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
  MessageCircle,
  CheckCircle,
  Lightbulb
} from "lucide-react";

const featureGuides = {
  dashboard: {
    title: "Dashboard",
    icon: <BookOpen className="h-5 w-5" />,
    description: "Ringkasan aktivitas dan statistik BK",
    color: "bg-blue-500",
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
    color: "bg-green-500",
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
    color: "bg-purple-500",
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
    color: "bg-orange-500",
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
    color: "bg-red-500",
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
    color: "bg-teal-500",
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
    color: "bg-indigo-500",
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
    color: "bg-pink-500",
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
    color: "bg-green-600",
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
          className="fixed bottom-6 right-6 rounded-full w-16 h-16 bg-gradient-to-r from-counseling-blue to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 z-[70] border-2 border-white"
          style={{ boxShadow: '0 8px 40px 0 #426cf861' }}
        >
          <HelpCircle className="h-7 w-7" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-6xl max-h-[85vh] overflow-y-auto animate-slideInUp bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 backdrop-blur-2xl shadow-2xl border-2 border-primary/20 z-[100]"
        style={{ borderRadius: '24px' }}
      >
        <DialogHeader className="border-b border-primary/20 pb-6 bg-gradient-to-r from-primary/10 to-secondary/10 -m-6 mb-6 p-6 rounded-t-3xl">
          <DialogTitle className="flex items-center gap-3 text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg">
              <BookOpen className="h-8 w-8" />
            </div>
            Panduan Fitur BK Connect
          </DialogTitle>
          <DialogDescription className="text-lg text-foreground/80 mt-2">
            Pelajari cara menggunakan setiap fitur dalam aplikasi BK Connect dengan mudah dan efektif
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedFeature} onValueChange={setSelectedFeature} className="w-full mt-8">
          <TabsList className="grid grid-cols-3 lg:grid-cols-5 mb-8 bg-card rounded-2xl p-3 shadow-xl border border-primary/20 h-auto">
            {Object.entries(featureGuides).map(([key, feature]) => (
              <TabsTrigger 
                key={key} 
                value={key} 
                className="text-xs transition-all duration-300 hover:bg-primary/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground rounded-xl shadow-sm h-auto p-2"
              >
                <div className="flex flex-col items-center gap-1 min-h-[60px]">
                  <div className={`p-1.5 rounded-lg ${feature.color} text-white shadow-lg transition-transform duration-200 group-hover:scale-110`}>
                    {feature.icon}
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-center leading-tight">{feature.title}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(featureGuides).map(([key, feature]) => (
            <TabsContent key={key} value={key} className="space-y-6 animate-fadeIn">
              <Card className="shadow-2xl border-2 border-primary/20 bg-card/90 backdrop-blur-sm rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground rounded-t-3xl p-8">
                  <CardTitle className="flex items-center gap-4 text-2xl">
                    <div className="p-3 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm">
                      {feature.icon}
                    </div>
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/90 text-lg mt-2">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <h4 className="font-bold text-xl text-foreground">Langkah-langkah Penggunaan</h4>
                      </div>
                      <div className="space-y-4">
                        {feature.steps.map((step, index) => (
                          <div key={index} className="flex gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 hover:border-primary/20 transition-all duration-300">
                            <Badge variant="outline" className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-primary to-secondary text-primary-foreground border-primary shadow-lg">
                              {index + 1}
                            </Badge>
                            <span className="text-sm text-foreground/80 leading-relaxed flex-1">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <Lightbulb className="h-6 w-6 text-yellow-500" />
                        <h4 className="font-bold text-xl text-foreground">Tips & Saran</h4>
                      </div>
                      <div className="space-y-4">
                        {feature.tips.map((tip, index) => (
                          <div key={index} className="flex gap-4 p-4 rounded-2xl bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 hover:border-yellow-300 transition-all duration-300">
                            <span className="text-yellow-500 text-xl">💡</span>
                            <span className="text-sm text-foreground/80 leading-relaxed flex-1">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border-2 border-green-200/50 shadow-lg">
          <p className="text-sm text-center text-foreground/70">
            <strong className="text-primary">💬 Butuh bantuan lebih lanjut?</strong> Hubungi administrator sistem atau gunakan fitur konsultasi online.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
