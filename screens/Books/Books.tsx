import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, ActivityIndicator, TextInput } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import {GoogleBook, useGetBooksQuery} from "../../redux/services/googleBookApi"


interface BooksScreenProps {}

const BooksScreen: React.FC<BooksScreenProps> = () => {
  const session = useSelector((state: RootState) => state.session)


  // Bliver ved med at fetche om og om igen

  const [books, setBooks] = useState<GoogleBook[]>([]);
  const fetchedBooks = useGetBooksQuery({ query: "14" }, { refetchOnMountOrArgChange: false })

  useEffect( () => {
    setBooks(fetchedBooks.data?.books ?? [])
    
  }, [])
  console.log(fetchedBooks)



  // Mangler at blive forbundet til query
  const [bookSearch, setBookSearch] = useState('')

  console.log(bookSearch)



  return (
    <View style={styles.container}>
      <Text style={styles.text}> Search for books {'\n'} </Text>
      <View style={{flexDirection: "column", justifyContent: "space-between", alignItems: "center"}}>
          <Text style={styles.label}>Input book title or author </Text>
          <TextInput 
            style={styles.input}
            onChangeText={(val) => {
              if(val.length > 3) {
                setBookSearch(val);

                // fetch('https://www.googleapis.com/books/v1/volumes?q='+bookSearch+'+inauthor:keyes&key=AIzaSyDSndfWGDUSNAhLmQ6vd4fbikfj1PDhnp4')
                // .then((res) => {
                //   res.json()
                //   console.log(res)
                // })
                // .catch(err => console.log(err))
              }
            }}  
          />
      </View>

      {/* {(fetchedBooks.data && fetchedBooks.data.books) && 
        <View style={{ flex: 1, width: "100%"}}>
          {fetchedBooks.data.books.map((item, index) => {
            return (
              <View key={index} style={{ backgroundColor: "#ccc", height: 30, padding: 30, marginBottom: 10, borderRadius: 10, width: "100%", flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}}>
                <Text style={{height: 50, width:40, backgroundColor:'white'}}></Text>
                <View>
                  <Text>{item.volumeId}</Text>
                </View>
                  <View>
                  </View>
              </View>
            )
          })}
        </View>
      } */}


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
      width: 250,
    }
  })

export default BooksScreen 