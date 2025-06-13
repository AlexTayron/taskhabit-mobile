import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '@/components/CustomDrawer'; // Importação do CustomDrawer de components/CustomDrawer.tsx

// Importe suas telas que agora estão na raiz do diretório 'app/'
import HomeScreen from './home';
import ExploreScreen from './explore';
import HabitsScreen from './habits';
import NotesScreen from './notes';
import TodosScreen from './todos';
import ShopScreen from './shop';
import StudyScreen from './study';
import LinksScreen from './links';
import SettingsScreen from './settings';
import TaskScreen from './tasks'; // Importa a tela tasks.tsx de app/tasks.tsx
import DashboardScreen from './dashboard'; // Importa a nova tela dashboard.tsx

// Mantenha esta importação se app/src/Tasks/index.tsx ainda for a sua tela "Tarefas" principal
import TarefasScreen from './src/Tasks';

const Drawer = createDrawerNavigator();

export default function Layout() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* Rotas do Drawer */}
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Drawer.Screen
        name="Tarefas"
        component={TarefasScreen} // Usando TarefasScreen de app/src/Tasks/index.tsx
        options={{ title: 'Tarefas' }}
      />
      <Drawer.Screen
        name="Habits"
        component={HabitsScreen}
        options={{ title: 'Hábitos' }}
      />
      <Drawer.Screen
        name="Notes"
        component={NotesScreen}
        options={{ title: 'Notas' }}
      />
      <Drawer.Screen
        name="Todos"
        component={TodosScreen}
        options={{ title: 'TO-DOs' }}
      />
      <Drawer.Screen
        name="Shop"
        component={ShopScreen}
        options={{ title: 'Compras' }}
      />
      <Drawer.Screen
        name="Study"
        component={StudyScreen}
        options={{ title: 'Estudos' }}
      />
      <Drawer.Screen
        name="Links"
        component={LinksScreen}
        options={{ title: 'Links' }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Configurações' }}
      />
    </Drawer.Navigator>
  );
}