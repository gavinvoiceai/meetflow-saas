import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mic, MicOff, Video, VideoOff, MessageSquare, Settings, Wand2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

const Meeting = () => {
  const { meetingId } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
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

    // Subscribe to real-time updates for messages
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `meeting_id=eq.${meetingId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
          // Update current transcription for captions
          setCurrentTranscription(payload.new.content);
          // Clear caption after 5 seconds
          setTimeout(() => setCurrentTranscription(""), 5000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/realtime-transcription`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
              },
              body: JSON.stringify({
                audio_data: base64Audio,
                meeting_id: meetingId,
                user_id: (await supabase.auth.getSession()).data.session?.user.id,
              }),
            });

            if (!response.ok) {
              console.error('Transcription failed:', await response.text());
              return;
            }

            // Clear audio chunks for next recording
            audioChunksRef.current = [];
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
        {/* Video area */}
        <div className="flex-1 p-4 relative">
          <div className="bg-[#222222] h-full rounded-lg flex items-center justify-center border border-[#333333]">
            <p className="text-gray-400">Video preview will appear here</p>
          </div>
          {/* Closed captions */}
          {currentTranscription && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/75 px-4 py-2 rounded-lg max-w-[80%] text-center">
              {currentTranscription}
            </div>
          )}
        </div>

        {/* Chat sidebar */}
        <div className="w-80 bg-[#222222] border-l border-[#333333] p-4">
          <div className="h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-white">Meeting Chat</h2>
            <ScrollArea className="flex-1">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="bg-[#2A2A2A] p-3 rounded-lg">
                    <p className="text-sm text-gray-300">{message.content}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[#222222] border-t border-[#333333] p-4">
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleAudio}
            className={!isAudioEnabled 
              ? "bg-destructive hover:bg-destructive/90 border-[#333333]" 
              : "bg-[#222222] border-[#333333] hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-colors"}
          >
            {isAudioEnabled ? <Mic className="text-[#0EA5E9]" /> : <MicOff />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleVideo}
            className={!isVideoEnabled 
              ? "bg-destructive hover:bg-destructive/90 border-[#333333]" 
              : "bg-[#222222] border-[#333333] hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-colors"}
          >
            {isVideoEnabled ? <Video className="text-[#0EA5E9]" /> : <VideoOff />}
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="bg-[#222222] border-[#333333] hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-colors"
          >
            <MessageSquare className="text-[#0EA5E9]" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="bg-[#222222] border-[#333333] hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-colors"
          >
            <Settings className="text-[#0EA5E9]" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-[#222222] border-[#333333] hover:border-[#0EA5E9] text-[#0EA5E9] hover:text-[#0EA5E9] transition-colors"
          >
            <Wand2 className="text-[#0EA5E9]" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Meeting;