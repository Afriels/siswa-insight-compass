
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, UserPlus, Copy, Key, Shield } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const CreateAdminUser = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState<{email: string, password: string} | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "admin"
  });

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Berhasil disalin",
      description: `${label} berhasil disalin ke clipboard`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simpan kredensial admin yang dibuat
      setAdminCredentials({
        email: formData.email,
        password: formData.password
      });

      // Simulasi pembuatan user (dalam implementasi nyata, ini akan menggunakan Supabase Auth Admin API)
      toast({
        title: "Kredensial Admin Disiapkan",
        description: "Kredensial admin telah disiapkan. Gunakan informasi di bawah untuk login pertama kali.",
        duration: 8000,
      });

      // Update profile dengan role admin setelah user mendaftar
      // Ini akan dilakukan secara manual oleh administrator sistem
      
    } catch (error: any) {
      console.error("Error creating admin user:", error);
      toast({
        title: "Gagal membuat user",
        description: error.message || "Terjadi kesalahan saat membuat user admin",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateRole = async () => {
    if (!adminCredentials) return;

    try {
      // Update role di database untuk user yang sudah register
      const { error } = await supabase
        .from('profiles')
        .update({ role: formData.role })
        .eq('username', adminCredentials.email);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Role admin berhasil diaktifkan",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal mengaktifkan role admin. Pastikan user sudah terdaftar.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Buat User Administrator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                placeholder="Nama lengkap administrator"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="text"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Password untuk admin"
                  required
                />
                <Button type="button" variant="outline" onClick={generatePassword}>
                  <Key className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="counselor">Konselor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Siapkan Kredensial Admin
            </Button>
          </form>
        </CardContent>
      </Card>

      {adminCredentials && (
        <Card className="max-w-md border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Shield className="h-5 w-5" />
              Kredensial Admin Telah Disiapkan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTitle>Langkah-langkah Aktivasi Admin:</AlertTitle>
              <AlertDescription className="space-y-2 mt-2">
                <div>1. Buka halaman registrasi aplikasi</div>
                <div>2. Daftarkan akun dengan email dan password di bawah</div>
                <div>3. Klik tombol "Aktifkan Role Admin" setelah registrasi berhasil</div>
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-green-700">Email:</Label>
                <div className="flex gap-2">
                  <Input
                    value={adminCredentials.email}
                    readOnly
                    className="bg-white"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(adminCredentials.email, "Email")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-green-700">Password:</Label>
                <div className="flex gap-2">
                  <Input
                    value={adminCredentials.password}
                    readOnly
                    className="bg-white"
                    type="text"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(adminCredentials.password, "Password")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Button onClick={handleUpdateRole} className="w-full bg-green-600 hover:bg-green-700">
              Aktifkan Role Admin
            </Button>

            <div className="text-xs text-green-600 bg-green-100 p-2 rounded">
              <strong>Catatan Keamanan:</strong> Simpan kredensial ini dengan aman. 
              Setelah admin berhasil login pertama kali, disarankan untuk mengganti password.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
