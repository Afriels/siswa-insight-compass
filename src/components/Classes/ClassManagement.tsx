
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
import { Label } from "@/components/ui/label";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Plus } from "lucide-react";

interface ClassData {
  name: string;
  grade: string;
  major?: string;
  studentCount: number;
}

const ClassManagement = () => {
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      
      // Get profiles with user_metadata that contains class information
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('user_metadata')
        .eq('role', 'student');
        
      if (error) {
        console.error("Error fetching profiles:", error);
        toast({
          title: "Error",
          description: "Gagal mengambil data kelas",
          variant: "destructive",
        });
        return;
      }
      
      // Process class data from profiles
      const classMap = new Map<string, ClassData>();
      
      profiles?.forEach(profile => {
        const metadata = profile.user_metadata as any;
        if (metadata?.class) {
          const className = metadata.class;
          
          if (classMap.has(className)) {
            const existing = classMap.get(className)!;
            classMap.set(className, {
              ...existing,
              studentCount: existing.studentCount + 1
            });
          } else {
            // Parse class info (e.g., "X-A", "XI IPA 2")
            const gradeMatch = className.match(/^(X{1,2}I{0,3})/);
            const grade = gradeMatch ? gradeMatch[1] : 'Unknown';
            const majorMatch = className.match(/(IPA|IPS|BAHASA)/);
            const major = majorMatch ? majorMatch[1] : undefined;
            
            classMap.set(className, {
              name: className,
              grade: grade,
              major: major,
              studentCount: 1
            });
          }
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

  const handleCreateClass = () => {
    // For demo purposes, just show info message
    toast({
      title: "Info",
      description: "Kelas baru akan otomatis terbuat ketika ada siswa yang mendaftar dengan kelas tersebut",
      duration: 5000,
    });
    setIsDialogOpen(false);
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Info Kelas Baru
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Informasi Pembuatan Kelas</DialogTitle>
              <DialogDescription>
                Kelas baru akan secara otomatis terbuat dalam sistem
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Cara Kerja Sistem Kelas:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Kelas otomatis terbuat ketika ada siswa yang mendaftar</li>
                  <li>• Format yang disarankan: X-A, XI IPA 1, XII IPS 2, dll.</li>
                  <li>• Sistem akan mendeteksi tingkat dan jurusan secara otomatis</li>
                  <li>• Data kelas akan terupdate setiap ada perubahan data siswa</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <Label>Contoh Format Kelas:</Label>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>• X-A, X-B, X-C (Kelas 10)</div>
                  <div>• XI IPA 1, XI IPA 2 (Kelas 11 IPA)</div>
                  <div>• XII IPS 1, XII IPS 2 (Kelas 12 IPS)</div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>
                Mengerti
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-counseling-blue"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada data kelas. Kelas akan muncul ketika ada siswa yang mendaftar.
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((classData, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{classData.name}</TableCell>
                    <TableCell>{getGradeBadge(classData.grade)}</TableCell>
                    <TableCell>{getMajorBadge(classData.major)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{classData.studentCount}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassManagement;
