
import { AuthForm } from "@/components/Auth/AuthForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Helmet } from "react-helmet-async";

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-counseling-blue"></div>
      </div>
    );
  }

  // Don't render auth form if user is already logged in
  if (user) {
    return null;
  }
  
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
