import { createDrawerNavigator } from '@react-navigation/drawer';
import { CustomDrawer } from '@/components/CustomDrawer';

const Drawer = createDrawerNavigator();

export default function Layout() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="(tabs)" component={() => null} />
    </Drawer.Navigator>
  );
}
