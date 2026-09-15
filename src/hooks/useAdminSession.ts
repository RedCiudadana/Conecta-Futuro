import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';

export interface AdminSession {
  email: string;
}

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setSession({ email: data.session.user.email ?? '' });
      }
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (sess?.user) {
        setSession({ email: sess.user.email ?? '' });
      } else {
        setSession(null);
      }
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, loading };
}
