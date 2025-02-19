import { View, Text, FlatList, TouchableOpacity } from "react-native";
import styles from "../../styles/styles";
import books from "../../data/Book";
function BooksScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bookItem}
            onPress={() => navigation.navigate("BookDetails", { book: item })}
          >
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookAuthor}>{item.author}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
export default BooksScreen;
