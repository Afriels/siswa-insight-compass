
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
          className="fixed bottom-6 right-6 rounded-full w-16 h-16 bg-gradient-to-r from-counseling-blue to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 z-50 border-2 border-white"
        >
          <HelpCircle className="h-7 w-7" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto animate-slideInUp bg-gradient-to-br from-blue-50 to-indigo-50">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-counseling-blue to-indigo-600 bg-clip-text text-transparent">
            <div className="p-2 rounded-lg bg-counseling-blue text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            Panduan Fitur BK Connect
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-600">
            Pelajari cara menggunakan setiap fitur dalam aplikasi BK Connect dengan mudah dan efektif
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedFeature} onValueChange={setSelectedFeature} className="w-full mt-6">
          <TabsList className="grid grid-cols-3 lg:grid-cols-5 mb-8 bg-white rounded-xl p-2 shadow-lg">
            {Object.entries(featureGuides).map(([key, feature]) => (
              <TabsTrigger 
                key={key} 
                value={key} 
                className="text-xs transition-all duration-300 hover:bg-blue-50 data-[state=active]:bg-counseling-blue data-[state=active]:text-white rounded-lg"
              >
                <div className="flex flex-col items-center gap-2 p-2">
                  <div className={`p-2 rounded-lg ${feature.color} text-white`}>
                    {feature.icon}
                  </div>
                  <span className="hidden sm:inline font-medium">{feature.title}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(featureGuides).map(([key, feature]) => (
            <TabsContent key={key} value={key} className="space-y-6 animate-fadeIn">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-counseling-blue to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-lg bg-white/20">
                      {feature.icon}
                    </div>
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <h4 className="font-bold text-lg text-gray-800">Langkah-langkah Penggunaan</h4>
                      </div>
                      <div className="space-y-3">
                        {feature.steps.map((step, index) => (
                          <div key={index} className="flex gap-4 p-3 rounded-lg bg-blue-50 border-l-4 border-counseling-blue">
                            <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-counseling-blue text-white border-counseling-blue">
                              {index + 1}
                            </Badge>
                            <span className="text-sm text-gray-700 leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        <h4 className="font-bold text-lg text-gray-800">Tips & Saran</h4>
                      </div>
                      <div className="space-y-3">
                        {feature.tips.map((tip, index) => (
                          <div key={index} className="flex gap-3 p-3 rounded-lg bg-yellow-50 border-l-4 border-yellow-400">
                            <span className="text-yellow-500 text-lg">💡</span>
                            <span className="text-sm text-gray-700 leading-relaxed">{tip}</span>
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

        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <p className="text-sm text-center text-gray-600">
            <strong>💬 Butuh bantuan lebih lanjut?</strong> Hubungi administrator sistem atau gunakan fitur konsultasi online.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
