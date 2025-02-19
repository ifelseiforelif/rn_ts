import { View, Text, Button } from "react-native";
import styles from "../../styles/styles";
function SettingsScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Button
        title="Детальні налаштування"
        onPress={() => navigation.navigate("AdvancedSettings")}
      />
    </View>
  );
}
export default SettingsScreen;
