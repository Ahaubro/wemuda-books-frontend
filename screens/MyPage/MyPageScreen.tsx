import { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Button, Pressable, FlatList, Image, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useGetUserByIdQuery, User } from '../../redux/services/userApi'
import { useGetStatusUpdatesByUserQuery, StatusUpdate } from '../../redux/services/statusUpdateApi'
import { lte } from 'lodash'
import { GoogleBook, useGetBookByIdQuery, useLazyGetBookByIdQuery } from '../../redux/services/googleBookApi'
import Navigation from '../../containers/MyPageNavigator'
import { useGetBooksByUserIdQuery, Book } from '../../redux/services/bookApi'
import DeafultView from "../../components/DefaultView"

interface MyPageScreenProps {
  navigation: any
}

const MyPageScreen: React.FC<MyPageScreenProps> = ({ navigation }) => {
  const session = useSelector((state: RootState) => state.session)

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

  useEffect(() => {
    setWantToReadState("Loading...")
    setHistoryState("Loading...")
  }, [])

  useEffect(() => {
    if (fetchedUserBooks.data) {
      //console.log("Fetched:", fetchedUserBooks.data.books)
      setAllUserBooks(fetchedUserBooks.data.books)
    }
  }, [fetchedUserBooks.data])

  useEffect(() => {
    //console.log("Filtering Books...")
    setWantToReadBooks(allUserBooks.filter(book => book.bookStatus == "WantToRead"))
    setHistoryBooks(allUserBooks.filter(book => book.bookStatus == "History"))
  }, [allUserBooks])

  useEffect(() => {
    //console.log("Filtered WantToRead")
    //console.log("WantToRead:", wantToReadBooks)
    setWantToReadState("No Books")
  }, [wantToReadBooks])

  //console.log("UserBooks:", allUserBooks)
  //console.log("WantToRead:", wantToReadBooks)
  useEffect(() => {
    //console.log("Filtered History")
    //console.log("History:", historyBooks)
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

  const thumbDefault = 'https://books.google.com/books/content?id=qc8qvXhpLA0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'


  return (
    <DeafultView>
      
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>{user.data?.firstName} {user.data?.lastName} </Text>
        </View>


        <View style={styles.streakAndMinutesContainer}>
          <View>
            <Text style={{ color: "#AAA", paddingVertical: 5 }}>Reading streak</Text>
            <Text style={{ fontWeight: "700", fontSize: 22 }}>{streak} <Text style={{ fontSize: 14, fontWeight: "700" }}> days </Text></Text>
          </View>

          <View>
            <Text style={{ color: "#AAA", paddingVertical: 5 }}>Minutes read</Text>
            <Text style={{ fontWeight: "700", fontSize: 22 }}>{minutes} <Text style={{ fontSize: 14, fontWeight: "700" }}> minutes </Text></Text>
          </View>
          <View></View>
        </View>


        <View style={styles.wantToReadContainer}>
          <Text style={styles.subHeading}>Want to read</Text>
          {wantToReadBooks.length > 0 ?
            <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={wantToReadBooks} renderItem={(({ item: book }) =>
              <View style={{paddingHorizontal: 5}}>
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
                    defaultSource={{ uri: thumbDefault }}
                    style={{ width: 90, height: 130, borderWidth: 0.5, borderColor: "#d3d3d3", borderRadius: 3 }}
                  />

                </TouchableOpacity>
              </View>

            )}
            />
            :

            <View style={{ height: 70, paddingBottom: 20 }}><Text>{wantToReadState}</Text></View>
          }
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10}}>
            <Pressable style={styles.buttonGray} onPress={() => {
              if (wantToReadBooks.length > 0)
                navigation.navigate('BookList', { books: wantToReadBooks, title: "Want to read" })
            }}><Text style={{ fontSize: 12, fontWeight: "500" }}>See all</Text></Pressable>
          </View>
        </View>



        <View style={styles.wantToReadContainer}>
          <Text style={styles.subHeading}>My history</Text>
          {historyBooks.length > 0 ?
            <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={historyBooks} renderItem={(({ item: book }) =>
              <View style={{paddingHorizontal: 5}}>
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
                    defaultSource={{ uri: thumbDefault }}
                    style={{ width: 90, height: 130, borderWidth: 0.5, borderColor: "#d3d3d3", borderRadius: 3 }}
                  />
                </TouchableOpacity>
              </View>
            )}
            />
            :

            <View style={{ height: 65, paddingBottom: 20 }}><Text>{historyState}</Text></View>
          }

          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
            <Pressable style={styles.buttonGray} onPress={() => {
              if (historyBooks.length > 0)
                navigation.navigate('BookList', { books: historyBooks, title: "My history" })
            }}><Text style={{ fontSize: 12, fontWeight: "500" }}>See all</Text></Pressable>
          </View>
        </View>

    </DeafultView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
  },
  subHeading: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5
  },
  text: {
    fontSize: 20,
  },
  buttonGray: {
    fontFamily: "sans-serif",
    textAlign: "center",
    fontWeight: "600",
    backgroundColor: "rgb(242,242,242)",
    borderRadius: 15,
    width: 80,
    marginBottom: 10,
    marginTop: 0,
    paddingHorizontal: 8,
    paddingVertical: 8,
    height: "fit-content"
  },
  headerContainer:{
    paddingTop: 60,
    paddingVertical: 25
  },
  streakAndMinutesContainer:{
    borderBottomColor: "rgb(242,242,242)", 
    borderBottomWidth: 0.5, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    width: "100%", 
    alignItems: "stretch", 
    paddingBottom: 15 
  },
  wantToReadContainer:{
    paddingTop: 30
  }
})

export default MyPageScreen
