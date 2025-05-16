
export interface BehaviorRecord {
  id: string;
  behavior_type: string;
  description: string;
  location: string | null;
  action: string | null;
  recorder_id: string | null;
  student_id: string;
  date: string;
  created_at: string;
  profiles?: {
    full_name: string;
  } | null;
}
