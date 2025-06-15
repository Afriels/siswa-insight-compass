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

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        {/* Semua halaman dashboard dan menu diproteksi */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
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
        {/* Jika route tidak ditemukan, arahkan ke / (landing) saja */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
