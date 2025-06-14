import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { IconSymbol } from "./ui/IconSymbol";
import { useFonts } from "expo-font";
import { useThemeContext } from "./ThemeContext";

export default function CustomDrawer(props: any) {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Inter: require("../assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
  });
  const { theme, toggleTheme } = useThemeContext();

  if (!fontsLoaded) return null;
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
        backgroundColor: theme === "dark" ? "#10131a" : "#fff",
        borderRightWidth: theme === "dark" ? 0 : 1,
        borderRightColor: theme === "dark" ? "transparent" : "#e5e7eb",
      }}
    >
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          gap: 10,
          padding: 24,
          paddingBottom: 12,
        }}
      >
        <Image
          source={
            theme === "dark"
              ? require("../assets/images/logo_dark.png")
              : require("../assets/images/logo_light.png")
          }
          style={{ width: 92, height: 72, resizeMode: "contain" }}
        />
      </View>
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: theme === "dark" ? "#232634" : "#e5e7eb",
          marginHorizontal: 24,
          marginBottom: 12,
        }}
      />
      <View
        style={{
          paddingHorizontal: 24,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
          style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }}
        />
        <View>
          <Text
            style={{
              color: theme === "dark" ? "#fff" : "#10131a",
              fontFamily: fontsLoaded ? "Inter" : "System",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Alex Tayron
          </Text>
          <Text
            style={{
              color: theme === "dark" ? "#aaa" : "#6b7280",
              fontFamily: fontsLoaded ? "Inter" : "System",
              fontSize: 14,
            }}
          >
            alextayron@gmail.com
          </Text>
        </View>
      </View>
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: theme === "dark" ? "#232634" : "#e5e7eb",
          marginHorizontal: 24,
          marginBottom: 8,
          marginTop: 4,
        }}
      />
      <View style={{ flex: 1, paddingHorizontal: 12, marginTop: 8 }}>
        <DrawerItem
          label="Painel"
          icon={() => (
            <Ionicons
              name="grid-outline"
              size={20}
              color={theme === "dark" ? "#fff" : "#10131a"}
            />
          )}
          labelStyle={{
            color: theme === "dark" ? "#fff" : "#10131a",
            fontFamily: fontsLoaded ? "Inter" : "System",
            fontWeight: "500",
            fontSize: 15,
          }}
          focused={props.state?.index === 0}
          style={
            props.state?.index === 0
              ? {
                  backgroundColor: theme === "dark" ? "#232634" : "#10131a",
                  borderRadius: 12,
                }
              : {}
          }
          activeTintColor={theme === "dark" ? "#fff" : "#fff"}
          inactiveTintColor={theme === "dark" ? "#fff" : "#10131a"}
          activeBackgroundColor={theme === "dark" ? "#232634" : "#10131a"}
          onPress={() => props.navigation.navigate("Dashboard")}
        />
        <DrawerItem
          label="Tarefas"
          icon={() => (
            <Ionicons
              name="checkmark-done-outline"
              size={20}
              color={theme === "dark" ? "#fff" : "#10131a"}
            />
          )}
          labelStyle={{
            color: theme === "dark" ? "#fff" : "#10131a",
            fontFamily: fontsLoaded ? "Inter" : "System",
            fontWeight: "500",
            fontSize: 15,
          }}
          focused={props.state?.index === 1}
          style={
            props.state?.index === 1
              ? {
                  backgroundColor: theme === "dark" ? "#232634" : "#f5f6fa",
                  borderRadius: 12,
                }
              : {}
          }
          onPress={() => props.navigation.navigate("Appointment")}
        />
        <DrawerItem
          label="Hábitos"
          icon={() => (
            <Ionicons
              name="repeat-outline"
              size={20}
              color={theme === "dark" ? "#fff" : "#10131a"}
            />
          )}
          labelStyle={{
            color: theme === "dark" ? "#fff" : "#10131a",
            fontFamily: fontsLoaded ? "Inter" : "System",
            fontWeight: "500",
            fontSize: 15,
          }}
          focused={props.state?.index === 2}
          style={
            props.state?.index === 2
              ? {
                  backgroundColor: theme === "dark" ? "#232634" : "#f5f6fa",
                  borderRadius: 12,
                }
              : {}
          }
          onPress={() => props.navigation.navigate("Habits")}
        />
        <DrawerItem
          label="Notas"
          icon={() => (
            <Feather
              name="file-text"
              size={20}
              color={theme === "dark" ? "#fff" : "#10131a"}
            />
          )}
          labelStyle={{
            color: theme === "dark" ? "#fff" : "#10131a",
            fontFamily: fontsLoaded ? "Inter" : "System",
            fontWeight: "500",
            fontSize: 15,
          }}
          focused={props.state?.index === 3}
          style={
            props.state?.index === 3
              ? {
                  backgroundColor: theme === "dark" ? "#232634" : "#f5f6fa",
                  borderRadius: 12,
                }
              : {}
          }
          onPress={() => props.navigation.navigate("Notes")}
        />
        <DrawerItem
          label="Tarefas"
          icon={() => (
            <Ionicons
              name="list-outline"
              size={20}
              color={theme === "dark" ? "#fff" : "#10131a"}
            />
          )}
          labelStyle={{
            color: theme === "dark" ? "#fff" : "#10131a",
            fontFamily: fontsLoaded ? "Inter" : "System",
            fontWeight: "500",
            fontSize: 15,
          }}
          focused={props.state?.index === 4}
          style={
            props.state?.index === 4
              ? {
                  backgroundColor: theme === "dark" ? "#232634" : "#f5f6fa",
                  borderRadius: 12,
                }
              : {}
          }
          onPress={() => props.navigation.navigate("Todos")}
        />
        <DrawerItem
          label="Compras"
          icon={() => (
            <Feather
              name="shopping-cart"
              size={20}
              color={theme === "dark" ? "#fff" : "#10131a"}
            />
          )}
          labelStyle={{
            color: theme === "dark" ? "#fff" : "#10131a",
            fontFamily: fontsLoaded ? "Inter" : "System",
            fontWeight: "500",
            fontSize: 15,
          }}
          focused={props.state?.index === 5}
          style={
            props.state?.index === 5
              ? {
                  backgroundColor: theme === "dark" ? "#232634" : "#f5f6fa",
                  borderRadius: 12,
                }
              : {}
          }
          onPress={() => props.navigation.navigate("Shop")}
        />
        <DrawerItem
          label="Estudos"
          icon={() => (
            <Ionicons
              name="book-outline"
              size={20}
              color={theme === "dark" ? "#fff" : "#10131a"}
            />
          )}
          labelStyle={{
            color: theme === "dark" ? "#fff" : "#10131a",
            fontFamily: fontsLoaded ? "Inter" : "System",
            fontWeight: "500",
            fontSize: 15,
          }}
          focused={props.state?.index === 6}
          style={
            props.state?.index === 6
              ? {
                  backgroundColor: theme === "dark" ? "#232634" : "#f5f6fa",
                  borderRadius: 12,
                }
              : {}
          }
          onPress={() => props.navigation.navigate("Study")}
        />
        <DrawerItem
          label="Ligações"
          icon={() => (
            <Feather
              name="link"
              size={20}
              color={theme === "dark" ? "#fff" : "#10131a"}
            />
          )}
          labelStyle={{
            color: theme === "dark" ? "#fff" : "#10131a",
            fontFamily: fontsLoaded ? "Inter" : "System",
            fontWeight: "500",
            fontSize: 15,
          }}
          focused={props.state?.index === 7}
          style={
            props.state?.index === 7
              ? {
                  backgroundColor: theme === "dark" ? "#232634" : "#f5f6fa",
                  borderRadius: 12,
                }
              : {}
          }
          onPress={() => props.navigation.navigate("Links")}
        />
        <DrawerItem
          label="Configurações"
          icon={() => (
            <Ionicons
              name="settings-outline"
              size={20}
              color={theme === "dark" ? "#fff" : "#10131a"}
            />
          )}
          labelStyle={{
            color: theme === "dark" ? "#fff" : "#10131a",
            fontFamily: fontsLoaded ? "Inter" : "System",
            fontWeight: "500",
            fontSize: 15,
          }}
          focused={props.state?.index === 8}
          style={
            props.state?.index === 8
              ? {
                  backgroundColor: theme === "dark" ? "#232634" : "#f5f6fa",
                  borderRadius: 12,
                }
              : {}
          }
          onPress={() => props.navigation.navigate("Settings")}
        />
        <DrawerItem
          label={theme === "dark" ? "Tema Claro" : "Tema Escuro"}
          icon={() => (
            <Ionicons
              name={theme === "dark" ? "moon-outline" : "sunny-outline"}
              size={20}
              color={theme === "dark" ? "#fff" : "#10131a"}
            />
          )}
          labelStyle={{
            color: theme === "dark" ? "#fff" : "#10131a",
            fontFamily: fontsLoaded ? "Inter" : "System",
            fontWeight: "500",
            fontSize: 15,
          }}
          onPress={toggleTheme}
        />
      </View>
      <View
        style={{
          marginTop: "auto",
          borderTopWidth: 1,
          borderTopColor: theme === "dark" ? "#232634" : "#e5e7eb",
          paddingHorizontal: 24,
          paddingVertical: 12,
        }}
      >
        <DrawerItem
          label="Sair"
          icon={() => <MaterialIcons name="logout" size={20} color="red" />}
          labelStyle={{
            color: "red",
            fontFamily: fontsLoaded ? "Inter" : "System",
            fontWeight: "500",
            fontSize: 15,
          }}
          onPress={() => {}}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    padding: 20,
    borderBottomWidth: 0,
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  name: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "SpaceMono",
  },
  email: {
    color: "#aaa",
    fontSize: 14,
    fontFamily: "SpaceMono",
  },
  menu: {
    marginTop: 10,
    gap: 0,
    paddingVertical: 0,
  },
  drawerLabel: {
    color: "#fff",
    fontWeight: "normal",
    fontFamily: "SpaceMono",
    fontSize: 15,
    marginVertical: -6,
  },
  logoutContainer: {
    marginTop: "auto",
    paddingHorizontal: 10,
  },
});
