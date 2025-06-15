
import { Link } from "react-router-dom";
import heroImage from "@/assets/landing-hero.jpg"; // Silakan upload asset yang sesuai jika perlu

export default function Landing() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-counseling-blue/80 to-counseling-lightGreen/80 flex flex-col">
      <header className="container mx-auto py-6 flex flex-col md:flex-row items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl md:text-4xl text-counseling-blue drop-shadow-lg">
            Sistem Bimbingan Konseling SMK
          </h1>
          <p className="mt-2 text-lg text-counseling-dark">Lebih dekat, lebih solutif, lebih baik bersama BK.</p>
        </div>
        <nav className="flex gap-3 mt-6 md:mt-0">
          <Link to="/auth" className="bg-counseling-blue text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700">Login</Link>
          <Link to="/admin" className="bg-white border border-counseling-blue text-counseling-blue px-6 py-2 rounded-xl shadow hover:bg-blue-100">Panel Admin</Link>
        </nav>
      </header>
      <section className="flex-1 flex flex-col md:flex-row items-center container mx-auto py-10 gap-10">
        <div className="flex-1 max-w-xl">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-4 text-counseling-blue">
            Selamat datang di Sistem BK Terintegrasi SMK
          </h2>
          <p className="mb-4 text-counseling-dark">
            Kemudahan komunikasi antara guru BK, siswa, dan orang tua. Fitur lengkap: konsultasi online, pemantauan perilaku, informasi jadwal, surat digital & AI Assistant!
          </p>
          <Link to="/auth" className="inline-block bg-counseling-green text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-green-700 text-lg transition">
            Mulai Konsultasi
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          {/* Ganti src dengan gambar asli bila sudah di-upload */}
          <img src={heroImage} alt="BK Connect Hero" className="rounded-3xl shadow-2xl border-4 border-counseling-blue max-w-xs md:max-w-lg"/>
        </div>
      </section>
      <footer className="mt-auto bg-counseling-blue text-white py-3 text-center text-xs">
        © {new Date().getFullYear()} BK Connect - SMK. All Rights Reserved.
      </footer>
    </main>
  );
}
