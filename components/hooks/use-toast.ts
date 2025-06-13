import { Alert } from 'react-native';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export const useToast = () => {
  const toast = ({ title, description, variant = 'default' }: ToastOptions) => {
    Alert.alert(
      title,
      description,
      [{ text: 'OK' }],
      { cancelable: true }
    );
  };

  return { toast };
}; 