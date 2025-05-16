
export type Tables = {
  behavior_records: {
    Row: {
      id: string;
      behavior_type: string;
      description: string;
      location: string | null;
      action: string | null;
      recorder_id: string | null;
      student_id: string;
      date: string;
      created_at: string;
    };
  };
  consultation_messages: {
    Row: {
      id: string;
      consultation_id: string | null;
      sender_id: string | null;
      message: string;
      created_at: string;
    };
  };
  consultations: {
    Row: {
      id: string;
      title: string;
      description: string;
      status: string | null;
      student_id: string | null;
      updated_at: string;
      created_at: string;
    };
  };
  profiles: {
    Row: {
      id: string;
      username: string | null;
      full_name: string | null;
      avatar_url: string | null;
      role: string | null;
      created_at: string;
    };
  };
  counseling_schedules: {
    Row: {
      id: string;
      title: string;
      description: string;
      scheduled_at: string;
      location: string;
      student_id: string;
      counselor_id: string;
      status: 'pending' | 'completed' | 'cancelled';
      created_at: string;
    };
  };
}
