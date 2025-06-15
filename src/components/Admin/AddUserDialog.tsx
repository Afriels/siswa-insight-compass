
import { useAuth } from "@/providers/AuthProvider";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  newUser: { email: string; password: string; fullName: string; role: string; };
  setNewUser: (data: { email: string; password: string; fullName: string; role: string; }) => void;
}

export function AddUserDialog({ open, onOpenChange, onSubmit, newUser, setNewUser }: AddUserDialogProps) {
  // Ambil user dari context
  const { user } = useAuth();
  // Hanya aktif jika email user === 'andikabgs@gmail.com'
  const isSuperAdmin = user?.email === 'andikabgs@gmail.com';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-counseling-blue hover:bg-blue-600">
          <UserPlus className="mr-2 h-4 w-4" />
          Tambah User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah User Baru</DialogTitle>
          <DialogDescription>
            {isSuperAdmin
              ? "Silakan isi data berikut untuk menambah user baru."
              : "Fitur ini memerlukan konfigurasi admin tambahan. Hubungi administrator sistem."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!isSuperAdmin && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Catatan:</strong> Pembuatan user baru memerlukan konfigurasi admin tambahan 
                yang saat ini belum tersedia. Silakan hubungi administrator sistem.
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input 
              id="fullName"
              value={newUser.fullName}
              onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
              placeholder="Masukkan nama lengkap"
              disabled={!isSuperAdmin}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="Masukkan email"
              disabled={!isSuperAdmin}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              type="password"
              value={newUser.password}
              onChange={e => setNewUser({ ...newUser, password: e.target.value })}
              placeholder="Masukkan password"
              disabled={!isSuperAdmin}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Peran</Label>
            <Select 
              value={newUser.role} 
              onValueChange={value => setNewUser({ ...newUser, role: value })}
              disabled={!isSuperAdmin}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih peran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Siswa</SelectItem>
                <SelectItem value="counselor">Guru BK</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button 
            className="bg-counseling-blue hover:bg-blue-600"
            onClick={onSubmit}
            // Hanya enable jika super admin
            disabled={!isSuperAdmin}
          >
            {isSuperAdmin ? "Tambah User" : "Fitur Tidak Tersedia"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

