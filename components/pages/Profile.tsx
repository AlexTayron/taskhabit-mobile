import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { validateAvatarUrl, sanitizeTextInput } from '../utils/security';
import { useStats } from '../hooks/use-stats';

const Profile: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar_url: '',
  });

  const [avatarError, setAvatarError] = useState('');
  const { data: stats, isLoading: isLoadingStats } = useStats();

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'avatar_url') {
      if (value && !validateAvatarUrl(value)) {
        setAvatarError('URL inválida.');
      } else {
        setAvatarError('');
      }
    }

    const sanitized = field === 'name' ? value : sanitizeTextInput(value, 100);
    setFormData(prev => ({ ...prev, [field]: sanitized }));
  };

  const handleSave = async () => {
    if (formData.avatar_url && !formData.avatar_url.includes('supabase') && !validateAvatarUrl(formData.avatar_url)) {
      toast({ title: 'URL inválida', description: 'Use uma URL HTTPS válida.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const success = await updateProfile({
        name: sanitizeTextInput(formData.name.trim(), 100),
        email: formData.email,
        avatar_url: formData.avatar_url,
      });

      if (success) {
        toast({ title: 'Perfil atualizado', description: 'Alterações salvas com sucesso.' });
        setIsEditing(false);
      } else {
        toast({ title: 'Erro', description: 'Não foi possível atualizar o perfil.', variant: 'destructive' });
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Erro', description: 'Erro inesperado.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        avatar_url: profile.avatar_url || '',
      });
    }
    setAvatarError('');
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      Alert.alert('Upload de imagem', 'Integre com biblioteca como react-native-image-picker');
    }
  };

  if (!user || !profile || !formData.name) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Perfil do Usuário</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Informações Básicas</Text>
          <Text style={styles.cardDescription}>Atualize suas informações pessoais</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarContainer} onPress={handleAvatarClick}>
              {formData.avatar_url ? (
                <Image source={{ uri: formData.avatar_url }} style={styles.avatar} />
              ) : (
                <View style={styles.defaultAvatar}>
                  <Text style={{ fontSize: 40 }}>👤</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.nameInputContainer}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                editable={isEditing}
                onChangeText={text => handleInputChange('name', text)}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.email}
              editable={false}
            />
            <Text style={styles.hintText}>O email não pode ser alterado.</Text>
          </View>

          {isEditing && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>URL do Avatar</Text>
              <TextInput
                style={styles.input}
                value={formData.avatar_url}
                onChangeText={text => handleInputChange('avatar_url', text)}
              />
              {avatarError ? <Text style={styles.errorText}>{avatarError}</Text> : null}
            </View>
          )}

          <View style={styles.buttonContainer}>
            {!isEditing ? (
              <TouchableOpacity style={styles.primaryButton} onPress={() => setIsEditing(true)}>
                <Text style={styles.primaryButtonText}>Editar</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.primaryButton, (loading || !!avatarError) && styles.disabledButton]}
                  onPress={handleSave}
                  disabled={loading || !!avatarError}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading ? 'Salvando...' : 'Salvar'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.outlineButton, loading && styles.disabledButton]}
                  onPress={handleCancel}
                  disabled={loading}
                >
                  <Text style={styles.outlineButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1A1A1A',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardContent: {},
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  defaultAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameInputContainer: {
    flex: 1,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 6,
    padding: 10,
    backgroundColor: 'white',
  },
  disabledInput: {
    backgroundColor: '#EEE',
  },
  hintText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  errorText: {
    color: '#D00',
    fontSize: 12,
    marginTop: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  outlineButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    borderColor: '#CCC',
    borderWidth: 1,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default Profile;
