
import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/Dashboard/StatCard";
import { RecentActivities } from "@/components/Dashboard/RecentActivities";
import { IssueChart } from "@/components/Dashboard/IssueChart";
import { FeatureGuide } from "@/components/Guide/FeatureGuide";
import { Helmet } from "react-helmet-async";
import { Users, Calendar, MessageSquare, TrendingUp } from "lucide-react";

const Index = () => {
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
