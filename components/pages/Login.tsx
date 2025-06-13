// Login.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast'; // Assuming useToast is adapted for RN
import { sanitizeTextInput } from '../utils/security'; // Assuming this utility is cross-platform

interface LoginProps {
  onSwitchToRegister: () => void;
}

// --- Simple Card Components (Copied/Adapted from Dashboard RN) ---
interface CardProps {
  children: React.ReactNode;
  style?: any;
}
const Card: React.FC<CardProps> = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);
const CardHeader: React.FC<CardProps> = ({ children, style }) => (
  <View style={[styles.cardHeader, style]}>{children}</View>
);
interface CardTitleProps { children: React.ReactNode; style?: any; }
const CardTitle: React.FC<CardTitleProps> = ({ children, style }) => (
  <Text style={[styles.cardTitle, style]}>{children}</Text>
);
interface CardDescriptionProps { children: React.ReactNode; style?: any; }
const CardDescription: React.FC<CardDescriptionProps> = ({ children, style }) => (
  <Text style={[styles.cardDescription, style]}>{children}</Text>
);
const CardContent: React.FC<CardProps> = ({ children, style }) => (
  <View style={[styles.cardContent, style]}>{children}</View>
);
const CardFooter: React.FC<CardProps> = ({ children, style }) => (
  <View style={[styles.cardFooter, style]}>{children}</View>
);
// --- End Simple Card Components ---

const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    // Sanitize email input
    const sanitizedEmail = email.trim().toLowerCase();

    if (!sanitizedEmail || !password) {
      toast({
        title: 'Erro',
        description: 'Todos os campos são obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(sanitizedEmail, password);
      if (success) {
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Bem-vindo de volta.',
        });
        // Navigation should be handled here if login is successful
      } else {
        toast({
          title: 'Erro no login',
          description: 'Email ou senha incorretos.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro durante o login.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card style={styles.cardContainer}>
      <CardHeader style={styles.cardHeader}>
        <CardTitle style={styles.cardTitle}>Login</CardTitle>
        <CardDescription style={styles.cardDescription}>
          Entre com suas credenciais para acessar sua conta
        </CardDescription>
      </CardHeader>
      <View>
        <CardContent style={styles.cardContent}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </CardContent>
        <CardFooter style={styles.cardFooter}>
          <TouchableOpacity
            style={[styles.button, isLoading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.registerText}>
            Não tem uma conta?{' '}
            <Text
              style={styles.registerLink}
              onPress={onSwitchToRegister}
            >
              Cadastre-se
            </Text>
          </Text>
        </CardFooter>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  cardContainer: {
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    marginTop: 50,
  },
  cardHeader: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 4,
  },
  cardTitle: {
    fontSize: 24, // text-2xl
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1A1A1A', // text-foreground
  },
  cardDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6B7280', // text-muted-foreground
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16, // space-y-4
  },
  formGroup: {
    gap: 8, // space-y-2
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A', // text-foreground
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB', // border-input
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1A1A1A',
  },
  cardFooter: {
    flexDirection: 'column',
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 16, // space-y-4
  },
  button: {
    width: '100%',
    backgroundColor: '#007BFF', // primary color
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6B7280', // text-muted-foreground
  },
  registerLink: {
    color: '#007BFF', // primary color
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});

export default Login;