import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "../components/CustomDrawer"; // Importação do CustomDrawer de components/CustomDrawer.tsx
import { ThemeProvider } from "../components/ThemeContext";
import { MenuProvider } from "react-native-popup-menu";

import HabitsScreen from "./habits";
import NotesScreen from "./notes";
import TodosScreen from "./todos";
import ShopScreen from "./shop";
import StudyScreen from "./study";
import LinksScreen from "./links";
import SettingsScreen from "./settings"; // Importa a tela tasks.tsx de app/tasks.tsx
import DashboardScreen from "./dashboard"; // Importa a nova tela dashboard.tsx
import AppointmentScreen from "./appointment";

const Drawer = createDrawerNavigator();

export default function Layout() {
  return (
    <MenuProvider>
      <ThemeProvider>
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawer {...props} />}
          /*  screenOptions={{ headerShown: false }} */
        >
          {/* Rotas do Drawer */}
          <Drawer.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ title: "Dashboard" }}
          />
          <Drawer.Screen
            name="Appointment"
            component={AppointmentScreen}
            options={{ title: "Compromissos" }}
          />
          <Drawer.Screen
            name="Habits"
            component={HabitsScreen}
            options={{ title: "Hábitos" }}
          />
          <Drawer.Screen
            name="Notes"
            component={NotesScreen}
            options={{ title: "Notas" }}
          />
          <Drawer.Screen
            name="Todos"
            component={TodosScreen}
            options={{ title: "TO-DOs" }}
          />
          <Drawer.Screen
            name="Shop"
            component={ShopScreen}
            options={{ title: "Compras" }}
          />
          <Drawer.Screen
            name="Study"
            component={StudyScreen}
            options={{ title: "Estudos" }}
          />
          <Drawer.Screen
            name="Links"
            component={LinksScreen}
            options={{ title: "Links" }}
          />
          <Drawer.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: "Configurações" }}
          />
        </Drawer.Navigator>
      </ThemeProvider>
    </MenuProvider>
  );
}
