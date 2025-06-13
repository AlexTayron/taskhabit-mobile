import { createDrawerNavigator } from '@react-navigation/drawer';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ProfileScreen from '../../components/pages/Profile';
import NotesScreen from '../../components/pages/Notes';
import LinksScreen from '../../components/pages/Links';
import ShoppingListsScreen from '../../components/pages/ShoppingLists';
import StudyPlanScreen from '../../components/pages/StudyPlan';
import SettingsScreen from '../../components/pages/Settings';

const Drawer = createDrawerNavigator();

function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
      }}
    >
      <Tabs.Screen
        name="Dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tarefas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkbox-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Hábitos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="repeat-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="todos"
        options={{
          title: 'TODOs',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer.Navigator initialRouteName="Tabs">
      <Drawer.Screen name="Tabs" component={TabsLayout} options={{ headerShown: false, title: 'Principal' }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
      <Drawer.Screen name="Notes" component={NotesScreen} options={{ title: 'Notas' }} />
      <Drawer.Screen name="Links" component={LinksScreen} options={{ title: 'Links' }} />
      <Drawer.Screen name="ShoppingLists" component={ShoppingListsScreen} options={{ title: 'Lista de Compras' }} />
      <Drawer.Screen name="StudyPlan" component={StudyPlanScreen} options={{ title: 'Plano de Estudos' }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configurações' }} />
    </Drawer.Navigator>
  );
}