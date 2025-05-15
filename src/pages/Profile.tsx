
import { Layout } from "@/components/Layout";
import { UserProfile } from "@/components/Profile/UserProfile";

const Profile = () => {
  return (
    <Layout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold">Profil Pengguna</h1>
        <p className="text-muted-foreground">
          Lihat dan ubah informasi profil Anda
        </p>
        
        <UserProfile />
      </div>
    </Layout>
  );
};

export default Profile;
