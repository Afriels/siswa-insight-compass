
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import UserManagement from "@/components/Admin/UserManagement";
import BehaviorManagement from "@/components/Admin/BehaviorManagement";
import ConsultationManagement from "@/components/Admin/ConsultationManagement";
import LetterManagement from "@/components/Admin/LetterManagement";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Helmet } from "react-helmet";

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (!user) {
          navigate("/login");
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data.role !== 'admin' && data.role !== 'counselor') {
          toast({
            title: "Akses ditolak",
            description: "Anda tidak memiliki akses ke halaman admin",
            variant: "destructive"
          });
          navigate("/");
          return;
        }
        
        setIsAdmin(true);
      } catch (error: any) {
        console.error("Error checking admin status:", error);
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat memeriksa status admin",
          variant: "destructive"
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [navigate, toast, user]);
  
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }
  
  if (!isAdmin) {
    return null; // Redirect is handled in the useEffect
  }
  
  return (
    <Layout>
      <Helmet>
        <title>Admin Dashboard - BK Connect</title>
      </Helmet>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="users">Manajemen User</TabsTrigger>
            <TabsTrigger value="behaviors">Manajemen Perilaku</TabsTrigger>
            <TabsTrigger value="consultations">Manajemen Konsultasi</TabsTrigger>
            <TabsTrigger value="letters">Manajemen Surat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="behaviors">
            <BehaviorManagement />
          </TabsContent>
          
          <TabsContent value="consultations">
            <ConsultationManagement />
          </TabsContent>
          
          <TabsContent value="letters">
            <LetterManagement />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
