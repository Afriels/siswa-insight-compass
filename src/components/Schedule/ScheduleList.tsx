
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { format, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ScheduleForm } from "./ScheduleForm";

interface ScheduleListProps {
  selectedDate?: Date;
}

interface Schedule {
  id: string;
  title: string;
  description: string | null;
  scheduled_at: string;
  location: string | null;
  status: 'scheduled' | 'completed' | 'cancelled';
  student_id: string;
  counselor_id: string;
  created_at: string;
  updated_at: string;
  student: {
    full_name: string | null;
  };
  counselor: {
    full_name: string | null;
  };
}

export const ScheduleList = ({ selectedDate }: ScheduleListProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [newStatus, setNewStatus] = useState<'scheduled' | 'completed' | 'cancelled'>('scheduled');
  
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('counseling_schedules')
        .select(`
          *,
          student:student_id (full_name),
          counselor:counselor_id (full_name)
        `)
        .order('scheduled_at', { ascending: true });
        
      if (error) throw error;
      
      setSchedules(data || []);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data jadwal konseling",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSchedules();
  }, []);
  
  const filteredSchedules = selectedDate
    ? schedules.filter(schedule => 
        isSameDay(new Date(schedule.scheduled_at), selectedDate)
      )
    : schedules;
  
  const handleEditSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsEditFormOpen(true);
  };
  
  const handleDeleteConfirm = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsDeleteDialogOpen(true);
  };
  
  const handleStatusChange = (schedule: Schedule, status: 'scheduled' | 'completed' | 'cancelled') => {
    setSelectedSchedule(schedule);
    setNewStatus(status);
    setIsStatusDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!selectedSchedule) return;
    
    try {
      const { error } = await supabase
        .from('counseling_schedules')
        .delete()
        .eq('id', selectedSchedule.id);
        
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Jadwal konseling berhasil dihapus",
      });
      
      fetchSchedules();
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      console.error("Error deleting schedule:", error);
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus jadwal konseling",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateStatus = async () => {
    if (!selectedSchedule) return;
    
    try {
      const { error } = await supabase
        .from('counseling_schedules')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedSchedule.id);
        
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: `Status jadwal konseling berhasil diperbarui`,
      });
      
      fetchSchedules();
      setIsStatusDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating schedule status:", error);
      toast({
        title: "Error",
        description: error.message || "Gagal memperbarui status jadwal konseling",
        variant: "destructive",
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'scheduled':
        return <Badge className="bg-blue-500">Terjadwal</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Selesai</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Dibatalkan</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-counseling-blue"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (filteredSchedules.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Tidak ada jadwal konseling</p>
          <p className="text-muted-foreground">
            {selectedDate 
              ? `Tidak ada jadwal untuk tanggal ${format(selectedDate, "dd MMMM yyyy")}`
              : "Belum ada jadwal konseling yang dibuat"}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <div className="space-y-4">
        {filteredSchedules.map((schedule) => (
          <Card key={schedule.id} className={
            schedule.status === 'cancelled' 
              ? "border-red-200 bg-red-50" 
              : schedule.status === 'completed'
                ? "border-green-200 bg-green-50"
                : ""
          }>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{schedule.title}</CardTitle>
                  <CardDescription>
                    {format(new Date(schedule.scheduled_at), "EEEE, dd MMMM yyyy", { locale: id })}
                  </CardDescription>
                </div>
                <div>{getStatusBadge(schedule.status)}</div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(schedule.scheduled_at), "HH:mm")}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Siswa: {schedule.student?.full_name || "Unknown"}</span>
                </div>
                
                {schedule.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{schedule.location}</span>
                  </div>
                )}
                
                {schedule.description && (
                  <p className="text-sm mt-2">{schedule.description}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2 ml-auto">
                {schedule.status === 'scheduled' && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-green-50 hover:bg-green-100 text-green-600"
                      onClick={() => handleStatusChange(schedule, 'completed')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Selesai
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-red-50 hover:bg-red-100 text-red-600"
                      onClick={() => handleStatusChange(schedule, 'cancelled')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Batalkan
                    </Button>
                  </>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditSchedule(schedule)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteConfirm(schedule)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Hapus
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Edit Schedule Form */}
      {selectedSchedule && (
        <ScheduleForm
          isOpen={isEditFormOpen}
          onClose={() => {
            setIsEditFormOpen(false);
            fetchSchedules();
          }}
          scheduleId={selectedSchedule.id}
          selectedDate={new Date(selectedSchedule.scheduled_at)}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus jadwal konseling ini? Tindakan ini tidak dapat dibatalkan.
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
      
      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Update Status</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mengubah status jadwal konseling menjadi 
              {newStatus === 'completed' ? ' Selesai' : ' Dibatalkan'}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Batal
            </Button>
            <Button 
              variant={newStatus === 'completed' ? "default" : "destructive"}
              onClick={handleUpdateStatus}
            >
              {newStatus === 'completed' ? 'Tandai Selesai' : 'Batalkan Jadwal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
