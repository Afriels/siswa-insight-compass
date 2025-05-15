
import { Layout } from "@/components/Layout";
import { ConsultationList } from "@/components/Consultation/ConsultationList";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const Consultation = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">Konsultasi</h1>
            <p className="text-muted-foreground">
              Ajukan konsultasi kepada guru BK untuk mendiskusikan masalah atau pertanyaan Anda.
            </p>
          </div>
          <Button asChild className="mt-4 sm:mt-0 bg-counseling-blue hover:bg-blue-600">
            <Link to="/consultation/new">
              <Plus size={16} className="mr-2" />
              Buat Konsultasi Baru
            </Link>
          </Button>
        </div>
        
        <ConsultationList />
      </div>
    </Layout>
  );
};

export default Consultation;
