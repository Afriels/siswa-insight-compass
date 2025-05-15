
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";

import Index from "./pages/Index";
import Students from "./pages/Students";
import Sociogram from "./pages/Sociogram";
import Issues from "./pages/Issues";
import Behavior from "./pages/Behavior";
import BehaviorHistoryPage from "./pages/BehaviorHistory";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Consultation from "./pages/Consultation";
import ConsultationNew from "./pages/ConsultationNew";
import ConsultationDetailPage from "./pages/ConsultationDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Auth />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
            <Route path="/sociogram" element={<ProtectedRoute><Sociogram /></ProtectedRoute>} />
            <Route path="/issues" element={<ProtectedRoute><Issues /></ProtectedRoute>} />
            <Route path="/behavior" element={<ProtectedRoute><Behavior /></ProtectedRoute>} />
            <Route path="/behavior/history" element={<ProtectedRoute><BehaviorHistoryPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/consultation" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />
            <Route path="/consultation/new" element={<ProtectedRoute><ConsultationNew /></ProtectedRoute>} />
            <Route path="/consultation/:id" element={<ProtectedRoute><ConsultationDetailPage /></ProtectedRoute>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
