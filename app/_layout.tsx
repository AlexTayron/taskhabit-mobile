import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../components/contexts/ThemeContext';
import { AuthProvider } from '../components/contexts/AuthContext';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="new-task"
        options={{
          presentation: 'modal',
          title: 'Nova Tarefa',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#007AFF',
        }}
      />
      <Stack.Screen
        name="task/[id]"
        options={{
          title: 'Detalhes da Tarefa',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#007AFF',
        }}
      />
    </Stack>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
