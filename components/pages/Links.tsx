// Links.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Linking, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast'; // Assuming useToast is adapted for RN
import { sanitizeTextInput } from '../utils/security'; // Assuming this utility is cross-platform

// Icon Placeholders (replace with react-native-vector-icons)
interface IconProps { size?: number; color?: string; }
const PlusIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>➕</Text>;
const ExternalLinkIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>🔗</Text>;
const PencilIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>✏️</Text>;
const TrashIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>🗑️</Text>;

interface Item {
  id: string;
  user_id: string;
  name: string;
  link: string;
  category: string;
  created_at: string;
}

const CATEGORIES = ['Curso', 'Projeto', 'Site', 'Artigo', 'Video', 'Documentação'] as const;
type Category = typeof CATEGORIES[number];

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

const Links: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Renamed from isOpen
  const [activeCategory, setActiveCategory] = useState<'all' | Category>('all');
  const [newItem, setNewItem] = useState({
    name: '',
    link: '',
    category: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadItems();
    }
  }, [user]);

  const loadItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar itens:', error.message);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os itens.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name.trim() || !newItem.link.trim() || !newItem.category || !user) {
      toast({ title: "Erro", description: "Todos os campos são obrigatórios.", variant: "destructive" });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('items')
        .insert({
          user_id: user.id,
          name: sanitizeTextInput(newItem.name, 200),
          link: newItem.link,
          category: newItem.category
        })
        .select()
        .single();

      if (error) throw error;

      setItems(prev => [data, ...prev]);
      setNewItem({ name: '', link: '', category: '' });
      setIsModalOpen(false);

      toast({
        title: "Sucesso",
        description: "Item adicionado com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro ao adicionar item:', error.message);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o item.",
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (id: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este item?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { text: "Excluir", onPress: async () => {
            try {
              const { error } = await supabase
                .from('items')
                .delete()
                .eq('id', id);

              if (error) throw error;

              setItems(prev => prev.filter(item => item.id !== id));

              toast({
                title: "Sucesso",
                description: "Item excluído com sucesso!",
              });
            } catch (error: any) {
              console.error('Erro ao excluir item:', error.message);
              toast({
                title: "Erro",
                description: "Não foi possível excluir o item.",
                variant: "destructive",
              });
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  const handleEditItem = async () => {
    if (!newItem.name.trim() || !newItem.link.trim() || !newItem.category || !user || !editingItemId) {
      toast({ title: "Erro", description: "Todos os campos são obrigatórios.", variant: "destructive" });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('items')
        .update({
          name: sanitizeTextInput(newItem.name, 200),
          link: newItem.link,
          category: newItem.category
        })
        .eq('id', editingItemId)
        .select()
        .single();

      if (error) throw error;

      setItems(prev => prev.map(item =>
        item.id === editingItemId ? data : item
      ));

      setNewItem({ name: '', link: '', category: '' });
      setIsModalOpen(false);
      setIsEditing(false);
      setEditingItemId(null);

      toast({
        title: "Sucesso",
        description: "Item atualizado com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro ao atualizar item:', error.message);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o item.",
        variant: "destructive",
      });
    }
  };

  const startEditing = (item: Item) => {
    setNewItem({
      name: item.name,
      link: item.link,
      category: item.category
    });
    setEditingItemId(item.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(item => item.category === activeCategory);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>Links</Text>
        <Text style={styles.sectionDescription}>Gerencie seus links e recursos</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.newLinkButton} onPress={() => setIsModalOpen(true)}>
            <PlusIcon size={16} color="white" />
            <Text style={styles.newLinkButtonText}>Novo Link</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add/Edit Link Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setNewItem({ name: '', link: '', category: '' });
          setIsEditing(false);
          setEditingItemId(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? 'Editar Item' : 'Adicionar Item'}</Text>
            <Text style={styles.modalDescription}>
              {isEditing ? 'Edite as informações do item' : 'Adicione um novo item à sua lista'}
            </Text>

            <View style={styles.formGroup}>
              <TextInput
                style={styles.input}
                placeholder="Nome do item"
                value={newItem.name}
                onChangeText={(text) => setNewItem(prev => ({ ...prev, name: text }))}
              />
            </View>
            <View style={styles.formGroup}>
              <TextInput
                style={styles.input}
                placeholder="Link"
                value={newItem.link}
                onChangeText={(text) => setNewItem(prev => ({ ...prev, link: text }))}
              />
            </View>
            <View style={styles.formGroup}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={newItem.category}
                  onValueChange={(itemValue) => setNewItem(prev => ({ ...prev, category: itemValue as Category }))}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione uma categoria" value="" />
                  {CATEGORIES.map((category) => (
                    <Picker.Item key={category} label={category} value={category} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsModalOpen(false);
                  setNewItem({ name: '', link: '', category: '' });
                  setIsEditing(false);
                  setEditingItemId(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, (!newItem.name.trim() || !newItem.link.trim() || !newItem.category) && styles.disabledButton]}
                onPress={isEditing ? handleEditItem : handleAddItem}
                disabled={!newItem.name.trim() || !newItem.link.trim() || !newItem.category}
              >
                <Text style={styles.saveButtonText}>{isEditing ? 'Salvar Alterações' : 'Salvar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView horizontal contentContainerStyle={styles.categoryFilterContainer}>
        <TouchableOpacity
          onPress={() => setActiveCategory('all')}
          style={[
            styles.categoryButton,
            activeCategory === 'all' ? styles.activeCategoryButton : styles.inactiveCategoryButton
          ]}
        >
          <Text style={activeCategory === 'all' ? styles.activeCategoryText : styles.inactiveCategoryText}>
            Todos
          </Text>
        </TouchableOpacity>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setActiveCategory(category)}
            style={[
              styles.categoryButton,
              activeCategory === category ? styles.activeCategoryButton : styles.inactiveCategoryButton
            ]}
          >
            <Text style={activeCategory === category ? styles.activeCategoryText : styles.inactiveCategoryText}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingMessageContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingMessage}>Carregando...</Text>
        </View>
      ) : filteredItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Nenhum item encontrado</Text>
        </View>
      ) : (
        <View style={styles.itemsGrid}>
          {filteredItems.map((item) => (
            <Card key={item.id} style={styles.itemCard}>
              <CardHeader style={styles.itemCardHeader}>
                <View style={styles.itemTextContainer}>
                  <CardTitle style={styles.itemCardTitle}>{item.name}</CardTitle>
                  <CardDescription style={styles.itemCardDescription}>{item.category}</CardDescription>
                </View>
                {/* Simplified Dropdown Menu */}
                <TouchableOpacity
                  onPress={() => Alert.alert(
                    "Opções do Link",
                    `"${item.name}"`,
                    [
                      { text: "Abrir Link", onPress: () => Linking.openURL(item.link) },
                      { text: "Editar", onPress: () => startEditing(item) },
                      { text: "Excluir", onPress: () => deleteItem(item.id), style: 'destructive' },
                      { text: "Cancelar", style: "cancel" }
                    ]
                  )}
                  style={styles.moreOptionsButton}
                >
                  <ExternalLinkIcon size={20} color="#6B7280" />
                </TouchableOpacity>
              </CardHeader>
            </Card>
          ))}
        </View>
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
  headerContainer: {
    marginBottom: 20,
    alignSelf: 'flex-start', // max-w-5xl, mx-auto, px-4 are managed by parent ScrollView contentContainerStyle and this view
  },
  sectionTitle: {
    fontSize: 22, // sm:text-3xl
    fontWeight: 'bold',
    color: '#1A1A1A', // text-foreground
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14, // sm:text-base
    color: '#6B7280', // text-muted-foreground
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8, // gap-2
  },
  newLinkButton: {
    backgroundColor: '#007BFF', // primary color
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  newLinkButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  // Modal Styles (reused from Habits RN)
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
    height: 50,
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
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
  // Category Filter
  categoryFilterContainer: {
    paddingBottom: 16, // pb-4
    marginBottom: 8, // mb-2
    // You'd need a custom scrollbar component for scrollbar-thin etc.
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999, // rounded-full
    marginRight: 8, // Simulate gap-2
    flexShrink: 0, // flex-shrink-0
  },
  activeCategoryButton: {
    backgroundColor: '#007BFF', // bg-primary
  },
  inactiveCategoryButton: {
    backgroundColor: '#F3F4F6', // bg-muted/50
  },
  activeCategoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white', // text-primary-foreground
  },
  inactiveCategoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280', // hover:bg-muted, text-muted-foreground
  },
  // Items Grid
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 24, // gap-6
  },
  itemCard: {
    width: '100%', // Default to full width for single column
    marginBottom: 24, // For gap if wrap is not used
  },
  itemCardHeader: {
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  itemTextContainer: {
    flex: 1,
    minWidth: 0, // Allows content to shrink
  },
  itemCardTitle: {
    fontSize: 16, // text-lg
    marginBottom: 4,
    flexWrap: 'wrap', // break-words
  },
  itemCardDescription: {
    fontSize: 12, // text-sm
    color: '#6B7280',
    flexWrap: 'wrap', // break-words
  },
  moreOptionsButton: {
    padding: 4,
  },
  loadingMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingMessage: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
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
  },
  cardHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});


export default Links;