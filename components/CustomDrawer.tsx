// components/CustomDrawer.tsx
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

export default function CustomDrawer(props: any) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
        <Text style={styles.name}>Alex Tayron</Text>
        <Text style={styles.email}>alextayron@gmail.com</Text>
      </View>

      <View style={styles.menu}>
        <DrawerItem label="Dashboard" icon={() => <Ionicons name="grid-outline" size={20} />} onPress={() => props.navigation.navigate('(tabs)')} />
        <DrawerItem label="Task" onPress={() => props.navigation.navigate('(tabs)', { screen: 'tasks' })} />
        <DrawerItem label="Habits" onPress={() => props.navigation.navigate('(tabs)', { screen: 'habits' })} />
        <DrawerItem label="Link" onPress={() => props.navigation.navigate('(tabs)', { screen: 'link' })} />
        <DrawerItem label="Notes" onPress={() => props.navigation.navigate('(tabs)', { screen: 'notes' })} />
        <DrawerItem label="Settings" onPress={() => props.navigation.navigate('(tabs)', { screen: 'settings' })} />
        <DrawerItem label="Shop" onPress={() => props.navigation.navigate('(tabs)', { screen: 'shop' })} />
        <DrawerItem label="Study" onPress={() => props.navigation.navigate('(tabs)', { screen: 'study' })} />
        <DrawerItem label="Todo" onPress={() => props.navigation.navigate('(tabs)', { screen: 'todos' })} />
        <DrawerItem label="Tema Claro" icon={() => <Ionicons name="sunny-outline" size={20} />} onPress={() => {}} />
      </View>

      <View style={{ marginTop: 'auto', paddingHorizontal: 10 }}>
        <DrawerItem label="Logout" icon={() => <MaterialIcons name="logout" size={20} color="red" />} labelStyle={{ color: 'red' }} onPress={() => {}} />
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
});
