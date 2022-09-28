import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Book, useGetBooksByUserIdQuery } from "../../redux/services/bookApi"
import { useGetUserByIdQuery } from "../../redux/services/userApi"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from '../../redux/store'
import { useGetStatusUpdatesByUserQuery, StatusUpdate } from '../../redux/services/statusUpdateApi'
import DefaultView from "../../components/DefaultView"
import Carousel from "../../components/Carousel"
import Looper from "../../components/Looper"

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

  //Currently Reading
  const userBooks = useGetBooksByUserIdQuery(session.id, { refetchOnMountOrArgChange: true })
  const userBooksArr = userBooks.data?.books


  // let currentlyReadingBook: Book = {
  //   bookId: "",
  //   title: "",
  //   author: "",
  //   description: "",
  //   bookStatus: "",
  //   thumbnail: "",
  //   averageRating: 0,
  //   ratingsCount: 0
  // }

  let currentlyReadingBooks: Book[] = []

  userBooksArr?.forEach((book) => {
    if (book.bookStatus == "CurrentlyReading") {
      // currentlyReadingBook = {
      //   bookId: book.bookId,
      //   title: book.title,
      //   author: book.author,
      //   description: book.description,
      //   bookStatus: book.bookStatus,
      //   thumbnail: book.thumbnail,
      //   averageRating: book.averageRating,
      //   ratingsCount: book.ratingsCount
      // }
      currentlyReadingBooks.push(book)
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


  useEffect(() => {
    user.refetch()
  }, [userBooks.data])

  //Flatlist element styling LOOPER BOOK
  const activeIndex = useRef(0);
  const [activeIndexForStyling, setActiveIndexForStyling] = useState(0);
  const [intervalScroll, setIntervalScroll] = useState(true);
  let scrollViewRef = useRef<FlatList>(null);

  function intervalFn() {
    if(intervalScroll) {
      if (scrollViewRef.current) {
        if (activeIndex.current === currentlyReadingBooks.length - 1) {
          activeIndex.current = 0;
        } else {
          activeIndex.current++;
        }
        
        scrollViewRef.current.scrollToOffset({
          animated: true,
          offset: activeIndex.current * Dimensions.get("window").width,
        });
      }
    }
  }

  useEffect(() => {
    if (currentlyReadingBooks.length > 0) {
      const interval = setInterval(intervalFn, 5000);

      return () => clearInterval(interval);
    }

  }, [currentlyReadingBooks]);

  const onScrollHandler = (
    scroll: number,
  ) => {
    if(intervalScroll) setIntervalScroll(false)
    if (scroll %  Dimensions.get("window").width === 0) {
      if (scroll === 0) {
        activeIndex.current = 0;
      } else {
        activeIndex.current = scroll /  Dimensions.get("window").width;
      }
      setActiveIndexForStyling(activeIndex.current);
      setIntervalScroll(true)
    }
  };



  return (
    <DefaultView>

      {session.token && userBooks.data?.books &&

        <View>
          <View style={styles.currentlyReadingImage}>
            <Text style={styles.currentlyReadingHeader}>Currently reading</Text>

            {
              currentlyReadingBooks.length === 0 ?
                <View style={{ width: 200, height: 280, backgroundColor: "rgb(242,242,242)", display: "flex", justifyContent: "center", alignItems: "center" }}>

                  <View style={{ flexDirection: 'column', width: '70%' }}>
                    <Text style={{ textAlign: 'center', paddingVertical: 20, fontFamily: 'GraphikMedium', marginTop: -35 }}> You are currently not reading a book </Text>

                    <TouchableOpacity activeOpacity={0.7} style={{ backgroundColor: "white", borderRadius: 15, paddingVertical: 8 }}
                      onPress={() => {
                        navigation.navigate("BookScreen")
                      }}>
                      <Text style={{ textAlign: 'center', fontFamily: 'GraphikSemibold' }}>Find a book</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                :

                <View style={{width: Dimensions.get("window").width }}>

                  <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={currentlyReadingBooks}
                    snapToAlignment={"center"}
                    decelerationRate={"fast"}
                    pagingEnabled={true}
                    snapToInterval={Dimensions.get("window").width}
                    ref={scrollViewRef}
                    onScroll={(e) => {
                      onScrollHandler(e.nativeEvent.contentOffset.x)
                    }}
                    renderItem={(({ item: book, index: i }) =>
                      <View style={{width: Dimensions.get("window").width}}>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('SelectedBookScreen', {
                              bookId: book.bookId,
                              title: book.title,
                              authors: book.author,
                              description: book.description,
                              thumbnail: book.thumbnail ? book.thumbnail : undefined,
                              averageRating: book.averageRating,
                              ratingsCount: book.ratingsCount,
                            })
                          }}>

                          <Looper item={book} activeIndex={activeIndex.current} index={i} />

                        </TouchableOpacity>
                      </View>

                    )}
                  />

                </View>
            }
          </View>


          <View style={{ marginTop: 70, paddingVertical: 10 }}>

            <>
              {currentlyReadingBooks.length != 0 &&
                <TouchableOpacity activeOpacity={0.7} style={styles.buttonGray} onPress={(() => navigation.navigate('ChooseBookToUpdateScreen', {
                  userId: session.id
                }))}>
                  <Text style={styles.btnBlackText}>Update reading progress</Text>
                </TouchableOpacity>
              }
            </>
          </View>


          {user.data?.booksGoal ?

            <View style={styles.homeInfoOuter}>

              {user.data?.booksRead == user.data?.booksGoal ?

                <Text style={{ fontSize: 16, paddingBottom: 5 }}>Reading challenge completed! 🎉 </Text>
                :

                <Text style={styles.readingChallengeText}>Reading challenge </Text>

              }

              <View style={styles.editNBooksRead}>

                <View style={{ marginRight: 25, marginTop: -10 }}>
                  <TouchableOpacity activeOpacity={0.7} style={{ backgroundColor: "white", borderRadius: 15, paddingHorizontal: 10, paddingVertical: 8 }}
                    onPress={() => navigation.navigate('UpdateGoalScreen', {
                      bookId: currentlyReadingBooks[0].bookId,
                      userId: session.id
                    })}>
                    <Text style={{ fontSize: 12, fontFamily: 'GraphikMedium' }}>Edit goal</Text>
                  </TouchableOpacity>
                </View>

                <Text style={{ fontSize: 22, fontFamily: 'GraphikMedium', marginTop: 5 }}>{user.data?.booksRead}/{user.data?.booksGoal ?? 0}<Text style={{ fontSize: 16 }}> books read </Text> </Text>

              </View>

            </View>

            :

            <View style={{ marginTop: 10 }}>
              <View style={{ marginTop: -10 }}>
                <TouchableOpacity activeOpacity={0.7} style={{ backgroundColor: "rgb(247,247,250)", borderRadius: 15, paddingHorizontal: 10, paddingVertical: 15 }}
                  onPress={() => navigation.navigate('UpdateGoalScreen', {
                    //bookId: currentlyReadingBooks[0].bookId,
                    userId: session.id
                  })}>
                  <Text style={{ fontSize: 14, textAlign: 'center', fontFamily: "GraphikMedium" }}>Set a reading challenge</Text>
                </TouchableOpacity>
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
    alignItems: "center",
    marginTop: 40,
  },
  streakAndMinutes: {
    backgroundColor: "rgb(247,247,250)",
    borderRadius: 10,
    width: '49%',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 20
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
  goalAndStreakHeader: {
    color: "rgb(225,225,225)",
    fontFamily: 'GraphikMedium',
    paddingBottom: 5,
    fontSize: 13,
  }

})

export default HomeScreen


