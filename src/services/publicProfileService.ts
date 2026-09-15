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

export async function getPublicProfile(slug: string): Promise<PublicProfileData | null> {
  const { data: participant } = await supabase
    .from('participants')
    .select('id, first_name, last_name, institution, department, created_at')
    .eq('profile_slug', slug)
    .eq('public_profile_enabled', true)
    .maybeSingle();

  if (!participant) return null;

  const [{ data: badges }, { data: certs }, { data: skills }, { data: paths }] = await Promise.all([
    supabase.from('participant_badges').select('awarded_at, badge:badges(name, icon, color, description)')
      .eq('participant_id', participant.id).eq('status', 'active').order('awarded_at', { ascending: false }),
    supabase.from('certificates').select('certificate_code, issued_at, verification_url, course:courses(title)')
      .eq('participant_id', participant.id).neq('status', 'revoked').order('issued_at', { ascending: false }),
    supabase.from('participant_skills').select('level, skill:skills(name, category)')
      .eq('participant_id', participant.id).eq('status', 'active'),
    supabase.from('path_progress').select('completion_percentage, status, learning_path:learning_paths(name)')
      .eq('participant_id', participant.id),
  ]);

  return {
    participant,
    badges: (badges ?? []).map(b => ({
      name: (b.badge as any)?.name ?? '',
      icon: (b.badge as any)?.icon ?? '',
      color: (b.badge as any)?.color ?? 'sky',
      description: (b.badge as any)?.description ?? null,
      awarded_at: b.awarded_at,
    })),
    certificates: (certs ?? []).map(c => ({
      certificate_code: c.certificate_code,
      course_title: (c.course as any)?.title ?? 'Curso',
      issued_at: c.issued_at,
      verification_url: c.verification_url,
    })),
    skills: (skills ?? []).map(s => ({
      name: (s.skill as any)?.name ?? '',
      category: (s.skill as any)?.category ?? '',
      level: s.level,
    })),
    pathProgress: (paths ?? []).map(p => ({
      path_name: (p.learning_path as any)?.name ?? '',
      completion_percentage: p.completion_percentage,
      status: p.status,
    })),
  };
}

export async function togglePublicProfile(participantId: string, enabled: boolean): Promise<string | null> {
  await supabase.from('participants').update({ public_profile_enabled: enabled }).eq('id', participantId);
  if (enabled) {
    const { data } = await supabase.from('participants').select('profile_slug').eq('id', participantId).maybeSingle();
    return data?.profile_slug ?? null;
  }
  return null;
}
