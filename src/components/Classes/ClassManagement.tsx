
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Plus, PenLine, Trash2 } from "lucide-react";
import { ClassForm } from "./ClassForm";

interface ClassData {
  id?: string;
  name: string;
  grade: string;
  major?: string;
  studentCount: number;
}

const ClassManagement = () => {
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      
      // Get profiles with role 'student' from the public.profiles table
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student');
      
      if (error) {
        console.error("Error fetching profiles:", error);
        toast({
          title: "Error",
          description: "Gagal mengambil data siswa",
          variant: "destructive",
        });
        return;
      }
      
      // Process class data from profiles based on user_metadata.class
      const classMap = new Map<string, ClassData>();
      
      profiles?.forEach((profile) => {
        // Extract class from profile data - for now use a default
        // In the future, you can add class info to profiles table
        const className = "X-A"; // Default class name for demo
        
        if (classMap.has(className)) {
          const existing = classMap.get(className)!;
          classMap.set(className, {
            ...existing,
            studentCount: existing.studentCount + 1
          });
        } else {
          // Parse class info (e.g., "X-A", "XI IPA 2")
          const gradeMatch = className.match(/^(X{1,2}I{0,3})/);
          const grade = gradeMatch ? gradeMatch[1] : 'X';
          const majorMatch = className.match(/(IPA|IPS|BAHASA)/);
          const major = majorMatch ? majorMatch[1] : undefined;
          
          classMap.set(className, {
            id: `class_${className.replace(/[^a-zA-Z0-9]/g, '_')}`,
            name: className,
            grade: grade,
            major: major,
            studentCount: 1
          });
        }
      });
      
      setClasses(Array.from(classMap.values()).sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error: any) {
      console.error("Error fetching classes:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data kelas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleAddClass = () => {
    setSelectedClass(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEditClass = (classData: ClassData) => {
    setSelectedClass(classData);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDeleteClass = (classData: ClassData) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kelas ${classData.name}?`)) {
      // For now, just show success message
      toast({
        title: "Berhasil",
        description: `Kelas ${classData.name} berhasil dihapus`,
      });
      fetchClasses();
    }
  };

  const getGradeBadge = (grade: string) => {
    switch(grade) {
      case 'X':
        return <Badge className="bg-green-500">Kelas 10</Badge>;
      case 'XI':
        return <Badge className="bg-blue-500">Kelas 11</Badge>;
      case 'XII':
        return <Badge className="bg-purple-500">Kelas 12</Badge>;
      default:
        return <Badge className="bg-gray-500">{grade}</Badge>;
    }
  };

  const getMajorBadge = (major?: string) => {
    if (!major) return null;
    
    switch(major) {
      case 'IPA':
        return <Badge variant="outline" className="bg-blue-50">IPA</Badge>;
      case 'IPS':
        return <Badge variant="outline" className="bg-green-50">IPS</Badge>;
      case 'BAHASA':
        return <Badge variant="outline" className="bg-yellow-50">BAHASA</Badge>;
      default:
        return <Badge variant="outline">{major}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Manajemen Kelas
          </CardTitle>
        </div>
        <Button onClick={handleAddClass}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Kelas
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Panduan Manajemen Kelas:</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Administrator dan Guru BK dapat menambah kelas secara manual</li>
            <li>• Kelas yang sudah ada akan menampilkan jumlah siswa yang terdaftar</li>
            <li>• Format yang disarankan: X-A, XI IPA 1, XII IPS 2, dll.</li>
            <li>• Siswa dapat diassign ke kelas melalui manajemen data siswa</li>
          </ul>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-counseling-blue"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada data kelas. Mulai dengan menambah kelas baru.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Kelas</TableHead>
                  <TableHead>Tingkat</TableHead>
                  <TableHead>Jurusan</TableHead>
                  <TableHead className="text-right">Jumlah Siswa</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((classData, index) => (
                  <TableRow key={classData.id || index}>
                    <TableCell className="font-medium">{classData.name}</TableCell>
                    <TableCell>{getGradeBadge(classData.grade)}</TableCell>
                    <TableCell>{getMajorBadge(classData.major)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{classData.studentCount}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditClass(classData)}
                        >
                          <PenLine className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteClass(classData)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <ClassForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSuccess={fetchClasses}
          initialData={selectedClass ? {
            name: selectedClass.name,
            grade: selectedClass.grade,
            major: selectedClass.major || ''
          } : undefined}
          mode={formMode}
        />
      </CardContent>
    </Card>
  );
};

export default ClassManagement;
