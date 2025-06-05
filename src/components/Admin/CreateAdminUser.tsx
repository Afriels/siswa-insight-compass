
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, UserPlus } from "lucide-react";

export const CreateAdminUser = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "admin"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Note: This is a simplified approach. In production, you'd want to use Supabase Auth Admin API
      // or create an edge function for user creation
      
      toast({
        title: "Informasi Penting",
        description: "Untuk membuat user admin baru, silakan minta calon admin untuk mendaftar melalui halaman login terlebih dahulu. Setelah itu, Anda dapat mengubah role mereka melalui SQL atau hubungi developer untuk bantuan.",
        duration: 10000,
      });

      // Reset form
      setFormData({
        email: "",
        password: "",
        full_name: "",
        role: "admin"
      });

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

  return (
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Catatan:</strong> Untuk keamanan, pembuatan user admin memerlukan calon admin untuk 
              mendaftar melalui halaman login terlebih dahulu. Setelah itu, role dapat diubah melalui database.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Petunjuk Pembuatan User
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
