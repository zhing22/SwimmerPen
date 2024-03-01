import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import HomeScreen from "./screens/HomeScreen";
import Annotation from "./screens/Annotation";
import Statistics from "./screens/Statistics";
import History from "./screens/History";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <SafeAreaProvider>
      {/* <StatusBar style="light" /> */}
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Annotation"
            component={Annotation}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Statistics"
            component={Statistics}
          />
          <Stack.Screen options={{
            title: 'Statistics History'
          }} name="History" component={History} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
