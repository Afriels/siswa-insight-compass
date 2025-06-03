
import { Layout } from "@/components/Layout";
import { ForumList } from "@/components/Forum/ForumList";
import { Helmet } from "react-helmet-async";

const Forum = () => {
  return (
    <>
      <Helmet>
        <title>Forum Diskusi - BK Connect</title>
        <link rel="icon" href="https://sman1lumbang.sch.id/wp-content/uploads/2022/12/logo-smanilum-60mm.png" type="image/png" />
      </Helmet>
      <Layout>
        <ForumList />
      </Layout>
    </>
  );
};

export default Forum;
