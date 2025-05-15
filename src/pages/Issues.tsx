
import { Layout } from "@/components/Layout";
import { IssueSearch } from "@/components/Issues/IssueSearch";

const Issues = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Pencarian Masalah</h1>
        <p className="text-muted-foreground">
          Cari siswa berdasarkan kategori masalah atau kelas untuk mempermudah intervensi yang tepat.
        </p>
        
        <IssueSearch />
      </div>
    </Layout>
  );
};

export default Issues;
