
import { Link } from "react-router-dom";
import { Lightbulb, Users, MessageCircle, Calendar, HelpCircle, CheckCircle, BookOpen, ShieldCheck } from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?fit=crop&w=700&q=80";

const fitur = [
  {
    icon: <MessageCircle className="h-8 w-8 text-counseling-blue" />,
    title: "Konsultasi Online",
    desc: "Siswa dapat berkonsultasi langsung dengan Guru BK melalui platform digital ini secara aman dan nyaman.",
  },
  {
    icon: <Calendar className="h-8 w-8 text-counseling-green" />,
    title: "Manajemen Jadwal",
    desc: "Atur jadwal konsultasi & lihat agenda dengan mudah demi terlaksananya layanan tepat waktu.",
  },
  {
    icon: <Users className="h-8 w-8 text-counseling-purple" />,
    title: "Kolaborasi Orang Tua",
    desc: "Orang tua siswa dapat mendukung dan memantau perkembangan anak secara langsung.",
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-yellow-400" />,
    title: "Tips Pengembangan Diri",
    desc: "Akses informasi menarik seperti artikel pengembangan diri, motivasi dan edukasi masalah remaja.",
  },
  {
    icon: <BookOpen className="h-8 w-8 text-pink-500" />,
    title: "AI Assistant",
    desc: "Asisten cerdas membantu menjawab kebutuhan informasi, tanya jawab, maupun konsultasi ringan.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-green-600" />,
    title: "Keamanan Data",
    desc: "Privasi dan keamanan data siswa menjadi prioritas utama aplikasi ini.",
  },
];

const steps = [
  {
    icon: <CheckCircle className="h-8 w-8 text-counseling-blue" />,
    title: "Login",
    desc: "Siswa/orang tua login menggunakan email yang terdaftar.",
  },
  {
    icon: <BookOpen className="h-8 w-8 text-counseling-green" />,
    title: "Pilih Konsultasi",
    desc: "Pilih menu konsultasi untuk membuat atau mengatur janji temu.",
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-counseling-purple" />,
    title: "Berkonsultasi",
    desc: "Sampaikan keluhan/pertanyaan di ruang yang aman bersama Guru BK.",
  },
];

const teamBK = [
  {
    name: "Bu Sarah, S.Pd",
    role: "Guru BK",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Pak Ahmad, M.Pd",
    role: "Guru BK",
    img: "https://randomuser.me/api/portraits/men/43.jpg",
  },
];

const faqs = [
  {
    q: "Apakah layanan ini rahasia?",
    a: "Semua data percakapan dan konsultasi dijamin kerahasiaannya sesuai kode etik BK.",
  },
  {
    q: "Siapa saja yang bisa menggunakan aplikasi ini?",
    a: "Siswa, orang tua/wali, serta guru dapat mengakses fitur sesuai otorisasinya.",
  },
  {
    q: "Bagaimana jadwal konsultasi dibuat?",
    a: "Siswa/orangtua cukup pilih waktu pada menu Jadwal, lalu menunggu konfirmasi guru BK.",
  },
  {
    q: "Apakah konsultasi bisa dilakukan via HP?",
    a: "Aplikasi ini berbasis web sehingga dapat diakses melalui komputer maupun smartphone.",
  },
];

export default function Landing() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-counseling-blue/80 to-counseling-lightGreen/80 flex flex-col">
      {/* Hero Section */}
      <header className="container mx-auto py-6 flex flex-col md:flex-row items-center md:justify-between animate-fade-in">
        <div>
          <h1 className="font-bold text-3xl md:text-5xl text-counseling-blue drop-shadow-lg">
            SMA Negeri 1 Lumbang
          </h1>
          <p className="mt-2 text-lg text-counseling-dark max-w-xl">
            Lebih dekat, lebih solutif, lebih baik bersama BK. <br />
            Hadirkan solusi permasalahan siswa — online & interaktif.
          </p>
          <Link
            to="/auth"
            className="mt-5 inline-block bg-counseling-green text-white font-semibold px-8 py-3 rounded-lg shadow hover:bg-green-700 text-lg transition"
          >
            Mulai Konsultasi
          </Link>
        </div>
        <div className="flex-1 flex justify-center md:flex-row mt-8 md:mt-0">
          <img
            src={heroImage}
            alt="BK Connect Hero"
            className="rounded-3xl shadow-2xl border-4 border-counseling-blue max-w-xs md:max-w-lg"
          />
        </div>
      </header>
      {/* Fitur Section */}
      <section className="w-full bg-white/80 py-12">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-counseling-blue text-center mb-8">
            Fitur Unggulan BK Online
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {fitur.map((f, i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center text-center hover:scale-105 transition animate-fade-in">
                <div className="mb-3">{f.icon}</div>
                <div className="font-semibold text-counseling-blue text-lg">{f.title}</div>
                <div className="text-gray-600 text-sm mt-2">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Tata Cara Konsultasi */}
      <section className="container mx-auto py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-counseling-blue text-center mb-8">
          Cara Konsultasi di BK Online
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center max-w-xs mx-auto animate-fade-in">
              <div className="mb-2">{step.icon}</div>
              <div className="font-semibold">{step.title}</div>
              <div className="text-gray-500 text-sm">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>
      {/* Tim BK */}
      <section className="w-full bg-white/80 py-12 border-y">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-counseling-blue text-center mb-8">
            Tim Guru BK
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {teamBK.map((person, i) => (
              <div key={person.name} className="flex flex-col items-center bg-white rounded-xl p-6 shadow-lg w-60 animate-fade-in">
                <img
                  src={person.img}
                  alt={person.name}
                  className="h-24 w-24 rounded-full object-cover mb-3 border-4 border-counseling-blue"
                />
                <div className="font-bold text-counseling-blue">{person.name}</div>
                <div className="text-gray-500 text-sm">{person.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ */}
      <section className="container mx-auto py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-counseling-blue text-center mb-8">FAQ BK Online</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={faq.q}
              className="bg-white px-5 py-4 rounded-lg shadow hover:bg-blue-50 transition animate-fade-in group"
            >
              <summary className="cursor-pointer font-semibold flex items-center gap-2 text-counseling-blue focus:outline-none group-open:text-green-700 transition">
                <HelpCircle className="h-5 w-5" />
                {faq.q}
              </summary>
              <div className="mt-2 text-gray-600 text-sm">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>
      <footer className="mt-auto bg-counseling-blue text-white py-3 text-center text-xs rounded-t-2xl">
        © {new Date().getFullYear()} BK Connect - SMA Negeri 1 Lumbang. All Rights Reserved.
      </footer>
    </main>
  );
}
