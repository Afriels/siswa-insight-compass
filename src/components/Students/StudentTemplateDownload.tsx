
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";

export const StudentTemplateDownload = () => {
  const { toast } = useToast();

  const downloadTemplate = () => {
    try {
      // Template data dengan contoh dan keterangan
      const templateData = [
        {
          NIS: "12345678",
          "Nama Lengkap": "Contoh Nama Siswa",
          Kelas: "X-A",
          Gender: "Laki-laki",
          "Skor Sosial": "Sedang",
          Email: "siswa@example.com"
        },
        {
          NIS: "",
          "Nama Lengkap": "",
          Kelas: "",
          Gender: "",
          "Skor Sosial": "",
          Email: ""
        }
      ];

      // Keterangan untuk setiap kolom
      const instructions = [
        {
          Kolom: "NIS",
          Keterangan: "Nomor Induk Siswa (wajib diisi, harus unik)",
          "Contoh": "12345678"
        },
        {
          Kolom: "Nama Lengkap", 
          Keterangan: "Nama lengkap siswa (wajib diisi)",
          "Contoh": "Ahmad Budi Santoso"
        },
        {
          Kolom: "Kelas",
          Keterangan: "Kelas siswa (wajib diisi)",
          "Contoh": "X-A, XI IPA 2, XII IPS 1"
        },
        {
          Kolom: "Gender",
          Keterangan: "Jenis kelamin (Laki-laki/Perempuan)",
          "Contoh": "Laki-laki atau Perempuan"
        },
        {
          Kolom: "Skor Sosial",
          Keterangan: "Tingkat skor sosial (Tinggi/Sedang/Rendah)",
          "Contoh": "Tinggi, Sedang, atau Rendah"
        },
        {
          Kolom: "Email",
          Keterangan: "Email untuk login (opsional, jika kosong akan dibuat otomatis)",
          "Contoh": "siswa@sekolah.sch.id"
        }
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      
      // Create template worksheet
      const templateWS = XLSX.utils.json_to_sheet(templateData);
      
      // Set column widths
      templateWS['!cols'] = [
        { wch: 15 }, // NIS
        { wch: 25 }, // Nama Lengkap
        { wch: 15 }, // Kelas
        { wch: 15 }, // Gender
        { wch: 15 }, // Skor Sosial
        { wch: 30 }  // Email
      ];
      
      // Create instructions worksheet
      const instructionsWS = XLSX.utils.json_to_sheet(instructions);
      
      // Set column widths for instructions
      instructionsWS['!cols'] = [
        { wch: 20 }, // Kolom
        { wch: 50 }, // Keterangan
        { wch: 30 }  // Contoh
      ];
      
      // Add worksheets to workbook
      XLSX.utils.book_append_sheet(workbook, templateWS, "Template Siswa");
      XLSX.utils.book_append_sheet(workbook, instructionsWS, "Petunjuk Pengisian");
      
      // Generate and download file
      XLSX.writeFile(workbook, "template-data-siswa.xlsx");
      
      toast({
        title: "Template berhasil diunduh",
        description: "File template telah berhasil diunduh ke komputer Anda",
      });
    } catch (error) {
      console.error("Error downloading template:", error);
      toast({
        title: "Error",
        description: "Gagal mengunduh template",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={downloadTemplate}
      className="bg-green-50 hover:bg-green-100 border-green-200"
    >
      <Download className="h-4 w-4 mr-2" />
      Download Template
    </Button>
  );
};
