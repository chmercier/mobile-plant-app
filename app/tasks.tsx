import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Header from "../components/Header";
import colors from "../styles/colors";
import typography from "../styles/typography";

// task interface
interface Task {
  id: string;
  title: string;
  plantName?: string; // optional
  description?: string; // optional
  dueDate: Date;
  isRecurring: boolean;
  recurrencePattern?: {
    frequency: "daily" | "2-3 days" | "4-5 days" | "weekly" | "biweekly" | "monthly";
  };
  isCompleted: boolean;
  completedDate?: Date;
  createdDate: Date;
  parentTaskId?: string; // track the original task this came from
}

const STORAGE_KEY = "@plant_care_tasks";

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Form state of the tasks
  const [formTitle, setFormTitle] = useState("");
  const [formPlantName, setFormPlantName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDueDate, setFormDueDate] = useState(new Date());
  const [formIsRecurring, setFormIsRecurring] = useState(false);
  const [formFrequency, setFormFrequency] = useState<"daily" | "2-3 days" | "4-5 days" | "weekly" | "biweekly" | "monthly">("weekly");

  // load tasks
  useEffect(() => {
    loadTasks();
  }, []);

  // save tasks to storage!
  useEffect(() => {
    if (tasks.length >= 0) {
      saveTasks();
    }
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        const parsed = JSON.parse(storedTasks);
        // convert strings to Date objects
        const tasksWithDates = parsed.map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          createdDate: new Date(task.createdDate),
          completedDate: task.completedDate ? new Date(task.completedDate) : undefined,
        }));
        setTasks(tasksWithDates);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const saveTasks = async () => {
    try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  const addTask = () => {
    if (!formTitle.trim()) {
      Alert.alert("Error", "Please enter a task title"); // only shows up on mobile
      return;
    }

    if (editingTaskId) {
      // find the task
      const taskBeingEdited = tasks.find((t) => t.id === editingTaskId);
      
      if (taskBeingEdited) {
        // determine root task id
        const rootTaskId = taskBeingEdited.parentTaskId || taskBeingEdited.id;
        
        // update all tasks in the recurring chain
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            const taskRootId = task.parentTaskId || task.id;
            
            // update if it's the root or part of the chain
            if (taskRootId === rootTaskId || task.id === rootTaskId) {
              return {
                ...task,
                title: formTitle.trim(),
                plantName: formPlantName.trim() || undefined,
                description: formDescription.trim() || undefined,
                isRecurring: formIsRecurring,
                recurrencePattern: formIsRecurring
                  ? {
                      frequency: formFrequency,
                    }
                  : undefined,
              };
            }
            return task;
          })
        );
      }
    } else {
      // create new task
      const newTask: Task = {
        id: Date.now().toString(),
        title: formTitle.trim(),
        plantName: formPlantName.trim() || undefined,
        description: formDescription.trim() || undefined,
        dueDate: formDueDate,
        isRecurring: formIsRecurring,
        recurrencePattern: formIsRecurring
          ? {
              frequency: formFrequency,
            }
          : undefined,
        isCompleted: false,
        createdDate: new Date(),
      };

      setTasks((prevTasks) => [...prevTasks, newTask]);
    }

    resetForm();
    setShowAddModal(false);
    setEditingTaskId(null);
  };

  const resetForm = () => {
    setFormTitle("");
    setFormPlantName("");
    setFormDescription("");
    setFormDueDate(new Date());
    setFormIsRecurring(false);
    setFormFrequency("weekly");
  };

  const completeTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          isCompleted: true,
          completedDate: new Date(),
        };
      }
      return t;
    });

    // create a new task instance if it's recurring
    if (task.isRecurring && task.recurrencePattern) {
      const nextDueDate = calculateNextDueDate(task.dueDate, task.recurrencePattern);
      
      // compare to find parent root for tracking
      const rootTaskId = task.parentTaskId || task.id;
      
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        dueDate: nextDueDate,
        isCompleted: false,
        completedDate: undefined,
        createdDate: new Date(),
        parentTaskId: rootTaskId, // link back to the original task
      };
      updatedTasks.push(newTask);
    }

    setTasks(updatedTasks);
  };

  const calculateNextDueDate = (
    currentDate: Date,
    pattern: Task["recurrencePattern"]
  ): Date => {
    const nextDate = new Date(currentDate);

    if (!pattern) return nextDate;

    switch (pattern.frequency) {
      case "daily":
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case "2-3 days":
        nextDate.setDate(nextDate.getDate() + 2);
        break;
      case "4-5 days":
        nextDate.setDate(nextDate.getDate() + 4);
        break;
      case "weekly":
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case "biweekly":
        nextDate.setDate(nextDate.getDate() + 14);
        break;
      case "monthly":
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
    }

    return nextDate;
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) {
      return "Today";
    } else if (compareDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else {
      const diffTime = compareDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0 && diffDays <= 7) {
        return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`;
      }
      
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  const isToday = (task: Task): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  };

  const sortedTasks = [...tasks].sort(
    (a, b) => a.dueDate.getTime() - b.dueDate.getTime()
  );

  const todayTasks = sortedTasks.filter((t) => !t.isCompleted && isToday(t));
  const upcomingTasks = sortedTasks.filter((t) => !t.isCompleted && !isToday(t));
  const completedTasks = sortedTasks.filter((t) => t.isCompleted);

  const activeTasks = [...todayTasks, ...upcomingTasks];

  const openEditModal = (task: Task) => {
    setEditingTaskId(task.id);
    setFormTitle(task.title);
    setFormPlantName(task.plantName || "");
    setFormDescription(task.description || "");
    setFormDueDate(new Date(task.dueDate));
    setFormIsRecurring(task.isRecurring);
    setFormFrequency(task.recurrencePattern?.frequency || "weekly");
    setShowAddModal(true);
  };

  const handleDeletePress = (taskId: string) => { 
    // do direct delete
    const newTasks = tasks.filter((t) => t.id !== taskId);
    console.log("new tasks length:", newTasks.length);
    setTasks(newTasks);
    
    // save to async
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks))
      .then(() => console.log("saved to storage"))
      .catch((err) => console.log(":( storage error:", err));
  };

  const renderTask = (task: Task) => (
    <View key={task.id} style={styles.taskCard}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => {
          console.log("checkbox pressed for task:", task.id);
          completeTask(task.id);
        }}
      >
        <View
          style={[
            styles.checkboxCircle,
            task.isCompleted && styles.checkboxChecked,
          ]}
        >
          {task.isCompleted && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => {
          console.log("task content pressed");
          openEditModal(task);
        }}
        activeOpacity={0.7}
      >
        <Text style={[typography.header, styles.taskTitle]}>{task.title}</Text>
        {task.plantName && (
          <Text style={[typography.body, styles.plantName]}>
          {task.plantName}
          </Text>
        )}
        {task.description && (
          <Text style={[typography.body, styles.description]}>
            {task.description}
          </Text>
        )}
        <View style={styles.taskMeta}>
          <Text style={styles.dueDate}>{formatDate(task.dueDate)}</Text>
          {task.isRecurring && (
            <Text style={styles.recurringLabel}>
              🔄 {task.recurrencePattern?.frequency}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.deleteButton}>
        <TouchableOpacity
          onPress={() => handleDeletePress(task.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Tasks" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[typography.header, styles.emptyHeader]}>
              No tasks yet
            </Text>
            <Text style={[typography.body, styles.emptyText]}>
              Tap the + button to add your first plant care task
            </Text>
          </View>
        ) : (
          <>
            {todayTasks.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Today</Text>
                {todayTasks.map(renderTask)}
              </View>
            )}

            {upcomingTasks.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {todayTasks.length > 0 ? "Upcoming" : "Tasks"}
                </Text>
                {upcomingTasks.map(renderTask)}
              </View>
            )}

            {completedTasks.length > 0 && (
              <View style={styles.section}>
                <TouchableOpacity
                  onPress={() => setShowCompletedTasks(!showCompletedTasks)}
                  style={styles.completedHeader}
                >
                  <Text style={styles.sectionTitle}>
                    Completed ({completedTasks.length})
                  </Text>
                  <Text style={styles.toggleIcon}> 
                    {showCompletedTasks ? "▼" : "▶"} 
                  </Text>
                  
                </TouchableOpacity>
                {showCompletedTasks && completedTasks.map(renderTask)}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* floating action button (+) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditingTaskId(null);
          resetForm();
          setShowAddModal(true);
        }}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Add/Edit Task Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setShowAddModal(false);
          setEditingTaskId(null);
          resetForm();
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                resetForm();
                setShowAddModal(false);
                setEditingTaskId(null);
              }}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[typography.header, styles.modalHeaderTitle]}>
              {editingTaskId ? "Edit Task" : "Add Task"}
            </Text>
            <TouchableOpacity onPress={addTask}>
              <Text style={styles.modalSaveText}>
                {editingTaskId ? "Update" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView 
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalScrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <TextInput
                style={styles.input}
                placeholder="Task title *"
                value={formTitle}
                onChangeText={setFormTitle}
                placeholderTextColor={colors.textSecondary }
                autoFocus={true}
              />

              <TextInput
                style={styles.input}
                placeholder="Plant name"
                value={formPlantName}
                onChangeText={setFormPlantName}
                placeholderTextColor={colors.textSecondary}
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description (optional)"
                value={formDescription}
                onChangeText={setFormDescription}
                multiline
                numberOfLines={3}
                placeholderTextColor={colors.textSecondary }
              />

              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={typography.body}>
                  Due Date: {formDueDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={formDueDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowDatePicker(Platform.OS === "ios");
                    if (date) setFormDueDate(date);
                  }}
                />
              )}

              <View style={styles.switchRow}>
                <Text style={typography.body}>Recurring</Text>
                <Switch
                  value={formIsRecurring}
                  onValueChange={setFormIsRecurring}
                  trackColor={{ false: "#ccc", true: colors.textSecondary }}
                  thumbColor={formIsRecurring ? "#fff" : "#f4f3f4"}
                />
              </View>

              {formIsRecurring && (
                <View style={styles.recurrenceContainer}>
                  <Text style={styles.label}>Frequency:</Text>
                  <View style={styles.frequencyButtons}>
                    {(["daily", "2-3 days", "4-5 days", "weekly", "biweekly", "monthly"] as const).map(
                      (freq) => (
                        <TouchableOpacity
                          key={freq}
                          style={[
                            styles.frequencyButton,
                            formFrequency === freq && styles.frequencyButtonActive,
                          ]}
                          onPress={() => setFormFrequency(freq)}
                        >
                          <Text
                            style={[
                              styles.frequencyButtonText,
                              formFrequency === freq &&
                                styles.frequencyButtonTextActive,
                            ]}
                          >
                            {freq}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                </View>
              )}

              {/* add padding at bottom for keyboard space on mobile */}
              <View style={{ height: 100 }} />
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingHorizontal: 30,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyHeader: {
    marginBottom: 10,
  },
  emptyText: {
    textAlign: "center",
    color: colors.textSecondary || "#666",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: colors.textPrimary || "#000",
  },
  completedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  toggleIcon: {
    fontSize: 16,
    color: colors.textSecondary || "#666",
  },
  taskCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkbox: {
    marginRight: 12,
    justifyContent: "center",
  },
  checkboxCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.backgroundDark,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.backgroundDark,
    borderColor: colors.backgroundDark,
  },
  checkmark: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  plantName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  dueDate: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  recurringLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  deleteButton: {
    justifyContent: "center",
    paddingLeft: 8,
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
  },
  deleteIcon: {
    fontSize: 24,
  },
  fab: { // the big plus button
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.backgroundDark,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.modal, // task modal is white for readability
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalCancelText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  modalSaveText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: colors.textPrimary,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  recurrenceContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
    color: colors.textPrimary || "#000",
  },
  frequencyButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  frequencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  frequencyButtonActive: {
    backgroundColor: colors.textSecondary,
    borderColor: colors.textSecondary,
  },
  frequencyButtonText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  frequencyButtonTextActive: {
    color: "#fff", // for readability
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: colors.textSecondary,
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: colors.backgroundDark,
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  }
});