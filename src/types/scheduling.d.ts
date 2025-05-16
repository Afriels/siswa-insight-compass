
export interface CounselingSchedule {
  id: string;
  title: string;
  description: string;
  scheduled_at: string;
  location: string;
  student_id: string;
  counselor_id: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  student?: {
    full_name: string;
  };
  counselor?: {
    full_name: string;
  };
}
