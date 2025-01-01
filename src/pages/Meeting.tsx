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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex">
        {/* Video area */}
        <div className="flex-1 p-4">
          <div className="bg-sidebar h-full rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Video preview will appear here</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-sidebar border-l border-sidebar-border p-4">
          <div className="h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Meeting Chat</h2>
            <div className="flex-1 overflow-y-auto">
              {/* Chat messages will appear here */}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-sidebar border-t border-sidebar-border p-4">
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleAudio}
            className={!isAudioEnabled ? "bg-destructive hover:bg-destructive/90" : ""}
          >
            {isAudioEnabled ? <Mic /> : <MicOff />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleVideo}
            className={!isVideoEnabled ? "bg-destructive hover:bg-destructive/90" : ""}
          >
            {isVideoEnabled ? <Video /> : <VideoOff />}
          </Button>
          <Button variant="outline" size="icon">
            <MessageSquare />
          </Button>
          <Button variant="outline" size="icon">
            <Settings />
          </Button>
          <Button variant="outline" size="icon" className="text-primary hover:text-primary">
            <Wand2 />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Meeting;