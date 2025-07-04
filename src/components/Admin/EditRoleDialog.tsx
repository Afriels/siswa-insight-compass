
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditRoleDialogProps {
  userId: string;
  userName?: string | null;
  currentRole: string | null;
  onRoleChange: (userId: string, newRole: string) => void;
}

export function EditRoleDialog({ userId, userName, currentRole, onRoleChange }: EditRoleDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(currentRole || "student");

  const handleRoleChange = async () => {
    try {
      await onRoleChange(userId, selectedRole);
      setOpen(false);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" title="Edit peran pengguna">
          <PenLine className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Peran Pengguna</DialogTitle>
          <DialogDescription>
            Ubah peran untuk pengguna {userName}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor={`role-${userId}`}>Peran</Label>
          <Select
            value={selectedRole}
            onValueChange={setSelectedRole}
          >
            <SelectTrigger id={`role-${userId}`}>
              <SelectValue placeholder="Pilih peran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Siswa</SelectItem>
              <SelectItem value="counselor">Guru BK</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleRoleChange}>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
