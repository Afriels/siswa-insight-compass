
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HelpCircle, 
  Users, 
  ChartBar, 
  Search, 
  Database, 
  MessageSquare, 
  Calendar, 
  TestTube,
  Settings,
  BookOpen,
  MessageCircle
} from "lucide-react";

const featureGuides = {
  dashboard: {
    title: "Dashboard",
    icon: <BookOpen className="h-5 w-5" />,
    description: "Ringkasan aktivitas dan statistik BK",
    steps: [
      "Lihat statistik siswa, konsultasi, dan perilaku terkini",
      "Monitor aktivitas terakhir di sistem",
      "Akses cepat ke fitur-fitur utama",
      "Pantau tren perkembangan siswa melalui grafik"
    ],
    tips: [
      "Dashboard diperbarui secara real-time",
      "Klik pada kartu statistik untuk detail lebih lanjut",
      "Gunakan filter tanggal untuk melihat data periode tertentu"
    ]
  },
  students: {
    title: "Data Siswa",
    icon: <Users className="h-5 w-5" />,
    description: "Kelola database siswa dan profil mereka",
    steps: [
      "Tambah siswa baru melalui form atau import Excel",
      "Edit informasi siswa yang sudah ada",
      "Cari siswa berdasarkan nama, kelas, atau NIS",
      "Export data siswa dalam format Excel",
      "Lihat detail profil dan riwayat konsultasi siswa"
    ],
    tips: [
      "Download template Excel untuk import data massal",
      "Pastikan data lengkap sebelum menyimpan",
      "Gunakan fitur pencarian untuk akses cepat"
    ]
  },
  sociogram: {
    title: "Sosiogram",
    icon: <ChartBar className="h-5 w-5" />,
    description: "Analisis hubungan sosial antar siswa",
    steps: [
      "Pilih kelas untuk analisis sosiogram",
      "Input data pilihan siswa dalam kelompok",
      "Lihat visualisasi jaringan pertemanan",
      "Analisis siswa populer dan terisolasi",
      "Export hasil analisis dalam bentuk laporan"
    ],
    tips: [
      "Lakukan survei sosiogram secara berkala",
      "Perhatikan siswa yang terisolasi untuk intervensi",
      "Gunakan hasil untuk membentuk kelompok belajar"
    ]
  },
  issues: {
    title: "Pencarian Masalah",
    icon: <Search className="h-5 w-5" />,
    description: "Identifikasi dan lacak masalah siswa",
    steps: [
      "Input gejala atau perilaku yang diamati",
      "Sistem akan menampilkan kemungkinan masalah",
      "Baca rekomendasi penanganan yang disarankan",
      "Catat tindak lanjut yang akan dilakukan",
      "Monitor perkembangan siswa"
    ],
    tips: [
      "Gunakan kata kunci yang spesifik saat mencari",
      "Kombinasikan beberapa gejala untuk hasil akurat",
      "Selalu konsultasi dengan ahli untuk kasus kompleks"
    ]
  },
  behavior: {
    title: "Pendataan Perilaku",
    icon: <Database className="h-5 w-5" />,
    description: "Catat dan pantau perilaku siswa",
    steps: [
      "Pilih siswa yang akan dicatat perilakunya",
      "Tentukan jenis perilaku (positif/negatif)",
      "Isi detail kejadian dan lokasi",
      "Tentukan tindak lanjut yang diperlukan",
      "Lihat riwayat perilaku siswa"
    ],
    tips: [
      "Catat perilaku segera setelah kejadian",
      "Gunakan bahasa objektif dan deskriptif",
      "Monitor pola perilaku untuk intervensi dini"
    ]
  },
  consultation: {
    title: "Konsultasi",
    icon: <MessageSquare className="h-5 w-5" />,
    description: "Layanan konsultasi online dengan siswa",
    steps: [
      "Siswa membuat permintaan konsultasi baru",
      "Guru BK menerima dan merespons permintaan",
      "Lakukan sesi chat konsultasi",
      "Buat catatan dan rencana tindak lanjut",
      "Tutup sesi dan evaluasi hasil"
    ],
    tips: [
      "Berikan respons yang empati dan supportif",
      "Gunakan teknik konseling yang sesuai",
      "Jaga kerahasiaan informasi siswa"
    ]
  },
  schedule: {
    title: "Jadwal Konseling",
    icon: <Calendar className="h-5 w-5" />,
    description: "Atur jadwal konseling dengan siswa dan orang tua",
    steps: [
      "Buat jadwal konseling baru",
      "Pilih siswa dan tentukan waktu",
      "Tentukan lokasi dan agenda konseling",
      "Kirim notifikasi ke siswa/orang tua",
      "Update status konseling setelah selesai"
    ],
    tips: [
      "Konfirmasi kehadiran sebelum jadwal",
      "Siapkan materi konseling terlebih dahulu",
      "Dokumentasikan hasil konseling"
    ]
  },
  psychology: {
    title: "Tes Psikologi",
    icon: <TestTube className="h-5 w-5" />,
    description: "Kelola tes psikologi untuk asesmen siswa",
    steps: [
      "Pilih template tes yang sesuai",
      "Assign tes kepada siswa",
      "Monitor progress pengerjaan tes",
      "Analisis hasil tes psikologi",
      "Buat laporan dan rekomendasi"
    ],
    tips: [
      "Pilih tes sesuai kebutuhan asesmen",
      "Pastikan lingkungan tes kondusif",
      "Interpretasi hasil dengan hati-hati"
    ]
  },
  whatsapp: {
    title: "WhatsApp Sender",
    icon: <MessageCircle className="h-5 w-5" />,
    description: "Kirim pesan WhatsApp ke orang tua/wali siswa",
    steps: [
      "Pilih template pesan yang sesuai",
      "Tambahkan kontak penerima",
      "Personalisasi pesan dengan data siswa",
      "Kirim pesan secara massal atau individual",
      "Monitor delivery dan respons"
    ],
    tips: [
      "Gunakan template untuk konsistensi",
      "Personalisasi pesan untuk engagement better",
      "Kirim di waktu yang tepat"
    ]
  }
};

export const FeatureGuide = () => {
  const [selectedFeature, setSelectedFeature] = useState<string>("dashboard");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-counseling-blue text-white hover:bg-blue-600 shadow-lg animate-bounce z-50"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto animate-slideInUp">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-6 w-6" />
            Panduan Fitur BK Connect
          </DialogTitle>
          <DialogDescription>
            Pelajari cara menggunakan setiap fitur dalam aplikasi BK Connect
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedFeature} onValueChange={setSelectedFeature} className="w-full">
          <TabsList className="grid grid-cols-3 lg:grid-cols-5 mb-6">
            {Object.entries(featureGuides).map(([key, feature]) => (
              <TabsTrigger 
                key={key} 
                value={key} 
                className="text-xs transition-all duration-200 hover:bg-blue-50"
              >
                <div className="flex flex-col items-center gap-1">
                  {feature.icon}
                  <span className="hidden sm:inline">{feature.title}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(featureGuides).map(([key, feature]) => (
            <TabsContent key={key} value={key} className="space-y-4 animate-fadeIn">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {feature.icon}
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-3">Langkah-langkah Penggunaan:</h4>
                    <ol className="space-y-2">
                      {feature.steps.map((step, index) => (
                        <li key={index} className="flex gap-3">
                          <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </Badge>
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-3">Tips & Saran:</h4>
                    <ul className="space-y-2">
                      {feature.tips.map((tip, index) => (
                        <li key={index} className="flex gap-2 text-sm">
                          <span className="text-yellow-500">💡</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
