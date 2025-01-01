import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { audio_data, meeting_id, user_id } = await req.json();

    // Connect to OpenAI for transcription
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: new FormData(Object.entries({
        file: new Blob([Buffer.from(audio_data, 'base64')], { type: 'audio/webm' }),
        model: 'whisper-1',
      })),
    });

    const transcription = await response.json();

    if (!transcription.text) {
      throw new Error('No transcription received');
    }

    // Store transcription in Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: transcriptionError } = await supabase
      .from('transcriptions')
      .insert({
        meeting_id,
        user_id,
        content: transcription.text,
      });

    if (transcriptionError) throw transcriptionError;

    // Also store as a chat message
    const { error: chatError } = await supabase
      .from('chat_messages')
      .insert({
        meeting_id,
        user_id,
        content: transcription.text,
      });

    if (chatError) throw chatError;

    return new Response(
      JSON.stringify({ transcription: transcription.text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});