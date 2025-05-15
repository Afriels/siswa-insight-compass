
import { Layout } from "@/components/Layout";
import { BehaviorHistory } from "@/components/Behavior/BehaviorHistory";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const BehaviorHistoryPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">Riwayat Perilaku</h1>
            <p className="text-muted-foreground">
              Riwayat perilaku siswa yang telah dicatat sebelumnya.
            </p>
          </div>
          <Button asChild className="mt-4 sm:mt-0 bg-counseling-blue hover:bg-blue-600">
            <Link to="/behavior">
              <Plus size={16} className="mr-2" />
              Catat Perilaku Baru
            </Link>
          </Button>
        </div>
        
        <BehaviorHistory />
      </div>
    </Layout>
  );
};

export default BehaviorHistoryPage;
