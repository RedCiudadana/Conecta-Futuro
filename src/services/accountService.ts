import { supabase } from '../config/supabase';

export interface MyAccountData {
  participant: {
    id: string;
    first_name: string;
    last_name: string;
    primary_email: string;
    phone: string | null;
    gender: string | null;
    department: string | null;
    municipality: string | null;
    age_range: string | null;
    urban_rural: string | null;
    pueblo: string | null;
    employment_situation: string | null;
    business_owner: boolean | null;
    sector: string | null;
    institution: string | null;
    digital_skill_level: string | null;
    how_found_us: string | null;
    profile_slug: string | null;
    public_profile_enabled: boolean | null;
    created_at: string;
    last_activity_at: string | null;
  } | null;
  enrollments: {
    id: string;
    status: string;
    enrolled_at: string;
    completed_at: string | null;
    course: {
      id: string;
      title: string;
      slug: string;
      status: string;
      category: string | null;
      level: string | null;
      duration: string | null;
      drive_folder_url: string | null;
    };
  }[];
  certificates: {
    id: string;
    certificate_code: string;
    status: string;
    issued_at: string | null;
    hours: number | null;
    pdf_url: string | null;
    verification_url: string | null;
    certificate_type: string | null;
    course: { id: string; title: string; slug: string };
  }[];
  attendance: {
    id: string;
    status: string;
    check_in_time: string | null;
    notes: string | null;
    session: {
      id: string;
      title: string | null;
      session_date: string | null;
      start_time: string | null;
      end_time: string | null;
    };
    course: { id: string; title: string; slug: string };
  }[];
  skills: {
    id: string;
    level: string;
    skill: { id: string; name: string; category: string };
  }[];
  badges: {
    id: string;
    awarded_at: string;
    badge: {
      id: string;
      name: string;
      icon: string | null;
      color: string | null;
      description: string | null;
    };
  }[];
  path_progress: {
    id: string;
    completion_percentage: number;
    status: string;
    path: { id: string; name: string; slug: string };
  }[];
}

export async function getMyAccountData(): Promise<MyAccountData | null> {
  const { data, error } = await supabase.rpc('get_my_account_data');
  if (error) throw error;
  return (data as MyAccountData) ?? null;
}

export interface ProfileUpdateInput {
  phone?: string;
  gender?: string;
  department?: string;
  municipality?: string;
  age_range?: string;
  urban_rural?: string;
  pueblo?: string;
  employment_situation?: string;
  digital_skill_level?: string;
  institution?: string;
}

export async function updateMyProfile(input: ProfileUpdateInput): Promise<void> {
  const { error } = await supabase.rpc('update_my_profile', {
    p_phone: input.phone ?? null,
    p_gender: input.gender ?? null,
    p_department: input.department ?? null,
    p_municipality: input.municipality ?? null,
    p_age_range: input.age_range ?? null,
    p_urban_rural: input.urban_rural ?? null,
    p_pueblo: input.pueblo ?? null,
    p_employment_situation: input.employment_situation ?? null,
    p_digital_skill_level: input.digital_skill_level ?? null,
    p_institution: input.institution ?? null,
  });
  if (error) throw error;
}
