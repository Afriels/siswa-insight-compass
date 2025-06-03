
import { Layout } from "@/components/Layout";
import { PsychologyTest } from "@/components/Psychology/PsychologyTest";
import { Helmet } from "react-helmet-async";

const PsychologyTestPage = () => {
  return (
    <>
      <Helmet>
        <title>Tes Psikologi - BK Connect</title>
        <link rel="icon" href="https://sman1lumbang.sch.id/wp-content/uploads/2022/12/logo-smanilum-60mm.png" type="image/png" />
      </Helmet>
      <Layout>
        <PsychologyTest />
      </Layout>
    </>
  );
};

export default PsychologyTestPage;
