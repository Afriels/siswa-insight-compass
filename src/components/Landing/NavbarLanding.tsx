
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function NavbarLanding() {
  return (
    <nav className="w-full bg-background/95 backdrop-blur-md border-b shadow py-2 z-50 fixed top-0 left-0">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <img
            className="h-10 w-10 rounded-lg border-2 border-primary/30 shadow"
            src="https://sman1lumbang.sch.id/wp-content/uploads/2022/12/logo-smanilum-60mm.png"
            alt="BK Connect SMA Negeri 1 Lumbang"
          />
          <span className="font-bold text-xl text-primary tracking-wider">
            BK Connect
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <Link
            to="/"
            className="font-semibold text-primary hover:text-accent transition"
            title="Kembali ke beranda"
          >
            Beranda
          </Link>
          <ThemeToggle />
          <Link
            to="/auth"
            className="bg-primary hover:bg-primary/90 transition text-primary-foreground px-5 py-2 rounded-lg font-semibold shadow-lg"
            title="Masuk ke sistem"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
