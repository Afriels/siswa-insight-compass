
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type BehaviorRecord = {
  id: string;
  student_id: string;
  date: string;
  location: string;
  behavior_type: string;
  description: string;
  action: string;
  created_at: string;
}

export function BehaviorHistory() {
  const [records, setRecords] = useState<BehaviorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchBehaviorRecords() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('behavior_records')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setRecords(data || []);
      } catch (error: any) {
        console.error("Error fetching behavior records:", error);
        toast({
          title: "Gagal mengambil data",
          description: error.message || "Terjadi kesalahan saat mengambil data riwayat perilaku",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchBehaviorRecords();
  }, [toast]);

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'positif':
        return 'bg-green-500 hover:bg-green-600';
      case 'negatif':
        return 'bg-red-500 hover:bg-red-600';
      case 'netral':
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Riwayat Perilaku Siswa</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-counseling-blue"></div>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada data perilaku yang tercatat
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Tindakan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.student_id}</TableCell>
                    <TableCell>{record.date ? format(new Date(record.date), 'dd/MM/yyyy') : '-'}</TableCell>
                    <TableCell>{record.location || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getBadgeColor(record.behavior_type)}>
                        {record.behavior_type === 'positif' ? 'Positif' : 
                         record.behavior_type === 'negatif' ? 'Negatif' : 'Netral'}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{record.description}</TableCell>
                    <TableCell className="max-w-xs truncate">{record.action || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
