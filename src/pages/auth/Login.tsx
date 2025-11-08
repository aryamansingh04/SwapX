import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[image:var(--gradient-soft)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/swapx-logo.svg" alt="SwapX" className="h-12 mx-auto mb-4" />
          <p className="text-muted-foreground">Learn together, grow together</p>
        </div>
        <div className="backdrop-blur-sm bg-card/95 shadow-2xl border-2 rounded-lg p-6">
          <Auth 
            supabaseClient={supabase} 
            appearance={{ theme: ThemeSupa }} 
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

