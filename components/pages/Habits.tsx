// Habits.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useToast } from '../hooks/use-toast'; // Assuming useToast is adapted for RN
import { sanitizeTextInput } from '../utils/security'; // Assuming this utility is cross-platform

// Icon Placeholders (replace with react-native-vector-icons)
interface IconProps {
  size?: number;
  color?: string;
}
const PlusIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>➕</Text>;
const BookOpenIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>📖</Text>;
const TargetIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>🎯</Text>;
const Loader2Icon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <ActivityIndicator size="small" color={color} />; // Actual indicator
const CheckCircleIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>✅</Text>;
const MoreVerticalIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>⋮</Text>;
const PencilIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>✏️</Text>;
const Trash2Icon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>🗑️</Text>;


// Dummy types for Supabase if not directly available from a shared package
type HabitStatus = 'ativo' | 'inativo'; // Example, adjust based on your DB
type Database = any; // Replace with your actual Supabase Database type

type Habit = Database['public']['Tables']['habits']['Row'];

interface HabitWithProgress extends Omit<Habit, 'unit_type' | 'status'> {
  daily_goal?: number;
  today_progress?: number;
  unit_type: UnitType;
  target_value: number;
  current_value: number;
  status: HabitStatus;
}

// Tipos de unidades disponíveis
const UNIT_TYPES = {
  DAYS: 'dias',
  UNITS: 'unidades',
  CHAPTERS: 'capítulos',
  PAGES: 'páginas',
  MINUTES: 'minutos',
  HOURS: 'horas',
  ML: 'ml',
  LITERS: 'litros',
  METERS: 'metros',
  KM: 'quilômetros'
} as const;

type UnitType = typeof UNIT_TYPES[keyof typeof UNIT_TYPES];

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
// --- End Simple Card Components ---

