import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface DashboardSettings {
  showTasks: boolean;
  showHabits: boolean;
  showNotes: boolean;
  showTodos: boolean;
  showStudy: boolean;
  layout: 'compact' | 'comfortable';
}

export default function SettingsScreen() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<DashboardSettings>({
    showTasks: true,
    showHabits: true,
    showNotes: true,
    showTodos: true,
    showStudy: true,
    layout: 'comfortable'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('dashboard_settings')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (profile?.dashboard_settings) {
        setSettings(profile.dashboard_settings as DashboardSettings);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      // TODO: Implementar toast nativo
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          dashboard_settings: settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // TODO: Implementar toast nativo
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      // TODO: Implementar toast nativo
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configurações</Text>
        <Text style={styles.subtitle}>Personalize sua experiência</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="grid-outline" size={20} color="#1A1A1A" />
            <Text style={styles.cardTitle}>Layout da Dashboard</Text>
          </View>
          <Text style={styles.cardDescription}>
            Escolha como deseja visualizar suas informações
          </Text>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.section}>
            <View style={styles.layoutSection}>
              <View>
                <Text style={styles.sectionTitle}>Estilo do Layout</Text>
                <Text style={styles.sectionDescription}>
                  Escolha entre um layout compacto ou confortável
                </Text>
              </View>
              <View style={styles.layoutButtons}>
                <TouchableOpacity
                  style={[
                    styles.layoutButton,
                    settings.layout === 'compact' && styles.layoutButtonActive
                  ]}
                  onPress={() => setSettings(prev => ({ ...prev, layout: 'compact' }))}
                >
                  <Text style={[
                    styles.layoutButtonText,
                    settings.layout === 'compact' && styles.layoutButtonTextActive
                  ]}>
                    Compacto
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.layoutButton,
                    settings.layout === 'comfortable' && styles.layoutButtonActive
                  ]}
                  onPress={() => setSettings(prev => ({ ...prev, layout: 'comfortable' }))}
                >
                  <Text style={[
                    styles.layoutButtonText,
                    settings.layout === 'comfortable' && styles.layoutButtonTextActive
                  ]}>
                    Confortável
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.switchesSection}>
              <Text style={styles.sectionTitle}>Cards Visíveis</Text>
              
              <View style={styles.switchItem}>
                <View>
                  <Text style={styles.switchLabel}>Tarefas</Text>
                  <Text style={styles.switchDescription}>
                    Mostrar card de tarefas na dashboard
                  </Text>
                </View>
                <Switch
                  value={settings.showTasks}
                  onValueChange={(value) => 
                    setSettings(prev => ({ ...prev, showTasks: value }))
                  }
                  trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                  thumbColor={settings.showTasks ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>

              <View style={styles.switchItem}>
                <View>
                  <Text style={styles.switchLabel}>Hábitos</Text>
                  <Text style={styles.switchDescription}>
                    Mostrar card de hábitos na dashboard
                  </Text>
                </View>
                <Switch
                  value={settings.showHabits}
                  onValueChange={(value) => 
                    setSettings(prev => ({ ...prev, showHabits: value }))
                  }
                  trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                  thumbColor={settings.showHabits ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>

              <View style={styles.switchItem}>
                <View>
                  <Text style={styles.switchLabel}>Notas</Text>
                  <Text style={styles.switchDescription}>
                    Mostrar card de notas na dashboard
                  </Text>
                </View>
                <Switch
                  value={settings.showNotes}
                  onValueChange={(value) => 
                    setSettings(prev => ({ ...prev, showNotes: value }))
                  }
                  trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                  thumbColor={settings.showNotes ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>

              <View style={styles.switchItem}>
                <View>
                  <Text style={styles.switchLabel}>TODOs</Text>
                  <Text style={styles.switchDescription}>
                    Mostrar card de TODOs na dashboard
                  </Text>
                </View>
                <Switch
                  value={settings.showTodos}
                  onValueChange={(value) => 
                    setSettings(prev => ({ ...prev, showTodos: value }))
                  }
                  trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                  thumbColor={settings.showTodos ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>

              <View style={styles.switchItem}>
                <View>
                  <Text style={styles.switchLabel}>Estudar Hoje</Text>
                  <Text style={styles.switchDescription}>
                    Mostrar card de estudos na dashboard
                  </Text>
                </View>
                <Switch
                  value={settings.showStudy}
                  onValueChange={(value) => 
                    setSettings(prev => ({ ...prev, showStudy: value }))
                  }
                  trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                  thumbColor={settings.showStudy ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={saveSettings}
            disabled={loading}
          >
            {loading ? (
              <>
                <ActivityIndicator color="white" />
                <Text style={styles.saveButtonText}>Salvando...</Text>
              </>
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color="white" />
                <Text style={styles.saveButtonText}>Salvar Configurações</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardContent: {
    padding: 16,
  },
  section: {
    gap: 24,
  },
  layoutSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  layoutButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  layoutButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  layoutButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  layoutButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  layoutButtonTextActive: {
    color: 'white',
  },
  switchesSection: {
    gap: 16,
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    marginTop: 24,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
}); 