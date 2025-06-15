
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
import Profile from "./pages/Profile";
import Forum from "./pages/Forum";
import Consultation from "./pages/Consultation";
import PsychologyTest from "./pages/PsychologyTest";
import AIAssistant from "./pages/AIAssistant";
import Schedule from "./pages/Schedule";
import Behavior from "./pages/Behavior";
import BehaviorHistory from "./pages/BehaviorHistory";
import Issues from "./pages/Issues";
import Sociogram from "./pages/Sociogram";
// ... tambah import halaman dashboard lain jika perlu

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Landing />} />
        {/* Auth page */}
        <Route path="/auth" element={<Auth />} />

        {/* Halaman Dashboard dan menu dashboard diproteksi */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/dashboard/consultation"
          element={
            <ProtectedRoute>
              <Consultation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/psychology-test"
          element={
            <ProtectedRoute>
              <PsychologyTest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/ai-assistant"
          element={
            <ProtectedRoute>
              <AIAssistant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/students"
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/behavior"
          element={
            <ProtectedRoute>
              <Behavior />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/behavior-history"
          element={
            <ProtectedRoute>
              <BehaviorHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/issues"
          element={
            <ProtectedRoute>
              <Issues />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/sociogram"
          element={
            <ProtectedRoute>
              <Sociogram />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Jika route tidak ditemukan, arahkan ke landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
