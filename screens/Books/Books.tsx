import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, ActivityIndicator, TextInput } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import {GoogleBook, useGetBooksQuery} from "../../redux/services/googleBookApi"
import { validatePathConfig } from '@react-navigation/native'
import _ from 'lodash';


interface BooksScreenProps {}

const BooksScreen: React.FC<BooksScreenProps> = () => {
const session = useSelector((state: RootState) => state.session)

//Booksearch useState
const [bookSearch, setBookSearch] = useState('')


//Fetched books useState
const [books, setBooks] = useState<GoogleBook[]>([]);
const fetchedBooks = useGetBooksQuery({ query: bookSearch }, { refetchOnMountOrArgChange: false, skip: bookSearch.length === 0 })
const { data, error } = fetchedBooks;


//Use effect fetched books
useEffect( () => {
  setBooks(fetchedBooks.data?.books ?? [])
}, [])

  
// Info printet ud i konsollen for en bog

// console.log(data?.items[0].volumeInfo.title)
// console.log(data?.items[0].volumeInfo.authors)
// console.log(data?.items[0].volumeInfo.description)
// console.log(data?.items[0].volumeInfo.categories)
// console.log(data?.items[0].volumeInfo.infoLink)
// console.log(data?.items[0].volumeInfo.publisher)


  return (
    <View style={styles.container}>
      <Text style={styles.text}> Search for books {'\n'} </Text>
      <View style={{flexDirection: "column", justifyContent: "space-between", alignItems: "center"}}>
          <TextInput 
            style={styles.input}
            onChangeText={ _.throttle( (text) => {
              setBookSearch(text)
            }, 1000)}
            placeholder={"Enter a book name or author to search"}
          />
      </View>


      {(fetchedBooks.data?.items && fetchedBooks.data.items) && 
        <View style={{ flex: 1, width: "100%"}}>
          {fetchedBooks.data?.items.map((item, index) => {
            return (
              <View key={index} style={{ backgroundColor: "#ccc", height: 30, padding: 30, marginBottom: 10, borderRadius: 10, width: "100%", flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}}>
                <Text style={{height: 50, width:40, backgroundColor:'white'}}></Text>
                <View>
                  <Text>Book Title: {item.volumeInfo.title}</Text>
                  <Text></Text>
                </View>
              </View>
            )
          })}

        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 40,
      color: 'black',
    },
    welcome_text: {
      fontSize: 20,
      width:150,
      color: 'black',
    },
    books: {
      flex: 1,
      width: "100%"
    },
    display_books: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      borderRadius: 5,
      backgroundColor: "#ccc",
      height: 40,
      marginBottom: 10
    },
    label: {
      fontSize: 20,
      marginEnd: 20
    },
    input:{
      borderWidth: 1,
      borderColor: '#777',
      padding: 8,
      margin: 10,
      width: 270,
    }
  })

export default BooksScreen 