import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import type { Message } from "./types";

interface ChatSidebarProps {
  meetingId: string;
}

export const ChatSidebar = ({ meetingId }: ChatSidebarProps) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [meetingId]);

  return (
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
  );
};