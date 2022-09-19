import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, ActivityIndicator, TextInput, Image, FlatList, Pressable, TouchableOpacity, NativeEventEmitter } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
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
import { endSession } from '../../redux/slices/sessionSlice'
import { statusUpdateApi } from '../../redux/services/statusUpdateApi'


//SelectedBook in progress
interface BooksScreenProps {
  navigation: any
}
const BooksScreen: React.FC<BooksScreenProps> = ({ navigation }) => {


  const session = useSelector((state: RootState) => state.session)
  const dispatch = useDispatch()


  //Booksearch useState
  const [bookSearch, setBookSearch] = useState('')


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

      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Search</Text>
      </View>

      <View style={styles.inputContainer}>
        {<Ionicons style={{paddingHorizontal: 15}} name={'search'} size={20} color={'grey'} />}
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
      <View style={{paddingVertical: 8}}></View>


      {(fetchedBooks.data?.items && fetchedBooks.data.items) &&
        <View style={{flex: 1, maxHeight: 600}}>
          <FlatList showsHorizontalScrollIndicator={true} keyExtractor={(item) => item.volumeInfo.title} data={fetchedBooks.data.items || []} renderItem={({ item, index }) => (

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
                    style={{ width: 60, height: 80, borderRadius: 3 }}
                  />
                  :
                  <div style={{ width: 60, height: 80, backgroundColor: "#ccc", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: 'GraphikRegular' }}>
                    No image
                  </div>
                }


                <View style={styles.titleAndAuthorContainer}>
                  <Text style={{ fontSize: 14, fontFamily: 'GraphikMedium'}}>{sliceTitle(item.volumeInfo.title)}{'\n'}</Text>
                  <Text style={{ fontSize: 12, marginTop: 3, marginLeft: -2, color: "#ccc", fontFamily: 'GraphikRegular' }}> By {getAuthors(item.volumeInfo.authors)} </Text>
                </View>   
              </View>
              
            </TouchableOpacity>

          )} />
        </View>
      }

      { session.token && session.token == "guest" &&
      <View>
        <Pressable style={{paddingVertical: 15}} onPress={ () => {
          dispatch(endSession());
        }}>
          <Text style={[styles.btnBlackText, {fontWeight: 'bold'}]}>Back to start</Text>
        </Pressable>

      </View>
      }

    </DefaultView>
  )
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 25,
    textAlign: 'left',
    paddingVertical: 15,   
    fontFamily: 'GraphikMedium'
},
  welcome_text: {
    fontSize: 20,
    width: 150,
    color: 'black',
    fontFamily: 'GraphikMedium'
  },
  label: {
    fontSize: 20,
    marginEnd: 20,
    fontFamily: 'GraphikRegular'
  },
  input: {
    flex: 1,
    outline: 'none',
    fontFamily: 'GraphikRegular'
  },
  booksContatiner: {
    backgroundColor: "white",
    paddingVertical: 8 ,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-around",
    marginLeft: -40
  },
  wantToRead: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "rgb(247,247,250)",
    borderRadius: 25,
    height: 50,
    borderBottomWidth: 1,
    border: 'none',
    outline: 'none',
    opacity: 0.8,
  },
  titleAndAuthorContainer:{
    flexDirection: 'column', 
    width: '60%', 
    marginLeft: -65,
  },
  headerContainer:{
    paddingTop: 50,
  },
  btnBlackText:{
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'GraphikMedium'
},

})

export default BooksScreen 