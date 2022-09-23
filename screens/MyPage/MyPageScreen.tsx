import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Button, Pressable, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useGetUserByIdQuery, User } from '../../redux/services/userApi'
import { useGetStatusUpdatesByUserQuery, StatusUpdate } from '../../redux/services/statusUpdateApi'
import { lte } from 'lodash'
import { GoogleBook, useGetBookByIdQuery, useLazyGetBookByIdQuery } from '../../redux/services/googleBookApi'
import Navigation from '../../containers/MyPageNavigator'
import { useGetBooksByUserIdQuery, Book } from '../../redux/services/bookApi'
import DeafultView from "../../components/DefaultView"
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { MyPageNavigatorParamList } from '../../types/NavigationTypes'


type MyPageScreenNavigationProps = StackNavigationProp<MyPageNavigatorParamList, 'MyPage'>
type MyPageScreenRouteProps = RouteProp<MyPageNavigatorParamList, 'MyPage'>

type Props = {
    navigation: MyPageScreenNavigationProps
    route: MyPageScreenRouteProps
}

function MyPageScreen({ navigation, route }: Props){
  const session = useSelector((state: RootState) => state.session)
  const dispatch = useDispatch()

  const user = useGetUserByIdQuery(session.id)

  const [streak, setStreak] = useState("?");
  const [minutes, setMinutes] = useState("?");

  const statusUpdates = useGetStatusUpdatesByUserQuery(session.id)

  const [allUserBooks, setAllUserBooks] = useState([] as Book[])

  const [wantToReadBooks, setWantToReadBooks] = useState([] as Book[])
  const [wantToReadState, setWantToReadState] = useState("Loading...")

  const [historyBooks, setHistoryBooks] = useState([] as Book[])
  const [historyState, setHistoryState] = useState("Loading...")

  const fetchedUserBooks = useGetBooksByUserIdQuery(session.id, { refetchOnMountOrArgChange: true })

  //Slice fullname
  let userFullname = user.data?.fullName
  let slicedUserName = ""
  if(userFullname != undefined){
    let slicedNameArr: string[] = userFullname.split(" ");
    slicedUserName = slicedNameArr[0] + " " + slicedNameArr[1].substring(0,1)
  }


  useEffect(() => {
    setWantToReadState("Loading...")
    setHistoryState("Loading...")
  }, [])

  useEffect(() => {
    if (fetchedUserBooks.data) {
      setAllUserBooks(fetchedUserBooks.data.books)
    }
  }, [fetchedUserBooks.data])

  useEffect(() => {
    setWantToReadBooks(allUserBooks.filter(book => book.bookStatus == "WantToRead"))
    setHistoryBooks(allUserBooks.filter(book => book.bookStatus == "History"))
  }, [allUserBooks])

  useEffect(() => {
    setWantToReadState("No Books")
  }, [wantToReadBooks])


  useEffect(() => {
    setHistoryState("No Books")
  }, [historyBooks])

  useEffect(() => {
    if (statusUpdates.data) {

      //Count Minutes
      const totalMinutes = statusUpdates.data.statusUpdates.reduce((prev, next: StatusUpdate) => prev + next.minutesRead, 0)
      setMinutes(String(totalMinutes))

      //Count Streak
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


  return (
    <DeafultView>

      <View style={styles.headerContainer}>
        <Text style={styles.heading}>{slicedUserName}</Text>

        <Pressable style={{paddingVertical: 15}} onPress={ () => {
          navigation.navigate("SettingsScreen")
        }}>
          <Ionicons name={'settings-sharp'} size={20} color={'black'} />
        </Pressable>
      
      </View>


      <View style={[styles.streakAndMinutesContainer, {paddingTop: 15}]}>
        <View>
          <Text style={{ color: "#AAA", paddingVertical: 5 }}>Reading streak</Text>
          <Text style={{ fontFamily: 'GraphikMedium', fontSize: 22 }}>{streak} <Text style={{ fontSize: 14, fontFamily: 'GraphikMedium'}}> days </Text></Text>
        </View>

        <View>
          <Text style={{ color: "#AAA", paddingVertical: 5 }}>Minutes read</Text>
          <Text style={{ fontFamily: 'GraphikMedium', fontSize: 22 }}>{minutes} <Text style={{ fontSize: 14, fontFamily: 'GraphikMedium'}}> minutes </Text></Text>
        </View>
        <View></View>
      </View>


      <View style={styles.wantToReadContainer}>
        <Text style={styles.subHeading}>Want to read</Text>
        {wantToReadBooks.length > 0 ?
          <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={wantToReadBooks} renderItem={(({ item: book }) =>
            <View style={{ paddingHorizontal: 4, paddingVertical: 8 }}>
              <TouchableOpacity onPress={() => {
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



                <Image
                  source={{ uri: book.thumbnail }}
                  style={{ width: 90, height: 130, borderWidth: 0.5, borderColor: "#d3d3d3", borderRadius: 5 }}
                />

              </TouchableOpacity>
            </View>

          )}
          />
          :

          <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 20}}>
            <Pressable style={[styles.buttonGray, { paddingHorizontal: 10, paddingVertical: 10, width: 250, borderColor: '1px solid black'}]}
              onPress={() => {
                navigation.navigate("BookScreen")
              }}>
              <Text style={{ textAlign: 'center', fontFamily: 'GraphikMedium', fontSize: 16 }}>Find books now</Text>
            </Pressable>
          </View>
        }

        { wantToReadBooks.length > 0 &&

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
          <Pressable style={styles.buttonGray} onPress={() => {
            if (wantToReadBooks.length > 0)
              navigation.navigate('BookList', { books: wantToReadBooks, title: "Want to read" })
          }}><Text style={styles.btnBlackText}>See all</Text></Pressable>
        </View>
        }

      </View>


      <View style={styles.wantToReadContainer}>
        <Text style={styles.subHeading}>My history</Text>
        {historyBooks.length > 0 ?
          <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={historyBooks} renderItem={(({ item: book }) =>
            <View style={{ paddingHorizontal: 4, paddingVertical: 8 }}>
              <TouchableOpacity onPress={() => {
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

                <Image
                  source={{ uri: book.thumbnail }}
                  style={{ width: 90, height: 130, borderWidth: 0.5, borderColor: "#d3d3d3", borderRadius: 5 }}
                />
              </TouchableOpacity>
            </View>
          )}
          />
          :

          <View style={{ justifyContent: 'center', paddingVertical: 20 }}>
            <Text style={{textAlign: 'center', fontSize: 16, fontFamily: 'GraphikMedium', lineHeight: 20}}>You have not finished any books yet. {'\n'} Find a book and start reading now!</Text>
            </View>
        }
        
        { historyBooks.length > 0 && 
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
          <Pressable style={[styles.buttonGray, {marginBottom: 20}]} onPress={() => {
            if (historyBooks.length > 0)
              navigation.navigate('BookList', { books: historyBooks, title: "My history" })
          }}><Text style={styles.btnBlackText}>See all</Text></Pressable>
        </View>
        }

      </View>
    </DeafultView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 25,
    color: 'black',
    textAlign: 'left',
    fontFamily: 'GraphikMedium',
    paddingVertical: 15
  },
  subHeading: {
    fontSize: 14,
    fontFamily: 'GraphikMedium',
    marginBottom: 5
  },
  text: {
    fontSize: 20,
  },
  buttonGray: {
    fontFamily: 'GraphikMedium',
    textAlign: "center",
    backgroundColor: "rgb(247,247,250)",
    borderRadius: 20,
    width: 75,
    marginBottom: 10,
    marginTop: 0,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  headerContainer: {
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakAndMinutesContainer: {
    borderBottomColor: "rgb(247,247,250)",
    borderBottomWidth: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "stretch",
    paddingBottom: 15
  },
  wantToReadContainer: {
    paddingTop: 40
  },
  btnBlackText: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'GraphikMedium',
  },
  btnWhiteText: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'GraphikMedium'
  },

})

export default MyPageScreen
