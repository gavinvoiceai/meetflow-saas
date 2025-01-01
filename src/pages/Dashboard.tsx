import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { nanoid } from "nanoid";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleStartMeeting = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const meetingId = nanoid(10);
      const { data, error } = await supabase
        .from('meetings')
        .insert({
          meeting_id: meetingId,
          host_id: session.user.id,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      navigate(`/meeting/${meetingId}`);
    } catch (error) {
      toast.error("Failed to start meeting");
      console.error(error);
    }
  };

  const handleJoinMeeting = () => {
    // Will implement join meeting dialog later
    toast.info("Join meeting feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <Button variant="destructive" onClick={() => supabase.auth.signOut()}>
            Sign Out
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            size="lg" 
            className="h-32 text-xl"
            onClick={handleStartMeeting}
          >
            Start New Meeting
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="h-32 text-xl"
            onClick={handleJoinMeeting}
          >
            Join Meeting
          </Button>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Your Meetings</h2>
          {/* Will implement meetings list later */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;