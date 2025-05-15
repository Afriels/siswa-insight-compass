
import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/Dashboard/StatCard";
import { IssueChart } from "@/components/Dashboard/IssueChart";
import { RecentActivities } from "@/components/Dashboard/RecentActivities";
import { Users, User, FileText, AlertCircle } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard BK Connect</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Siswa"
            value="350"
            description="Dari 15 kelas"
            icon={<Users size={18} />}
            colorClass="bg-counseling-blue text-white"
          />
          <StatCard
            title="Siswa Terkonseling"
            value="124"
            description="35.4% dari total siswa"
            icon={<User size={18} />}
            colorClass="bg-counseling-green text-white"
          />
          <StatCard
            title="Sesi Konseling"
            value="289"
            description="Bulan ini: 42"
            icon={<FileText size={18} />}
            colorClass="bg-counseling-purple text-white"
          />
          <StatCard
            title="Masalah Aktif"
            value="56"
            description="Perlu tindak lanjut"
            icon={<AlertCircle size={18} />}
            colorClass="bg-red-500 text-white"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IssueChart />
          <RecentActivities />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
