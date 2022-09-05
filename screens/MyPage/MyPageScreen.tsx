import {useState, useEffect} from 'react'
import { Text, View, StyleSheet, Button, Pressable, FlatList, Image } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useGetUserByIdQuery, User } from '../../redux/services/userApi'
import { useGetStatusUpdatesByUserQuery, StatusUpdate } from '../../redux/services/statusUpdateApi'
import { lte } from 'lodash'
import {GoogleBook, useGetBookByIdQuery, useLazyGetBookByIdQuery} from '../../redux/services/googleBookApi'
import Navigation from '../../containers/MyPageNavigator'
import { useGetBooksByUserIdQuery, Book } from '../../redux/services/bookApi'

interface MyPageScreenProps {
  navigation: any
}

const MyPageScreen: React.FC<MyPageScreenProps> = ({navigation}) => {
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

  const fetchedUserBooks = useGetBooksByUserIdQuery(session.id)

  useEffect(() => {
    setWantToReadState("Loading...")
    setHistoryState("Loading...")
  }, [])

  useEffect(() => {
    if(fetchedUserBooks.data){
      //console.log("Fetched:", fetchedUserBooks.data.books)
      setAllUserBooks(fetchedUserBooks.data.books)
    }
  }, [fetchedUserBooks.data])

  useEffect(() => {
    console.log("Filtering Books...")
    setWantToReadBooks(allUserBooks.filter(() => true/*book => book.status == "WantToRead"*/))
    setHistoryBooks(allUserBooks.filter(book => book.status == "HasRead"))
  }, [allUserBooks])

  useEffect(() => {
    console.log("Filtered WantToRead")
    console.log("WantToRead:", wantToReadBooks)
    setWantToReadState("No Books")
  }, [wantToReadBooks])

  //console.log("UserBooks:", allUserBooks)
  //console.log("WantToRead:", wantToReadBooks)
  useEffect(() => {
    console.log("Filtered History")
    console.log("History:", historyBooks)
    setHistoryState("No Books")
  }, [historyBooks])

  useEffect(() => {
    if(statusUpdates.data){
      //Count Minutes
      const totalMinutes = statusUpdates.data.statusUpdates.reduce((prev, next: StatusUpdate) => prev + next.minutesRead, 0)
      setMinutes(String(totalMinutes))

      //Count Streak
      let updatesInDay = []

      let dayBeginning = new Date(new Date().setHours(0, 0, 0, 0))
      let dayEnd = new Date(new Date(dayBeginning).setDate(dayBeginning.getDate() + 1))

      updatesInDay = statusUpdates.data.statusUpdates.filter((s:StatusUpdate) => {
        const time = new Date(s.timeOfUpdate)
        return dayBeginning <= time && time < dayEnd
      })

      let streakCounter = 0

      do{
        if(updatesInDay.length > 0)
          streakCounter++;

        dayEnd = dayBeginning
        dayBeginning = new Date(new Date(dayBeginning).setDate(dayBeginning.getDate() - 1))

        updatesInDay = statusUpdates.data.statusUpdates.filter((s:StatusUpdate) => {
          const time = new Date(s.timeOfUpdate)
          return dayBeginning <= time && time < dayEnd
        })
      }while(updatesInDay.length > 0);

      setStreak(String(streakCounter))

    }
  }, [statusUpdates.data])

  const thumbDefault = 'https://books.google.com/books/content?id=qc8qvXhpLA0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'


  // const [bookIds] = useState(["QCF9AHclv_4C", "WZKHswEACAAJ", "9PuctAEACAAJ", "hoDePAAACAAJ", "ZSfqxgKbrWMC"])

  // const [getBook] = useLazyGetBookByIdQuery()

  // useEffect(() => {
  //   bookIds.forEach(id => {
  //     getBook({ id }).unwrap().then((data) => {
  //       console.log(id, data)
  //       books.push(data?.book)
  //     })
  //   })
  // }, [bookIds])

  // console.log(books)
  
  return (
    <View style={{margin: 20, marginTop: 50}}>
      <View style={{marginBottom: 20}}>
        <Text style={styles.heading}>{user.data?.firstName} {user.data?.lastName}</Text>
      </View>

      <View style={{ borderBottomColor: "#AAA", borderBottomWidth: 2, paddingBottom: 20, flex: 1, flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "stretch" }}>
        <View>
          <Text style={{color: "#AAA"}}>Reading streak</Text>
          <Text style={{fontSize: 20}}><Text style={{fontWeight: "bold"}}>{streak}</Text> days</Text>
        </View>
        <View>
          <Text style={{color: "#AAA"}}>Minutes read</Text>
          <Text style={{fontSize: 20}}><Text style={{fontWeight: "bold"}}>{minutes}</Text> minutes</Text>
        </View>
        <View></View>
      </View>
      
      <View style={{marginTop: 20}}>
        <Text style={styles.subHeading}>Want to read</Text>
        {wantToReadBooks.length > 0 ?
          <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={wantToReadBooks} style={{padding: 0, margin: 0, height: 65}} renderItem={( ({item:book}) =>
            <View style={{margin: 0, padding: 0, marginRight: 10}}>
              <Image
                source={{ uri: book.thumbnail }}
                defaultSource={{ uri: thumbDefault }}
                style={{ width: 50, height: 65 }}
              />
            </View>
          )}
          />
          :
          <View style={{height: 65, paddingBottom: 20}}><Text>{wantToReadState}</Text></View>
        }
        <View style={{width: "100%", flex: 1, flexDirection: "row", justifyContent: "center"}}>
          <Pressable style={styles.buttonGray} onPress={() => { 
            if(wantToReadBooks.length > 0)
              navigation.navigate('BookList', {books: wantToReadBooks, title: "Want to read"})
            }}><Text style={{fontWeight: "bold"}}>Se alle</Text></Pressable>
        </View>
      </View>

      <View style={{marginTop: 20}}>
        <Text style={styles.subHeading}>My history</Text>
          {historyBooks.length > 0 ?
            <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={historyBooks} style={{padding: 0, margin: 0, height: 65}} renderItem={( ({item:book}) =>
              <View style={{margin: 0, padding: 0, marginRight: 10}}>
                <Image
                  source={{ uri: book.thumbnail }}
                  defaultSource={{ uri: thumbDefault }}
                  style={{ width: 50, height: 65 }}
                />
              </View>
            )}
            />
            :
            <View style={{height: 65, paddingBottom: 20}}><Text>{historyState}</Text></View>
          }

        <View style={{width: "100%", flex: 1, flexDirection: "row", justifyContent: "center"}}>
          <Pressable style={styles.buttonGray}  onPress={() => {
            if(historyBooks.length > 0)
              navigation.navigate('BookList', {books: historyBooks, title: "My history"})
          }}><Text style={{fontWeight: "bold"}}>Se alle</Text></Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 30,
  },
  subHeading: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10
  },
  text: {
    fontSize: 20,
  },
  buttonGray: {
      fontSize: 12,
      fontWeight: 700,
      fontFamily: "sans-serif",
      textAlign: "center",
      backgroundColor: "#DDD",
      borderRadius: 15,
      width: "fit-content",
      marginBottom: 10,
      marginTop: 0,
      paddingHorizontal: 15,
      paddingVertical: 10,
      height: "fit-content"
  }
})

export default MyPageScreen
