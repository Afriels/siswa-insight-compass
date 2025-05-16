
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { CounselingSchedule } from "@/types/scheduling";

interface ScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  scheduleToEdit?: CounselingSchedule;
}

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  scheduled_at: z.string(),
  student_id: z.string().min(1, "Please select a student")
});

type FormValues = z.infer<typeof formSchema>;

export function ScheduleForm({ isOpen, onClose, selectedDate, scheduleToEdit }: ScheduleFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: scheduleToEdit?.title || "",
      description: scheduleToEdit?.description || "",
      location: scheduleToEdit?.location || "",
      scheduled_at: scheduleToEdit?.scheduled_at
        ? format(new Date(scheduleToEdit.scheduled_at), "yyyy-MM-dd'T'HH:mm")
        : selectedDate
        ? format(selectedDate, "yyyy-MM-dd'T'HH:mm")
        : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      student_id: scheduleToEdit?.student_id || "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      loadStudents();
    }
  }, [isOpen]);

  useEffect(() => {
    // Update form when editing or date changes
    if (scheduleToEdit) {
      form.reset({
        title: scheduleToEdit.title,
        description: scheduleToEdit.description,
        location: scheduleToEdit.location,
        scheduled_at: format(new Date(scheduleToEdit.scheduled_at), "yyyy-MM-dd'T'HH:mm"),
        student_id: scheduleToEdit.student_id,
      });
    } else if (selectedDate) {
      form.setValue("scheduled_at", format(selectedDate, "yyyy-MM-dd'T'HH:mm"));
    }
  }, [form, scheduleToEdit, selectedDate]);

  async function loadStudents() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("role", "student");

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading students",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  async function onSubmit(data: FormValues) {
    try {
      setIsSubmitting(true);

      if (scheduleToEdit) {
        // Update existing schedule
        const { error } = await supabase
          .from("counseling_schedules")
          .update({
            title: data.title,
            description: data.description,
            scheduled_at: data.scheduled_at,
            location: data.location,
            student_id: data.student_id,
          })
          .eq("id", scheduleToEdit.id);

        if (error) throw error;

        toast({
          title: "Schedule updated",
          description: "The counseling schedule has been updated successfully.",
        });
      } else {
        // Create new schedule
        const { error } = await supabase.from("counseling_schedules").insert({
          title: data.title,
          description: data.description,
          scheduled_at: data.scheduled_at,
          location: data.location,
          student_id: data.student_id,
          counselor_id: user?.id,
          status: "pending",
        });

        if (error) throw error;

        toast({
          title: "Schedule created",
          description: "New counseling schedule has been created successfully.",
        });
      }

      form.reset();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error saving schedule",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {scheduleToEdit ? "Edit Counseling Schedule" : "Create New Counseling Schedule"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Counseling session title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description about this counseling session"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scheduled_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date & Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Where the session will take place" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="student_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : scheduleToEdit ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
