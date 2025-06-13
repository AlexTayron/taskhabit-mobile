import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Stats {
  tasks: number;
  habits: number;
  notes: number;
  todos: number;
}

export const useStats = () => {
  const [data, setData] = useState<Stats>({ tasks: 0, habits: 0, notes: 0, todos: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // TODO: Implementar busca real de estatísticas
      setData({ tasks: 0, habits: 0, notes: 0, todos: 0 });
      setIsLoading(false);
    }
  }, [user]);

  return { data, isLoading };
}; 