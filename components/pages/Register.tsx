// Register.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast'; // Assuming useToast is adapted for RN
import { validatePasswordStrength, sanitizeTextInput } from '../utils/security'; // Assuming these utilities are cross-platform

interface RegisterProps {
  onSwitchToLogin: () => void;
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

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({ isValid: true, message: '' });
  const { register } = useAuth();
  const { toast } = useToast();

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value) {
      setPasswordValidation(validatePasswordStrength(value));
    } else {
      setPasswordValidation({ isValid: true, message: '' });
    }
  };

  const handleSubmit = async () => {
    // Validate password strength
    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
      toast({
        title: 'Senha inválida',
        description: passwordCheck.message,
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      return;
    }

    // Sanitize inputs
    const sanitizedName = sanitizeTextInput(name, 100);
    const sanitizedEmail = email.trim().toLowerCase();

    if (!sanitizedName || !sanitizedEmail) {
      toast({
        title: 'Erro',
        description: 'Todos os campos são obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(sanitizedName, sanitizedEmail, password);
      if (success) {
        toast({
          title: 'Conta criada com sucesso!',
          description: 'Bem-vindo ao TaskHabit.',
        });
        // Navigation should be handled here after successful registration
      } else {
        toast({
          title: 'Erro no cadastro',
          description: 'Não foi possível criar sua conta.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro durante o cadastro.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card style={styles.cardContainer}>
      <CardHeader style={styles.cardHeader}>
        <CardTitle style={styles.cardTitle}>Cadastro</CardTitle>
        <CardDescription style={styles.cardDescription}>
          Crie sua conta para começar a usar o TaskHabit
        </CardDescription>
      </CardHeader>
      <View>
        <CardContent style={styles.cardContent}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu nome completo"
              value={name}
              onChangeText={setName}
              maxLength={100}
            />
          </View>
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
              onChangeText={handlePasswordChange}
              secureTextEntry
            />
            {password ? (
              passwordValidation.isValid ? (
                <Text style={styles.validPasswordText}>Senha válida ✓</Text>
              ) : (
                <Text style={styles.invalidPasswordText}>{passwordValidation.message}</Text>
              )
            ) : null}
            <Text style={styles.passwordHint}>
              A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número.
            </Text>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirmar Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
        </CardContent>
        <CardFooter style={styles.cardFooter}>
          <TouchableOpacity
            style={[styles.button, (isLoading || !passwordValidation.isValid) && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isLoading || !passwordValidation.isValid}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Criar conta</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.loginText}>
            Já tem uma conta?{' '}
            <Text
              style={styles.loginLink}
              onPress={onSwitchToLogin}
            >
              Faça login
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContainer: {
    width: '90%', // max-w-md
    maxWidth: 400,
    alignSelf: 'center', // centers the card horizontally
    marginTop: 50, // Example margin top
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
  validPasswordText: {
    fontSize: 12,
    color: '#22C55E', // text-green-600
  },
  invalidPasswordText: {
    fontSize: 12,
    color: '#EF4444', // text-red-600
  },
  passwordHint: {
    fontSize: 12,
    color: '#6B7280', // text-muted-foreground
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
  loginText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6B7280', // text-muted-foreground
  },
  loginLink: {
    color: '#007BFF', // primary color
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});

export default Register;