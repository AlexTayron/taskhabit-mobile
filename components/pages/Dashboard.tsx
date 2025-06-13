import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext'; // Assuming this path is correct
import { supabase } from '../../lib/supabase'; // Assuming this path is correct
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For persistent storage

// You'll need to replace these with a React Native icon library like react-native-vector-icons
// For now, I'm using simple Text placeholders or omitting them.
// import { Calendar, CheckCircle, BookOpen, StickyNote, List } from 'lucide-react';
interface IconProps {
  size?: number;
  color?: string;
  className?: string; // For compatibility, though it will be ignored for RN styles
}

const CalendarIcon: React.FC<IconProps> = ({ size = 24, color = 'black' }) => <Text style={{ fontSize: size, color }}>🗓️</Text>;
const CheckCircleIcon: React.FC<IconProps> = ({ size = 24, color = 'black' }) => <Text style={{ fontSize: size, color }}>✅</Text>;
const BookOpenIcon: React.FC<IconProps> = ({ size = 24, color = 'black' }) => <Text style={{ fontSize: size, color }}>📖</Text>;
const StickyNoteIcon: React.FC<IconProps> = ({ size = 24, color = 'black' }) => <Text style={{ fontSize: size, color }}>📝</Text>;
const ListIcon: React.FC<IconProps> = ({ size = 24, color = 'black' }) => <Text style={{ fontSize: size, color }}>📋</Text>;


// Dummy types for Supabase if not directly available from a shared package
type TaskStatus = 'pending' | 'in_progress' | 'completed';

interface Stats {
  totalTasks: number;
  completedTasks: number;
  totalHabits: number;
  activeHabits: number;
  totalNotes: number;
  totalTodos: number;
}

interface DashboardSettings {
  showTasks: boolean;
  showHabits: boolean;
  showNotes: boolean;
  showTodos: boolean;
  showStudy: boolean;
  layout: 'compact' | 'comfortable';
}

interface Task {
  id: string;
  title: string;
  due_date: string | null;
  status: TaskStatus;
}

interface Habit {
  id: string;
  name: string;
  streak: number;
  frequency: string;
}

// Basic Card components for React Native
interface CardProps {
  children: React.ReactNode;
  style?: any; // For passing custom styles
}

const Card: React.FC<CardProps> = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const CardHeader: React.FC<CardProps> = ({ children, style }) => (
  <View style={[styles.cardHeader, style]}>{children}</View>
);

interface CardTitleProps {
  children: React.ReactNode;
  style?: any;
}
const CardTitle: React.FC<CardTitleProps> = ({ children, style }) => (
  <Text style={[styles.cardTitle, style]}>{children}</Text>
);

interface CardDescriptionProps {
  children: React.ReactNode;
  style?: any;
}
const CardDescription: React.FC<CardDescriptionProps> = ({ children, style }) => (
  <Text style={[styles.cardDescription, style]}>{children}</Text>
);

const CardContent: React.FC<CardProps> = ({ children, style }) => (
  <View style={[styles.cardContent, style]}>{children}</View>
);


