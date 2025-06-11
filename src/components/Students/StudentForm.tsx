
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export interface StudentFormData {
  id?: string;
  nis: string;
  full_name: string;
  class: string;
  gender: 'Laki-laki' | 'Perempuan';
  birth_date?: string;
  birth_place?: string;
  address?: string;
  phone?: string;
  parent_name?: string;
  parent_phone?: string;
  social_score?: 'Tinggi' | 'Sedang' | 'Rendah';
  email?: string;
  password?: string;
}

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: StudentFormData;
  mode: 'create' | 'edit';
}

export const StudentForm = ({ isOpen, onClose, onSuccess, initialData, mode }: StudentFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<StudentFormData>(
    initialData || {
      nis: "",
      full_name: "",
      class: "",
      gender: "Laki-laki",
      birth_date: "",
      birth_place: "",
      address: "",
      phone: "",
      parent_name: "",
      parent_phone: "",
      social_score: "Sedang",
      email: "",
      password: ""
    }
  );

  const handleChange = (field: keyof StudentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Validation
      if (!formData.nis || !formData.full_name || !formData.class) {
        toast({
          title: "Form tidak lengkap",
          description: "NIS, nama lengkap, dan kelas harus diisi",
          variant: "destructive",
        });
        return;
      }
      
      if (mode === 'create') {
        toast({
          title: "Fitur Pembuatan User Siswa",
          description: "Untuk membuat user siswa baru, silakan minta siswa untuk mendaftar melalui halaman login terlebih dahulu. Setelah itu, data profil mereka dapat diperbarui melalui form edit.",
          variant: "default",
          duration: 8000,
        });
      } else {
        if (!formData.id) {
          toast({
            title: "Error",
            description: "ID siswa tidak ditemukan",
            variant: "destructive",
          });
          return;
        }
        
        // Prepare comprehensive user metadata
        const user_metadata = {
          nis: formData.nis,
          class: formData.class,
          gender: formData.gender,
          birth_date: formData.birth_date,
          birth_place: formData.birth_place,
          address: formData.address,
          phone: formData.phone,
          parent_name: formData.parent_name,
          parent_phone: formData.parent_phone,
          social_score: formData.social_score
        };
        
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            user_metadata: user_metadata
          })
          .eq('id', formData.id);
          
        if (error) {
          console.error("Database error:", error);
          throw new Error(`Database error: ${error.message}`);
        }
        
        toast({
          title: "Sukses",
          description: "Data siswa berhasil diperbarui",
          duration: 3000,
        });
        
        onSuccess();
        onClose();
      }
      
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      
      let errorMessage = "Gagal menyimpan data siswa";
      
      if (error.message?.includes("permission denied")) {
        errorMessage = "Anda tidak memiliki izin untuk melakukan operasi ini";
      } else if (error.message?.includes("network")) {
        errorMessage = "Masalah koneksi jaringan. Silakan coba lagi.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Terjadi kesalahan",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Tambah User Siswa Baru' : 'Edit Data Siswa'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Untuk keamanan, siswa perlu mendaftar sendiri melalui halaman login.'
              : 'Perbarui data siswa yang sudah ada.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Data Utama */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Data Utama</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nis">NIS *</Label>
                <Input
                  id="nis"
                  value={formData.nis}
                  onChange={(e) => handleChange('nis', e.target.value)}
                  placeholder="Masukkan NIS"
                  disabled={mode === 'create'}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="full_name">Nama Lengkap *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class">Kelas *</Label>
                <Input
                  id="class"
                  value={formData.class}
                  onChange={(e) => handleChange('class', e.target.value)}
                  placeholder="Contoh: X-A, XI IPA 2, dst."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Jenis Kelamin</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleChange('gender', value as 'Laki-laki' | 'Perempuan')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Data Pribadi */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Data Pribadi</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birth_place">Tempat Lahir</Label>
                <Input
                  id="birth_place"
                  value={formData.birth_place || ""}
                  onChange={(e) => handleChange('birth_place', e.target.value)}
                  placeholder="Masukkan tempat lahir"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birth_date">Tanggal Lahir</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date || ""}
                  onChange={(e) => handleChange('birth_date', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Textarea
                id="address"
                value={formData.address || ""}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Masukkan alamat lengkap"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">No. Telepon Siswa</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Masukkan nomor telepon"
              />
            </div>
          </div>

          {/* Data Orang Tua */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Data Orang Tua/Wali</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parent_name">Nama Orang Tua/Wali</Label>
                <Input
                  id="parent_name"
                  value={formData.parent_name || ""}
                  onChange={(e) => handleChange('parent_name', e.target.value)}
                  placeholder="Masukkan nama orang tua/wali"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="parent_phone">No. Telepon Orang Tua/Wali</Label>
                <Input
                  id="parent_phone"
                  value={formData.parent_phone || ""}
                  onChange={(e) => handleChange('parent_phone', e.target.value)}
                  placeholder="Masukkan nomor telepon orang tua/wali"
                />
              </div>
            </div>
          </div>

          {/* Data Akademik */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Data Akademik & Sosial</h4>
            
            <div className="space-y-2">
              <Label htmlFor="social_score">Skor Sosial</Label>
              <Select
                value={formData.social_score}
                onValueChange={(value) => handleChange('social_score', value as 'Tinggi' | 'Sedang' | 'Rendah')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih skor sosial" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tinggi">Tinggi</SelectItem>
                  <SelectItem value="Sedang">Sedang</SelectItem>
                  <SelectItem value="Rendah">Rendah</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {mode === 'create' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Cara menambah siswa baru:</strong>
                <br />1. Minta siswa untuk mendaftar di halaman login
                <br />2. Setelah mendaftar, gunakan form edit untuk melengkapi data
                <br />3. Data akan tersimpan dengan aman di sistem
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={loading || mode === 'create'} className="w-full sm:w-auto">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? 'Lihat Petunjuk' : 'Simpan Perubahan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
