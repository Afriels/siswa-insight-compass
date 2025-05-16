
export interface Profile {
  full_name: string;
  id: string;
}

export interface BehaviorRecord {
  id: string;
  student_id: string;
  behavior_type: string;
  description: string;
  location: string;
  action: string;
  date: string;
  created_at: string;
  recorder_id: string;
  profiles: Profile;
}
