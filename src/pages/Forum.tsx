
import { Layout } from "@/components/Layout";
import { ForumList } from "@/components/Forum/ForumList";
import { CreateTopicDialog } from "@/components/Forum/CreateTopicDialog";
import { FeatureGuide } from "@/components/Guide/FeatureGuide";
import { Helmet } from "react-helmet-async";

const Forum = () => {
  return (
    <Layout>
      <Helmet>
        <title>Forum Diskusi - BK Connect</title>
      </Helmet>
      
      <div className="space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center animate-slideInDown">
          <div>
            <h1 className="text-2xl font-bold">Forum Diskusi</h1>
            <p className="text-muted-foreground">
              Diskusi dan berbagi pengalaman dengan sesama siswa
            </p>
          </div>
          <CreateTopicDialog />
        </div>

        <div className="animate-slideInUp">
          <ForumList />
        </div>
      </div>
      
      <FeatureGuide />
    </Layout>
  );
};

export default Forum;
