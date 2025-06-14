import React from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, Image } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../../styles/_drawer.styles';

export default function CustomDrawer(props: any) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
        <Text style={styles.name}>Alex Tayron 2</Text>
        <Text style={styles.email}>alextayron@gmail.com</Text>
      </View>

      <View style={styles.menu}>
        <DrawerItem label="Dashboard" icon={() => <Ionicons name="grid-outline" size={20} />} onPress={() => props.navigation.navigate('Dashboard')} />
        <DrawerItem label="Appointment" icon={() => <Ionicons name="checkmark-done-outline" size={20} />} onPress={() => props.navigation.navigate('Appointment')} />
        <DrawerItem label="Hábitos" icon={() => <Ionicons name="repeat-outline" size={20} />} onPress={() => props.navigation.navigate('Habitos')} />
        <DrawerItem label="Notas" icon={() => <Feather name="file-text" size={20} />} onPress={() => props.navigation.navigate('Notas')} />
        <DrawerItem label="TO-DOs" icon={() => <Ionicons name="list-outline" size={20} />} onPress={() => props.navigation.navigate('Todos')} />
        <DrawerItem label="Compras" icon={() => <Feather name="shopping-cart" size={20} />} onPress={() => props.navigation.navigate('Compras')} />
        <DrawerItem label="Estudos" icon={() => <Ionicons name="book-outline" size={20} />} onPress={() => props.navigation.navigate('Estudos')} />
        <DrawerItem label="Links" icon={() => <Feather name="link" size={20} />} onPress={() => props.navigation.navigate('Links')} />
        <DrawerItem label="Configurações" icon={() => <Ionicons name="settings-outline" size={20} />} onPress={() => props.navigation.navigate('Configuracoes')} />
        <DrawerItem label="Tema Claro" icon={() => <Ionicons name="sunny-outline" size={20} />} onPress={() => {}} />
      </View>

      <View style={styles.logout}>
        <DrawerItem label="Logout" icon={() => <MaterialIcons name="logout" size={20} color="red" />} labelStyle={{ color: 'red' }} onPress={() => {}} />
      </View>
    </DrawerContentScrollView>
  );
}
