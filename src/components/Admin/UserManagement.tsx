
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AlertCircle, PenLine, Trash2, UserPlus } from "lucide-react";

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
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "student"
  });
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data pengguna",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCreateUser = async () => {
    try {
      if (!newUser.email || !newUser.password || !newUser.fullName) {
        toast({
          title: "Form tidak lengkap",
          description: "Mohon lengkapi semua field yang diperlukan",
          variant: "destructive",
        });
        return;
      }
      
      // Check if email or fullName already exists
      const { data: existingProfiles, error: checkError } = await supabase
        .from('profiles')
        .select('username, full_name')
        .or(`username.eq.${newUser.email},full_name.eq.${newUser.fullName}`);

      if (checkError) throw checkError;
      
      if (existingProfiles && existingProfiles.length > 0) {
        const duplicateEmail = existingProfiles.some(profile => profile.username === newUser.email);
        const duplicateName = existingProfiles.some(profile => profile.full_name === newUser.fullName);
        
        if (duplicateEmail) {
          throw new Error("Email sudah terdaftar. Gunakan email lain.");
        }
        
        if (duplicateName) {
          throw new Error("Nama sudah terdaftar. Gunakan nama lain.");
        }
      }
      
      const { error } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        email_confirm: true,
        user_metadata: {
          full_name: newUser.fullName,
          role: newUser.role
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Pengguna baru telah berhasil dibuat",
      });
      
      setNewUser({
        email: "",
        password: "",
        fullName: "",
        role: "student"
      });
      
      setIsDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: error.message || "Gagal membuat pengguna baru",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Peran pengguna berhasil diperbarui",
      });
      
      fetchUsers();
    } catch (error: any) {
      console.error("Error updating user role:", error);
      toast({
        title: "Error",
        description: "Gagal memperbarui peran pengguna",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    try {
      if (!confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
        return;
      }
      
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Pengguna berhasil dihapus",
      });
      
      fetchUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus pengguna",
        variant: "destructive",
      });
    }
  };
  
  const getRoleBadge = (role: string | null) => {
    switch(role) {
      case 'admin':
        return <Badge className="bg-red-500">Admin</Badge>;
      case 'counselor':
        return <Badge className="bg-purple-500">Guru BK</Badge>;
      case 'student':
        return <Badge className="bg-green-500">Siswa</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };
  
  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manajemen User</CardTitle>
          <CardDescription>Kelola pengguna aplikasi</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-counseling-blue hover:bg-blue-600">
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah User Baru</DialogTitle>
              <DialogDescription>
                Isi form di bawah untuk menambahkan user baru
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input 
                  id="fullName"
                  value={newUser.fullName}
                  onChange={e => setNewUser({...newUser, fullName: e.target.value})}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  placeholder="Masukkan email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Masukkan password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Peran</Label>
                <Select 
                  value={newUser.role} 
                  onValueChange={value => setNewUser({...newUser, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih peran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Siswa</SelectItem>
                    <SelectItem value="counselor">Guru BK</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button 
                className="bg-counseling-blue hover:bg-blue-600"
                onClick={handleCreateUser}
              >
                Tambah User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-counseling-blue"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 flex flex-col items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-10 w-10" />
            {searchTerm ? "Tidak ada pengguna yang cocok dengan pencarian" : "Belum ada pengguna"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name || '-'}</TableCell>
                    <TableCell>{user.username || '-'}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {format(new Date(user.created_at), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <PenLine className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Peran Pengguna</DialogTitle>
                              <DialogDescription>
                                Ubah peran untuk pengguna {user.full_name}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="py-4">
                              <Label htmlFor={`role-${user.id}`}>Peran</Label>
                              <Select
                                defaultValue={user.role || "student"}
                                onValueChange={(value) => handleUpdateRole(user.id, value)}
                              >
                                <SelectTrigger id={`role-${user.id}`}>
                                  <SelectValue placeholder="Pilih peran" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="student">Siswa</SelectItem>
                                  <SelectItem value="counselor">Guru BK</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;
