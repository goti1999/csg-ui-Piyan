import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(undefined);

const STORAGE_KEY = 'csg_admin_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedSession = localStorage.getItem(STORAGE_KEY);
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        if (parsedSession.user) {
          setUser(parsedSession.user);
          setSession(parsedSession);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (
    username, 
    password,
    validateUser,
    updateLastLogin
  ) => {
    // Validate against users in AppContext
    const validatedUser = validateUser(username, password);
    
    if (validatedUser) {
      const authUser = {
        id: validatedUser.id,
        username: validatedUser.username,
        role: validatedUser.role,
      };
      const newSession = { user: authUser };
      
      setUser(authUser);
      setSession(newSession);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      
      // Update last login time
      updateLastLogin(validatedUser.id);
      
      return { error: null };
    } else {
      return { error: new Error('Invalid username or password, or account is not active.') };
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
