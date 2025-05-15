
import { Layout } from "@/components/Layout";
import { ConsultationForm } from "@/components/Consultation/ConsultationForm";

const ConsultationNew = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Buat Konsultasi Baru</h1>
        <p className="text-muted-foreground">
          Ajukan konsultasi kepada guru BK untuk mendiskusikan masalah atau pertanyaan Anda.
        </p>
        
        <ConsultationForm />
      </div>
    </Layout>
  );
};

export default ConsultationNew;
