import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome"; // icons

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="About" component={AboutScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [books, setBooks] = useState<{ title: string; author: string }[]>([]);
  const [newBook, setNewBook] = useState<{ title: string; author: string }>({
    title: "",
    author: "",
  });

  useEffect(() => {
    const loadBooks = async () => {
      const storedBooks = await AsyncStorage.getItem("books");
      if (storedBooks) {
        setBooks(JSON.parse(storedBooks));
      }
    };
    loadBooks();
  }, []);

  const handleLogin = async () => {
    if (username === "admin" && password === "123") {
      setIsLoggedIn(true);
      await AsyncStorage.setItem("isLoggedIn", "true");
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.removeItem("isLoggedIn");
  };

  const handleAddBook = async () => {
    if (newBook.title && newBook.author) {
      const updatedBooks = [...books, newBook];
      setBooks(updatedBooks);
      await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
      setNewBook({ title: "", author: "" });
    }
  };

  const handleDeleteBook = async (book: { title: string; author: string }) => {
    const updatedBooks = books.filter((b) => b !== book);
    setBooks(updatedBooks);
    await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", padding: 20 }}>
        <Text>Login</Text>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={{ borderBottomWidth: 1, marginBottom: 10 }}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{ borderBottomWidth: 1, marginBottom: 20 }}
        />
        <Button title="Login" onPress={handleLogin} />
      </SafeAreaView>
    );
  }

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Books"
        options={{
          tabBarIcon: () => <Icon name="book" size={20} />,
        }}
      >
        {() => (
          <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <Text>Book List</Text>
            <FlatList
              ListEmptyComponent={<Text>List is empty</Text>}
              data={books}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text>
                    {item.title} by {item.author}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Button
                      title="Delete"
                      onPress={() => handleDeleteBook(item)}
                    />
                  </View>
                </View>
              )}
            />
            <TextInput
              placeholder="Book Title"
              value={newBook.title}
              onChangeText={(text) => setNewBook({ ...newBook, title: text })}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              placeholder="Author"
              value={newBook.author}
              onChangeText={(text) => setNewBook({ ...newBook, author: text })}
              style={{ borderBottomWidth: 1, marginBottom: 20 }}
            />

            <Button title="Add Book" onPress={handleAddBook} />

            <Button title="Logout" onPress={handleLogout} />
          </SafeAreaView>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Settings"
        options={{
          tabBarIcon: () => <Icon name="cogs" size={20} />,
        }}
      >
        {() => (
          <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <Text>Settings</Text>
            <Text>Тут будуть налаштування</Text>
          </SafeAreaView>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const AboutScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text>About the app</Text>
      <Text>This is a book management app with login functionality.</Text>
    </SafeAreaView>
  );
};

export default App;

// import { useState, useEffect } from "react";
// import {
//   View,
//   FlatList,
//   StyleSheet,
//   Button,
//   TextInput,
//   Modal,
//   Text,
//   StatusBar,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// interface Book {
//   id: string;
//   title: string;
//   author: string;
// }

// const App: React.FC = () => {
//   const [books, setBooks] = useState<Book[]>([]);
//   const [visible, setVisible] = useState(false);
//   const [currentBook, setCurrentBook] = useState<Book | null>(null);
//   const [title, setTitle] = useState("");
//   const [author, setAuthor] = useState("");

//   useEffect(() => {
//     loadBooks();
//   }, []);

//   const loadBooks = async () => {
//     const storedBooks = await AsyncStorage.getItem("books");
//     if (storedBooks) {
//       setBooks(JSON.parse(storedBooks));
//     }
//   };

//   const saveBooks = async (books: Book[]) => {
//     await AsyncStorage.setItem("books", JSON.stringify(books));
//     setBooks(books);
//   };

//   const handleAddBook = () => {
//     setCurrentBook(null);
//     setTitle("");
//     setAuthor("");
//     setVisible(true);
//   };

//   const handleEditBook = (book: Book) => {
//     setCurrentBook(book);
//     setTitle(book.title);
//     setAuthor(book.author);
//     setVisible(true);
//   };

//   const handleDeleteBook = async (id: string) => {
//     const updatedBooks = books.filter((book) => book.id !== id);
//     await saveBooks(updatedBooks);
//   };

//   const handleSaveBook = async () => {
//     if (title && author) {
//       const newBook: Book = {
//         id: currentBook ? currentBook.id : Date.now().toString(),
//         title,
//         author,
//       };

//       let updatedBooks;
//       if (currentBook) {
//         updatedBooks = books.map((book) =>
//           book.id === currentBook.id ? newBook : book
//         );
//       } else {
//         updatedBooks = [...books, newBook];
//       }

//       await saveBooks(updatedBooks);
//       setVisible(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Book List</Text>
//         <Button title="Add Book" onPress={handleAddBook} />
//       </View>
//       <FlatList
//         data={books}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>{item.title}</Text>
//             <Text style={styles.cardAuthor}>{item.author}</Text>
//             <View style={styles.cardActions}>
//               <Button onPress={() => handleEditBook(item)} title="Edit" />
//               <Button
//                 onPress={() => handleDeleteBook(item.id)}
//                 title="Delete"
//               />
//             </View>
//           </View>
//         )}
//       />

//       {/* Modal for adding/editing book */}
//       <Modal
//         visible={visible}
//         animationType="slide"
//         onRequestClose={() => setVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Title"
//             value={title}
//             onChangeText={setTitle}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Author"
//             value={author}
//             onChangeText={setAuthor}
//           />
//           <View style={styles.modalActions}>
//             <Button title="Save" onPress={handleSaveBook} />
//             <Button title="Cancel" onPress={() => setVisible(false)} />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#f5f5f5",
//     paddingTop: StatusBar.currentHeight,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 16,
//     marginVertical: 8,
//     borderRadius: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   cardAuthor: {
//     fontSize: 16,
//     color: "#666",
//     marginVertical: 8,
//   },
//   cardActions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//     backgroundColor: "white",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 12,
//     marginBottom: 12,
//     borderRadius: 6,
//   },
//   modalActions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
// });

// export default App;
