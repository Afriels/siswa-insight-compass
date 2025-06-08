import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/hooks/use-theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes caching
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="bk-connect-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <HelmetProvider>
            <Helmet>
              <title>BK Connect - Aplikasi Bimbingan Konseling Digital</title>
              <link rel="icon" href="https://sman1lumbang.sch.id/wp-content/uploads/2022/12/logo-smanilum-60mm.png" type="image/png" />
            </Helmet>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<ForumLanding />} />
              <Route path="/login" element={<Auth />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
              <Route path="/sociogram" element={<ProtectedRoute><Sociogram /></ProtectedRoute>} />
              <Route path="/issues" element={<ProtectedRoute><Issues /></ProtectedRoute>} />
              <Route path="/behavior" element={<ProtectedRoute><Behavior /></ProtectedRoute>} />
              <Route path="/behavior/history" element={<ProtectedRoute><BehaviorHistoryPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/consultation" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />
              <Route path="/consultation/new" element={<ProtectedRoute><ConsultationNew /></ProtectedRoute>} />
              <Route path="/consultation/:id" element={<ProtectedRoute><ConsultationDetailPage /></ProtectedRoute>} />
              <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
              <Route path="/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
              <Route path="/psychology-test" element={<ProtectedRoute><PsychologyTestPage /></ProtectedRoute>} />
              <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HelmetProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
