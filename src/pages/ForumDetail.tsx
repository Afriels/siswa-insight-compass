
import { Layout } from "@/components/Layout";
import { ForumDetail } from "@/components/Forum/ForumDetail";
import { Helmet } from "react-helmet-async";

const ForumDetailPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>Detail Diskusi - BK Connect</title>
      </Helmet>
      
      <ForumDetail />
    </Layout>
  );
};

export default ForumDetailPage;
