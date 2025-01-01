export interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

export interface Meeting {
  id: string;
  meeting_id: string;
  host_id: string;
  title: string | null;
  scheduled_start: string | null;
  status: string | null;
}