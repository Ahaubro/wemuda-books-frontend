import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Pressable, FlatList, Image, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import Entypo from '@expo/vector-icons/Entypo'
import { StatusBar } from 'expo-status-bar'
import { FONTS } from '../../utils/fontUtils'
import i18n from 'i18n-js'
import { Book, useGetBooksByUserIdQuery } from "../../redux/services/bookApi"
import { useGetUserByIdQuery } from "../../redux/services/userApi"
import { useSelector } from "react-redux"
import { RootState } from '../../redux/store'
import { useGetStatusUpdatesByUserQuery, StatusUpdate } from '../../redux/services/statusUpdateApi'
import { configureScope } from '@sentry/react-native'

interface HomeScreenProps {
  navigation: any
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const session = useSelector((state: RootState) => state.session)

  const user = useGetUserByIdQuery(session.id, {refetchOnMountOrArgChange: true})

  const [streak, setStreak] = useState("?");
  const [minutes, setMinutes] = useState("?");

  const statusUpdates = useGetStatusUpdatesByUserQuery(session.id);

  //const [booksRead, setBooksRead] = useState("?")

  //Arex igang med currentlyReadning
  const userBooks = useGetBooksByUserIdQuery(session.id, { refetchOnMountOrArgChange: true })
  const userBooksArr = userBooks.data?.books
  //let currentlyReadingBookThumbnail: string | undefined = ""
  //let currentlyReadingBookId: string | undefined = ""
  let currentlyReadingBook: Book = {
    bookId: "",
    title: "",
    author: "",
    description: "",
    bookStatus: "",
    thumbnail: "",
    averageRating: 0,
    ratingsCount: 0
  }

  userBooksArr?.forEach((book) => {
    if (book.bookStatus == "CurrentlyReading") {
      currentlyReadingBook = {
        bookId: book.bookId,
        title: book.title,
        author: book.author,
        description: book.description,
        bookStatus: book.bookStatus,
        thumbnail: book.thumbnail,
        averageRating: book.averageRating,
        ratingsCount: book.ratingsCount
      }
    }
  })

  useEffect(() => {
    if (statusUpdates.data) {
      const totalMinutes = statusUpdates.data.statusUpdates.reduce((prev, next: StatusUpdate) => prev + next.minutesRead, 0)
      setMinutes(String(totalMinutes))

      let updatesInDay = []

      let dayBeginning = new Date(new Date().setHours(0, 0, 0, 0))
      let dayEnd = new Date(new Date(dayBeginning).setDate(dayBeginning.getDate() + 1))

      updatesInDay = statusUpdates.data.statusUpdates.filter((s: StatusUpdate) => {
        const time = new Date(s.timeOfUpdate)
        return dayBeginning <= time && time < dayEnd
      })

      let streakCounter = 0

      do {
        if (updatesInDay.length > 0)
          streakCounter++;
        dayEnd = dayBeginning
        dayBeginning = new Date(new Date(dayBeginning).setDate(dayBeginning.getDate() - 1))
        updatesInDay = statusUpdates.data.statusUpdates.filter((s: StatusUpdate) => {
          const time = new Date(s.timeOfUpdate)
          return dayBeginning <= time && time < dayEnd
        })
      } while (updatesInDay.length > 0);

      setStreak(String(streakCounter))

    }
  }, [statusUpdates.data])

  // useEffect(() => {
  //   const historyBooks = userBooks.data?.books.filter(book => book.bookStatus == "History")
  //   const text = String(historyBooks?.length)
  //   console.log(historyBooks, text)
  //   setBooksRead(text)
  // }, [userBooks.data])

  return (
    <View style={{ backgroundColor: "white", height: "100%" }}>

      {session.token && userBooks.data?.books &&

        <View style={{ flex: 1, alignItems: "center", marginTop: 40, width: "100%", paddingHorizontal: 10 }}>
          <View style={{ flex: 1, alignItems: "center", paddingBottom: 30 }}>
            <Text style={{ marginBottom: 10, fontSize: 14, fontWeight: "700", }}>Currently reading</Text>

            <View>
              <TouchableOpacity onPress={() => {
                navigation.navigate('SelectedBookScreen', {
                  bookId: currentlyReadingBook.bookId,
                  title: currentlyReadingBook.title,
                  //authors: getAuthors(book.authors),
                  description: currentlyReadingBook.description,
                  thumbnail: currentlyReadingBook.thumbnail ? currentlyReadingBook.thumbnail : undefined,
                  averageRating: currentlyReadingBook.averageRating,
                  ratingsCount: currentlyReadingBook.ratingsCount,
                })
              }}>

                {currentlyReadingBook.thumbnail ?
                  <Image
                    source={{ uri: currentlyReadingBook.thumbnail }}
                    style={{ width: 130, height: 180, borderRadius: 5, borderWidth: 0.5, borderColor: "#d3d3d3" }}
                  />
                  :
                  <div style={{ width: 130, height: 180, backgroundColor: "#ccc", display: "flex", justifyContent: "center", alignItems: "center" }}>

                  </div>
                }
              </TouchableOpacity>
            </View>







            <Pressable style={{ ...styles.buttonGray, marginTop: 25 }} onPress={(() => navigation.navigate('UpdateStatus', {
              thumbnail: currentlyReadingBook.thumbnail,
              bookId: currentlyReadingBook.bookId,
              userId: session.id
            }))}>
              <Text style={{ fontWeight: "bold", fontSize: 12 }}>Update progress</Text>
            </Pressable>
          </View>

          <View style={{borderBottomColor: "#AAA", borderBottomWidth: 2, width: "100%", paddingBottom: 10}}>
            <Text style={{color: "#AAA"}}>Reading Challenge</Text>
            <Text style={{fontWeight: "bold"}}><Text style={{fontSize: 20}}>{user.data?.booksRead}/{user.data?.booksGoal ?? 0}</Text> books read</Text>
          </View>

          <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between", width: "100%", paddingBottom: 100 }}>
            <View>
              <Text style={{ color: "#AAA" }}>Reading streak</Text>
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>{streak} <Text style={{ fontSize: 14, fontWeight: "bold" }}> days </Text></Text>
            </View>
            <View>
              <Text style={{ color: "#AAA" }}>Minutes read</Text>
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>{minutes} <Text style={{ fontSize: 14, fontWeight: "bold" }}> minutes </Text></Text>
            </View>
            <View></View>
          </View>   
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
  },
  text: {
    fontSize: 35,
  },
  welcome_text: {
    fontSize: 35,
    textAlign: 'center',
  },
  bookBox: {
    backgroundColor: "#ccc",
    height: 30,
    padding: 30,
    marginBottom: 10,
    borderRadius: 10,
    width: "100%",
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between"
  },
  buttonGray: {
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "sans-serif",
    textAlign: "center",
    backgroundColor: "#d3d3d3",
    borderRadius: 18,
    width: "fit-content",
    marginBottom: 10,
    marginTop: 0,
    paddingHorizontal: 15,
    paddingVertical: 8,
    height: "fit-content",
    opacity: 0.9
  }
})

export default HomeScreen
