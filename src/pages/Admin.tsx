
import { Layout } from "@/components/Layout";
import UserManagement from "@/components/Admin/UserManagement";
import ClassManagement from "@/components/Classes/ClassManagement";
import { StudentTable } from "@/components/Students/StudentTable";
import BehaviorManagement from "@/components/Admin/BehaviorManagement";
import ConsultationManagement from "@/components/Admin/ConsultationManagement";
import LetterManagement from "@/components/Admin/LetterManagement";
import { TestManagement } from "@/components/Psychology/TestManagement";
import { MultiWhatsAppSender } from "@/components/WhatsApp/MultiWhatsAppSender";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const MENU_ITEMS = [
  { value: "users", label: "User" },
  { value: "students", label: "Siswa" },
  { value: "classes", label: "Kelas" },
  { value: "behavior", label: "Perilaku" },
  { value: "consultation", label: "Konsultasi" },
  { value: "psychology", label: "Tes Psikologi" },
  { value: "letters", label: "Surat" },
  { value: "whatsapp", label: "WhatsApp" },
];

const Admin = () => {
  const [tab, setTab] = useState("users");

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Panel Administrasi</h1>
          <p className="text-muted-foreground">
            Kelola pengguna, data siswa, dan sistem aplikasi BK Connect
          </p>
        </div>

        {/* Dropdown menu selalu tampil di semua ukuran layar */}
        <div>
          <Select value={tab} onValueChange={setTab}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Pilih menu" />
            </SelectTrigger>
            <SelectContent>
              {MENU_ITEMS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Konten sesuai pilihan */}
        <div>
          {tab === "users" && <UserManagement />}
          {tab === "students" && <StudentTable />}
          {tab === "classes" && <ClassManagement />}
          {tab === "behavior" && <BehaviorManagement />}
          {tab === "consultation" && <ConsultationManagement />}
          {tab === "psychology" && (
            <TestManagement onBack={() => {}} onTestsUpdated={() => {}} />
          )}
          {tab === "letters" && <LetterManagement />}
          {tab === "whatsapp" && <MultiWhatsAppSender />}
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
