import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import "react-native-get-random-values"; //Додаємо залежність для генерації випадкових значень
import { v4 as uuidv4 } from "uuid";

let db: SQLite.SQLiteDatabase | null = null;
interface IBook {
  id: string;
  title: string;
  author: string;
}
export default function App() {
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [books, setBooks] = useState<IBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);

  useEffect(() => {
    openDatabase();
  }, []);

  // Підключаємось до БД асінхронно
  const openDatabase = async () => {
    db = await SQLite.openDatabaseAsync("books.db");
    console.log("✅ База даних відкрита");
    createTable();
    fetchBooks();
  };

  // Створюємо таблицю
  const createTable = async () => {
    if (!db) return;
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL
      );
    `);
    console.log("✅ Таблиця створена");
  };

  // Отримаємо книги
  const fetchBooks = async () => {
    if (!db) return;
    const result = await db.getAllAsync<IBook>("SELECT * FROM books;");
    setBooks(result);
  };

  // Додаємо книгу
  const addBook = async () => {
    if (!db) {
      console.error("❌ Помилка при з'єднанні до БД!");
      return;
    }

    if (!title || !author) {
      Alert.alert("Помилка", "Введіть назву та автора");
      return;
    }

    const id = uuidv4();
    try {
      await db.runAsync(
        "INSERT INTO books (id, title, author) VALUES (?, ?, ?);",
        [id, title, author]
      );
      setTitle("");
      setAuthor("");
      await fetchBooks();
    } catch (error) {
      console.error("❌ Помилка при додаванні книги:", error);
    }
  };

  // Видаляємо книгу
  const deleteBook = async (id: string) => {
    if (!db) return;
    await db.runAsync("DELETE FROM books WHERE id = ?;", [id]);
    await fetchBooks();
  };

  // Оновлюємо книгу
  const updateBook = async () => {
    if (!db || !selectedBook) return;

    if (!title || !author) {
      Alert.alert("Помилка", "Введіть нову назву та автора");
      return;
    }

    try {
      await db.runAsync(
        "UPDATE books SET title = ?, author = ? WHERE id = ?;",
        [title, author, selectedBook.id]
      );
      setSelectedBook(null);
      setTitle("");
      setAuthor("");
      await fetchBooks();
    } catch (error) {
      console.error("❌ Помилка при редагуванні книги:", error);
    }
  };

  // Обираємо книгу для редагування
  const selectBookToEdit = (book: IBook) => {
    setSelectedBook(book);
    setTitle(book.title);
    setAuthor(book.author);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {selectedBook ? "Редагувати книгу" : "Додати книгу"}
      </Text>
      <TextInput
        placeholder="Назва"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Автор"
        value={author}
        onChangeText={setAuthor}
        style={styles.input}
      />
      <Button
        title={selectedBook ? "Оновити" : "Додати"}
        onPress={selectedBook ? updateBook : addBook}
      />

      <Text style={styles.heading}>📖 Перелік книг</Text>
      <FlatList
        data={books}
        ListEmptyComponent={<Text>Немає жодної книги</Text>}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <View>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookAuthor}>{item.author}</Text>
            </View>
            <View style={styles.buttons}>
              <Button title="✏️" onPress={() => selectBookToEdit(item)} />
              <Button title="🗑️" onPress={() => deleteBook(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

// Стилі
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5 },
  bookItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
  },
  bookTitle: { fontSize: 16, fontWeight: "bold" },
  bookAuthor: { color: "gray" },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 100,
  },
});
