
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export function AuthForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon lengkapi email dan password",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Login berhasil",
        description: "Anda telah berhasil masuk ke akun Anda",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login gagal",
        description: error.message || "Terjadi kesalahan saat login",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!signupForm.email || !signupForm.password || !signupForm.fullName) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon lengkapi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }
    
    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Password tidak cocok",
        description: "Password dan konfirmasi password harus sama",
        variant: "destructive",
      });
      return;
    }
    
    if (signupForm.password.length < 6) {
      toast({
        title: "Password terlalu pendek",
        description: "Password harus minimal 6 karakter",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Check if email or fullName already exists
      const { data: existingProfiles, error: checkError } = await supabase
        .from('profiles')
        .select('username, full_name')
        .or(`username.eq.${signupForm.email},full_name.eq.${signupForm.fullName}`);

      if (checkError) throw checkError;
      
      if (existingProfiles && existingProfiles.length > 0) {
        const duplicateEmail = existingProfiles.some(profile => profile.username === signupForm.email);
        const duplicateName = existingProfiles.some(profile => profile.full_name === signupForm.fullName);
        
        if (duplicateEmail) {
          throw new Error("Email sudah terdaftar. Gunakan email lain.");
        }
        
        if (duplicateName) {
          throw new Error("Nama sudah terdaftar. Gunakan nama lain.");
        }
      }
      
      const { error } = await supabase.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
        options: {
          data: {
            full_name: signupForm.fullName,
            // Role is now set by default in the database
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Pendaftaran berhasil",
        description: "Akun Anda telah berhasil dibuat. Silakan periksa email Anda untuk verifikasi.",
      });
      
      // Reset form
      setSignupForm({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
      });
      
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Pendaftaran gagal",
        description: error.message || "Terjadi kesalahan saat mendaftar",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <img src="https://sman1lumbang.sch.id/wp-content/uploads/2022/12/logo-smanilum-60mm.png" 
               alt="Logo SMAN 1 Lumbang" 
               className="h-20 w-auto" />
        </div>
        <CardTitle className="text-center text-counseling-blue text-2xl">BK Connect</CardTitle>
        <CardDescription className="text-center">
          Aplikasi Bimbingan Konseling Digital
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Daftar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Masukkan email Anda"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Masukkan password Anda"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-counseling-blue hover:bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Memproses..." : "Login"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Masukkan nama lengkap Anda"
                  value={signupForm.fullName}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signupEmail">Email</Label>
                <Input
                  id="signupEmail"
                  name="email"
                  type="email"
                  placeholder="Masukkan email Anda"
                  value={signupForm.email}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signupPassword">Password</Label>
                <Input
                  id="signupPassword"
                  name="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={signupForm.password}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Masukkan password yang sama"
                  value={signupForm.confirmPassword}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-counseling-blue hover:bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Memproses..." : "Daftar"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
