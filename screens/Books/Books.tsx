import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import {GoogleBook, useGetBooksQuery} from "../../redux/services/googleBookApi"


interface BooksScreenProps {}

const BooksScreen: React.FC<BooksScreenProps> = () => {
  const session = useSelector((state: RootState) => state.session)


  const [books, setBooks] = useState<GoogleBook[]>([]);

  const fetchedBooks = useGetBooksQuery(null, { refetchOnMountOrArgChange: false })



  useEffect( () => {
    setBooks(fetchedBooks.data?.books ?? [])
  })

  console.log(fetchedBooks)


  return (
    <View style={styles.container}>
      <Text style={styles.text}> Books {"/n"} </Text>

      { fetchedBooks.isLoading && <ActivityIndicator size={"large"}/> }  

      { (fetchedBooks.data && fetchedBooks.data.books) && 

        <View style={styles.books}> 
          {fetchedBooks.data.books.map( (item, index) => {
            return(
              <View key={index} style={styles.display_books}> 

                {/* <Text>{item.author}</Text>
                <Text>{item.title}</Text>
              
                <View> 
                  <Text>{item.genre}</Text>
                </View> */}

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
      color: 'white',
    },
    welcome_text: {
      fontSize: 20,
      width:150,
      color: 'white',
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
    }
  })

export default BooksScreen