import { supabase } from '../config/supabase';

export interface PublicProfileData {
  participant: {
    first_name: string;
    last_name: string;
    institution: string | null;
    department: string | null;
    created_at: string;
  };
  badges: { name: string; icon: string; color: string; description: string | null; awarded_at: string }[];
  certificates: { certificate_code: string; course_title: string; issued_at: string; verification_url: string | null }[];
  skills: { name: string; category: string; level: string }[];
  pathProgress: { path_name: string; completion_percentage: number; status: string }[];
}

// Public profiles are assembled by the database, which only ever returns a
// profile its owner has chosen to publish. The browser cannot read participant
// rows directly.
export async function getPublicProfile(slug: string): Promise<PublicProfileData | null> {
  const { data: payload } = await supabase.rpc('get_public_profile', { p_slug: slug });

  if (!payload || !payload.participant) return null;

  return {
    participant: payload.participant,
    badges: (payload.badges ?? []).map((b: any) => ({
      name: b.badge?.name ?? '',
      icon: b.badge?.icon ?? '',
      color: b.badge?.color ?? 'sky',
      description: b.badge?.description ?? null,
      awarded_at: b.awarded_at,
    })),
    certificates: (payload.certificates ?? []).map((c: any) => ({
      certificate_code: c.certificate_code,
      course_title: c.course?.title ?? 'Curso',
      issued_at: c.issued_at,
      verification_url: c.verification_url ?? null,
    })),
    skills: (payload.skills ?? []).map((s2: any) => ({
      name: s2.skill?.name ?? '',
      category: s2.skill?.category ?? '',
      level: s2.level,
    })),
    pathProgress: (payload.path_progress ?? []).map((pp: any) => ({
      path_name: pp.path?.name ?? '',
      completion_percentage: pp.completion_percentage,
      status: pp.status,
    })),
  };
}

// The participant is derived from the verified passport session, so nobody can
// publish or unpublish somebody else's profile.
export async function togglePublicProfile(
  sessionToken: string | null,
  enabled: boolean,
): Promise<string | null> {
  if (!sessionToken) return null;
  const { data } = await supabase.rpc('set_public_profile', {
    p_session_token: sessionToken,
    p_enabled: enabled,
  });
  return (data as string | null) ?? null;
}
