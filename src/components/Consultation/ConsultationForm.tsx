
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function ConsultationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi form sederhana
    if (!formData.title || !formData.description) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Anda harus login untuk membuat konsultasi");
      
      // Insert data to Supabase
      const { error } = await supabase
        .from('consultations')
        .insert([
          {
            student_id: user.id,
            title: formData.title,
            description: formData.description,
          },
        ]);
        
      if (error) throw error;
      
      // Tampilkan toast sukses
      toast({
        title: "Konsultasi berhasil dibuat",
        description: "Guru BK akan segera merespon konsultasi Anda",
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
      });
      
    } catch (error: any) {
      console.error("Error creating consultation:", error);
      toast({
        title: "Gagal membuat konsultasi",
        description: error.message || "Terjadi kesalahan saat membuat konsultasi",
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

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Buat Konsultasi Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="Masukkan judul konsultasi"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi <span className="text-red-500">*</span></Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Jelaskan masalah atau pertanyaan Anda secara detail..."
              value={formData.description}
              onChange={handleChange}
              rows={6}
              required
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-counseling-blue hover:bg-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Konsultasi'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
