import { useThemeContext } from "../components/ThemeContext";

export function useColorScheme() {
  try {
    return useThemeContext().theme;
  } catch {
    // fallback para o hook nativo se não estiver no provider
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require("react-native").useColorScheme();
  }
}
