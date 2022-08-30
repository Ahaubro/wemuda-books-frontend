import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, ActivityIndicator, TextInput, Image, FlatList, Pressable } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import {GoogleBook, useGetBooksQuery} from "../../redux/services/googleBookApi"
import { validatePathConfig } from '@react-navigation/native'
import _ from 'lodash';
import Ionicons from '@expo/vector-icons/Ionicons'


interface BooksScreenProps {}

const BooksScreen: React.FC<BooksScreenProps> = () => {
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
useEffect( () => {
  setBooks(fetchedBooks.data?.books ?? [])
}, [])

  
console.log(data?.items[5].volumeInfo)

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
    <View style={{backgroundColor: 'white', height: '100%'}}>
      <Text style={styles.text}> {'\n'} Search  {'\n'} </Text>
      <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
        
        <Ionicons name={'search'} size={20} color={'black'} /> 
          <TextInput 
            style={styles.input}
            onChangeText={ _.throttle( (text) => {
              setBookSearch(text)
            }, 1000)}
            placeholder={"Enter a book name or author to search"}
          />

          <Text>{'\n'}</Text>
      </View>


      {(fetchedBooks.data?.items && fetchedBooks.data.items) && 
        <View style={{ flex: 1, width: "100%"}}>
          <FlatList keyExtractor={(item) => item.volumeInfo.title} data={fetchedBooks.data.items || []} renderItem={({ item, index }) => (
            <View  style={styles.booksContatiner}>

              <Image

              //source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
              source={{ uri: thumbDefault }}
              style={{ width: 40, height: 55 }}
              />

              <View style={{flexDirection: 'column', width:'50%'}}>
                <Text style={{fontSize: 10, fontWeight: 'bold'}}>{item.volumeInfo.title}{'\n'}</Text>
                <Text style={{fontSize: 10}}> { item.volumeInfo.authors } </Text>
              </View>

              <Pressable style={{}} onPress={ () => {
                console.log("Coming soon")
              }}> <Text style={{fontWeight: 'bold', fontSize: 10}}> Want to read <Ionicons name={'chevron-down'} size={20} color={'black'} />  </Text> </Pressable>
          </View>
          )} />
          {/* {fetchedBooks.data?.items.map((item, index) => {
            return (
              <View key={index} style={{ backgroundColor: "#ccc", height: 30, padding: 30, marginBottom: 10, borderRadius: 10, width: "100%", flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}}>
                
                <Image 
                source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
                style={{ width: 50, height: 60 }}
              
                />

                <View>
                  <Text>Book Title: {item.volumeInfo.title}</Text>
                  <Text></Text>
                </View>
              </View>
            )
          })} */}

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
    label: {
      fontSize: 20,
      marginEnd: 20
    },
    input:{
      borderWidth: 1,
      backgroundColor: '#d3d3d3',
      padding: 8,
      margin: 0,
      width: '100%',
      borderRadius: 20,
      border: 'none',
      height: 40,
      opacity: 0.65,
    },
    booksContatiner:{
      backgroundColor: "white", 
      height: 30, 
      padding: 30, 
      marginBottom: 10, 
      borderRadius: 10, 
      width: "100%", 
      flexDirection: 'row', 
      alignItems: "center", 
      justifyContent: "space-between"
    },
    wantToRead: {
      fontSize: 12,
    }
  })

export default BooksScreen 