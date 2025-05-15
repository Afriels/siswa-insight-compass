
import { Layout } from "@/components/Layout";
import { ConsultationDetail } from "@/components/Consultation/ConsultationDetail";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ConsultationDetailPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <Button variant="outline" asChild className="mb-4">
          <Link to="/consultation">
            <ArrowLeft size={16} className="mr-2" />
            Kembali ke Daftar Konsultasi
          </Link>
        </Button>
        
        <ConsultationDetail />
      </div>
    </Layout>
  );
};

export default ConsultationDetailPage;
