
import { Layout } from "@/components/Layout";
import { SociogramChart } from "@/components/Sociogram/SociogramChart";
import { SociogramFilter } from "@/components/Sociogram/SociogramFilter";

const Sociogram = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Sosiogram Kelas</h1>
        <p className="text-muted-foreground">
          Visualisasi hubungan sosial antar siswa berdasarkan data sosiometri.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SociogramFilter />
          </div>
          <div className="lg:col-span-2">
            <SociogramChart />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sociogram;