const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [settings, setSettings] = useState<DashboardSettings>({
    showTasks: true,
    showHabits: true,
    showNotes: true,
    showTodos: true,
    showStudy: true,
    layout: 'comfortable'
  });

  useEffect(() => {
    if (profile?.dashboard_settings) {
      setSettings(profile.dashboard_settings as DashboardSettings);
    }
  }, [profile]);

  // Query para tarefas
  const { data: tasksData, isLoading: isLoadingTasks, error: tasksError, refetch: refetchTasks } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('id, title, due_date, status, created_at')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao carregar tarefas:', error.message);
          throw error;
        }
        return data || [];
      } catch (error) {
        console.error('Erro na query de tarefas:', error);
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
    retryDelay: 1000
  });

  // Query para hábitos
  const { data: habitsData, isLoading: isLoadingHabits, error: habitsError, refetch: refetchHabits } = useQuery({
    queryKey: ['habits', user?.id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('habits')
          .select('id, name, streak, frequency')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao carregar hábitos:', error.message);
          throw error;
        }
        return data || [];
      } catch (error) {
        console.error('Erro na query de hábitos:', error);
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: 1000
  });

  // Query para notas
  const { data: notesCount, isLoading: isLoadingNotes, error: notesError, refetch: refetchNotes } = useQuery({
    queryKey: ['notes-count', user?.id],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('notes')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user?.id);

        if (error) {
          console.error('Erro ao carregar notas:', error.message);
          throw error;
        }
        return count || 0;
      } catch (error) {
        console.error('Erro na query de notas:', error);
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: 1000
  });

  // Query para todos
  const { data: todosData, isLoading: isLoadingTodos, error: todosError, refetch: refetchTodos } = useQuery({
    queryKey: ['todos', user?.id],
    queryFn: async () => {
      try {
        const { data: lists, error: listsError } = await supabase
          .from('todo_lists')
          .select('id')
          .eq('user_id', user?.id);

        if (listsError) {
          console.error('Erro ao carregar listas:', listsError.message);
          throw listsError;
        }

        if (lists && lists.length > 0) {
          const { count, error } = await supabase
            .from('todo_items')
            .select('id', { count: 'exact', head: true })
            .in('list_id', lists.map(list => list.id));

          if (error) {
            console.error('Erro ao carregar todos:', error.message);
            throw error;
          }
          return count || 0;
        }
        return 0;
      } catch (error) {
        console.error('Erro na query de todos:', error);
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: 1000
  });

  const isLoading = isLoadingTasks || isLoadingHabits || isLoadingNotes || isLoadingTodos;
  const hasErrors = tasksError || habitsError || notesError || todosError;

  const stats: Stats = {
    totalTasks: tasksData?.length || 0,
    completedTasks: tasksData?.filter(task => task.status === 'completed').length || 0,
    totalHabits: habitsData?.length || 0,
    activeHabits: habitsData?.filter(habit => habit.streak > 0).length || 0,
    totalNotes: notesCount || 0,
    totalTodos: todosData || 0
  };

  const recentTasks = tasksData
    ?.filter(task => {
      // Incluir tarefas pendentes e em andamento
      if (task.status === 'completed') return false;

      // Se tiver data, verificar se é hoje ou futura
      if (task.due_date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const taskDate = new Date(task.due_date);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate >= today;
      }

      // Incluir tarefas sem data
      return true;
    })
    .sort((a, b) => {
      // Primeiro por status (pendentes primeiro)
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;

      // Depois por data (se tiver)
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      if (a.due_date) return -1;
      if (b.due_date) return 1;
      return 0;
    })
    .slice(0, 3) || [];

  const recentHabits = habitsData?.slice(0, 3) || [];

  const [error, setError] = useState<string | null>(null);

  // Function to get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Array of inspirational messages
  const inspirationalMessages = [
    "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    "Não espere por uma oportunidade perfeita. Pegue uma oportunidade comum e a torne perfeita.",
    "A persistência é o caminho do êxito.",
    "Grandes conquistas requerem grandes ambições.",
    "O futuro pertence àqueles que acreditam na beleza de seus sonhos.",
    "Seja você mesmo; todos os outros já foram tomados.",
    "A única maneira de fazer um excelente trabalho é amar o que você faz.",
    "Acredite que você pode e você já está no meio do caminho.",
    "Não deixe o medo de perder ser maior que a empolgação de ganhar.",
    "A disciplina é a ponte entre objetivos e conquistas.",
    "Cada dia é uma nova oportunidade para mudar sua vida.",
    "O que não nos desafia não nos transforma.",
    "Sonhe grande e ouse falhar.",
    "A vida começa no final da sua zona de conforto.",
    "Seja a mudança que você quer ver no mundo.",
    "A disciplina é o alicerce do sucesso.",
    "Tudo posso naquele que me fortalece. — Filipenses 4:13",
    "O autoconhecimento é a chave para o crescimento pessoal.",
    "Entrega o teu caminho ao Senhor, confia nele, e o mais Ele fará. — Salmos 37:5",
    "Invista em si mesmo; é o melhor investimento que existe.",
    "Deus não escolhe os capacitados, Ele capacita os escolhidos.",
    "O sucesso não é um destino, é um processo.",
    "O Senhor é meu pastor; nada me faltará. — Salmos 23:1",
    "Grandes mudanças começam com pequenas atitudes.",
    "A fé não torna as coisas fáceis, torna-as possíveis. — Lucas 1:37",
    "Acredite em si mesmo, mesmo quando ninguém mais acreditar.",
    "Não temas, porque Eu sou contigo; não te assombres, porque Eu sou o teu Deus. — Isaías 41:10",
    "A vitória pertence aos perseverantes.",
    "Se Deus é por nós, quem será contra nós? — Romanos 8:31",
    "Seja constante, mesmo quando não estiver motivado.",
    "A graça de Deus é suficiente para você.",
    "A sua evolução incomodará quem parou no tempo.",
    "Confie nos planos de Deus, mesmo que você ainda não os compreenda.",
    "Quem não se arrisca, nunca sai do lugar.",
    "Espere no Senhor. Seja forte! Coragem! Espere no Senhor. — Salmos 27:14",
    "O desenvolvimento pessoal exige esforço diário.",
    "O choro pode durar uma noite, mas a alegria vem pela manhã. — Salmos 30:5",
    "Colha conhecimento todos os dias e verá frutos amanhã.",
    "Quem se humilha será exaltado. — Mateus 23:12",
    "Você não precisa ser o melhor, apenas precisa ser melhor que ontem.",
    "Sede fortes e corajosos; não temais, nem vos atemorizeis. — Deuteronômio 31:6",
    "A excelência é fruto da prática, não do talento inato.",
    "Deus transforma o deserto em jardim e a tristeza em alegria.",
    "Resiliência: a habilidade de continuar quando tudo diz para parar.",
    "Aquietai-vos e sabei que Eu sou Deus. — Salmos 46:10",
    "Tenha metas claras e um plano definido.",
    "Porque para Deus nada é impossível. — Lucas 1:37",
    "O tempo é o recurso mais valioso; use-o com sabedoria.",
    "O Senhor luta por você; apenas fique quieto. — Êxodo 14:14",
    "Não há crescimento sem desconforto.",
    "Persevere na fé, mesmo quando tudo parecer impossível.",
    "Fracasso é uma oportunidade disfarçada de aprendizado.",
    "Deus nunca chega atrasado; Ele chega no tempo certo.",
    "Mantenha o foco no que você pode controlar.",
    "Tudo coopera para o bem daqueles que amam a Deus. — Romanos 8:28",
    "A vida que você quer está escondida atrás dos hábitos que você evita.",
    "Em tudo dai graças. — 1 Tessalonicenses 5:18",
    "Seja paciente: o progresso é invisível no começo.",
    "Andamos por fé, e não por vista. — 2 Coríntios 5:7",
    "Tenha coragem de começar, mesmo que ainda não esteja pronto.",
    "A oração é a chave da manhã e o ferrolho da noite.",
    "A consistência constrói resultados extraordinários.",
    "A sua identidade não está nos seus erros, mas em Cristo.",
    "As desculpas nunca construíram nada.",
    "Deus não te trouxe até aqui para te abandonar.",
    "A sua mentalidade determina a sua realidade.",
    "A maior vitória é confiar no propósito de Deus.",
    "Pense grande, comece pequeno, aja agora.",
    "A cruz não foi o fim, foi o começo de uma nova história.",
    "Quem quer resultados encontra meios; quem não quer, encontra desculpas.",
    "Deus tem pensamentos de paz e não de mal para você. — Jeremias 29:11",
    "A ação vence o medo.",
    "Eleva os meus olhos para os montes: de onde me virá o socorro? O meu socorro vem do Senhor. — Salmos 121:1-2",
    "Crescer dói, mas não crescer dói mais ainda.",
    "Não se preocupe com o amanhã; Deus já está lá.",
    "Não pare até se orgulhar.",
    "Deus é especialista em transformar cenários impossíveis.",
    "Foco, força e fé: a tríade do sucesso.",
    "Quando Deus é sua prioridade, tudo se alinha.",
    "Você é o único responsável pela sua evolução.",
    "Sua missão é plantar; Deus é quem faz crescer.",
    "Transforme adversidades em combustível para a sua vitória.",
    "Seja luz onde Deus te colocou.",
    "A diferença entre quem você é e quem quer ser está no que você faz diariamente.",
    "Deus não falha e nunca falhará.",
    "Pare de esperar por oportunidades, comece a criá-las.",
    "Onde termina a força humana, começa o poder de Deus.",
    "Hábito supera motivação.",
    "As promessas de Deus nunca falham.",
    "Sua jornada inspira quem nem te conhece.",
    "Confie no processo, Deus está no controle.",
    "Quem quer faz, quem não quer, justifica.",
    "Deus é refúgio e fortaleza, socorro bem presente na angústia. — Salmos 46:1",
    "Tudo o que você busca está fora da sua zona de conforto.",
    "Confie no processo: cada passo te aproxima do seu objetivo.",
    "Seja determinado como quem já venceu.",
    "Não permita que o medo decida o seu futuro.",
    "A consistência cria confiança e resultados.",
    "O sucesso é uma maratona, não uma corrida de 100 metros.",
    "Valorize cada pequeno progresso; ele constrói a grande vitória.",
    "Cada dia é uma oportunidade de se tornar melhor do que ontem.",
    "Só quem persiste vê o que os desistentes nunca verão.",
    "Sua mente pode ser sua maior aliada ou sua maior inimiga: escolha bem.",
    "Não existe momento perfeito: comece com o que você tem agora."
  ];

  // Function to get random inspirational message
  const getRandomMessage = async () => {
    const now = new Date();
    const currentHour = now.toISOString().slice(0, 13); // Pega a data até a hora (YYYY-MM-DDTHH)
    let savedData = null;
    try {
      const storedData = await AsyncStorage.getItem('hourlyMessage');
      if (storedData) {
        savedData = JSON.parse(storedData);
      }
    } catch (e) {
      console.error('Failed to load message from AsyncStorage', e);
    }

    if (savedData) {
      const { hour, message } = savedData;
      if (hour === currentHour) {
        return message;
      }
    }

    // Generate new message for this hour
    const randomIndex = Math.floor(Math.random() * inspirationalMessages.length);
    const currentMessage = inspirationalMessages[randomIndex];

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('hourlyMessage', JSON.stringify({
        hour: currentHour,
        message: currentMessage
      }));
    } catch (e) {
      console.error('Failed to save message to AsyncStorage', e);
    }

    return currentMessage;
  };

  const [currentInspirationalMessage, setCurrentInspirationalMessage] = useState<string>('');

  useEffect(() => {
    const fetchMessage = async () => {
      const message = await getRandomMessage();
      setCurrentInspirationalMessage(message);
    };
    fetchMessage();

    // Initial load for dashboard data (using refetch from react-query)
    if (user) {
      refetchTasks();
      refetchHabits();
      refetchNotes();
      refetchTodos();
    } else {
      setError('Erro ao carregar dados. Tente recarregar a página.');
    }
  }, [user]);


  const getTaskStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return styles.taskStatusCompleted;
      case 'in_progress':
        return styles.taskStatusInProgress;
      default:
        return styles.taskStatusTodo;
    }
  };

  const getTaskStatusText = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'in_progress':
        return 'Em andamento';
      default:
        return 'A fazer';
    }
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getHabitProgress = (habit: Habit) => {
    // Simple progress calculation based on streak
    const maxStreak = 30; // Assuming 30 days as max for percentage
    return Math.min((habit.streak / maxStreak) * 100, 100);
  };

  const statsConfig = [
    {
      title: 'Tarefas Hoje',
      value: recentTasks.length.toString(),
      description: `${stats.completedTasks} concluídas`,
      icon: CalendarIcon,
      color: '#3B82F6' // blue-500
    },
    {
      title: 'Hábitos Ativos',
      value: stats.totalHabits.toString(),
      description: `${stats.activeHabits} realizados hoje`,
      icon: BookOpenIcon,
      color: '#22C55E' // green-500
    },
    {
      title: 'Notas Criadas',
      value: stats.totalNotes.toString(),
      description: 'Total de notas',
      icon: StickyNoteIcon,
      color: '#F59E0B' // yellow-500
    },
    {
      title: 'TODOs Pendentes',
      value: stats.totalTodos.toString(),
      description: 'Itens não concluídos',
      icon: ListIcon,
      color: '#A855F7' // purple-500
    },
    {
      title: 'Estudar Hoje',
      value: '0', // Você pode adicionar a lógica para contar tarefas de estudo aqui
      description: 'Tarefas de estudo',
      icon: BookOpenIcon,
      color: '#6366F1' // indigo-500
    }
  ];

  // Filtrar statsConfig baseado nas configurações
  const filteredStatsConfig = statsConfig.filter(stat => {
    if (stat.title.includes('Tarefas')) return settings.showTasks;
    if (stat.title.includes('Hábitos')) return settings.showHabits;
    if (stat.title.includes('Notas')) return settings.showNotes;
    if (stat.title.includes('TODOs')) return settings.showTodos;
    if (stat.title.includes('Estudar')) return settings.showStudy;
    return true;
  });

  const handleReloadData = () => {
    refetchTasks();
    refetchHabits();
    refetchNotes();
    refetchTodos();
    setError(null); // Clear any previous errors
  };

  // Show error state with specific error messages
  if (hasErrors) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greetingText}>
            {getGreeting()}, {profile?.name?.split(' ')[0] || 'Usuário'}!
          </Text>
          <Text style={styles.inspirationalMessage}>
            "{currentInspirationalMessage}"
          </Text>
        </View>

        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Erro ao carregar dados</Text>
          <View style={styles.errorMessageList}>
            {tasksError && <Text style={styles.errorMessageItem}>• Erro ao carregar tarefas</Text>}
            {habitsError && <Text style={styles.errorMessageItem}>• Erro ao carregar hábitos</Text>}
            {notesError && <Text style={styles.errorMessageItem}>• Erro ao carregar notas</Text>}
            {todosError && <Text style={styles.errorMessageItem}>• Erro ao carregar todos</Text>}
          </View>
          <TouchableOpacity
            onPress={handleReloadData}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greetingText}>
            {getGreeting()}, {profile?.name?.split(' ')[0] || 'Usuário'}!
          </Text>
          <Text style={styles.inspirationalMessage}>
            "{currentInspirationalMessage}"
          </Text>
        </View>

        <View style={styles.dashboardSection}>
          <Text style={styles.dashboardTitle}>Dashboard</Text>
          <Text style={styles.mutedText}>Carregando suas atividades...</Text>
        </View>

        <View style={styles.statsGridLoading}>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} style={styles.cardLoading}>
              <CardHeader style={styles.cardHeaderLoading}>
                <View style={styles.loadingPlaceholderHalfWidth}></View>
                <View style={styles.loadingPlaceholderSmall}></View>
              </CardHeader>
              <CardContent>
                <View style={styles.loadingPlaceholderThirdWidth}></View>
                <View style={styles.loadingPlaceholderTwoThirdsWidth}></View>
              </CardContent>
            </Card>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={[
      styles.container,
      settings.layout === 'compact' ? styles.compactLayout : {}
    ]}>
      {/* Greeting and Inspirational Message */}
      <View style={styles.header}>
        <Text style={styles.greetingText}>
          {getGreeting()}, {profile?.name?.split(' ')[0] || 'Usuário'}!
        </Text>
        <Text style={styles.inspirationalMessage}>
          "{currentInspirationalMessage}"
        </Text>
      </View>

      <View style={styles.dashboardSection}>
        <Text style={styles.dashboardTitle}>Dashboard</Text>
        <Text style={styles.mutedText}>Visão geral das suas atividades</Text>
      </View>

      {/* Cards de estatísticas */}
      <View style={[
        styles.statsGrid,
        settings.layout === 'compact' ? styles.statsGridCompact : styles.statsGridComfortable
      ]}>
        {filteredStatsConfig.map((stat, index) => (
          <Card key={index} style={styles.statCard}>
            <CardHeader style={styles.statCardHeader}>
              <CardTitle style={styles.statCardTitle}>{stat.title}</CardTitle>
              <stat.icon size={20} color={stat.color} />
            </CardHeader>
            <CardContent style={styles.statCardContent}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statDescription}>
                {stat.description}
              </Text>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* Cards de Tarefas e Hábitos */}
      <View style={[
        styles.cardsGrid,
        settings.layout === 'compact' ? styles.cardsGridCompact : styles.cardsGridComfortable
      ]}>
        {/* Tarefas do Dia */}
        {settings.showTasks && (
          <Card style={styles.mainCard}>
            <CardHeader>
              <CardTitle>Tarefas de Hoje</CardTitle>
              <CardDescription>Seus compromissos para hoje</CardDescription>
            </CardHeader>
            <CardContent style={styles.mainCardContent}>
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <View key={task.id} style={styles.taskItem}>
                    <View style={styles.taskItemLeft}>
                      <Text style={styles.taskTitle}>{task.title}</Text>
                      <Text style={styles.taskTime}>
                        {task.due_date ? formatTime(task.due_date) : 'Sem horário definido'}
                      </Text>
                    </View>
                    <Text style={[styles.taskStatusBadge, getTaskStatusColor(task.status)]}>
                      {getTaskStatusText(task.status)}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <CalendarIcon size={50} color="#A0A0A0" />
                  <Text style={styles.emptyStateText}>Nenhuma tarefa para hoje</Text>
                </View>
              )}
            </CardContent>
          </Card>
        )}

        {/* Progresso dos Hábitos */}
        {settings.showHabits && (
          <Card style={styles.mainCard}>
            <CardHeader>
              <CardTitle>Progresso dos Hábitos</CardTitle>
              <CardDescription>Acompanhe seus hábitos diários</CardDescription>
            </CardHeader>
            <CardContent style={styles.mainCardContent}>
              {recentHabits.length > 0 ? (
                recentHabits.map((habit) => {
                  const progress = getHabitProgress(habit);
                  return (
                    <View key={habit.id} style={styles.habitItem}>
                      <View style={styles.habitTextContainer}>
                        <Text style={styles.habitName}>{habit.name}</Text>
                        <Text style={styles.habitStreak}>{habit.streak} dias</Text>
                      </View>
                      <View style={styles.progressBarBackground}>
                        <View
                          style={[styles.progressBarFill, { width: `${progress}%` }]}
                        />
                      </View>
                      <Text style={styles.habitFrequency}>
                        Frequência: {habit.frequency}
                      </Text>
                    </View>
                  );
                })
              ) : (
                <View style={styles.emptyState}>
                  <BookOpenIcon size={50} color="#A0A0A0" />
                  <Text style={styles.emptyStateText}>Nenhum hábito cadastrado</Text>
                </View>
              )}
            </CardContent>
          </Card>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80, // To account for potential bottom navigation or safety area
    backgroundColor: '#F8F8F8', // Equivalent to a light background color
    flexGrow: 1, // Allows content to grow within ScrollView
  },
  compactLayout: {
    maxWidth: 800, // Roughly equivalent to max-w-5xl
    alignSelf: 'center', // Centers the content if maxWidth is set
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A', // foreground
    textAlign: 'center',
    flexWrap: 'wrap', // Allows text to wrap
  },
  inspirationalMessage: {
    fontSize: 14,
    color: '#6B7280', // muted-foreground
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: '90%', // Limit width for better readability on small screens
  },
  dashboardSection: {
    marginBottom: 20,
  },
  dashboardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  mutedText: {
    fontSize: 14,
    color: '#6B7280',
  },
  // Card styles
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3, // For Android shadow
    overflow: 'hidden', // Ensures content stays within rounded corners
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  cardDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  cardContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 0, // Ensure no extra top padding
  },
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8, // gap in React Native needs to be simulated or done with margins
    marginBottom: 20,
  },
  statsGridCompact: {
    justifyContent: 'space-between',
  },
  statsGridComfortable: {
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    minWidth: '48%', // Approx two columns on small screens
    maxWidth: '48%',
    marginBottom: 8, // Simulate gap
  },
  statCardHeader: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statCardTitle: {
    fontSize: 12,
  },
  statCardContent: {
    paddingHorizontal: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  statDescription: {
    fontSize: 10,
    color: '#6B7280',
  },
  // Main Cards (Tasks & Habits)
  cardsGrid: {
    gap: 24, // gap in React Native needs to be simulated or done with margins
  },
  cardsGridCompact: {
    flexDirection: 'column', // Stack vertically in compact
  },
  cardsGridComfortable: {
    flexDirection: 'column', // Default to column layout, you can adjust for 2 columns on larger screens
  },
  mainCard: {
    marginBottom: 24,
  },
  mainCardContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  // Task specific styles
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#F3F4F6', // accent/50
    borderRadius: 8,
    marginBottom: 8,
  },
  taskItemLeft: {
    flex: 1,
    marginRight: 8,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  taskTime: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  taskStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999, // full rounded
    fontSize: 12,
    fontWeight: '500',
    overflow: 'hidden', // Needed for borderRadius to work with background color
  },
  taskStatusCompleted: {
    backgroundColor: '#D1FAE5', // green-100
    color: '#065F46', // green-800
  },
  taskStatusInProgress: {
    backgroundColor: '#FEF3C7', // yellow-100
    color: '#92400E', // yellow-800
  },
  taskStatusTodo: {
    backgroundColor: '#E5E7EB', // gray-100
    color: '#374151', // gray-800
  },
  // Habit specific styles
  habitItem: {
    marginBottom: 12,
  },
  habitTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  habitName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 8,
  },
  habitStreak: {
    fontSize: 13,
    color: '#6B7280',
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB', // secondary
    borderRadius: 9999,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1E40AF', // primary (blue-700, adjust as needed)
    borderRadius: 9999,
  },
  habitFrequency: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 8,
  },
  // Loading states
  cardLoading: {
    backgroundColor: '#E5E7EB', // gray-200 for pulse effect
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
  },
  cardHeaderLoading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  loadingPlaceholderHalfWidth: {
    height: 16,
    backgroundColor: '#D1D5DB', // gray-300
    borderRadius: 4,
    width: '50%',
  },
  loadingPlaceholderSmall: {
    height: 16,
    backgroundColor: '#D1D5DB',
    borderRadius: 4,
    width: 16, // A small square
  },
  loadingPlaceholderThirdWidth: {
    height: 24,
    backgroundColor: '#D1D5DB',
    borderRadius: 4,
    width: '30%',
    marginBottom: 8,
  },
  loadingPlaceholderTwoThirdsWidth: {
    height: 12,
    backgroundColor: '#D1D5DB',
    borderRadius: 4,
    width: '60%',
  },
  statsGridLoading: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  // Error state
  errorBox: {
    backgroundColor: '#FEE2E2', // destructive/10
    borderColor: '#FCA5A5', // destructive/20
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC2626', // destructive
    marginBottom: 8,
  },
  errorMessageList: {
    marginBottom: 12,
  },
  errorMessageItem: {
    fontSize: 14,
    color: '#B91C1C', // destructive/80
    marginBottom: 4,
  },
  retryButton: {
    backgroundColor: '#DC2626', // destructive
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: 'white', // destructive-foreground
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Dashboard;