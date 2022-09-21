import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Pressable, FlatList, Image, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import Entypo from '@expo/vector-icons/Entypo'
import { StatusBar } from 'expo-status-bar'
import { FONTS } from '../../utils/fontUtils'
import i18n from 'i18n-js'
import { Book, useGetBooksByUserIdQuery } from "../../redux/services/bookApi"
import { useGetUserByIdQuery } from "../../redux/services/userApi"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from '../../redux/store'
import { useGetStatusUpdatesByUserQuery, StatusUpdate } from '../../redux/services/statusUpdateApi'
import { configureScope } from '@sentry/react-native'
import DefaultView from "../../components/DefaultView"
import { endSession } from '../../redux/slices/sessionSlice'

interface HomeScreenProps {
  navigation: any
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const session = useSelector((state: RootState) => state.session)
  const dispatch = useDispatch()

  const user = useGetUserByIdQuery(session.id, { refetchOnMountOrArgChange: true })

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

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     user.refetch()
  //   })
  //   return unsubscribe
  // }, [navigation])

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

  useEffect(() => {
    user.refetch()
  }, [userBooks.data])

  return (
    <DefaultView>

      {session.token && userBooks.data?.books &&

        <View>

          <View style={styles.currentlyReadingImage}>
            <Text style={styles.currentlyReadingHeader}>Currently reading</Text>
            <TouchableOpacity onPress={() => {
              navigation.navigate('SelectedBookScreen', {
                bookId: currentlyReadingBook.bookId,
                title: currentlyReadingBook.title,
                authors: currentlyReadingBook.author,
                description: currentlyReadingBook.description,
                thumbnail: currentlyReadingBook.thumbnail ? currentlyReadingBook.thumbnail : undefined,
                averageRating: currentlyReadingBook.averageRating,
                ratingsCount: currentlyReadingBook.ratingsCount,
              })
            }}>

              {currentlyReadingBook.thumbnail ?
                <Image
                  source={{ uri: currentlyReadingBook.thumbnail }}
                  style={{ width: 200, height: 280, borderRadius: 5 }}
                />
                :
                <div style={{ width: 200, height: 280, backgroundColor: "rgb(242,242,242)", display: "flex", justifyContent: "center", alignItems: "center" }}>

                  <View style={{ flexDirection: 'column', width: '70%' }}>
                    <Text style={{ textAlign: 'center', paddingVertical: 20, fontFamily: 'GraphikMedium', marginTop: -35 }}> You are currently not reading a book </Text>

                    <Pressable style={{ backgroundColor: "white", borderRadius: 15, paddingHorizontal: 10, paddingVertical: 8 }}
                      onPress={() => {
                        navigation.navigate("BookScreen")
                      }}>
                      <Text style={{ textAlign: 'center', fontFamily: 'GraphikSemibold' }}>Find a book</Text>
                    </Pressable>
                  </View>
                </div>
              }
            </TouchableOpacity>

          </View>


          <View style={{ marginTop: 70, paddingVertical: 10 }}>

            <>
              {currentlyReadingBook.thumbnail &&

                <Pressable style={styles.buttonGray} onPress={(() => navigation.navigate('UpdateStatus', {
                  thumbnail: currentlyReadingBook.thumbnail,
                  bookId: currentlyReadingBook.bookId,
                  userId: session.id
                }))}>
                  <Text style={styles.btnBlackText}>Update reading progress</Text>
                </Pressable>     
                  
              }
            </>    
          </View>    


          {user.data?.booksGoal ?

            <View style={styles.homeInfoOuter}>

              {user.data?.booksRead == user.data?.booksGoal ?

                <Text style={{ fontSize: 16, marginTop: 12, marginLeft: 5, paddingHorizontal: 2, paddingVertical: 5 }}>Reading challenge completed!! 🎉🎉 </Text>
                :

                <Text style={styles.readingChallengeText}>Reading challenge </Text>

              }

              <View style={styles.editNBooksRead}>

                <View style={{ marginRight: 25, marginTop: -10 }}>
                  <Pressable style={{ backgroundColor: "white", borderRadius: 15, paddingHorizontal: 10, paddingVertical: 8 }}
                    onPress={() => navigation.navigate('UpdateGoalScreen', {
                      thumbnail: currentlyReadingBook.thumbnail,
                      bookId: currentlyReadingBook.bookId,
                      userId: session.id
                    })}>
                    <Text style={{ fontSize: 12, fontFamily: 'GraphikMedium'}}>Edit goal</Text>
                  </Pressable>
                </View>

                <Text style={{ fontSize: 22, fontFamily: 'GraphikMedium', marginTop: 5}}>{user.data?.booksRead}/{user.data?.booksGoal ?? 0}<Text style={{ fontSize: 16}}> books read </Text> </Text>

              </View>

            </View>

            :

            <View>
              <View style={{ marginTop: -10 }}>
                <Pressable style={{ backgroundColor: "rgb(247,247,250)", borderRadius: 15, paddingHorizontal: 10, paddingVertical: 15 }}
                  onPress={() => navigation.navigate('UpdateGoalScreen', {
                    thumbnail: currentlyReadingBook.thumbnail,
                    bookId: currentlyReadingBook.bookId,
                    userId: session.id
                  })}>
                  <Text style={{ fontSize: 14, textAlign: 'center', fontFamily: "GraphikMedium"}}>Set a reading challenge</Text>
                </Pressable>
              </View>
            </View>
          }

          <View style={{ marginTop: 10, flexDirection: "row", width: '100%' }}>

            <View style={styles.streakAndMinutes}>
              <Text style={styles.goalAndStreakHeader}>Reading streak</Text>
              <Text style={{ fontSize: 22, fontFamily: 'GraphikMedium', marginTop: 5 }}>{streak} <Text style={{ fontSize: 14, fontFamily: "GraphikMedium", marginTop: 5 }}> days </Text></Text>
            </View>

            <View style={{ width: '2%' }}></View>


            <View style={styles.streakAndMinutes}>
              <Text style={styles.goalAndStreakHeader}>Minutes read</Text>
              <Text style={{ fontSize: 22, fontFamily: 'GraphikMedium', marginTop: 5 }}>{minutes} <Text style={{ fontSize: 14, fontFamily: "GraphikMedium", marginTop: 5 }}> minutes </Text></Text>
            </View>

          </View>
        </View>
      }

      <StatusBar style="dark" />
    </DefaultView>
  )
}



