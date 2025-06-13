// filepath: app/AppNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from '../screens/Dashboard'; // ajuste o caminho conforme necessário
import OutraPagina from './OutraPagina'; // ajuste conforme suas páginas

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="OutraPagina" component={OutraPagina} />
      {/* Adicione outras páginas aqui */}
    </Drawer.Navigator>
  );
}