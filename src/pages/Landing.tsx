import { Link } from "react-router-dom";
import { Lightbulb, Users, MessageCircle, Calendar, HelpCircle, CheckCircle, BookOpen, ShieldCheck } from "lucide-react";
import NavbarLanding from "@/components/Landing/NavbarLanding";
import heroImage from "@/assets/counseling-hero.jpg";
import consultationImage from "@/assets/consultation-scene.jpg";

const fitur = [
  {
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
    title: "Konsultasi Online",
    desc: "Siswa dapat berkonsultasi langsung dengan Guru BK melalui platform digital ini secara aman dan nyaman.",
  },
  {
    icon: <Calendar className="h-8 w-8 text-accent" />,
    title: "Manajemen Jadwal",
    desc: "Atur jadwal konsultasi & lihat agenda dengan mudah demi terlaksananya layanan tepat waktu.",
  },
  {
    icon: <Users className="h-8 w-8 text-secondary" />,
    title: "Kolaborasi Orang Tua",
    desc: "Orang tua siswa dapat mendukung dan memantau perkembangan anak secara langsung.",
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
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
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: "Login",
    desc: "Siswa/orang tua login menggunakan email yang terdaftar.",
  },
  {
    icon: <BookOpen className="h-8 w-8 text-accent" />,
    title: "Pilih Konsultasi",
    desc: "Pilih menu konsultasi untuk membuat atau mengatur janji temu.",
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-secondary" />,
    title: "Berkonsultasi",
    desc: "Sampaikan keluhan/pertanyaan di ruang yang aman bersama Guru BK.",
  },
];

const teamBK = [
  {
    name: "Mr. Ropin Juwaeni Sholeh",
    role: "Guru BK Senior",
    img: "https://randomuser.me/api/portraits/men/78.jpg",
  },
  {
    name: "Ms. Rizka Choirotinusman",
    role: "Guru BK",
    img: "https://randomuser.me/api/portraits/women/84.jpg",
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
    <main className="relative min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex flex-col">
      {/* Navbar Landing */}
      <NavbarLanding />
      
      {/* Hero Section */}
      <header className="container mx-auto py-8 flex flex-col lg:flex-row items-center lg:justify-between animate-fadeInSoft mt-16 gap-8">
        <div className="flex-1 animate-slideInLeft">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4 animate-fadeIn">
            <span className="text-sm font-medium text-primary">✨ Platform BK Modern</span>
          </div>
          <h1 className="font-bold text-4xl md:text-6xl text-primary drop-shadow-lg leading-tight">
            Dengan BK, Semua <br/>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Jadi Lebih Baik
            </span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Bimbingan Konseling SMA Negeri 1 Lumbang, tempat kamu bisa menceritakan masalahmu 
            dengan aman, tenang dan terjaga privasi.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/auth"
              className="group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
            >
              Mulai Konsultasi
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              to="/forum"
              className="group border-2 border-primary/20 hover:border-primary text-primary font-medium px-8 py-4 rounded-xl transition-all duration-300 hover:bg-primary/5 inline-flex items-center justify-center"
            >
              Jelajahi Forum
            </Link>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center animate-slideInRight">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl animate-pulse"></div>
            <img
              src={heroImage}
              alt="BK Connect - Konseling Modern"
              className="relative rounded-3xl shadow-2xl border border-primary/20 max-w-sm md:max-w-lg hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </header>

      {/* Fitur Section */}
      <section className="w-full bg-card/50 backdrop-blur-sm py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12 animate-slideInUp">
            Fitur Unggulan BK Online
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fitur.map((f, i) => (
              <div 
                key={i} 
                className="group p-8 bg-card rounded-2xl shadow-lg hover:shadow-xl border border-border/50 hover:border-primary/20 transition-all duration-300 hover:-translate-y-2 animate-slideInUp"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                <h3 className="font-semibold text-primary text-xl mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Process */}
      <section className="container mx-auto py-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 animate-slideInLeft">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8">
              Cara Konsultasi di BK Online
            </h2>
            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-4 animate-slideInLeft" style={{ animationDelay: `${i * 150}ms` }}>
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-foreground mb-2">{step.title}</h4>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 animate-slideInRight">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl blur-2xl"></div>
              <img
                src={consultationImage}
                alt="Konsultasi BK"
                className="relative rounded-3xl shadow-2xl border border-primary/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tim BK */}
      <section className="w-full bg-card/50 backdrop-blur-sm py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12 animate-slideInUp">
            Tim Guru BK
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {teamBK.map((person, i) => (
              <div 
                key={person.name} 
                className="group bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl w-80 transition-all duration-300 hover:-translate-y-2 animate-slideInUp border border-border/50 hover:border-primary/20"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
                    <img
                      src={person.img}
                      alt={person.name}
                      className="relative h-32 w-32 rounded-full object-cover border-4 border-primary/20 group-hover:border-primary/40 transition-colors"
                    />
                  </div>
                  <h3 className="font-bold text-primary text-xl mb-2">{person.name}</h3>
                  <p className="text-muted-foreground">{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12 animate-slideInUp">
          FAQ BK Online
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={faq.q}
              className="group bg-card px-6 py-5 rounded-xl shadow-md hover:shadow-lg border border-border/50 hover:border-primary/20 transition-all animate-slideInUp"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <summary className="cursor-pointer font-semibold flex items-center gap-3 text-primary focus:outline-none group-open:text-accent transition-colors">
                <HelpCircle className="h-5 w-5 flex-shrink-0" />
                <span>{faq.q}</span>
              </summary>
              <div className="mt-4 text-muted-foreground leading-relaxed pl-8">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>

      <footer className="mt-auto bg-primary text-primary-foreground py-6 text-center rounded-t-2xl">
        <p className="text-sm opacity-90">
          © {new Date().getFullYear()} BK Connect - SMA Negeri 1 Lumbang. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}