const styles = StyleSheet.create({
  container: {
    margin: 12
  },
  text: {
    fontSize: 35,
    fontFamily: "GraphikMedium",
  },
  welcome_text: {
    fontSize: 35,
    textAlign: 'center',
  },
  buttonGray: {
    fontSize: 12,
    fontFamily: "GraphikMedium",
    textAlign: "center",
    backgroundColor: "rgb(247,247,250)",
    borderRadius: 15,
    color: "black",
    paddingVertical: 15,
  },
  currentlyReadingImage: {
    flex: 1,
    alignItems: "center",
    marginTop: 40,
  },
  streakAndMinutes: {
    backgroundColor: "rgb(247,247,250)",
    borderRadius: 10,
    width: '49%',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  homeInfoOuter: {
    backgroundColor: "rgb(247,247,250)",
    borderRadius: 10,
    height: 90,
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  readingChallengeText: {
    color: "rgb(225,225,225)",
    fontSize: 13,
    paddingBottom: 5,
    fontFamily: "GraphikMedium",
  },
  editNBooksRead: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between'
  },
  currentlyReadingHeader: {
    paddingVertical: 15,
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 14,
    fontFamily: "GraphikRegular",
  },
  buttonWhite: {
    fontSize: 12,
    fontFamily: "GraphikMedium",
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: 20,
    color: "white",
    marginTop: 5,
    paddingVertical: 15,
    border: '1px solid black',
  },
  btnBlackText: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: "GraphikMedium",
  },
  goalAndStreakHeader:{
    color: "rgb(225,225,225)", 
    fontFamily: 'GraphikMedium', 
    paddingBottom: 5, 
    fontSize: 13,
  }

})

export default HomeScreen


