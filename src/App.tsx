import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import BooksScreen from "./components/screens/BooksScreen";
import DetailBookScreen from "./components/screens/DetailBookScreen";
import SettingsScreen from "./components/screens/SettingsScreen";
import AdvancedSettingsScreen from "./components/screens/AdvancedSettingsScreen";

//створення стеків
const Stack = createNativeStackNavigator();
const BooksStackScreens = () => (
  <Stack.Navigator>
    <Stack.Screen name="Books" component={BooksScreen} />
    <Stack.Screen name="BookDetails" component={DetailBookScreen} />
  </Stack.Navigator>
);

const SettingsStackScreens = () => (
  <Stack.Navigator>
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="AdvancedSettings" component={AdvancedSettingsScreen} />
  </Stack.Navigator>
);

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let icon;
            if (route.name === "Books") {
              icon = <MaterialIcons name="book" size={size} color={color} />;
            } else if (route.name === "Settings") {
              icon = <FontAwesome name="gears" size={size} color={color} />;
            }
            return icon;
          },
          tabBarActiveTintColor: "green",
          tabBarInactiveTintColor: "lightblue",
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Books"
          options={{ title: "Книги" }}
          component={BooksStackScreens}
        />
        <Tab.Screen
          name="Settings"
          options={{ title: "Налаштування" }}
          component={SettingsStackScreens}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
