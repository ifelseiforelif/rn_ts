import { View, Text } from "react-native";
import styles from "../../styles/styles";
function DetailBookScreen({ route }: any) {
  const { book } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{book.title}</Text>
      <Text style={styles.bookAuthor}>Автор: {book.author}</Text>
      <Text style={styles.bookDescription}>{book.description}.</Text>
    </View>
  );
}
export default DetailBookScreen;
