import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';

type User = {
  id: number;
  email: string;
};

interface AuthContextType {
  signIn: (userData: { token: string; id: number; email: string }) => void;
  signOut: () => void;
  toggleAdminMode: () => void;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdminMode: boolean;
}

const AuthContext = createContext<AuthContextType>({
  signIn: () => {},
  signOut: () => {},
  toggleAdminMode: () => {},
  user: null,
  token: null,
  isLoading: true,
  isAdminMode: false,
});

export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be used within a <SessionProvider />');
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      const savedToken = await AsyncStorage.getItem('session');
      const savedUser = await AsyncStorage.getItem('user');
      if (savedToken && savedUser) {
        try {
          const parsedUser: User = JSON.parse(savedUser);
          setToken(savedToken);
          setUser(parsedUser);
        } catch (e) {
          console.warn("Erreur lecture user/session");
          await AsyncStorage.multiRemove(['session', 'user']);
        }
      }
      setIsLoading(false);
    };
    loadSession();
  }, []);

  const signIn = async ({ token, id, email }: { token: string; id: number; email: string }) => {
    const userData = { id, email };
    await AsyncStorage.setItem('session', token);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  const signOut = async () => {
    await AsyncStorage.multiRemove(['session', 'user']);
    setToken(null);
    setUser(null);
    setIsAdminMode(false); // On désactive le mode admin à la déconnexion
  };

  const toggleAdminMode = () => {
    setIsAdminMode((prev) => !prev);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        toggleAdminMode,
        user,
        token,
        isLoading,
        isAdminMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
