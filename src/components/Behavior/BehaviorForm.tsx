
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export function BehaviorForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    siswa: "",
    tanggal: "",
    lokasi: "",
    tipe: "",
    deskripsi: "",
    tindakan: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi form sederhana
    if (!formData.siswa || !formData.tanggal || !formData.tipe || !formData.deskripsi) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive",
      });
      return;
    }
    
    // Simulasi pengiriman data
    console.log("Form data:", formData);
    
    // Tampilkan toast sukses
    toast({
      title: "Data berhasil disimpan",
      description: "Catatan perilaku siswa telah berhasil dicatat",
    });
    
    // Reset form
    setFormData({
      siswa: "",
      tanggal: "",
      lokasi: "",
      tipe: "",
      deskripsi: "",
      tindakan: "",
    });
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
              <Label htmlFor="siswa">Nama Siswa <span className="text-red-500">*</span></Label>
              <Select
                value={formData.siswa}
                onValueChange={(value) => handleSelectChange("siswa", value)}
                required
              >
                <SelectTrigger id="siswa">
                  <SelectValue placeholder="Pilih siswa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ahmad">Ahmad Fauzi</SelectItem>
                  <SelectItem value="siti">Siti Nurhaliza</SelectItem>
                  <SelectItem value="budi">Budi Santoso</SelectItem>
                  <SelectItem value="dewi">Dewi Lestari</SelectItem>
                  <SelectItem value="eko">Eko Prasetyo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal Kejadian <span className="text-red-500">*</span></Label>
              <Input
                type="date"
                id="tanggal"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lokasi">Lokasi</Label>
              <Input
                type="text"
                id="lokasi"
                name="lokasi"
                placeholder="Contoh: Kelas, Kantin, dll"
                value={formData.lokasi}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipe">Tipe Perilaku <span className="text-red-500">*</span></Label>
              <Select
                value={formData.tipe}
                onValueChange={(value) => handleSelectChange("tipe", value)}
                required
              >
                <SelectTrigger id="tipe">
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
            <Label htmlFor="deskripsi">Deskripsi Perilaku <span className="text-red-500">*</span></Label>
            <Textarea
              id="deskripsi"
              name="deskripsi"
              placeholder="Jelaskan perilaku siswa yang diamati..."
              value={formData.deskripsi}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tindakan">Tindakan yang Diambil</Label>
            <Textarea
              id="tindakan"
              name="tindakan"
              placeholder="Jelaskan tindakan yang diambil (jika ada)..."
              value={formData.tindakan}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline">
              Batal
            </Button>
            <Button type="submit" className="bg-counseling-blue hover:bg-blue-600">
              Simpan Data
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
