import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { getMyAccountData, MyAccountData } from '../services/accountService';

interface AccountContextValue {
  session: { email: string } | null;
  accountData: MyAccountData | null;
  loading: boolean;
  accountError: string | null;
  refresh: () => Promise<void>;
}

const AccountContext = createContext<AccountContextValue>({
  session: null,
  accountData: null,
  loading: true,
  accountError: null,
  refresh: async () => {},
});

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<{ email: string } | null>(null);
  const [accountData, setAccountData] = useState<MyAccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountError, setAccountError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await getMyAccountData();
      setAccountData(data);
      setAccountError(null);
    } catch {
      setAccountData(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      if (data.session?.user) {
        setSession({ email: data.session.user.email ?? '' });
        try {
          const acc = await getMyAccountData();
          if (!mounted) return;
          setAccountData(acc);
        } catch {
          if (!mounted) return;
          setAccountData(null);
        }
      }
      if (mounted) setLoading(false);
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      (async () => {
        if (sess?.user) {
          setSession({ email: sess.user.email ?? '' });
          try {
            const acc = await getMyAccountData();
            if (mounted) setAccountData(acc);
          } catch {
            if (mounted) setAccountData(null);
          }
        } else {
          setSession(null);
          setAccountData(null);
        }
        if (mounted) setLoading(false);
      })();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <AccountContext.Provider value={{ session, accountData, loading, accountError, refresh }}>
      {children}
    </AccountContext.Provider>
  );
};

export function useAccount() {
  return useContext(AccountContext);
}
