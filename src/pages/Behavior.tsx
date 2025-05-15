
import { Layout } from "@/components/Layout";
import { BehaviorForm } from "@/components/Behavior/BehaviorForm";

const Behavior = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Pendataan Perilaku</h1>
        <p className="text-muted-foreground">
          Catat perilaku siswa untuk membantu analisis perkembangan dan pemahaman masalah pergaulan.
        </p>
        
        <BehaviorForm />
      </div>
    </Layout>
  );
};

export default Behavior;
