
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
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
            defaultValue={currentRole || "student"}
            onValueChange={(value) => onRoleChange(userId, value)}
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
      </DialogContent>
    </Dialog>
  );
}
