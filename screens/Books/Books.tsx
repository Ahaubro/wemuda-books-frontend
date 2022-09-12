import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, ActivityIndicator, TextInput, Image, FlatList, Pressable, TouchableOpacity, NativeEventEmitter } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { GoogleBook, useGetBooksQuery } from "../../redux/services/googleBookApi"
import { Book, useAddBookMutation, useGetBooksByUserIdQuery } from '../../redux/services/bookApi'
import { } from '@react-navigation/native'
import _ from 'lodash';
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { BookNavigatorParamList } from '../../types/NavigationTypes'
import DefaultView from "../../components/DefaultView"
import BackArrowContainer from "../../components/BackArrowContainer"


//SelectedBook in progress
interface BooksScreenProps {
  navigation: any
}
const BooksScreen: React.FC<BooksScreenProps> = ({ navigation }) => {


  const session = useSelector((state: RootState) => state.session)


  //Booksearch useState
  const [bookSearch, setBookSearch] = useState('')


  //Add book in progress
  // const [addBook] = useAddBookMutation();
  // const [addBookAtributes, setAddBookAtributes] = useState<{
  //   userId: number, bookId: string, title: string, thumbnail: string | undefined, author: string,
  //   description: string, averageRating: number, ratingCount: number, bookStatus: string
  // }>({
  //   userId: 0, bookId: "", title: "", thumbnail: "", author: "", description: "",
  //   averageRating: 0, ratingCount: 0, bookStatus: ""
  // })


  //Fetched books useState
  const [books, setBooks] = useState<GoogleBook[]>([]);
  const fetchedBooks = useGetBooksQuery({ query: bookSearch }, { refetchOnMountOrArgChange: true, skip: bookSearch.length === 0 })


  //For updating wantToRead
  const fetchedUserBooks = useGetBooksByUserIdQuery(session.id, { refetchOnMountOrArgChange: true });
  const [savedBookIds, setSavedBookIds] = useState<string[]>([]);

  const { data, error } = fetchedBooks;


  //Use effect fetched books
  useEffect(() => {
    setBooks(fetchedBooks.data?.books ?? [])

    if (fetchedUserBooks.data) {
      let arr = fetchedUserBooks.data.books.map(item => item.bookId)
      setSavedBookIds(arr);
    }
  }, [fetchedUserBooks.data])


  //Function that slice authors
  let slicedAuthorString: string = ""

  const getAuthors = (authors: string[]) => {
    if (!authors) {
      slicedAuthorString = "No Authors"
      return slicedAuthorString
    } else if (authors.length === 1) {
      slicedAuthorString = authors[0]
      return slicedAuthorString
    } else {
      slicedAuthorString = `${authors[0]} and ${authors.length} others.`
      return slicedAuthorString
    }
  }


  //Function that slice titles
  const sliceTitle = (title: string) => {
    if (title.length < 20) return title
    else return `${title.substring(0, 20)}... `
  }

  const renderItem = (item: GoogleBook) => {
    return (
      <View>
        <Image
          source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
          style={{ width: 50, height: 65 }}
        />
        <Text>{item.volumeInfo.title}</Text>
      </View>
    )
  }


  return (
    <DefaultView>

      <BackArrowContainer>
        <Pressable onPress={() => {
          navigation.pop();
        }}>
          <Ionicons name={'chevron-back'} size={25} color={'black'} />
        </Pressable>
      </BackArrowContainer>


      <Text style={styles.text}> Search </Text>

      <View style={styles.inputContainer}>
        {<Ionicons name={'search'} size={20} color={'grey'} />}
        <TextInput
          style={styles.input}
          onChangeText={_.throttle((text) => {
            if (text.length > 2) {
              setBookSearch(text);
            }
          }, 1000)
          }
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace') {
              console.log("Backspace ramt")
            }
          }}
          placeholder={"Enter book name or author to search"}
        />
      </View>


      {(fetchedBooks.data?.items && fetchedBooks.data.items) &&
        <View style={{ flex: 1, width: "100%" }}>
          <FlatList keyExtractor={(item) => item.volumeInfo.title} data={fetchedBooks.data.items || []} renderItem={({ item, index }) => (

            <TouchableOpacity onPress={() => {
              navigation.navigate('SelectedBookScreen', {
                bookId: item.id,
                title: item.volumeInfo.title,
                authors: getAuthors(item.volumeInfo.authors),
                description: item.volumeInfo.description,
                thumbnail: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : undefined,
                averageRating: item.volumeInfo.averageRating,
                ratingsCount: item.volumeInfo.ratingsCount,
              })
            }}>

              <View style={styles.booksContatiner}>
                {item.volumeInfo.imageLinks ?
                  <Image
                    source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
                    style={{ width: 50, height: 65, borderRadius: 3 }}
                  />
                  :
                  <div style={{ width: 50, height: 65, backgroundColor: "#ccc", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    No image
                  </div>
                }


                <View style={{ flexDirection: 'column', width: '60%', padding: 15 }}>
                  <Text style={{ fontSize: 11, fontWeight: 'bold' }}>{sliceTitle(item.volumeInfo.title)}{'\n'}</Text>
                  <Text style={{ fontSize: 11, marginTop: 3, marginLeft: -2 }}> {getAuthors(item.volumeInfo.authors)} </Text>
                </View>

                {/* {session.id && (
                  <View style={{ marginRight: -40 }}>
                    <Pressable style={{}} onPress={() => {
                      addBookAtributes.userId = session.id;
                      addBookAtributes.bookId = item.id;
                      addBookAtributes.title = item.volumeInfo.title;
                      addBookAtributes.author = getAuthors(item.volumeInfo.authors);
                      addBookAtributes.description = item.volumeInfo.description;
                      addBookAtributes.thumbnail = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : undefined,
                      addBookAtributes.averageRating = item.volumeInfo.averageRating;
                      addBookAtributes.ratingCount = item.volumeInfo.ratingsCount
                      addBookAtributes.bookStatus = "WantToRead"
                      console.log(addBookAtributes)
                      addBook(addBookAtributes);

                    }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 10 }}>
                        {savedBookIds.filter(elm => elm === item.id).length === 1 ?
                          <>On my list <Ionicons name={'checkmark-sharp'} size={20} color={'green'} /> </>
                          :
                          <>Want to read <Ionicons name={'chevron-down'} size={20} color={'black'} /> </>
                        }
                      </Text>
                    </Pressable>
                  </View>
                )} */}


              </View>
            </TouchableOpacity>

          )} />
        </View>
      }
    </DefaultView>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 25,
    color: 'black',
    textAlign: 'left',
    fontWeight: 'bold',
    paddingVertical: 10,
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
    padding: 40,
    borderRadius: 10,
    width: "100%",
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
  },
  wantToRead: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: 'rgb(242,242,242)',
    padding: 8,
    paddingBottom: 10,
    borderRadius: 20,
    height: 40,
    borderBottomWidth: 1,
    border: 'none',
    outline: 'none',
    opacity: 0.8
  },

})

export default BooksScreen 