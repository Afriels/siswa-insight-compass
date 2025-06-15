
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertCircle, Trash2 } from "lucide-react";
import { EditRoleDialog } from "./EditRoleDialog";
import { format } from "date-fns";

export type UserTableItem = {
  id: string;
  username: string;
  full_name: string | null;
  role: string | null;
  created_at: string;
};

interface UserTableProps {
  users: UserTableItem[];
  loading: boolean;
  searchTerm: string;
  handleDeleteUser: (userId: string) => void;
  handleUpdateRole: (userId: string, newRole: string) => void;
}

export function UserTable({
  users, loading, searchTerm, handleDeleteUser, handleUpdateRole,
}: UserTableProps) {
  const getRoleBadge = (role: string | null) => {
    switch(role) {
      case 'admin':
        return <Badge className="bg-red-500">Admin</Badge>;
      case 'counselor':
        return <Badge className="bg-purple-500">Guru BK</Badge>;
      case 'student':
        return <Badge className="bg-green-500">Siswa</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-counseling-blue"></div>
      </div>
    );
  }
  if (users.length === 0) {
    return (
      <div className="text-center py-8 flex flex-col items-center gap-2 text-muted-foreground">
        <AlertCircle className="h-10 w-10" />
        {searchTerm ? "Tidak ada pengguna yang cocok dengan pencarian" : "Belum ada pengguna"}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Peran</TableHead>
            <TableHead>Tanggal Dibuat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.full_name || '-'}</TableCell>
              <TableCell>{user.username || '-'}</TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>
                {format(new Date(user.created_at), 'dd/MM/yyyy HH:mm')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <EditRoleDialog
                    userId={user.id}
                    userName={user.full_name}
                    currentRole={user.role}
                    onRoleChange={handleUpdateRole}
                  />
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
