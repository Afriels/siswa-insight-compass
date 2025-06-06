
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, 
  AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScheduleForm } from "./ScheduleForm";

interface ScheduleData {
  id: string;
  title: string;
  description: string;
  scheduled_at: string;
  location: string;
  status: "pending" | "completed" | "cancelled";
  student_id: string | null;
  counselor_id: string | null;
  created_at: string;
}

interface ScheduleListProps {
  selectedDate?: Date;
}

export function ScheduleList({ selectedDate }: ScheduleListProps) {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleData | undefined>(undefined);
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    if (selectedDate) {
      loadSchedules();
      setFormattedDate(format(selectedDate, "EEEE, MMMM d, yyyy"));
    }
  }, [selectedDate]);

  async function loadSchedules() {
    if (!selectedDate) return;

    try {
      setIsLoading(true);
      
      // Format date to YYYY-MM-DD for comparison
      const dateString = format(selectedDate, "yyyy-MM-dd");
      
      const { data, error } = await supabase
        .from("counseling_schedules")
        .select("*")
        .gte('scheduled_at', `${dateString}T00:00:00`)
        .lt('scheduled_at', `${dateString}T23:59:59`)
        .order('scheduled_at', { ascending: true });

      if (error) {
        console.error("Schedule loading error:", error);
        throw error;
      }
      
      console.log("Loaded schedules:", data);
      setSchedules(data || []);
    } catch (error: any) {
      console.error("Error loading schedules:", error);
      toast({
        title: "Error loading schedules",
        description: error.message || "Terjadi kesalahan saat memuat jadwal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleEdit = (schedule: ScheduleData) => {
    setEditingSchedule(schedule);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("counseling_schedules")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Jadwal dihapus",
        description: "Jadwal konseling berhasil dihapus.",
      });
      
      setSchedules(schedules.filter(schedule => schedule.id !== id));
    } catch (error: any) {
      toast({
        title: "Error menghapus jadwal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const closeEditForm = () => {
    setEditingSchedule(undefined);
    loadSchedules();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Selesai</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Dibatalkan</Badge>;
      default:
        return <Badge variant="outline">Tertunda</Badge>;
    }
  };

  return (
    <Card className="animate-fadeIn">
      <CardHeader className="animate-slideInDown">
        <CardTitle>Jadwal Konseling</CardTitle>
        <CardDescription>
          {formattedDate ? `Jadwal untuk ${formattedDate}` : "Pilih tanggal untuk melihat jadwal"}
        </CardDescription>
      </CardHeader>
      <CardContent className="animate-slideInUp">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-counseling-blue"></div>
          </div>
        ) : schedules.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule, index) => (
                <TableRow 
                  key={schedule.id} 
                  className="animate-slideInRight hover-lift"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <TableCell>
                    {format(new Date(schedule.scheduled_at), "HH:mm")}
                  </TableCell>
                  <TableCell>{schedule.title}</TableCell>
                  <TableCell>{schedule.location}</TableCell>
                  <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(schedule)}
                        className="transition-all duration-200 hover:bg-blue-50"
                      >
                        Edit
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Hapus
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Yakin hapus jadwal?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini akan menghapus jadwal konseling secara permanen.
                              Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(schedule.id)}
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 animate-fadeIn">
            <p className="text-muted-foreground">
              {selectedDate ? "Tidak ada jadwal pada tanggal ini." : "Pilih tanggal untuk melihat jadwal."}
            </p>
          </div>
        )}
      </CardContent>

      {editingSchedule && (
        <ScheduleForm
          isOpen={true}
          onClose={closeEditForm}
          scheduleToEdit={editingSchedule}
        />
      )}
    </Card>
  );
}
