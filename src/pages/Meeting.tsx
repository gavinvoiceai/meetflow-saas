import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { Mic, MicOff, Video, VideoOff, MessageSquare, Settings, Wand2 } from "lucide-react";

const Meeting = () => {
  const { meetingId } = useParams();
  const isMobile = useIsMobile();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [transcriptions, setTranscriptions] = useState<Array<{ content: string; timestamp: string }>>([]);

  useEffect(() => {
    const channel = supabase
      .channel('meeting-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transcriptions',
          filter: `meeting_id=eq.${meetingId}`,
        },
        (payload) => {
          setTranscriptions((prev) => [...prev, payload.new as any]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [meetingId]);

  const toggleAudio = () => setIsAudioEnabled(!isAudioEnabled);
  const toggleVideo = () => setIsVideoEnabled(!isVideoEnabled);

  return (
    <div className="h-screen bg-background text-foreground">
      <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"}>
        <ResizablePanel defaultSize={75} minSize={50}>
          <div className="h-full flex flex-col">
            {/* Video Grid */}
            <div className="flex-1 bg-sidebar-background p-4">
              <div className="w-full h-full rounded-lg bg-sidebar-accent flex items-center justify-center">
                <p className="text-sidebar-accent-foreground">Video placeholder</p>
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 bg-sidebar-background border-t border-sidebar-border">
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleAudio}
                  className={!isAudioEnabled ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
                >
                  {isAudioEnabled ? <Mic /> : <MicOff />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleVideo}
                  className={!isVideoEnabled ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
                >
                  {isVideoEnabled ? <Video /> : <VideoOff />}
                </Button>
                <Button variant="outline" size="icon">
                  <MessageSquare />
                </Button>
                <Button variant="outline" size="icon">
                  <Settings />
                </Button>
                <Button variant="outline" size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Wand2 />
                </Button>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={25} minSize={20}>
          <div className="h-full flex flex-col bg-sidebar-background border-l border-sidebar-border">
            <div className="p-4 border-b border-sidebar-border">
              <h2 className="text-lg font-semibold text-sidebar-foreground">Transcriptions</h2>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {transcriptions.map((transcription, index) => (
                  <div key={index} className="bg-sidebar-accent rounded-lg p-3">
                    <p className="text-sm text-sidebar-accent-foreground">{transcription.content}</p>
                    <span className="text-xs text-sidebar-foreground/60">{new Date(transcription.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Meeting;