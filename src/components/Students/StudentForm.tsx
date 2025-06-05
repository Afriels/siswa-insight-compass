
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        // Show improved message about admin functions
        toast({
          title: "Fitur Pembuatan User Siswa",
          description: "Untuk membuat user siswa baru, silakan minta siswa untuk mendaftar melalui halaman login terlebih dahulu. Setelah itu, data profil mereka dapat diperbarui melalui form edit.",
          variant: "default",
          duration: 8000,
        });
      } else {
        // Update existing user profile
        if (!formData.id) {
          toast({
            title: "Error",
            description: "ID siswa tidak ditemukan",
            variant: "destructive",
          });
          return;
        }
        
        // Prepare user metadata
        const user_metadata = {
          nis: formData.nis,
          class: formData.class,
          gender: formData.gender,
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Tambah User Siswa Baru' : 'Edit Data Siswa'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Untuk keamanan, siswa perlu mendaftar sendiri melalui halaman login.'
              : 'Perbarui data siswa yang sudah ada.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nis" className="text-right">NIS</Label>
            <Input
              id="nis"
              value={formData.nis}
              onChange={(e) => handleChange('nis', e.target.value)}
              placeholder="Masukkan NIS"
              className="col-span-3"
              disabled={mode === 'create'}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="full_name" className="text-right">Nama Lengkap</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="class" className="text-right">Kelas</Label>
            <Input
              id="class"
              value={formData.class}
              onChange={(e) => handleChange('class', e.target.value)}
              placeholder="Contoh: X-A, XI IPA 2, dst."
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleChange('gender', value as 'Laki-laki' | 'Perempuan')}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Pilih gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                <SelectItem value="Perempuan">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="social_score" className="text-right">Skor Sosial</Label>
            <Select
              value={formData.social_score}
              onValueChange={(value) => handleChange('social_score', value as 'Tinggi' | 'Sedang' | 'Rendah')}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Pilih skor sosial" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tinggi">Tinggi</SelectItem>
                <SelectItem value="Sedang">Sedang</SelectItem>
                <SelectItem value="Rendah">Rendah</SelectItem>
              </SelectContent>
            </Select>
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
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={loading || mode === 'create'}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? 'Lihat Petunjuk' : 'Simpan Perubahan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
