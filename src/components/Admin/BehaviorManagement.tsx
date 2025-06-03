
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { BehaviorRecord } from "@/types/behavior-records";

const BehaviorManagement = () => {
  const { toast } = useToast();
  const [records, setRecords] = useState<BehaviorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchBehaviorRecords = async () => {
    try {
      setLoading(true);
      
      // First get behavior records
      const { data: behaviorData, error: behaviorError } = await supabase
        .from('behavior_records')
        .select('*')
        .order('date', { ascending: false });
        
      if (behaviorError) throw behaviorError;
      
      if (!behaviorData || behaviorData.length === 0) {
        setRecords([]);
        return;
      }
      
      // Get unique student IDs from behavior records
      const studentIds = [...new Set(behaviorData.map(record => record.student_id))];
      
      // Fetch profiles for these student IDs
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', studentIds);
        
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        // Continue without profiles data
      }
      
      // Map behavior records with profiles
      const recordsWithProfiles = behaviorData.map(record => ({
        ...record,
        profiles: profilesData?.find(profile => profile.id === record.student_id) || null
      }));
      
      setRecords(recordsWithProfiles);
    } catch (error: any) {
      console.error("Error fetching behavior records:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data perilaku",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBehaviorRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const getBehaviorBadge = (type: string) => {
    switch(type.toLowerCase()) {
      case 'positive':
        return <Badge className="bg-green-500">Positif</Badge>;
      case 'negative':
        return <Badge className="bg-red-500">Negatif</Badge>;
      case 'neutral':
        return <Badge className="bg-blue-500">Netral</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };
  
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Manajemen Perilaku</CardTitle>
        <CardDescription>
          Lihat dan kelola data perilaku siswa
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-counseling-blue"></div>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-8 flex flex-col items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-10 w-10" />
            Belum ada data perilaku
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Tindakan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.profiles?.full_name || 'Unknown'}</TableCell>
                    <TableCell>{getBehaviorBadge(record.behavior_type)}</TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell>{record.location || '-'}</TableCell>
                    <TableCell>
                      {format(new Date(record.date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{record.action || '-'}</TableCell>
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

export default BehaviorManagement;
