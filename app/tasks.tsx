import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router'; // Importe useNavigation
import { Ionicons } from '@expo/vector-icons'; // Importe Ionicons para o ícone do menu


export default function TaskScreen() {
  const navigation = useNavigation(); // Hook para acessar o objeto de navegação

  return (
    <View style={styles.container}>
      {/* Botão de menu no cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tasks</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.text}>Tela de Tasks</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Remover justifyContent e alignItems do container principal para o conteúdo
    // backgroundColor: '#f0f0f0', // Opcional: Adicione uma cor de fundo para a tela
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40, // Para evitar a barra de status em Android/iOS
    backgroundColor: '#fff', // Cor de fundo do cabeçalho
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'flex-start', // Alinha o botão do menu à esquerda
    gap: 16, // Espaçamento entre o ícone e o título
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});