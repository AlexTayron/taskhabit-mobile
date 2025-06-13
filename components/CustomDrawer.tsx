import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

export default function CustomDrawer(props: any) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, backgroundColor: '#1A1A1A' }}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
        <Text style={styles.name}>Alex Tayron</Text>
        <Text style={styles.email}>alextayron@gmail.com</Text>
      </View>

      <View style={styles.menu}>
        <DrawerItem
          label="Dashboard"
          icon={() => <Ionicons name="grid-outline" size={20} color="#fff" />}
          labelStyle={styles.drawerLabel}
          onPress={() => props.navigation.navigate('Dashboard')} // Navega diretamente para a tela Dashboard
        />
        <DrawerItem
          label="Tarefas"
          icon={() => <Ionicons name="checkmark-done-outline" size={20} color="#fff" />}
          labelStyle={styles.drawerLabel}
          onPress={() => props.navigation.navigate('Tarefas')} // Navega diretamente para a tela Tarefas
        />
        <DrawerItem
          label="Hábitos"
          icon={() => <Ionicons name="repeat-outline" size={20} color="#fff" />}
          labelStyle={styles.drawerLabel}
          onPress={() => props.navigation.navigate('Habits')} // Navega diretamente para a tela Habits
        />
        <DrawerItem
          label="Notas"
          icon={() => <Feather name="file-text" size={20} color="#fff" />}
          labelStyle={styles.drawerLabel}
          onPress={() => props.navigation.navigate('Notes')} // Navega diretamente para a tela Notes
        />
        <DrawerItem
          label="TO-DOs"
          icon={() => <Ionicons name="list-outline" size={20} color="#fff" />}
          labelStyle={styles.drawerLabel}
          onPress={() => props.navigation.navigate('Todos')} // Navega diretamente para a tela Todos
        />
        <DrawerItem
          label="Compras"
          icon={() => <Feather name="shopping-cart" size={20} color="#fff" />}
          labelStyle={styles.drawerLabel}
          onPress={() => props.navigation.navigate('Shop')} // Navega diretamente para a tela Shop
        />
        <DrawerItem
          label="Estudos"
          icon={() => <Ionicons name="book-outline" size={20} color="#fff" />}
          labelStyle={styles.drawerLabel}
          onPress={() => props.navigation.navigate('Study')} // Navega diretamente para a tela Study
        />
        <DrawerItem
          label="Links"
          icon={() => <Feather name="link" size={20} color="#fff" />}
          labelStyle={styles.drawerLabel}
          onPress={() => props.navigation.navigate('Links')} // Navega diretamente para a tela Links
        />
        <DrawerItem
          label="Configurações"
          icon={() => <Ionicons name="settings-outline" size={20} color="#fff" />}
          labelStyle={styles.drawerLabel}
          onPress={() => props.navigation.navigate('Settings')} // Navega diretamente para a tela Settings
        />
        <DrawerItem
          label="Tema Claro"
          icon={() => <Ionicons name="sunny-outline" size={20} color="#fff" />}
          labelStyle={styles.drawerLabel}
          onPress={() => {}}
        />
      </View>

      <View style={styles.logoutContainer}>
        <DrawerItem
          label="Logout"
          icon={() => <MaterialIcons name="logout" size={20} color="red" />}
          labelStyle={{ color: 'red' }}
          onPress={() => {}}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  email: {
    color: '#aaa',
    fontSize: 14,
  },
  menu: {
    marginTop: 10,
  },
  drawerLabel: {
    color: '#fff',
    fontWeight: 'normal',
  },
  logoutContainer: {
    marginTop: 'auto',
    paddingHorizontal: 10,
  },
});