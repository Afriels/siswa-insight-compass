
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

const Index = () => {
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
            <div className="animate-slideInLeft" style={{ animationDelay: '100ms' }}>
              <StatCard 
                title="Konsultasi Bulan Ini"
                value="3"
                description="Sesi konsultasi"
                icon={<MessageSquare className="h-4 w-4" />}
              />
            </div>
            <div className="animate-slideInLeft" style={{ animationDelay: '200ms' }}>
              <StatCard 
                title="Jadwal Mendatang"
                value="2"
                description="Janji temu"
                icon={<Calendar className="h-4 w-4" />}
              />
            </div>
            <div className="animate-slideInLeft" style={{ animationDelay: '300ms' }}>
              <StatCard 
                title="Progres Pembelajaran"
                value="85%"
                description="Tingkat kemajuan"
                icon={<BookOpen className="h-4 w-4" />}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 animate-slideInUp" style={{ animationDelay: '400ms' }}>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Jadwal Konsultasi Terdekat
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium">Konsultasi Akademik</p>
                  <p className="text-sm text-muted-foreground">Senin, 10 Juni 2025 - 10:00 WIB</p>
                  <p className="text-sm text-blue-600">dengan Bu Sarah</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-medium">Konsultasi Karier</p>
                  <p className="text-sm text-muted-foreground">Rabu, 12 Juni 2025 - 14:00 WIB</p>
                  <p className="text-sm text-green-600">dengan Pak Ahmad</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tips Pengembangan Diri
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="font-medium">Manajemen Waktu</p>
                  <p className="text-sm text-muted-foreground">Buat jadwal belajar yang teratur untuk hasil optimal</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-medium">Komunikasi Efektif</p>
                  <p className="text-sm text-muted-foreground">Latih kemampuan berbicara di depan umum</p>
                </div>
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
          <div className="animate-slideInLeft" style={{ animationDelay: '100ms' }}>
            <StatCard 
              title="Total Siswa"
              value="150"
              description="Siswa terdaftar"
              icon={<Users className="h-4 w-4" />}
            />
          </div>
          <div className="animate-slideInLeft" style={{ animationDelay: '200ms' }}>
            <StatCard 
              title="Konsultasi Hari Ini"
              value="12"
              description="Sesi konsultasi"
              icon={<MessageSquare className="h-4 w-4" />}
            />
          </div>
          <div className="animate-slideInLeft" style={{ animationDelay: '300ms' }}>
            <StatCard 
              title="Jadwal Mendatang"
              value="8"
              description="Jadwal minggu ini"
              icon={<Calendar className="h-4 w-4" />}
            />
          </div>
          <div className="animate-slideInLeft" style={{ animationDelay: '400ms' }}>
            <StatCard 
              title="Tingkat Aktivitas"
              value="85%"
              description="Partisipasi siswa"
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </div>
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
