import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, ActivityIndicator, TextInput, Image, FlatList, Pressable, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { GoogleBook, useGetBooksQuery } from "../../redux/services/googleBookApi"
import { } from '@react-navigation/native'
import _ from 'lodash';
import Ionicons from '@expo/vector-icons/Ionicons'

//SelectedBook in progress
interface BooksScreenProps {
  navigation: any,
}
const BooksScreen: React.FC<BooksScreenProps> = ({ navigation }) => {

  const session = useSelector((state: RootState) => state.session)

  //Booksearch useState
  const [bookSearch, setBookSearch] = useState('')


  //Fetched books useState
  const [books, setBooks] = useState<GoogleBook[]>([]);
  const fetchedBooks = useGetBooksQuery({ query: bookSearch }, { refetchOnMountOrArgChange: false, skip: bookSearch.length === 0 })
  const { data, error } = fetchedBooks;

  // Default thumbnail
  const thumbDefault: any = 'https://books.google.com/books/content?id=qc8qvXhpLA0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'


  //Use effect fetched books
  useEffect(() => {
    setBooks(fetchedBooks.data?.books ?? [])
  }, [])


  // Selected book



  const renderItem = (item: GoogleBook) => {
    return (
      <View>
        <Image
          source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
          style={{ width: 45, height: 60 }}
        />

        <Text>{item.volumeInfo.title}</Text>
      </View>
    )
  }


  return (
    <View style={{ backgroundColor: 'white', height: '100%' }}>
      <Text style={styles.text}> {'\n'} Search </Text>

      <View style={styles.inputContainer}>

        {<Ionicons name={'search'} size={20} color={'black'} />}
        <TextInput
          style={styles.input}
          onChangeText={_.throttle((text) => {
            setBookSearch(text)
          }, 1000)}
          placeholder={"Enter a book name or author to search"}
        />

        <Text>{'\n'}</Text>
      </View>


      {(fetchedBooks.data?.items && fetchedBooks.data.items) &&
        <View style={{ flex: 1, width: "100%" }}>
          <FlatList keyExtractor={(item) => item.volumeInfo.title} data={fetchedBooks.data.items || []} renderItem={({ item, index }) => (

            <TouchableOpacity onPress={() => {
              navigation.navigate('SelectedBookScreen', {
                bookId: 11,
                title: item.volumeInfo.title,
                description: item.volumeInfo.description
                })
              }}>

              <View style={styles.booksContatiner}>
                {item.volumeInfo.imageLinks ?
                  <Image
                    source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
                    defaultSource={{ uri: thumbDefault }}
                    style={{ width: 40, height: 55 }}
                  />
                  :
                  <div style={{ width: 40, height: 55, backgroundColor: "#ccc", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    No image
                  </div>
                }


                <View style={{ flexDirection: 'column', width: '60%', padding: 15 }}>
                  <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{item.volumeInfo.title}{'\n'}</Text>
                  <Text style={{ fontSize: 10 }}> {item.volumeInfo.authors.length} </Text>
                </View>

                {/* Navigation in progress */}

                <View style={{ marginRight: -40 }}>
                  <Pressable style={{}} onPress={() => {
                    console.log("Coming soon")
                  }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 10 }}> Want to read <Ionicons name={'chevron-down'} size={20} color={'black'} />  </Text> </Pressable>
                </View>

              </View>

            </TouchableOpacity>

          )} />
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 25,
    color: 'black',
    textAlign: 'left',
    padding: 15,
    fontWeight: 'bold',
  },
  welcome_text: {
    fontSize: 20,
    width: 150,
    color: 'black',
  },
  books: {
    flex: 1,
    width: "100%"
  },
  label: {
    fontSize: 20,
    marginEnd: 20
  },
  input: {
    flex: 1,
    outline: 'none',
  },
  booksContatiner: {
    backgroundColor: "white",
    height: 30,
    padding: 35,
    marginBottom: 10,
    marginLeft: -15,
    borderRadius: 10,
    width: "100%",
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
  },
  wantToRead: {
    fontSize: 12,
  },
  inputContainer:{
    flexDirection: "row", 
    justifyContent: "space-between",
    alignItems: "center", 
    borderWidth: 1,
    backgroundColor: '#d3d3d3',
    padding: 8,
    paddingBottom: 10,
    margin: 0,
    borderRadius: 20,
    height: 40,
    opacity: 0.5,
    borderBottomWidth: 1,
    marginRight: 10,
    marginLeft: 10,
    border: 'none',
    outline: 'none',
    
  }
  
})

export default BooksScreen 