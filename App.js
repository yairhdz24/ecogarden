import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StyleSheet } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

// Importar pantallas
// import SplashScreen from "./screens/SplashScreen"
// import MainScreen from "./screens/MainScreen"
// import ScannerScreen from "./screens/ScannerScreen"
// import ResultsScreen from "./screens/ResultsScreen"
// import HistoryScreen from "./screens/HistoryScreen"
// import MapScreen from "./screens/MapScreen"
// import GuideScreen from "./screens/GuideScreen"
// import TipsScreen from "./screens/TipsScreen"
// import SupabaseManager from "./screens/SupabaseManager"
// import SupabaseManager from "./screens/SupabaseManager"
import SupabaseDiagnostic from "./screens/SupabaseDiagnostic"
import SupabaseExplorer from "./screens/SupabaseExplorer"
import SupabaseManager from "./screens/SupabaseManager"

const Stack = createNativeStackNavigator()

function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {/* <Stack.Screen name="Splash" component={SplashScreen} /> */}
      <Stack.Screen name="Main" component={SupabaseManager} />
      {/* <Stack.Screen name="Main" component={MainScreen} /> */}
      {/* <Stack.Screen name="Scanner" component={ScannerScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Guide" component={GuideScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Tips" component={TipsScreen} /> */}
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: "none",
  },
})
