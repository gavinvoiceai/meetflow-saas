// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nqkxcitvsimgncxplecf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xa3hjaXR2c2ltZ25jeHBsZWNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NTU4ODgsImV4cCI6MjA1MTMzMTg4OH0.3WEJEJlyZQi8kmoePZsuhjvC8d8MZNVqxp9xHHGFuB4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);