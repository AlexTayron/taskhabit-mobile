import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import DateTimePicker from "@react-native-community/datetimepicker";

const statusOptions = [
  { label: "Pendente", value: "Pendente" },
  { label: "Em andamento", value: "Em andamento" },
  { label: "Concluído", value: "Concluído" },
];
const priorities = ["baixa", "média", "alta"];

const initialTasks = [
  {
    id: "1",
    title: "dfsdfsdf",
    dueDate: "21/07/2025",
    priority: "baixa",
    status: "Pendente",
    description: "",
  },
];

export default function AppointmentScreen() {
  const [tasks, setTasks] = useState(initialTasks);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    priority: "média",
    description: "",
  });
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);

  const textColor = useThemeColor({}, "text");
  const bgColor = useThemeColor({}, "background");

  const handleAddTask = () => {
    if (!newTask.title) return;
    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        ...newTask,
        status: "Pendente",
      },
    ]);
    setNewTask({ title: "", dueDate: "", priority: "média", description: "" });
    setModalVisible(false);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  };
  const handlePriorityChange = (id: string, newPriority: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, priority: newPriority } : t))
    );
  };
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };
  const handleEditTask = (task: any) => {
    setEditTask(task);
    setEditTaskId(task.id);
    setEditModalVisible(true);
  };
  const handleSaveEdit = () => {
    setTasks(
      tasks.map((t) => (t.id === editTaskId ? { ...t, ...editTask } : t))
    );
    setEditModalVisible(false);
    setEditTaskId(null);
    setEditTask(null);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <ThemedText style={styles.title} type="title">
            Agenda
          </ThemedText>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Novo</Text>
        </TouchableOpacity>
      </View>
      <ThemedText style={styles.subtitle}>
        Gerencie seus compromissos e agenda
      </ThemedText>
      {/* Lista de compromissos */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 16 }}
        renderItem={({ item }) => {
          let cardBg = "#fff";
          if (item.status === "Em andamento") cardBg = "#fffbe6";
          if (item.status === "Concluído") cardBg = "#e6ffed";
          return (
            <View style={[styles.taskCard, { backgroundColor: cardBg }]}>
              <ThemedText style={styles.taskTitle} type="defaultSemiBold">
                {item.title}
              </ThemedText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 2,
                }}
              >
                <Feather name="calendar" size={16} color={textColor} />
                <ThemedText style={styles.taskMeta}>
                  Vence dia: {item.dueDate}
                </ThemedText>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <ThemedText style={styles.taskMeta}>Prioridade: </ThemedText>
                <TouchableOpacity
                  style={styles.priorityBox}
                  onPress={() => {
                    const idx = priorities.indexOf(item.priority);
                    const next = priorities[(idx + 1) % priorities.length];
                    handlePriorityChange(item.id, next);
                  }}
                >
                  <Text style={{ color: "#10131a", fontWeight: "bold" }}>
                    {item.priority}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color="#10131a" />
                </TouchableOpacity>
              </View>
              <View style={styles.taskFooter}>
                <TouchableOpacity
                  style={styles.statusBox}
                  onPress={() => {
                    const idx = statusOptions.findIndex(
                      (s) => s.value === item.status
                    );
                    const next =
                      statusOptions[(idx + 1) % statusOptions.length].value;
                    handleStatusChange(item.id, next);
                  }}
                >
                  <Text style={styles.statusText}>{item.status}</Text>
                  <Ionicons name="chevron-down" size={16} color={textColor} />
                </TouchableOpacity>
                <Menu>
                  <MenuTrigger>
                    <Feather name="more-vertical" size={20} color={textColor} />
                  </MenuTrigger>
                  <MenuOptions
                    customStyles={{
                      optionsContainer: {
                        width: 120,
                        borderRadius: 8,
                        padding: 0,
                      },
                    }}
                  >
                    <MenuOption onSelect={() => handleEditTask(item)}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                          padding: 10,
                        }}
                      >
                        <Feather name="edit-2" size={16} color="#10131a" />
                        <Text style={{ color: "#10131a", fontWeight: "bold" }}>
                          Editar
                        </Text>
                      </View>
                    </MenuOption>
                    <MenuOption onSelect={() => handleDeleteTask(item.id)}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                          padding: 10,
                        }}
                      >
                        <Feather name="trash-2" size={16} color="#e11d48" />
                        <Text style={{ color: "#e11d48", fontWeight: "bold" }}>
                          Excluir
                        </Text>
                      </View>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </View>
            </View>
          );
        }}
      />
      {/* Modal Nova Agenda */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle} type="title">
              Nova Agenda
            </ThemedText>
            <ThemedText style={styles.modalSubtitle}>
              Crie um novo compromisso para sua agenda
            </ThemedText>
            <Text style={styles.modalLabel}>Título da Agenda</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Reunião com cliente"
              value={newTask.title}
              onChangeText={(t) => setNewTask({ ...newTask, title: t })}
              placeholderTextColor="#aaa"
            />
            <Text style={styles.modalLabel}>Data de Vencimento</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="dd/mm/aaaa"
                value={newTask.dueDate}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={
                  newTask.dueDate
                    ? new Date(newTask.dueDate.split("/").reverse().join("-"))
                    : new Date()
                }
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    const d = selectedDate;
                    const formatted = `${("0" + d.getDate()).slice(-2)}/${(
                      "0" +
                      (d.getMonth() + 1)
                    ).slice(-2)}/${d.getFullYear()}`;
                    setNewTask({ ...newTask, dueDate: formatted });
                  }
                }}
              />
            )}
            <Text style={styles.modalLabel}>Prioridade</Text>
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => {
                const idx = priorities.indexOf(newTask.priority);
                const next = priorities[(idx + 1) % priorities.length];
                setNewTask({ ...newTask, priority: next });
              }}
            >
              <Text style={styles.selectText}>
                {newTask.priority.charAt(0).toUpperCase() +
                  newTask.priority.slice(1)}
              </Text>
              <Ionicons name="chevron-down" size={16} color={textColor} />
            </TouchableOpacity>
            <Text style={styles.modalLabel}>Descrição</Text>
            <TextInput
              style={[styles.input, { height: 60 }]}
              placeholder="Detalhes sobre o compromisso..."
              value={newTask.description}
              onChangeText={(desc) =>
                setNewTask({ ...newTask, description: desc })
              }
              placeholderTextColor="#aaa"
              multiline
            />
            <TouchableOpacity
              style={styles.modalAddButton}
              onPress={handleAddTask}
            >
              <Text style={styles.modalAddButtonText}>Adicionar Agenda</Text>
            </TouchableOpacity>
            <Pressable
              style={styles.modalCancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* Modal Editar Agenda */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle} type="title">
              Editar Agenda
            </ThemedText>
            <Text style={styles.modalLabel}>Título da Agenda</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Reunião com cliente"
              value={editTask?.title}
              onChangeText={(t) => setEditTask({ ...editTask, title: t })}
              placeholderTextColor="#aaa"
            />
            <Text style={styles.modalLabel}>Data de Vencimento</Text>
            <TouchableOpacity onPress={() => setShowEditDatePicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="dd/mm/aaaa"
                value={editTask?.dueDate}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>
            {showEditDatePicker && (
              <DateTimePicker
                value={
                  editTask?.dueDate
                    ? new Date(editTask.dueDate.split("/").reverse().join("-"))
                    : new Date()
                }
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowEditDatePicker(false);
                  if (selectedDate) {
                    const d = selectedDate;
                    const formatted = `${("0" + d.getDate()).slice(-2)}/${(
                      "0" +
                      (d.getMonth() + 1)
                    ).slice(-2)}/${d.getFullYear()}`;
                    setEditTask({ ...editTask, dueDate: formatted });
                  }
                }}
              />
            )}
            <Text style={styles.modalLabel}>Prioridade</Text>
            <View style={styles.selectBox}>
              <Text style={styles.selectText}>
                {editTask?.priority?.charAt(0).toUpperCase() +
                  editTask?.priority?.slice(1)}
              </Text>
              <Ionicons name="chevron-down" size={16} color={textColor} />
            </View>
            <Text style={styles.modalLabel}>Descrição</Text>
            <TextInput
              style={[styles.input, { height: 60 }]}
              placeholder="Detalhes sobre o compromisso..."
              value={editTask?.description}
              onChangeText={(desc) =>
                setEditTask({ ...editTask, description: desc })
              }
              placeholderTextColor="#aaa"
              multiline
            />
            <TouchableOpacity
              style={styles.modalAddButton}
              onPress={handleSaveEdit}
            >
              <Text style={styles.modalAddButtonText}>Salvar</Text>
            </TouchableOpacity>
            <Pressable
              style={styles.modalCancelButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginLeft: 24,
    marginBottom: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10131a",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 18,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  taskMeta: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  taskFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    justifyContent: "space-between",
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  statusText: {
    fontSize: 15,
    color: "#10131a",
    marginRight: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 2,
    color: "#10131a",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 10,
    fontSize: 15,
    marginBottom: 2,
    color: "#10131a",
    backgroundColor: "#f9fafb",
  },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#f9fafb",
    marginBottom: 2,
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: 15,
    color: "#10131a",
  },
  modalAddButton: {
    backgroundColor: "#6b7280",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 18,
  },
  modalAddButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalCancelButton: {
    alignItems: "center",
    marginTop: 10,
  },
  modalCancelButtonText: {
    color: "#10131a",
    fontSize: 16,
    fontWeight: "bold",
  },
  priorityBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 2,
    gap: 2,
  },
});
