import React, { useState, useEffect } from 'react'
import { Button, StyleSheet, Text, ToastAndroid, View, ActivityIndicator } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import Entypo from '@expo/vector-icons/Entypo'
import { StatusBar } from 'expo-status-bar'
import { FONTS } from '../../utils/fontUtils'
import i18n from 'i18n-js'
import {useGetBooksQuery, Book, useGetBookByIdQuery, useDeleteBookMutation, useAddBookMutation, useUpdateBookMutation } from "../../redux/services/bookApi"


interface HomeScreenProps {}

const HomeScreen: React.FC<HomeScreenProps> = () => {

  const [books, setBooks] = useState<Book[]>([]);
  const [book, setBook] = useState<Book>();


  const fetchedBooks = useGetBooksQuery(null, { refetchOnMountOrArgChange: false });
  const fecthedBookById = useGetBookByIdQuery(2, {refetchOnMountOrArgChange: false});
  const [deleteBook, {isLoading}] = useDeleteBookMutation();
  const [addBook, {}] = useAddBookMutation();
  const [updateBook, {isSuccess}] = useUpdateBookMutation();


  
  //Skal vi også lige have igen - LÆS
  useEffect(() => {
    setBooks(fetchedBooks.data?.books ?? []),
    setBook(fecthedBookById.data)
    
    //deleteBook(1066).then(res=> {console.log("Book deleted")})

    // updateBook({
    //   id:1,
    //   title: 'Ny titel',
    //   author: 'Ole b',
    //   genre: 'Fantasy',
    //   releaseDate: '2015-09-25T05:50:06'
    // }).unwrap()
    // .then(res => {
    //   console.log("Den er opdateret")
    // }).catch( (error) => console.error("NIKS", error));
    

 // addBook({
  //     title: 'Test fra frontend',
  //     author: 'Arex',
  //     genre: 'Fantasy',
  //     releaseDate: '2015-09-25T05:50:06'
  //   }).then(res => {
  //     console.log("Ny bog oprettet")
  //   })
  
  }, [])

  console.log(fetchedBooks);


  

  return (
    <View style={styles.container}>
      {fetchedBooks.isLoading && 
        <ActivityIndicator size="large" style={{height: "100%"}}/>
      }

      {(fetchedBooks.data && fetchedBooks.data.books) && 
        <View style={{ flex: 1, width: "100%"}}>
          {fetchedBooks.data.books.map((item, index) => {
            return (
              <View key={index} style={styles.bookBox}>
                <Text style={{height: 50, width:40, backgroundColor:'white'}}></Text>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexGrow: 1, paddingStart: 20}}>
                  <View style={{justifyContent: "flex-start"}}>
                    <Text>{item.title}</Text>
                    <Text>{item.author}</Text>
                  </View>
                  <View>
                    {item.genre}
                  </View>
                </View>
              </View>
            )
          })}

          {(fecthedBookById.data && fecthedBookById.data) &&
          <View style={{flex:1, width: '50%'}}> 
            <Text>{fecthedBookById.data.author}</Text>
            <Text>{fecthedBookById.data.title}</Text>

          </View>}
        </View>
      }
      
      

      <StatusBar style="dark" />
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingTop: 10
  },
  heading: {
    fontFamily: FONTS.bold,
    fontSize: 40,
    color: 'white',
  },
  text: {
    fontSize: 30,
    color: 'white',
  },
  welcome_text: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
  bookBox:{
    backgroundColor: "#ccc",
    height: 30,
    padding: 30,
    marginBottom: 10,
    borderRadius: 10,
    width: "100%",
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between"
  }
})

export default HomeScreen
