
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format, parse } from "date-fns";
import { id } from "date-fns/locale";
import { Loader2 } from "lucide-react";

interface Student {
  id: string;
  full_name: string;
}

interface ScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  scheduleId?: string;
}

export const ScheduleForm = ({ isOpen, onClose, selectedDate, scheduleId }: ScheduleFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    time: "08:00",
    student_id: "",
    location: "",
  });
  
  const fetchStudents = async () => {
    try {
      setFormLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'student')
        .order('full_name');
        
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data siswa",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };
  
  const fetchSchedule = async (id: string) => {
    try {
      setFormLoading(true);
      const { data, error } = await supabase
        .from('counseling_schedules')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        const scheduledTime = data.scheduled_at ? new Date(data.scheduled_at) : new Date();
        
        setFormData({
          title: data.title || "",
          description: data.description || "",
          date: format(scheduledTime, "yyyy-MM-dd"),
          time: format(scheduledTime, "HH:mm"),
          student_id: data.student_id || "",
          location: data.location || "",
        });
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data jadwal",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      fetchStudents();
      
      if (scheduleId) {
        fetchSchedule(scheduleId);
      } else {
        // Reset form for new schedule
        setFormData({
          title: "",
          description: "",
          date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
          time: "08:00",
          student_id: "",
          location: "",
        });
      }
    }
  }, [isOpen, scheduleId, selectedDate]);
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Validation
      if (!formData.title || !formData.date || !formData.time || !formData.student_id) {
        toast({
          title: "Form tidak lengkap",
          description: "Judul, tanggal, waktu, dan siswa harus diisi",
          variant: "destructive",
        });
        return;
      }
      
      // Parse date and time into a timestamp
      const dateTimeString = `${formData.date} ${formData.time}`;
      const scheduledAt = parse(dateTimeString, "yyyy-MM-dd HH:mm", new Date());
      
      if (scheduleId) {
        // Update existing schedule
        const { error } = await supabase
          .from('counseling_schedules')
          .update({
            title: formData.title,
            description: formData.description,
            scheduled_at: scheduledAt.toISOString(),
            student_id: formData.student_id,
            counselor_id: user?.id,
            location: formData.location,
            updated_at: new Date().toISOString(),
          })
          .eq('id', scheduleId);
          
        if (error) throw error;
        
        toast({
          title: "Berhasil",
          description: "Jadwal konseling berhasil diperbarui",
        });
      } else {
        // Create new schedule
        const { error } = await supabase
          .from('counseling_schedules')
          .insert({
            title: formData.title,
            description: formData.description,
            scheduled_at: scheduledAt.toISOString(),
            student_id: formData.student_id,
            counselor_id: user?.id,
            location: formData.location,
            status: 'scheduled',
          });
          
        if (error) throw error;
        
        toast({
          title: "Berhasil",
          description: "Jadwal konseling baru berhasil dibuat",
        });
      }
      
      onClose();
    } catch (error: any) {
      console.error("Error saving schedule:", error);
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan jadwal konseling",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{scheduleId ? "Edit Jadwal Konseling" : "Tambah Jadwal Konseling"}</DialogTitle>
          <DialogDescription>
            {scheduleId ? "Perbarui detail jadwal konseling" : "Buat jadwal konseling baru"}
          </DialogDescription>
        </DialogHeader>
        
        {formLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-counseling-blue" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Judul</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Masukkan judul jadwal"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student" className="text-right">Siswa</Label>
              <Select
                value={formData.student_id}
                onValueChange={(value) => handleChange('student_id', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih siswa" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>{student.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">Tanggal</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">Waktu</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Lokasi</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Masukkan lokasi"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Masukkan deskripsi atau catatan"
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={loading || formLoading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {scheduleId ? "Perbarui Jadwal" : "Simpan Jadwal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
