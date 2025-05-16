
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
import { CounselingSchedule } from "@/types/scheduling";

interface ScheduleListProps {
  selectedDate?: Date;
}

export function ScheduleList({ selectedDate }: ScheduleListProps) {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<CounselingSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<CounselingSchedule | undefined>(undefined);
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
        .select(`
          *,
          student:student_id(full_name),
          counselor:counselor_id(full_name)
        `)
        .gte('scheduled_at', `${dateString}T00:00:00`)
        .lt('scheduled_at', `${dateString}T23:59:59`);

      if (error) throw error;
      setSchedules(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading schedules",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleEdit = (schedule: CounselingSchedule) => {
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
        title: "Schedule deleted",
        description: "The counseling schedule has been deleted successfully.",
      });
      
      setSchedules(schedules.filter(schedule => schedule.id !== id));
    } catch (error: any) {
      toast({
        title: "Error deleting schedule",
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
        return <Badge className="bg-green-500">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Counseling Schedules</CardTitle>
        <CardDescription>
          {formattedDate ? `Schedules for ${formattedDate}` : "Select a date to view schedules"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-counseling-blue"></div>
          </div>
        ) : schedules.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    {format(new Date(schedule.scheduled_at), "HH:mm")}
                  </TableCell>
                  <TableCell>{schedule.title}</TableCell>
                  <TableCell>{schedule.student?.full_name}</TableCell>
                  <TableCell>{schedule.location}</TableCell>
                  <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(schedule)}
                      >
                        Edit
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this counseling schedule.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(schedule.id)}
                            >
                              Delete
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
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {selectedDate ? "No schedules found for this date." : "Select a date to view schedules."}
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