const Habits: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [habits, setHabits] = useState<HabitWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Renamed from isOpen
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Renamed from isEditDialogOpen
  const [editingHabit, setEditingHabit] = useState<HabitWithProgress | null>(null);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    unit_type: UNIT_TYPES.DAYS as UnitType,
    target_value: 0,
    current_value: 0
  });
  const [addProgressModalOpen, setAddProgressModalOpen] = useState(false); // Renamed from addProgressDialogOpen
  const [selectedHabit, setSelectedHabit] = useState<HabitWithProgress | null>(null);
  const [progressToAdd, setProgressToAdd] = useState('');

  useEffect(() => {
    if (user) {
      loadHabits();
    }
  }, [user]);

  const loadHabits = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const habitsWithProgress = (data || []).map(habit => ({
        ...habit,
        daily_goal: 1, // Placeholder, adjust if real logic exists
        today_progress: 0, // Placeholder, adjust if real logic exists
        unit_type: habit.unit_type as UnitType,
        target_value: habit.target_value || 0,
        current_value: habit.current_value || 0,
        status: habit.status as HabitStatus // Ensure status type
      }));

      setHabits(habitsWithProgress);
    } catch (error: any) {
      console.error('Erro ao carregar hábitos:', error.message);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os hábitos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = async () => {
    if (!newHabit.name.trim() || !user || !newHabit.target_value) {
      toast({ title: "Erro", description: "Nome e meta diária são obrigatórios.", variant: "destructive" });
      return;
    }

    const sanitizedName = sanitizeTextInput(newHabit.name, 100);
    const sanitizedDescription = sanitizeTextInput(newHabit.description, 500);

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          name: sanitizedName,
          description: sanitizedDescription,
          frequency: newHabit.frequency,
          status: 'ativo', // Default status
          streak: 0,
          unit_type: newHabit.unit_type,
          target_value: newHabit.target_value,
          current_value: 0
        })
        .select()
        .single();

      if (error) throw error;

      const habitWithProgress = {
        ...data,
        target_value: newHabit.target_value,
        current_value: 0,
        unit_type: data.unit_type as UnitType,
        status: data.status as HabitStatus
      };

      setHabits(prev => [habitWithProgress, ...prev]);
      setNewHabit({
        name: '',
        description: '',
        frequency: 'daily',
        unit_type: UNIT_TYPES.DAYS,
        target_value: 0,
        current_value: 0
      });
      setIsAddModalOpen(false);

      toast({
        title: "Sucesso",
        description: "Hábito adicionado com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro ao adicionar hábito:', error.message);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o hábito.",
        variant: "destructive",
      });
    }
  };

  const handleAddProgress = async () => {
    if (!selectedHabit || !progressToAdd) {
      toast({ title: "Erro", description: "Informe o progresso a ser adicionado.", variant: "destructive" });
      return;
    }

    const progress = parseFloat(progressToAdd);
    if (isNaN(progress) || progress <= 0) {
      toast({ title: "Erro", description: "O progresso deve ser um número positivo.", variant: "destructive" });
      return;
    }

    const newValue = (selectedHabit.current_value || 0) + progress;
    const targetReached = newValue >= (selectedHabit.target_value || 0);
    const finalValue = targetReached ? selectedHabit.target_value || 0 : newValue;

    try {
      const { error } = await supabase
        .from('habits')
        .update({
          current_value: finalValue,
          streak: targetReached ? (selectedHabit.streak || 0) + 1 : selectedHabit.streak
        })
        .eq('id', selectedHabit.id);

      if (error) throw error;

      setHabits(prev => prev.map(habit =>
        habit.id === selectedHabit.id
          ? {
              ...habit,
              current_value: finalValue,
              streak: targetReached ? (habit.streak || 0) + 1 : habit.streak
            }
          : habit
      ));

      if (targetReached) {
        toast({
          title: "Parabéns! 🎉",
          description: "Meta diária atingida!",
        });
      } else {
        toast({
          title: "Progresso registrado!",
          description: `Faltam ${(selectedHabit.target_value || 0) - finalValue} ${selectedHabit.unit_type} para atingir a meta.`,
        });
      }

      setAddProgressModalOpen(false);
      setSelectedHabit(null);
      setProgressToAdd('');
    } catch (error: any) {
      console.error('Erro ao atualizar progresso:', error.message);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o progresso.",
        variant: "destructive",
      });
    }
  };

  const getDailyGoalProgress = (habit: HabitWithProgress) => {
    const current = habit.current_value || 0;
    const target = habit.target_value || 1;
    return Math.min((current / target) * 100, 100);
  };

  const deleteHabit = async (id: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este hábito?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { text: "Excluir", onPress: async () => {
            try {
              const { error } = await supabase
                .from('habits')
                .delete()
                .eq('id', id);

              if (error) throw error;

              setHabits(prev => prev.filter(habit => habit.id !== id));

              toast({
                title: "Sucesso",
                description: "Hábito removido com sucesso!",
              });
            } catch (error: any) {
              console.error('Erro ao deletar hábito:', error.message);
              toast({
                title: "Erro",
                description: "Não foi possível remover o hábito.",
                variant: "destructive",
              });
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  const startEditingProgress = (id: string) => { // Removed currentProgress param as it's not used directly
    setSelectedHabit(habits.find(h => h.id === id) || null);
    setProgressToAdd(''); // Clear previous input
    setAddProgressModalOpen(true);
  };

  const handleEditHabit = async () => {
    if (!editingHabit || !user) return;

    const sanitizedName = sanitizeTextInput(editingHabit.name, 100);
    const sanitizedDescription = sanitizeTextInput(editingHabit.description || '', 500);

    try {
      const { error } = await supabase
        .from('habits')
        .update({
          name: sanitizedName,
          description: sanitizedDescription,
          frequency: editingHabit.frequency,
          unit_type: editingHabit.unit_type
        })
        .eq('id', editingHabit.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setHabits(prev => prev.map(habit =>
        habit.id === editingHabit.id
          ? {
              ...habit,
              name: sanitizedName,
              description: sanitizedDescription,
              frequency: editingHabit.frequency,
              unit_type: editingHabit.unit_type
            }
          : habit
      ));

      setIsEditModalOpen(false);
      setEditingHabit(null);

      toast({
        title: "Sucesso",
        description: "Hábito atualizado com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro ao atualizar hábito:', error.message);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o hábito.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loader2Icon size={32} color="#007BFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.sectionTitle}>Hábitos</Text>
          <Text style={styles.sectionDescription}>Construa hábitos saudáveis com metas diárias</Text>
        </View>

        <TouchableOpacity
          style={styles.newHabitButton}
          onPress={() => setIsAddModalOpen(true)}
        >
          <PlusIcon size={16} color="white" />
          <Text style={styles.newHabitButtonText}>Novo Hábito</Text>
        </TouchableOpacity>

        {/* Add Habit Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isAddModalOpen}
          onRequestClose={() => setIsAddModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Adicionar Novo Hábito</Text>
              <Text style={styles.modalDescription}>Crie um novo hábito para desenvolver com meta diária</Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Nome do Hábito</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Beber água"
                  value={newHabit.name}
                  onChangeText={(text) => setNewHabit(prev => ({ ...prev, name: text }))}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Descrição (opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Descreva seu hábito..."
                  value={newHabit.description}
                  onChangeText={(text) => setNewHabit(prev => ({ ...prev, description: text }))}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Tipo de Unidade</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={newHabit.unit_type}
                    onValueChange={(itemValue: UnitType) => setNewHabit(prev => ({ ...prev, unit_type: itemValue }))}
                    style={styles.picker}
                  >
                    {Object.values(UNIT_TYPES).map((unit) => (
                      <Picker.Item key={unit} label={unit} value={unit} />
                    ))}
                  </Picker>
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Meta Diária ({newHabit.unit_type})
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={`Ex: 1000 ${newHabit.unit_type}`}
                  value={newHabit.target_value.toString()}
                  onChangeText={(text) => setNewHabit(prev => ({
                    ...prev,
                    target_value: parseFloat(text) || 0
                  }))}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAddModalOpen(false)}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveButton, (!newHabit.name.trim() || !newHabit.target_value) && styles.disabledButton]}
                  onPress={handleAddHabit}
                  disabled={!newHabit.name.trim() || !newHabit.target_value}
                >
                  <Text style={styles.saveButtonText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Habit Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Hábito</Text>
              <Text style={styles.modalDescription}>Modifique as informações do seu hábito</Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Nome do Hábito</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Ler 30 minutos"
                  value={editingHabit?.name || ''}
                  onChangeText={(text) => setEditingHabit(prev => prev ? { ...prev, name: text } : null)}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Descrição (opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Descreva seu hábito..."
                  value={editingHabit?.description || ''}
                  onChangeText={(text) => setEditingHabit(prev => prev ? { ...prev, description: text } : null)}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Tipo de Unidade</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={editingHabit?.unit_type || UNIT_TYPES.DAYS}
                    onValueChange={(itemValue: UnitType) => setEditingHabit(prev => prev ? { ...prev, unit_type: itemValue } : null)}
                    style={styles.picker}
                  >
                    {Object.values(UNIT_TYPES).map((unit) => (
                      <Picker.Item key={unit} label={unit} value={unit} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditModalOpen(false)}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleEditHabit}>
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Add Progress Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={addProgressModalOpen}
          onRequestClose={() => setAddProgressModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Adicionar Progresso</Text>
              <Text style={styles.modalDescription}>
                Registre seu progresso para {selectedHabit?.name}
              </Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Quanto você progrediu? ({selectedHabit?.unit_type})
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={`Ex: 200 ${selectedHabit?.unit_type}`}
                  value={progressToAdd}
                  onChangeText={setProgressToAdd}
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.progressInfoText}>
                Meta diária: {selectedHabit?.target_value} {selectedHabit?.unit_type}
                {"\n"}
                Progresso atual: {selectedHabit?.current_value} {selectedHabit?.unit_type}
                {"\n"}
                Restante: {(selectedHabit?.target_value || 0) - (selectedHabit?.current_value || 0)} {selectedHabit?.unit_type}
              </Text>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setAddProgressModalOpen(false)}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleAddProgress}>
                  <Text style={styles.saveButtonText}>Registrar Progresso</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      {habits.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <TargetIcon size={60} color="#A0A0A0" />
          <Text style={styles.emptyStateTitle}>Nenhum hábito cadastrado</Text>
          <Text style={styles.emptyStateDescription}>
            Comece adicionando seu primeiro hábito para desenvolver
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => setIsAddModalOpen(true)}
          >
            <PlusIcon size={16} color="white" />
            <Text style={styles.emptyStateButtonText}>Novo Hábito</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.habitsGrid}>
          {habits.map((habit) => (
            <Card key={habit.id} style={styles.habitCard}>
              <CardHeader style={styles.cardHeader}>
                <View style={styles.habitCardTitleContainer}>
                  <CardTitle style={styles.habitCardTitle}>
                    {habit.name}
                  </CardTitle>
                  {habit.description && (
                    <CardDescription style={styles.habitCardDescription}>
                      {habit.description}
                    </CardDescription>
                  )}
                </View>
                {/* Dropdown Menu - Simplified for RN */}
                <TouchableOpacity
                  onPress={() => Alert.alert(
                    "Opções do Hábito",
                    `${habit.name}`,
                    [
                      {
                        text: "Editar",
                        onPress: () => {
                          setEditingHabit(habit);
                          setIsEditModalOpen(true);
                        }
                      },
                      {
                        text: "Excluir",
                        onPress: () => deleteHabit(habit.id),
                        style: 'destructive'
                      },
                      {
                        text: "Cancelar",
                        style: "cancel"
                      }
                    ]
                  )}
                  style={styles.moreButton}
                >
                  <MoreVerticalIcon size={20} color="#6B7280" />
                </TouchableOpacity>
              </CardHeader>
              <CardContent>
                <View style={styles.habitDetails}>
                  <View style={styles.habitGoalInfo}>
                    <Text style={styles.habitGoalLabel}>Meta Diária</Text>
                    <Text style={styles.habitGoalValue}>
                      {habit.current_value || 0}/{habit.target_value || 0} {habit.unit_type}
                    </Text>
                    <Text style={styles.habitStreakText}>
                      Sequência: {habit.streak} dias
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.progressButton}
                    onPress={() => {
                      setSelectedHabit(habit);
                      setAddProgressModalOpen(true);
                    }}
                  >
                    <PlusIcon size={16} color="#007BFF" />
                    <Text style={styles.progressButtonText}>Progresso</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.progressBarSection}>
                  <View style={styles.progressBarTextContainer}>
                    <Text style={styles.progressBarLabel}>Progresso de hoje</Text>
                    <Text style={styles.progressBarPercentage}>{Math.round(getDailyGoalProgress(habit))}%</Text>
                  </View>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[styles.progressBarFill, { width: `${getDailyGoalProgress(habit)}%` }]}
                    />
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80, // Similar to pb-20 sm:pb-6, adjust as needed for safe area
    backgroundColor: '#F8F8F8', // background color
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  headerContainer: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24, // sm:text-3xl
    fontWeight: 'bold',
    color: '#1A1A1A', // foreground
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14, // sm:text-base
    color: '#6B7280', // muted-foreground
  },
  newHabitButton: {
    backgroundColor: '#007BFF', // primary color
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16, // Added margin top for spacing in column layout
    width: '100%', // full width on small screens
  },
  newHabitButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  // Card styles (reused from Dashboard RN)
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: 0,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  cardDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  cardContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 0,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '90%', // max-w-md
    maxHeight: '80%', // To prevent overflow on small screens
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1A1A1A',
  },
  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB', // border-input
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    color: '#1A1A1A',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50, // Standard height for picker
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB', // outline variant border
  },
  cancelButtonText: {
    color: '#6B7280', // muted-foreground
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
  // Empty State
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1A1A1A',
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyStateButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 14,
  },
  // Habits Grid
  habitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16, // simulate gap-4
  },
  habitCard: {
    width: '100%', // Default to full width for single column
    marginBottom: 16, // spacing between cards if not using wrap gap
  },
  habitCardTitleContainer: {
    flex: 1,
    paddingRight: 10,
  },
  habitCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  habitCardDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  moreButton: {
    padding: 4,
  },
  habitDetails: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  habitGoalInfo: {
    gap: 4,
  },
  habitGoalLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  habitGoalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  habitStreakText: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB', // outline variant border
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: '100%', // Full width for button in column layout
  },
  progressButtonText: {
    color: '#007BFF', // primary color
    fontSize: 14,
    fontWeight: '500',
  },
  progressBarSection: {
    marginTop: 16,
  },
  progressBarTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressBarLabel: {
    fontSize: 12,
    color: '#1A1A1A',
  },
  progressBarPercentage: {
    fontSize: 12,
    color: '#1A1A1A',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E5E7EB', // secondary
    borderRadius: 9999, // full rounded
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007BFF', // primary
  },
  progressInfoText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 10,
  }
});

// Media queries for larger screens (e.g., sm:grid-cols-2 lg:grid-cols-3) need to be handled with Dimensions API or different component structures in React Native
// For simplicity, the current styles assume a single column layout or basic responsiveness.
// For true responsive grids, consider libraries or manual `Dimensions.get('window').width` checks.
// Example for habitCard (to make it two columns on larger screens):
/*
const { width } = Dimensions.get('window');
if (width > 600) { // Example breakpoint for tablet
  styles.habitCard.width = '48%';
}
if (width > 900) { // Example breakpoint for desktop
  styles.habitsGrid.flexDirection = 'row';
  styles.habitCard.width = '31%'; // Approx 3 columns
}
*/

export default Habits;