import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mic, MicOff, Video, VideoOff, MessageSquare, Settings, Wand2 } from "lucide-react";

const Meeting = () => {
  const { meetingId } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

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

  const toggleAudio = () => setIsAudioEnabled(!isAudioEnabled);
  const toggleVideo = () => setIsVideoEnabled(!isVideoEnabled);

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex">
        {/* Video area */}
        <div className="flex-1 p-4">
          <div className="bg-[#222222] h-full rounded-lg flex items-center justify-center border border-[#333333]">
            <p className="text-gray-400">Video preview will appear here</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-[#222222] border-l border-[#333333] p-4">
          <div className="h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-white">Meeting Chat</h2>
            <div className="flex-1 overflow-y-auto">
              {/* Chat messages will appear here */}
            </div>
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