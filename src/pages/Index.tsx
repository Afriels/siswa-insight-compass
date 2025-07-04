
import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/Dashboard/StatCard";
import { RecentActivities } from "@/components/Dashboard/RecentActivities";
import { IssueChart } from "@/components/Dashboard/IssueChart";
import { FeatureGuide } from "@/components/Guide/FeatureGuide";
import { Helmet } from "react-helmet-async";
import { Users, Calendar, MessageSquare, TrendingUp, BookOpen, Clock } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<{ role: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    
    fetchProfile();
  }, [user]);

  // Student Dashboard
  if (userProfile?.role === 'student') {
    return (
      <Layout>
        <Helmet>
          <title>Dashboard Siswa - BK Connect</title>
        </Helmet>
        
        <div className="space-y-6 animate-fadeIn">
          <div className="animate-slideInDown">
            <h1 className="text-2xl font-bold text-counseling-blue">Dashboard Siswa</h1>
            <p className="text-muted-foreground">
              Selamat datang di portal siswa BK Connect
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-slideInUp">
            <Link to="/consultation" className="animate-slideInLeft" style={{ animationDelay: '100ms' }} title="Lihat konsultasi saya">
              <StatCard 
                title="Konsultasi Bulan Ini"
                value="0"
                description="Sesi konsultasi"
                icon={<MessageSquare className="h-4 w-4" />}
              />
            </Link>
            <Link to="/schedule" className="animate-slideInLeft" style={{ animationDelay: '200ms' }} title="Lihat jadwal saya">
              <StatCard 
                title="Jadwal Mendatang"
                value="0"
                description="Janji temu"
                icon={<Calendar className="h-4 w-4" />}
              />
            </Link>
            <Link to="/psychology-test" className="animate-slideInLeft" style={{ animationDelay: '300ms' }} title="Ikuti tes psikologi">
              <StatCard 
                title="Tes Tersedia"
                value="3"
                description="Tes psikologi"
                icon={<BookOpen className="h-4 w-4" />}
              />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 animate-slideInUp" style={{ animationDelay: '400ms' }}>
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Akses Cepat
              </h3>
              <div className="space-y-3">
                <Link 
                  to="/consultation/new" 
                  className="block p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                  title="Mulai konsultasi baru dengan guru BK"
                >
                  <p className="font-medium text-primary">Buat Konsultasi Baru</p>
                  <p className="text-sm text-muted-foreground">Mulai sesi konsultasi dengan guru BK</p>
                </Link>
                <Link 
                  to="/ai-assistant" 
                  className="block p-3 bg-accent/10 hover:bg-accent/20 rounded-lg transition-colors"
                  title="Konsultasi dengan asisten AI"
                >
                  <p className="font-medium text-accent">AI Assistant</p>
                  <p className="text-sm text-muted-foreground">Konsultasi ringan dengan AI</p>
                </Link>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tips Pengembangan Diri
              </h3>
              <div className="space-y-3">
                <Link 
                  to="/forum" 
                  className="block p-3 bg-secondary/10 hover:bg-secondary/20 rounded-lg transition-colors"
                  title="Bergabung dengan forum diskusi"
                >
                  <p className="font-medium text-secondary">Forum Diskusi</p>
                  <p className="text-sm text-muted-foreground">Bergabung dengan diskusi teman-teman</p>
                </Link>
                <Link 
                  to="/psychology-test" 
                  className="block p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                  title="Ikuti tes psikologi"
                >
                  <p className="font-medium text-foreground">Tes Psikologi</p>
                  <p className="text-sm text-muted-foreground">Ikuti tes untuk mengenal diri lebih baik</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <FeatureGuide />
      </Layout>
    );
  }

  // Admin/Counselor Dashboard (existing)
  return (
    <Layout>
      <Helmet>
        <title>Dashboard - BK Connect</title>
      </Helmet>
      
      <div className="space-y-6 animate-fadeIn">
        <div className="animate-slideInDown">
          <h1 className="text-2xl font-bold text-counseling-blue">Dashboard BK Connect</h1>
          <p className="text-muted-foreground">
            Selamat datang di sistem Bimbingan Konseling Digital
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-slideInUp">
          <Link to="/students" className="animate-slideInLeft" style={{ animationDelay: '100ms' }} title="Kelola data siswa">
            <StatCard 
              title="Total Siswa"
              value="0"
              description="Siswa terdaftar"
              icon={<Users className="h-4 w-4" />}
            />
          </Link>
          <Link to="/consultation" className="animate-slideInLeft" style={{ animationDelay: '200ms' }} title="Kelola konsultasi">
            <StatCard 
              title="Konsultasi Hari Ini"
              value="0"
              description="Sesi konsultasi"
              icon={<MessageSquare className="h-4 w-4" />}
            />
          </Link>
          <Link to="/schedule" className="animate-slideInLeft" style={{ animationDelay: '300ms' }} title="Kelola jadwal">
            <StatCard 
              title="Jadwal Mendatang"
              value="0"
              description="Jadwal minggu ini"
              icon={<Calendar className="h-4 w-4" />}
            />
          </Link>
          <Link to="/admin" className="animate-slideInLeft" style={{ animationDelay: '400ms' }} title="Panel administrasi">
            <StatCard 
              title="Panel Admin"
              value="Ready"
              description="Sistem aktif"
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-7 animate-slideInUp" style={{ animationDelay: '500ms' }}>
          <div className="md:col-span-4">
            <IssueChart />
          </div>
          <div className="md:col-span-3">
            <RecentActivities />
          </div>
        </div>
      </div>
      
      <FeatureGuide />
    </Layout>
  );
};

export default Index;
