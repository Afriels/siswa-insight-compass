
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Students from "./pages/Students";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { AuthProvider } from "./providers/AuthProvider";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
// ... tambah import halaman dashboard lain jika perlu

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Landing />} />
        {/* Auth page */}
        <Route path="/auth" element={<Auth />} />

        {/* Semua halaman dashboard dan menu dashboard diproteksi, 
            gunakan awalan /dashboard untuk menjaga konsistensi */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        {/* Contoh: jika ada halaman dashboard lain, gunakan awalan /dashboard/halaman */}
        {/* 
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/forum"
          element={
            <ProtectedRoute>
              <Forum />
            </ProtectedRoute>
          }
        />
        */}

        {/* Admin/Siswa route tetap */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          }
        />
        {/* Jika route tidak ditemukan, arahkan ke / (landing) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
