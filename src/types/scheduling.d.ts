
import { Database } from "@/integrations/supabase/types";

export type CounselingSchedule = Database['public']['Tables']['counseling_schedules']['Row'] & {
  student?: {
    full_name: string;
  };
  counselor?: {
    full_name: string;
  };
};
