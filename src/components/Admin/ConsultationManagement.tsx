
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Eye, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

type Consultation = {
  id: string;
  title: string;
  status: 'pending' | 'ongoing' | 'resolved';
  created_at: string;
  updated_at: string;
  description: string;
  profiles: {
    full_name: string;
  } | null;
};

const ConsultationManagement = () => {
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchConsultations = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('consultations')
        .select('*, profiles:student_id(full_name)')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Convert status to the expected type
      const typedData = data?.map(item => ({
        ...item,
        status: item.status as 'pending' | 'ongoing' | 'resolved'
      })) || [];
      
      setConsultations(typedData);
    } catch (error: any) {
      console.error("Error fetching consultations:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data konsultasi",
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

  const handleUpdateStatus = async (consultationId: string, newStatus: 'pending' | 'ongoing' | 'resolved') => {
    try {
      const { error } = await supabase
        .from('consultations')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', consultationId);
        
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Status konsultasi berhasil diperbarui",
      });
      
      fetchConsultations();
    } catch (error: any) {
      console.error("Error updating consultation status:", error);
      toast({
        title: "Error",
        description: error.message || "Gagal memperbarui status konsultasi",
        variant: "destructive",
      });
    }
  };
  
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
        <CardTitle>Manajemen Konsultasi</CardTitle>
        <CardDescription>
          Lihat dan kelola data konsultasi
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-counseling-blue"></div>
          </div>
        ) : consultations.length === 0 ? (
          <div className="text-center py-8 flex flex-col items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-10 w-10" />
            Belum ada data konsultasi
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
                  <TableHead>Terakhir Diperbarui</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
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
                    <TableCell>
                      {format(new Date(consultation.updated_at), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                          title="Lihat detail konsultasi"
                        >
                          <Link to={`/dashboard/consultation-detail/${consultation.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        
                        {consultation.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUpdateStatus(consultation.id, 'ongoing')}
                            className="text-blue-600 hover:bg-blue-50"
                            title="Mulai konsultasi"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {consultation.status === 'ongoing' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUpdateStatus(consultation.id, 'resolved')}
                            className="text-green-600 hover:bg-green-50"
                            title="Selesaikan konsultasi"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {consultation.status === 'resolved' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUpdateStatus(consultation.id, 'pending')}
                            className="text-orange-600 hover:bg-orange-50"
                            title="Buka kembali konsultasi"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
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

export default ConsultationManagement;
