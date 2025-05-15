
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type Consultation = {
  id: string;
  title: string;
  status: 'pending' | 'ongoing' | 'resolved';
  created_at: string;
  profiles: {
    full_name: string;
  } | null;
}

export function ConsultationList() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      
      // Check if user is counselor
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You need to be logged in to view consultations");

      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      const isCounselor = profileData?.role === 'counselor' || profileData?.role === 'admin';
      
      let query = supabase
        .from('consultations')
        .select('id, title, status, created_at, profiles:student_id(full_name)');
        
      if (!isCounselor) {
        // Students can only see their own consultations
        query = query.eq('student_id', user.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setConsultations(data || []);
    } catch (error: any) {
      console.error("Error fetching consultations:", error);
      toast({
        title: "Gagal mengambil data",
        description: error.message || "Terjadi kesalahan saat mengambil data konsultasi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Menunggu</Badge>;
      case 'ongoing':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Berlangsung</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500 hover:bg-green-600">Selesai</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Daftar Konsultasi</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-counseling-blue"></div>
          </div>
        ) : consultations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada konsultasi yang dibuat
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultations.map((consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell className="font-medium">
                      <Link 
                        to={`/consultation/${consultation.id}`} 
                        className="hover:text-counseling-blue hover:underline"
                      >
                        {consultation.title}
                      </Link>
                    </TableCell>
                    <TableCell>{consultation.profiles?.full_name || 'Unknown'}</TableCell>
                    <TableCell>{getStatusBadge(consultation.status)}</TableCell>
                    <TableCell>
                      {format(new Date(consultation.created_at), 'dd/MM/yyyy HH:mm')}
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
}
