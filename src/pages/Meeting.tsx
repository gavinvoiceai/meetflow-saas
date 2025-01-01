import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChatSidebar } from "@/components/meeting/ChatSidebar";
import { VideoArea } from "@/components/meeting/VideoArea";
import { ControlBar } from "@/components/meeting/ControlBar";
import type { Meeting } from "@/components/meeting/types";

const MeetingPage = () => {
  const { meetingId } = useParams();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const fetchMeeting = async () => {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('meeting_id', meetingId)
        .single();

      if (error) {
        toast.error("Failed to load meeting");
        return;
      }

      setMeeting(data);
    };

    fetchMeeting();
  }, [meetingId]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          
          // Convert to base64
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          
          reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(',')[1];
            
            // Send to our Edge Function
            const response = await supabase.functions.invoke('realtime-transcription', {
              body: {
                audio_data: base64Audio,
                meeting_id: meetingId,
                user_id: (await supabase.auth.getSession()).data.session?.user.id,
              },
            });

            if (!response.error) {
              // Clear audio chunks for next recording
              audioChunksRef.current = [];
            } else {
              console.error('Transcription failed:', response.error);
            }
          };
          
          reader.readAsDataURL(blob);
        }
      };

      mediaRecorder.start(3000); // Capture in 3-second intervals
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error("Failed to start recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      audioChunksRef.current = [];
    }
  };

  const toggleAudio = () => {
    if (!isAudioEnabled) {
      startRecording();
    } else {
      stopRecording();
    }
    setIsAudioEnabled(!isAudioEnabled);
  };
  
  const toggleVideo = () => setIsVideoEnabled(!isVideoEnabled);

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex">
        <VideoArea currentTranscription={currentTranscription} />
        <ChatSidebar meetingId={meetingId!} />
      </div>
      <ControlBar
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
      />
    </div>
  );
};

export default MeetingPage;