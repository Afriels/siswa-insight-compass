
import { Link } from "react-router-dom";

export default function NavbarLanding() {
  return (
    <nav className="w-full bg-white/90 border-b shadow py-2 z-50 fixed top-0 left-0">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <img
            className="h-10 w-10 rounded-lg border-2 border-blue-300 shadow"
            src="https://sman1lumbang.sch.id/wp-content/uploads/2022/12/logo-smanilum-60mm.png"
            alt="BK Connect SMA Negeri 1 Lumbang"
          />
          <span className="font-bold text-xl text-counseling-blue tracking-wider">
            BK Connect
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <Link
            to="/"
            className="font-semibold text-counseling-blue hover:text-green-600 transition"
          >
            Beranda
          </Link>
          <Link
            to="/auth"
            className="bg-counseling-green hover:bg-green-700 transition text-white px-5 py-2 rounded font-semibold shadow"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
