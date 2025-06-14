import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    fontFamily: 'SpaceMono',
  },
  email: {
    color: '#aaa',
    fontSize: 14,
    fontFamily: 'SpaceMono',
  },
  menu: {
    marginTop: 10,
  },
  logout: {
    marginTop: 'auto',
    paddingHorizontal: 10,
  },
});
