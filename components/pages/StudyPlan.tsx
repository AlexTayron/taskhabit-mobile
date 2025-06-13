import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StudyTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  subtasks: StudySubtask[];
}

interface StudySubtask {
  id: string;
  title: string;
  completed: boolean;
}

export default function StudyPlanScreen() {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<StudyTask | null>(null);
  const [newSubtask, setNewSubtask] = useState('');

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    
    const task: StudyTask = {
      id: Date.now().toString(),
      title: newTask.trim(),
      description: newTaskDescription.trim(),
      completed: false,
        subtasks: []
      };

    setTasks(prev => [task, ...prev]);
    setNewTask('');
      setNewTaskDescription('');
    setIsModalVisible(false);
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const addSubtask = (taskId: string) => {
    if (!newSubtask.trim()) return;

    const subtask: StudySubtask = {
      id: Date.now().toString(),
      title: newSubtask.trim(),
      completed: false
    };

    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return { ...task, subtasks: [...task.subtasks, subtask] };
      }
      return task;
    }));

    setNewSubtask('');
    setSelectedTask(null);
  };

  const toggleSubtaskStatus = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: task.subtasks.map(subtask =>
            subtask.id === subtaskId
              ? { ...subtask, completed: !subtask.completed }
              : subtask
          )
        };
      }
      return task;
    }));
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId)
        };
      }
      return task;
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>O que Estudar Hoje</Text>
        <Text style={styles.subtitle}>Organize seus estudos e acompanhe seu progresso</Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Nova Tarefa</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <TouchableOpacity onPress={() => toggleTaskStatus(item.id)}>
                <Ionicons
                  name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={item.completed ? '#10B981' : '#6B7280'}
                />
              </TouchableOpacity>
              <View style={styles.taskInfo}>
                <Text style={[
                  styles.taskTitle,
                  item.completed && styles.completedTask
                ]}>
                  {item.title}
                </Text>
                {item.description && (
                  <Text style={styles.taskDescription}>{item.description}</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>

            {item.subtasks.length > 0 && (
              <View style={styles.subtasksContainer}>
                {item.subtasks.map(subtask => (
                  <View key={subtask.id} style={styles.subtaskRow}>
                    <TouchableOpacity onPress={() => toggleSubtaskStatus(item.id, subtask.id)}>
                      <Ionicons
                        name={subtask.completed ? 'checkmark-circle' : 'ellipse-outline'}
                        size={20}
                        color={subtask.completed ? '#10B981' : '#6B7280'}
                      />
                    </TouchableOpacity>
                    <Text style={[
                      styles.subtaskText,
                      subtask.completed && styles.completedSubtask
                    ]}>
                      {subtask.title}
                    </Text>
                    <TouchableOpacity onPress={() => deleteSubtask(item.id, subtask.id)}>
                      <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.addSubtaskButton}
              onPress={() => setSelectedTask(item)}
            >
              <Ionicons name="add-circle-outline" size={20} color="#3B82F6" />
              <Text style={styles.addSubtaskText}>Adicionar Subtarefa</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={48} color="#6B7280" />
            <Text style={styles.emptyText}>Nenhuma tarefa adicionada</Text>
          </View>
        }
      />

      {/* Modal para adicionar tarefa */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Tarefa</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Título da tarefa"
              value={newTask}
              onChangeText={setNewTask}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descrição (opcional)"
                              value={newTaskDescription}
              onChangeText={setNewTaskDescription}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddTask}
                disabled={!newTask.trim()}
              >
                <Text style={[styles.buttonText, styles.saveButtonText]}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para adicionar subtarefa */}
      <Modal
        visible={!!selectedTask}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedTask(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Subtarefa</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Título da subtarefa"
              value={newSubtask}
              onChangeText={setNewSubtask}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setSelectedTask(null)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => selectedTask && addSubtask(selectedTask.id)}
                disabled={!newSubtask.trim()}
              >
                <Text style={[styles.buttonText, styles.saveButtonText]}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 16,
  },
  header: {
    marginBottom: 24,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskInfo: {
    flex: 1,
    marginLeft: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  subtasksContainer: {
    marginTop: 12,
    marginLeft: 36,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtaskText: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    marginLeft: 8,
  },
  completedSubtask: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  addSubtaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginLeft: 36,
  },
  addSubtaskText: {
    color: '#3B82F6',
    marginLeft: 4,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  saveButtonText: {
    color: 'white',
  },
});
