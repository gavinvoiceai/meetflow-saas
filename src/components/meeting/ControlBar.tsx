import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, MessageSquare, Settings, Wand2 } from "lucide-react";

interface ControlBarProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
}

export const ControlBar = ({
  isAudioEnabled,
  isVideoEnabled,
  onToggleAudio,
  onToggleVideo,
}: ControlBarProps) => {
  return (
    <div className="bg-[#222222] border-t border-[#333333] p-4">
      <div className="flex justify-center items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleAudio}
          className={!isAudioEnabled 
            ? "bg-destructive hover:bg-destructive/90 border-[#333333]" 
            : "bg-[#222222] border-[#333333] hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-colors"}
        >
          {isAudioEnabled ? <Mic className="text-[#0EA5E9]" /> : <MicOff />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleVideo}
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
  );
};