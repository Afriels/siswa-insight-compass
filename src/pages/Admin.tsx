
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/Admin/UserManagement";
import BehaviorManagement from "@/components/Admin/BehaviorManagement";
import ConsultationManagement from "@/components/Admin/ConsultationManagement";
import LetterManagement from "@/components/Admin/LetterManagement";
import { CreateAdminUser } from "@/components/Admin/CreateAdminUser";
import { MultiWhatsAppSender } from "@/components/WhatsApp/MultiWhatsAppSender";
import { FeatureGuide } from "@/components/Guide/FeatureGuide";
import { Helmet } from "react-helmet-async";

const Admin = () => {
  return (
    <>
      <Helmet>
        <title>Admin Panel - BK Connect</title>
        <link rel="icon" href="https://sman1lumbang.sch.id/wp-content/uploads/2022/12/logo-smanilum-60mm.png" type="image/png" />
      </Helmet>
      <Layout>
        <div className="space-y-6 animate-fadeIn">
          <div className="animate-slideInDown">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">
              Kelola sistem BK Connect
            </p>
          </div>

          <Tabs defaultValue="users" className="w-full animate-slideInUp">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="users">Manajemen User</TabsTrigger>
              <TabsTrigger value="create-admin">Buat Admin</TabsTrigger>
              <TabsTrigger value="behavior">Data Perilaku</TabsTrigger>
              <TabsTrigger value="consultation">Konsultasi</TabsTrigger>
              <TabsTrigger value="letters">Surat</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-4 animate-fadeIn">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="create-admin" className="space-y-4 animate-fadeIn">
              <div>
                <h2 className="text-xl font-semibold mb-4">Buat User Administrator Baru</h2>
                <CreateAdminUser />
              </div>
            </TabsContent>
            
            <TabsContent value="behavior" className="space-y-4 animate-fadeIn">
              <BehaviorManagement />
            </TabsContent>
            
            <TabsContent value="consultation" className="space-y-4 animate-fadeIn">
              <ConsultationManagement />
            </TabsContent>
            
            <TabsContent value="letters" className="space-y-4 animate-fadeIn">
              <LetterManagement />
            </TabsContent>

            <TabsContent value="whatsapp" className="space-y-4 animate-fadeIn">
              <div>
                <h2 className="text-xl font-semibold mb-4">Manajemen WhatsApp</h2>
                <MultiWhatsAppSender />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <FeatureGuide />
      </Layout>
    </>
  );
};

export default Admin;
