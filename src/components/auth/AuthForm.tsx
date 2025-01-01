import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export const AuthForm = () => {
  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">MeetFlow</h1>
        <p className="text-muted-foreground">Join or host video conferences with ease</p>
      </div>
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: 'hsl(var(--primary))',
                brandAccent: 'hsl(var(--primary))',
              },
            },
          },
        }}
        theme="dark"
        providers={[]}
      />
    </div>
  );
};