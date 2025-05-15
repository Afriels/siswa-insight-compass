
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Profile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
};

export function UserProfile() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/login");
          return;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        setProfile(data);
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [navigate, toast]);
  
  const updateProfile = async () => {
    if (!profile) return;
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
        })
        .eq('id', profile.id);
        
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-counseling-blue"></div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Profile not found. Please log in again.
      </div>
    );
  }
  
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Profil Pengguna</CardTitle>
        <CardDescription>
          Lihat dan ubah informasi profil Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={profile.username}
              disabled
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input
              id="fullName"
              value={profile.full_name}
              onChange={(e) => setProfile({...profile, full_name: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Peran</Label>
            <Input
              id="role"
              value={profile.role === 'counselor' ? 'Guru BK' : 
                    profile.role === 'admin' ? 'Administrator' : 
                    profile.role === 'student' ? 'Siswa' : profile.role}
              disabled
              className="bg-muted"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button
            onClick={updateProfile}
            className="bg-counseling-blue hover:bg-blue-600"
            disabled={saving}
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
          
          <Button
            onClick={handleSignOut}
            variant="destructive"
          >
            Keluar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
