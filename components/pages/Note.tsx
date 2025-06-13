// Notes.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast'; // Assuming useToast is adapted for RN
import { sanitizeTextInput } from '../utils/security'; // Assuming this utility is cross-platform

// Note: Rich text editing (`contentEditable`, `document.execCommand`) is complex in React Native.
// For simplicity, the rich text editor functionality will be replaced with a multiline TextInput.
// Displaying HTML content will be done using a basic Text component,
// which might not render all HTML tags correctly without a dedicated HTML renderer library.

// Icon Placeholders (replace with react-native-vector-icons)
interface IconProps { size?: number; color?: string; }
const PlusIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>➕</Text>;
const SaveIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>💾</Text>;
const Loader2Icon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <ActivityIndicator size="small" color={color} />;
const MoreVerticalIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>⋮</Text>;
const PencilIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>✏️</Text>;
const TrashIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>🗑️</Text>;
const StickyNoteIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>📝</Text>;

// Dummy types for Supabase if not directly available from a shared package
type Database = any; // Replace with your actual Supabase Database type
type Note = Database['public']['Tables']['notes']['Row'];

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

const Notes: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState<{
    title: string;
    content: string;
    color: string;
  }>({
    title: '',
    content: '',
    color: '#ffffff'
  });

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  const loadNotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar notas:', error.message);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as notas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.title.trim() || !user) {
      toast({ title: "Erro", description: "O título da nota é obrigatório.", variant: "destructive" });
      return;
    }

    const sanitizedTitle = sanitizeTextInput(newNote.title, 200);
    // Note: For content, `sanitizeHtml` would ideally involve an HTML parser for RN,
    // here we'll just treat it as plain text or very basic formatting for simplicity.
    const sanitizedContent = sanitizeTextInput(newNote.content, 2000); // Max length for content

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: sanitizedTitle,
          content: sanitizedContent,
          color: newNote.color
        })
        .select()
        .single();

      if (error) throw error;

      setNotes(prev => [data, ...prev]);
      setNewNote({ title: '', content: '', color: '#ffffff' });
      setIsModalOpen(false);

      toast({
        title: "Sucesso",
        description: "Nota criada com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro ao criar nota:', error.message);
      toast({
        title: "Erro",
        description: "Não foi possível criar a nota.",
        variant: "destructive",
      });
    }
  };

  const handleEditNote = async () => {
    if (!newNote.title.trim() || !user || !editingNoteId) {
      toast({ title: "Erro", description: "O título da nota é obrigatório.", variant: "destructive" });
      return;
    }

    const sanitizedTitle = sanitizeTextInput(newNote.title, 200);
    const sanitizedContent = sanitizeTextInput(newNote.content, 2000);

    try {
      const { data, error } = await supabase
        .from('notes')
        .update({
          title: sanitizedTitle,
          content: sanitizedContent,
          color: newNote.color
        })
        .eq('id', editingNoteId)
        .select()
        .single();

      if (error) throw error;

      setNotes(prev => prev.map(note =>
        note.id === editingNoteId ? data : note
      ));

      setNewNote({ title: '', content: '', color: '#ffffff' });
      setIsModalOpen(false);
      setIsEditing(false);
      setEditingNoteId(null);

      toast({
        title: "Sucesso",
        description: "Nota atualizada com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro ao atualizar nota:', error.message);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a nota.",
        variant: "destructive",
      });
    }
  };

  const startEditing = (note: Note) => {
    setNewNote({
      title: note.title,
      content: note.content || '',
      color: note.color || '#ffffff'
    });
    setEditingNoteId(note.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const deleteNote = async (id: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta nota?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { text: "Excluir", onPress: async () => {
            try {
              const { error } = await supabase
                .from('notes')
                .delete()
                .eq('id', id);

              if (error) throw error;

              setNotes(prev => prev.filter(note => note.id !== id));

              toast({
                title: "Sucesso",
                description: "Nota excluída com sucesso!",
              });
            } catch (error: any) {
              console.error('Erro ao excluir nota:', error.message);
              toast({
                title: "Erro",
                description: "Não foi possível excluir a nota.",
                variant: "destructive",
              });
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  const getColorStyle = (color: string) => {
    // Map web colors to RN compatible hex or rgba
    const colorMap: { [key: string]: string } = {
      '#ffffff': '#FFFFFF',
      '#fef3c7': '#FEF3C7', // yellow-100
      '#dbeafe': '#DBEAFE', // blue-100
      '#dcfce7': '#DCFCE7', // green-100
      '#fce7f3': '#FCE7F3', // pink-100
      '#ede9fe': '#EDE9FE', // purple-100
    };
    return {
      backgroundColor: colorMap[color] || '#FFFFFF',
      color: '#020817', // Text color will always be dark
    };
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
          <Text style={styles.sectionTitle}>Notas</Text>
          <Text style={styles.sectionDescription}>Gerencie suas anotações e ideias</Text>
        </View>

        <TouchableOpacity style={styles.newNoteButton} onPress={() => setIsModalOpen(true)}>
          <PlusIcon size={16} color="white" />
          <Text style={styles.newNoteButtonText}>Nova Nota</Text>
        </TouchableOpacity>

        {/* Add/Edit Note Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalOpen}
          onRequestClose={() => {
            setIsModalOpen(false);
            setNewNote({ title: '', content: '', color: '#ffffff' });
            setIsEditing(false);
            setEditingNoteId(null);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{isEditing ? 'Editar Nota' : 'Criar Nova Nota'}</Text>
              <Text style={styles.modalDescription}>
                {isEditing ? 'Edite sua nota' : 'Crie uma nova nota para organizar suas ideias'}
              </Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Título</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Título da nota (máx. 200 caracteres)"
                  value={newNote.title}
                  onChangeText={(text) => setNewNote(prev => ({ ...prev, title: text }))}
                  maxLength={200}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Cor</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={newNote.color}
                    onValueChange={(itemValue) => setNewNote(prev => ({ ...prev, color: itemValue as string }))}
                    style={styles.picker}
                  >
                    <Picker.Item label="Branco" value="#ffffff" />
                    <Picker.Item label="Amarelo" value="#fef3c7" />
                    <Picker.Item label="Azul" value="#dbeafe" />
                    <Picker.Item label="Verde" value="#dcfce7" />
                    <Picker.Item label="Rosa" value="#fce7f3" />
                    <Picker.Item label="Roxo" value="#ede9fe" />
                  </Picker>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Conteúdo</Text>
                {/* Simplified Text Input for content */}
                <TextInput
                  style={styles.textArea}
                  placeholder="Escreva sua nota aqui..."
                  value={newNote.content}
                  onChangeText={(text) => setNewNote(prev => ({ ...prev, content: text }))}
                  multiline
                  textAlignVertical="top" // For Android to start text at top
                />
                <Text style={styles.editorWarning}>
                  (Edição de texto rico não disponível nesta versão. Use texto simples.)
                </Text>
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsModalOpen(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveButton, !newNote.title.trim() && styles.disabledButton]}
                  onPress={isEditing ? handleEditNote : handleAddNote}
                  disabled={!newNote.title.trim()}
                >
                  {loading ? (
                    <Loader2Icon size={16} color="white" />
                  ) : (
                    <>
                      <SaveIcon size={16} color="white" />
                      <Text style={styles.saveButtonText}>{isEditing ? 'Salvar Alterações' : 'Salvar Nota'}</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <View style={styles.notesGrid}>
        {notes.map((note) => (
          <Card key={note.id} style={[styles.noteCard, getColorStyle(note.color)]}>
            <CardHeader style={styles.noteCardHeader}>
              <CardTitle style={styles.noteCardTitle}>{note.title}</CardTitle>
              {/* Simplified Dropdown Menu */}
              <TouchableOpacity
                onPress={() => Alert.alert(
                  "Opções da Nota",
                  `"${note.title}"`,
                  [
                    { text: "Editar", onPress: () => startEditing(note) },
                    { text: "Excluir", onPress: () => deleteNote(note.id), style: 'destructive' },
                    { text: "Cancelar", style: "cancel" }
                  ]
                )}
                style={styles.moreButton}
              >
                <MoreVerticalIcon size={20} color="#6B7280" />
              </TouchableOpacity>
            </CardHeader>
            <CardContent>
              {/* Displaying HTML content as plain text. For proper HTML rendering, a library like react-native-render-html is recommended. */}
              <Text style={styles.noteContent}>
                {note.content}
              </Text>
            </CardContent>
          </Card>
        ))}
      </View>

      {notes.length === 0 && (
        <Card style={styles.emptyStateCard}>
          <CardContent style={styles.emptyStateContent}>
            <StickyNoteIcon size={50} color="#A0A0A0" />
            <Text style={styles.emptyStateTitle}>
              Nenhuma nota criada
            </Text>
            <Text style={styles.emptyStateDescription}>
              Crie sua primeira nota para começar a organizar suas ideias
            </Text>
          </CardContent>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F8F8F8', // bg-background
    paddingBottom: 80, // Adjust for bottom navigation
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24, // text-3xl
    fontWeight: 'bold',
    color: '#1A1A1A', // foreground
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280', // muted-foreground
  },
  newNoteButton: {
    backgroundColor: '#007BFF', // primary color
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  newNoteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
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
    width: '95%', // max-w-2xl w-full
    maxHeight: '80%',
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
    paddingVertical: 10,
    paddingHorizontal: 12,
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
    height: 50,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 150, // min-h-[200px]
    fontSize: 16,
    color: '#1A1A1A',
  },
  editorWarning: {
    fontSize: 12,
    color: '#EF4444', // red-600 for warnings
    marginTop: 5,
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
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row', // For icon and text
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
  // Notes Grid
  notesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16, // gap-4
  },
  noteCard: {
    width: '100%', // Default to full width for single column
    marginBottom: 16,
  },
  noteCardHeader: {
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  noteCardTitle: {
    fontSize: 16, // text-lg
    fontWeight: '600',
    color: '#020817', // Text color will always be dark
    flex: 1, // Allow title to take space
    marginRight: 8, // Space for dropdown
  },
  moreButton: {
    padding: 4,
  },
  noteContent: {
    fontSize: 14,
    color: '#020817', // Text color
    // For `prose prose-sm max-w-none`, you'd need a dedicated HTML renderer library
    // or manually style common HTML elements. Here it's plain text.
  },
  // Empty State Card
  emptyStateCard: {
    alignItems: 'center',
    paddingVertical: 48, // py-12
  },
  emptyStateContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontSize: 18, // text-lg
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
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
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default Notes;