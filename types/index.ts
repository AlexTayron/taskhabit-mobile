export interface Task {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  priority: string | null;
  status: string | null;
  due_date: string | null;
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
} 