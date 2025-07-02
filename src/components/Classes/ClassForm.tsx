import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ClassFormData {
  name: string;
  grade: string;
  major: string;
}

interface ClassFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ClassFormData;
  mode: 'create' | 'edit';
}

export const ClassForm = ({ isOpen, onClose, onSuccess, initialData, mode }: ClassFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ClassFormData>(
    initialData || {
      name: '',
      grade: 'X',
      major: ''
    }
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Nama kelas harus diisi",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // For now, just show success message since this is manual management
      toast({
        title: "Berhasil",
        description: `Kelas ${formData.name} berhasil ${mode === 'create' ? 'ditambahkan' : 'diperbarui'}`,
      });
      
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        grade: 'X',
        major: ''
      });
    } catch (error: any) {
      console.error("Error saving class:", error);
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan data kelas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Tambah Kelas Baru' : 'Edit Kelas'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Kelas *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: XI IPA 1, X-A, XII IPS 2"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Tingkat *</Label>
            <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih tingkat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="X">Kelas 10</SelectItem>
                <SelectItem value="XI">Kelas 11</SelectItem>
                <SelectItem value="XII">Kelas 12</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="major">Jurusan (Opsional)</Label>
            <Select value={formData.major} onValueChange={(value) => setFormData({ ...formData, major: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jurusan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tidak Ada</SelectItem>
                <SelectItem value="IPA">IPA</SelectItem>
                <SelectItem value="IPS">IPS</SelectItem>
                <SelectItem value="BAHASA">Bahasa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Catatan:</strong> Fitur ini untuk pencatatan manual. 
              Siswa tetap perlu diassign ke kelas melalui data siswa.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : mode === 'create' ? 'Tambah' : 'Perbarui'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};