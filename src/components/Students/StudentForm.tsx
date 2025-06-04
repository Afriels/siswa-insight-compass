
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
        // Show message that admin functions are not available
        toast({
          title: "Fitur Tidak Tersedia",
          description: "Pembuatan user siswa baru memerlukan konfigurasi admin yang belum tersedia. Hubungi administrator sistem untuk menambahkan siswa baru.",
          variant: "destructive",
          duration: 8000,
        });
      } else {
        // Update existing user profile - this should work with regular permissions
        if (!formData.id) throw new Error("ID siswa tidak ditemukan");
        
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            user_metadata: {
              nis: formData.nis,
              class: formData.class,
              gender: formData.gender,
              social_score: formData.social_score
            }
          })
          .eq('id', formData.id);
          
        if (error) throw error;
        
        toast({
          title: "Data siswa berhasil diperbarui",
          duration: 3000,
        });
        
        onSuccess();
        onClose();
      }
      
    } catch (error: any) {
      console.error("Error creating/updating student:", error);
      toast({
        title: "Terjadi kesalahan",
        description: error.message || "Gagal menyimpan data siswa",
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
              ? 'Fitur ini memerlukan konfigurasi admin tambahan. Hubungi administrator sistem.'
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Catatan:</strong> Pembuatan user siswa baru memerlukan konfigurasi admin tambahan. 
                Silakan hubungi administrator sistem untuk menambahkan siswa baru ke database.
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
            {mode === 'create' ? 'Fitur Tidak Tersedia' : 'Simpan Perubahan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
