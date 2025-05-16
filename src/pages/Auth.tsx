
import { AuthForm } from "@/components/Auth/AuthForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";

const Auth = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    
    checkUser();
  }, [navigate]);
  
  return (
    <>
      <Helmet>
        <title>Login - BK Connect</title>
        <link rel="icon" href="https://sman1lumbang.sch.id/wp-content/uploads/2022/12/logo-smanilum-60mm.png" type="image/png" />
      </Helmet>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <AuthForm />
      </div>
    </>
  );
};

export default Auth;
