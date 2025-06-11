
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/Admin/UserManagement";
import ClassManagement from "@/components/Classes/ClassManagement";
import { StudentTable } from "@/components/Students/StudentTable";
import { BehaviorManagement } from "@/components/Admin/BehaviorManagement";
import { ConsultationManagement } from "@/components/Admin/ConsultationManagement";
import { LetterManagement } from "@/components/Admin/LetterManagement";
import { TestManagement } from "@/components/Psychology/TestManagement";
import { MultiWhatsAppSender } from "@/components/WhatsApp/MultiWhatsAppSender";

const Admin = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Panel Administrasi</h1>
          <p className="text-muted-foreground">
            Kelola pengguna, data siswa, dan sistem aplikasi BK Connect
          </p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
            <TabsTrigger value="users">User</TabsTrigger>
            <TabsTrigger value="students">Siswa</TabsTrigger>
            <TabsTrigger value="classes">Kelas</TabsTrigger>
            <TabsTrigger value="behavior">Perilaku</TabsTrigger>
            <TabsTrigger value="consultation">Konsultasi</TabsTrigger>
            <TabsTrigger value="psychology">Tes Psikologi</TabsTrigger>
            <TabsTrigger value="letters">Surat</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="students">
            <StudentTable />
          </TabsContent>

          <TabsContent value="classes">
            <ClassManagement />
          </TabsContent>

          <TabsContent value="behavior">
            <BehaviorManagement />
          </TabsContent>

          <TabsContent value="consultation">
            <ConsultationManagement />
          </TabsContent>

          <TabsContent value="psychology">
            <TestManagement />
          </TabsContent>

          <TabsContent value="letters">
            <LetterManagement />
          </TabsContent>

          <TabsContent value="whatsapp">
            <MultiWhatsAppSender />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
