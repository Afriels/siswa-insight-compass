import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TestTube, Clock, Users, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { TestSession } from "./TestSession";
import { TestResult } from "./TestResult";
import { TestManagement } from "./TestManagement";

interface TestTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  duration_minutes: number;
  instructions: string;
}

interface TestSession {
  id: string;
  status: string;
  answers: Record<string, any>;
  results: Record<string, any>;
  completed_at: string | null;
}

export const PsychologyTest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [testTemplates, setTestTemplates] = useState<TestTemplate[]>([]);
  const [selectedTest, setSelectedTest] = useState<TestTemplate | null>(null);
  const [currentSession, setCurrentSession] = useState<TestSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [showManagement, setShowManagement] = useState(false);
  const [userRole, setUserRole] = useState<string>('student');

  useEffect(() => {
    fetchTestTemplates();
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      setUserRole(data.role || 'student');
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchTestTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('psychology_test_templates')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) throw error;

      setTestTemplates(data || []);
    } catch (error) {
      console.error("Error fetching test templates:", error);
      toast({
        title: "Error",
        description: "Gagal memuat daftar tes psikologi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async (test: TestTemplate) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Anda harus login untuk mengikuti tes",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create new test session
      const { data, error } = await supabase
        .from('psychology_test_sessions')
        .insert({
          user_id: user.id,
          test_template_id: test.id,
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;

      setSelectedTest(test);
      setCurrentSession({
        id: data.id,
        status: data.status,
        answers: (data.answers as Record<string, any>) || {},
        results: (data.results as Record<string, any>) || {},
        completed_at: data.completed_at
      });
    } catch (error) {
      console.error("Error starting test:", error);
      toast({
        title: "Error",
        description: "Gagal memulai tes",
        variant: "destructive",
      });
    }
  };

  const handleTestComplete = (results: Record<string, any>) => {
    setCurrentSession(prev => prev ? { 
      ...prev, 
      results, 
      status: 'completed',
      completed_at: new Date().toISOString()
    } : null);
  };

  const resetTest = () => {
    setSelectedTest(null);
    setCurrentSession(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-counseling-blue"></div>
      </div>
    );
  }

  if (showManagement && (userRole === 'counselor' || userRole === 'admin')) {
    return (
      <TestManagement 
        onBack={() => setShowManagement(false)}
        onTestsUpdated={fetchTestTemplates}
      />
    );
  }

  if (selectedTest && currentSession) {
    if (currentSession.status === 'completed' && currentSession.results && Object.keys(currentSession.results).length > 0) {
      return (
        <TestResult
          test={selectedTest}
          session={{
            id: currentSession.id,
            results: currentSession.results,
            completed_at: currentSession.completed_at || new Date().toISOString()
          }}
          onBack={resetTest}
        />
      );
    }

    return (
      <TestSession
        test={selectedTest}
        session={currentSession}
        onComplete={handleTestComplete}
        onBack={resetTest}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold mb-2">Tes Psikologi Online</h1>
          <p className="text-muted-foreground">
            Pilih tes psikologi yang ingin Anda ikuti untuk mengetahui lebih dalam tentang diri Anda
          </p>
        </div>
        
        {(userRole === 'counselor' || userRole === 'admin') && (
          <Button
            variant="outline"
            onClick={() => setShowManagement(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Kelola Tes
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testTemplates.map((test) => (
          <Card key={test.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <TestTube className="h-8 w-8 text-primary" />
                <Badge>{test.category}</Badge>
              </div>
              <CardTitle className="text-lg">{test.title}</CardTitle>
              <CardDescription>{test.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {test.duration_minutes} menit
                </div>
              </div>
              <Button 
                className="w-full"
                onClick={() => handleStartTest(test)}
              >
                Mulai Tes
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {testTemplates.length === 0 && (
        <div className="text-center py-12">
          <TestTube className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Belum Ada Tes Tersedia</h3>
          <p className="text-muted-foreground">
            Saat ini belum ada tes psikologi yang tersedia.
          </p>
        </div>
      )}
    </div>
  );
};
