import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AddUserDialog } from "./AddUserDialog";
import { UserTable } from "./UserTable";

type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  role: string | null;
  created_at: string;
};

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "student"
  });
  const [creating, setCreating] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users from profiles table...");
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Gagal mengambil data pengguna: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const createSupabaseAdminUser = async (userData: {email: string, full_name: string, password: string, role: string}) => {
    const response = await fetch('/functions/v1/admin-user', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", payload: userData }),
    });
    let result;
    try {
      result = await response.json();
    } catch (err) {
      console.error("Failed to parse edge function response to JSON:", err);
      throw new Error("Terjadi error pada response dari server. Silakan cek edge function.");
    }
    if (!response.ok) {
      throw new Error(result?.error || "Gagal membuat user");
    }
    return result.user;
  };

  // Fungsi helper polling tunggu user profile masuk DB setelah mendaftar Auth
  const waitForNewUserProfile = async (email: string, maxTries = 3, delay = 700) => {
    for (let i = 0; i < maxTries; i++) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', email)
        .limit(1);
      if (profiles && profiles.length > 0) return true;
      await new Promise(res => setTimeout(res, delay));
    }
    return false;
  };

  const deleteSupabaseAdminUser = async (supabaseUserId: string) => {
    const response = await fetch('/functions/v1/admin-user', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", payload: { id: supabaseUserId } }),
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || "Gagal menghapus user")
    return result.success
  }
  
  const handleCreateUser = async () => {
    console.log("handleCreateUser dipanggil");
    try {
      if (!newUser.email || !newUser.password || !newUser.fullName) {
        toast({
          title: "Form tidak lengkap",
          description: "Mohon lengkapi semua field yang diperlukan",
          variant: "destructive",
        });
        return;
      }
      
      setCreating(true);
      
      // Manual user creation - directly insert to profiles table
      const userId = crypto.randomUUID();
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username: newUser.email,
          full_name: newUser.fullName,
          role: newUser.role
        });
      
      if (profileError) {
        console.error("Error creating profile:", profileError);
        throw new Error("Gagal membuat profil pengguna");
      }
      
      toast({
        title: "User berhasil dibuat",
        description: "User baru berhasil ditambahkan secara manual",
        duration: 6000,
      });
      
      setIsDialogOpen(false);
      setNewUser({ email: "", password: "", fullName: "", role: "student" });
      fetchUsers();
    } catch (error: any) {
      console.error("Gagal membuat user:", error);
      toast({
        title: "Gagal membuat user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      console.log("Updating role for user:", userId, "to role:", newRole);
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) {
        console.error("Role update error:", error);
        throw error;
      }
      
      toast({
        title: "Berhasil",
        description: "Peran pengguna berhasil diperbarui",
      });
      
      // Refresh users list
      await fetchUsers();
    } catch (error: any) {
      console.error("Failed to update role:", error);
      toast({
        title: "Error",
        description: error.message || "Gagal memperbarui peran pengguna",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      if (!confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) return;
      const user = users.find((u) => u.id === userId);
      if (!user) return;
      await deleteSupabaseAdminUser(userId);
      await supabase.from('profiles').delete().eq('id', userId);
      toast({
        title: "User berhasil dihapus",
        description: "Pengguna sudah berhasil dihapus dari sistem",
      });
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Gagal menghapus user",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manajemen User</CardTitle>
          <CardDescription>Kelola pengguna aplikasi</CardDescription>
        </div>
        <AddUserDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleCreateUser}
          newUser={newUser}
          setNewUser={setNewUser}
          loading={creating}
        />
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Cari pengguna..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Informasi Penting:</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Saat ini fitur pembuatan dan penghapusan user memerlukan konfigurasi admin tambahan</li>
            <li>• Fitur edit peran user masih dapat digunakan untuk user yang sudah ada</li>
            <li>• Untuk menambah user baru, hubungi administrator sistem</li>
          </ul>
        </div>
        <UserTable
          users={filteredUsers}
          loading={loading}
          searchTerm={searchTerm}
          handleDeleteUser={handleDeleteUser}
          handleUpdateRole={handleUpdateRole}
        />
      </CardContent>
    </Card>
  );
};

export default UserManagement;
