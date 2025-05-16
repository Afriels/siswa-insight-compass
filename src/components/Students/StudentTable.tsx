
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogFooter, DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, UserPlus, PenLine, Trash2, Download, Upload } from "lucide-react";
import { StudentForm, StudentFormData } from "./StudentForm";
import * as XLSX from 'xlsx';

interface Student {
  id: string;
  username: string | null;
  full_name: string | null;
  created_at: string;
  role: string | null;
  user_metadata?: {
    nis?: string;
    class?: string;
    gender?: string;
    social_score?: string;
  }
}

export function StudentTable() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentFormData | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  
  const fetchStudents = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setStudents(data || []);
    } catch (error: any) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data siswa",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    (student.full_name && student.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.user_metadata?.nis && student.user_metadata.nis.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.user_metadata?.class && student.user_metadata.class.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setFormMode('create');
    setIsFormOpen(true);
  };
  
  const handleEditStudent = (student: Student) => {
    setSelectedStudent({
      id: student.id,
      nis: student.user_metadata?.nis || '',
      full_name: student.full_name || '',
      class: student.user_metadata?.class || '',
      gender: (student.user_metadata?.gender as any) || 'Laki-laki',
      social_score: (student.user_metadata?.social_score as any) || 'Sedang',
      email: student.username || '',
    });
    setFormMode('edit');
    setIsFormOpen(true);
  };
  
  const handleDeleteConfirm = (studentId: string) => {
    setStudentToDelete(studentId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!studentToDelete) return;
    
    try {
      const { error } = await supabase.auth.admin.deleteUser(studentToDelete);
      
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Data siswa berhasil dihapus",
      });
      
      fetchStudents();
    } catch (error: any) {
      console.error("Error deleting student:", error);
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus data siswa",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };
  
  const handleExportToExcel = () => {
    try {
      setExporting(true);
      
      // Transform data for export
      const exportData = filteredStudents.map(student => ({
        NIS: student.user_metadata?.nis || '',
        'Nama Lengkap': student.full_name || '',
        Kelas: student.user_metadata?.class || '',
        Gender: student.user_metadata?.gender || '',
        'Skor Sosial': student.user_metadata?.social_score || '',
        Email: student.username || ''
      }));
      
      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Siswa");
      
      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, "data-siswa.xlsx");
      
      toast({
        title: "Berhasil",
        description: "Data siswa berhasil diekspor ke Excel",
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast({
        title: "Error",
        description: "Gagal mengekspor data ke Excel",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };
  
  const handleImportFromExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setImporting(true);
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = event.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Validate data structure
          if (!jsonData.length) throw new Error("File Excel tidak memiliki data");
          
          // Track success and failures
          let successCount = 0;
          let failureCount = 0;
          
          // Process each row
          for (const row of jsonData) {
            try {
              const record = row as any;
              
              if (!record.NIS || !record['Nama Lengkap'] || !record.Kelas) {
                failureCount++;
                continue;
              }
              
              // Generate email if not provided
              const email = record.Email || `${record.NIS}@student.example.com`;
              const password = Math.random().toString(36).slice(-8); // Generate random password
              
              // Create auth user
              await supabase.auth.admin.createUser({
                email: email,
                password: password,
                email_confirm: true,
                user_metadata: {
                  full_name: record['Nama Lengkap'],
                  role: "student",
                  nis: record.NIS,
                  class: record.Kelas,
                  gender: record.Gender || "Laki-laki",
                  social_score: record['Skor Sosial'] || "Sedang"
                }
              });
              
              successCount++;
            } catch (error) {
              failureCount++;
              console.error("Error importing row:", error);
            }
          }
          
          // Refresh data
          fetchStudents();
          
          toast({
            title: "Import selesai",
            description: `Berhasil: ${successCount} siswa, Gagal: ${failureCount} siswa`,
            duration: 5000,
          });
          
          // Clear input
          e.target.value = '';
        } catch (error: any) {
          console.error("Error processing Excel file:", error);
          toast({
            title: "Error",
            description: error.message || "Gagal memproses file Excel",
            variant: "destructive",
          });
        } finally {
          setImporting(false);
        }
      };
      
      reader.readAsBinaryString(file);
    } catch (error: any) {
      console.error("Error with file reader:", error);
      setImporting(false);
      toast({
        title: "Error",
        description: error.message || "Gagal membaca file Excel",
        variant: "destructive",
      });
      
      // Clear input
      e.target.value = '';
    }
  };
  
  const getSocialScoreBadge = (score?: string) => {
    switch(score) {
      case "Tinggi":
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-counseling-lightGreen text-green-800">Tinggi</span>;
      case "Sedang":
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-counseling-lightBlue text-blue-800">Sedang</span>;
      case "Rendah":
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-counseling-lightPurple text-purple-800">Rendah</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">-</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h2 className="text-xl font-semibold">Data Siswa</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Cari siswa..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportToExcel} disabled={exporting || !students.length}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <div className="relative">
              <Button variant="outline" disabled={importing}>
                <Upload className="h-4 w-4 mr-2" />
                Import
                <Input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  onChange={handleImportFromExcel} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  disabled={importing}
                />
              </Button>
            </div>
            
            <Button onClick={handleAddStudent}>
              <UserPlus className="h-4 w-4 mr-2" />
              Tambah Siswa
            </Button>
          </div>
        </div>
      </div>
      
      <div className="rounded-md border shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NIS</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Skor Sosial</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-counseling-blue"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "Tidak ada siswa yang sesuai dengan pencarian" : "Belum ada data siswa"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.user_metadata?.nis || '-'}</TableCell>
                    <TableCell className="font-medium">{student.full_name || '-'}</TableCell>
                    <TableCell>{student.user_metadata?.class || '-'}</TableCell>
                    <TableCell>{student.user_metadata?.gender || '-'}</TableCell>
                    <TableCell>{getSocialScoreBadge(student.user_metadata?.social_score)}</TableCell>
                    <TableCell>{student.username || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditStudent(student)}>
                          <PenLine className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteConfirm(student.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Student Form Dialog */}
      <StudentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchStudents}
        initialData={selectedStudent || undefined}
        mode={formMode}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data siswa ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
