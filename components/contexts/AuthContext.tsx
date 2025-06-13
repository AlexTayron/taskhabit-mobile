import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: string; email: string; name: string } | null;
  profile: { name: string; email: string; avatar_url: string; } | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profileData: { name: string; email: string; avatar_url: string; }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [profile, setProfile] = useState<{ name: string; email: string; avatar_url: string; } | null>(null);

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // TODO: Implementar a lógica de registro com sua API
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // TODO: Implementar a lógica de login com sua API
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setIsAuthenticated(false);
  };

  const updateProfile = async (profileData: { name: string; email: string; avatar_url: string; }): Promise<boolean> => {
    try {
      // Implementar lógica de atualização do perfil
      setProfile(profileData);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      profile,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 