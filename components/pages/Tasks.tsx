import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Loader2, Pencil, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { sanitizeTextInput } from '../utils/security';
import { supabase } from '@/integrations/supabase/client';
import type { Database, TaskStatus } from '@/integrations/supabase/types';
import { cn } from '@/lib/utils';

type Task = Database['public']['Tables']['tasks']['Row'];

// Valores permitidos para o status
const STATUS_VALUES: Record<string, TaskStatus> = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
} as const;

// Mapeamento para exibição em português
const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pendente',
  in_progress: 'Em andamento',
  completed: 'Concluída'
} as const;

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'média' as const,
    status: STATUS_VALUES.PENDING as TaskStatus
  });

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true, nullsFirst: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as tarefas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !user) return;

    const sanitizedTitle = sanitizeTextInput(newTask.title, 200);
    const sanitizedDescription = sanitizeTextInput(newTask.description, 1000);
    
    // Formata a data para incluir o horário final do dia
    const formattedDueDate = newTask.due_date 
      ? new Date(newTask.due_date + 'T23:59:59').toISOString()
      : null;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: sanitizedTitle,
          description: sanitizedDescription,
          due_date: formattedDueDate,
          priority: newTask.priority,
          status: newTask.status
        })
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => {
        const newTasks = [...prev, data];
        return newTasks.sort((a, b) => {
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        });
      });
      setNewTask({ title: '', description: '', due_date: '', priority: 'média', status: STATUS_VALUES.PENDING });
      setIsOpen(false);
      
      toast({
        title: "Sucesso",
        description: "Tarefa adicionada com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a tarefa.",
        variant: "destructive",
      });
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, status } : task
      ));
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa.",
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Tarefa removida com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a tarefa.",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = async () => {
    if (!editingTask || !user) return;

    const sanitizedTitle = sanitizeTextInput(editingTask.title, 200);
    const sanitizedDescription = sanitizeTextInput(editingTask.description || '', 1000);

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: sanitizedTitle,
          description: sanitizedDescription,
          due_date: editingTask.due_date,
          priority: editingTask.priority
        })
        .eq('id', editingTask.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...editingTask }
          : task
      ));

      setIsEditDialogOpen(false);
      setEditingTask(null);
      
      toast({
        title: "Sucesso",
        description: "Tarefa atualizada com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa.",
        variant: "destructive",
      });
    }
  };

  // Organizar tarefas por status e data
  const organizedTasks = React.useMemo(() => {
    const sortByDate = (a: Task, b: Task) => {
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    };

    const pending = tasks.filter(task => task.status === STATUS_VALUES.PENDING).sort(sortByDate);
    const inProgress = tasks.filter(task => task.status === STATUS_VALUES.IN_PROGRESS).sort(sortByDate);
    const completed = tasks.filter(task => task.status === STATUS_VALUES.COMPLETED).sort(sortByDate);

    return [...pending, ...inProgress, ...completed];
  }, [tasks]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case STATUS_VALUES.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case STATUS_VALUES.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Função para formatar a data relativa
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Remove o horário para comparação apenas das datas
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return 'Vence hoje';
    } else if (date.getTime() === tomorrow.getTime()) {
      return 'Vence amanhã';
    } else {
      return `Vence dia: ${date.toLocaleDateString('pt-BR')}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Tarefas</h2>
          <p className="text-muted-foreground">Gerencie seus compromissos e agenda</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent className="mr-4 max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
              <DialogDescription>
                Crie um novo compromisso para sua agenda
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título da Tarefa</label>
                <Input
                  placeholder="Ex: Reunião com cliente"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  maxLength={200}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Data de Vencimento</label>
                <Input
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Prioridade</label>
                <Select 
                  value={newTask.priority} 
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="média">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  placeholder="Detalhes sobre a tarefa..."
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  maxLength={1000}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddTask} disabled={!newTask.title.trim()}>
                Adicionar Tarefa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {organizedTasks.map((task) => (
          <Card 
            key={task.id} 
            className={`hover:shadow-md transition-shadow duration-200 ${
              task.status === STATUS_VALUES.COMPLETED ? 'opacity-75' : ''
            }`}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className={`text-base sm:text-lg font-semibold mb-2 ${
                    task.status === STATUS_VALUES.COMPLETED ? 'line-through text-muted-foreground' : 'text-foreground'
                  }`}>
                    {task.title}
                  </h3>
                  <div className="flex flex-col gap-1 text-xs sm:text-sm text-muted-foreground mb-2">
                    {task.due_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{formatRelativeDate(task.due_date)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span>Prioridade: {task.priority}</span>
                    </div>
                  </div>
                  {task.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={task.status}
                    onValueChange={(value) => updateTaskStatus(task.id, value as TaskStatus)}
                  >
                    <SelectTrigger className={cn(
                      "h-8 sm:h-9 w-[130px] sm:w-[150px]",
                      getStatusColor(task.status)
                    )}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={STATUS_VALUES.PENDING}>Pendente</SelectItem>
                      <SelectItem value={STATUS_VALUES.IN_PROGRESS}>Em andamento</SelectItem>
                      <SelectItem value={STATUS_VALUES.COMPLETED}>Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 sm:h-9 w-8 sm:w-9">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setEditingTask(task);
                        setIsEditDialogOpen(true);
                      }}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tasks.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhuma tarefa cadastrada
            </h3>
            <p className="text-muted-foreground">
              Adicione sua primeira tarefa para começar a organizar sua agenda
            </p>
          </CardContent>
        </Card>
      )}

      {/* Diálogo de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="mr-4 max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Tarefa</DialogTitle>
            <DialogDescription>
              Modifique as informações da tarefa
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Título da Tarefa</label>
              <Input
                placeholder="Ex: Reunião com cliente"
                value={editingTask?.title || ''}
                onChange={(e) => setEditingTask(prev => prev ? { ...prev, title: e.target.value } : null)}
                maxLength={200}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Data de Vencimento</label>
              <Input
                type="date"
                value={editingTask?.due_date?.split('T')[0] || ''}
                onChange={(e) => setEditingTask(prev => prev ? { ...prev, due_date: e.target.value } : null)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Prioridade</label>
              <Select 
                value={editingTask?.priority || 'média'} 
                onValueChange={(value) => setEditingTask(prev => prev ? { ...prev, priority: value } : null)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="média">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                placeholder="Detalhes sobre a tarefa..."
                value={editingTask?.description || ''}
                onChange={(e) => setEditingTask(prev => prev ? { ...prev, description: e.target.value } : null)}
                maxLength={1000}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditingTask(null);
            }}>
              Cancelar
            </Button>
            <Button onClick={handleEditTask} disabled={!editingTask?.title.trim()}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
