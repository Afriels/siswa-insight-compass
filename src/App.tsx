
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { ThemeProvider } from "@/hooks/use-theme";
import { HelmetProvider } from "react-helmet-async";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Students from "./pages/Students";
import Consultation from "./pages/Consultation";
import ConsultationNew from "./pages/ConsultationNew";
import ConsultationDetail from "./pages/ConsultationDetail";
import Behavior from "./pages/Behavior";
import BehaviorHistory from "./pages/BehaviorHistory";
import Issues from "./pages/Issues";
import Sociogram from "./pages/Sociogram";
import PsychologyTest from "./pages/PsychologyTest";
import Forum from "./pages/Forum";
import ForumDetail from "./pages/ForumDetail";
import Schedule from "./pages/Schedule";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import AIAssistant from "./pages/AIAssistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthProvider>
              <div className="w-full">
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                  <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
                  <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
                  <Route path="/consultation" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />
                  <Route path="/consultation/new" element={<ProtectedRoute><ConsultationNew /></ProtectedRoute>} />
                  <Route path="/consultation/:id" element={<ProtectedRoute><ConsultationDetail /></ProtectedRoute>} />
                  <Route path="/behavior" element={<ProtectedRoute><Behavior /></ProtectedRoute>} />
                  <Route path="/behavior-history" element={<ProtectedRoute><BehaviorHistory /></ProtectedRoute>} />
                  <Route path="/issues" element={<ProtectedRoute><Issues /></ProtectedRoute>} />
                  <Route path="/sociogram" element={<ProtectedRoute><Sociogram /></ProtectedRoute>} />
                  <Route path="/psychology-test" element={<ProtectedRoute><PsychologyTest /></ProtectedRoute>} />
                  <Route path="/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
                  <Route path="/forum/:id" element={<ProtectedRoute><ForumDetail /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
