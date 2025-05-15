
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export function BehaviorForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    student_id: "",
    date: new Date().toISOString().split('T')[0],
    location: "",
    behavior_type: "",
    description: "",
    action: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi form sederhana
    if (!formData.student_id || !formData.date || !formData.behavior_type || !formData.description) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Insert data to Supabase
      const { error } = await supabase
        .from('behavior_records')
        .insert([
          {
            student_id: formData.student_id,
            date: formData.date,
            location: formData.location,
            behavior_type: formData.behavior_type,
            description: formData.description,
            action: formData.action,
          },
        ]);
        
      if (error) throw error;
      
      // Tampilkan toast sukses
      toast({
        title: "Data berhasil disimpan",
        description: "Catatan perilaku siswa telah berhasil dicatat",
      });
      
      // Reset form
      setFormData({
        student_id: "",
        date: new Date().toISOString().split('T')[0],
        location: "",
        behavior_type: "",
        description: "",
        action: "",
      });
      
      // Redirect to history page
      navigate("/behavior/history");
      
    } catch (error: any) {
      console.error("Error saving behavior record:", error);
      toast({
        title: "Gagal menyimpan data",
        description: error.message || "Terjadi kesalahan saat menyimpan catatan perilaku",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Pendataan Perilaku Siswa</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student_id">Nama Siswa <span className="text-red-500">*</span></Label>
              <Select
                value={formData.student_id}
                onValueChange={(value) => handleSelectChange("student_id", value)}
                required
              >
                <SelectTrigger id="student_id">
                  <SelectValue placeholder="Pilih siswa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ahmad Fauzi">Ahmad Fauzi</SelectItem>
                  <SelectItem value="Siti Nurhaliza">Siti Nurhaliza</SelectItem>
                  <SelectItem value="Budi Santoso">Budi Santoso</SelectItem>
                  <SelectItem value="Dewi Lestari">Dewi Lestari</SelectItem>
                  <SelectItem value="Eko Prasetyo">Eko Prasetyo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal Kejadian <span className="text-red-500">*</span></Label>
              <Input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Lokasi</Label>
              <Input
                type="text"
                id="location"
                name="location"
                placeholder="Contoh: Kelas, Kantin, dll"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="behavior_type">Tipe Perilaku <span className="text-red-500">*</span></Label>
              <Select
                value={formData.behavior_type}
                onValueChange={(value) => handleSelectChange("behavior_type", value)}
                required
              >
                <SelectTrigger id="behavior_type">
                  <SelectValue placeholder="Pilih tipe perilaku" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positif">Perilaku Positif</SelectItem>
                  <SelectItem value="negatif">Perilaku Negatif</SelectItem>
                  <SelectItem value="netral">Observasi Netral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Perilaku <span className="text-red-500">*</span></Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Jelaskan perilaku siswa yang diamati..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="action">Tindakan yang Diambil</Label>
            <Textarea
              id="action"
              name="action"
              placeholder="Jelaskan tindakan yang diambil (jika ada)..."
              value={formData.action}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/behavior/history")}
            >
              Lihat Riwayat
            </Button>
            <Button 
              type="submit" 
              className="bg-counseling-blue hover:bg-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
