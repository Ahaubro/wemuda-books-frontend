import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Pressable, FlatList, Image } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import Entypo from '@expo/vector-icons/Entypo'
import { StatusBar } from 'expo-status-bar'
import { FONTS } from '../../utils/fontUtils'
import i18n from 'i18n-js'
import { useGetBooksQuery, Book, useGetBooksByUserIdQuery, useDeleteBookMutation, useAddBookMutation, useUpdateBookMutation } from "../../redux/services/bookApi"
import { useGetUserByIdQuery } from "../../redux/services/userApi"
import { useSelector } from "react-redux"
import { RootState } from '../../redux/store'
import { useGetStatusUpdatesByUserQuery, StatusUpdate } from '../../redux/services/statusUpdateApi'

interface HomeScreenProps { }

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const session = useSelector((state: RootState) => state.session)

  const user = useGetUserByIdQuery(session.id)

  const [streak, setStreak] = useState("?");
  const [minutes, setMinutes] = useState("?");

  const statusUpdates = useGetStatusUpdatesByUserQuery(session.id);

  //Arex igang med currentlyReadning
  const userBooks = useGetBooksByUserIdQuery(session.id)
  const userBooksArr = userBooks.data?.books
  let currentlyReadingBook: string | undefined = ""
  
  userBooksArr?.forEach( (book) => {
    if(book.bookStatus == "CurrentlyReading") {
      currentlyReadingBook = book.thumbnail
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

      do{
        if(updatesInDay.length > 0)
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
    <View>

      {session.token && userBooks.data?.books &&

        <View style={{ flex: 1, alignItems: "center", marginTop: 50, width: "100%", paddingHorizontal: 10 }}>

          
          <View style={{ flex: 1, alignItems: "center", paddingBottom: 30 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Currently reading</Text>
            

            {currentlyReadingBook ?
                  <Image
                    source={{ uri: currentlyReadingBook }}
                    style={{ width: 100, height: 150, borderRadius: 3 }}
                  />
                  :
                  <div style={{ width: 50, height: 65, backgroundColor: "#ccc", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    No image
                  </div>
                }


            <Pressable style={{ ...styles.buttonGray, marginTop: 25 }}><Text style={{ fontWeight: "bold" }}>Update progress</Text></Pressable>
          </View>

          

          <View style={{borderBottomColor: "#AAA", borderBottomWidth: 2, width: "100%", paddingBottom: 10}}>
            <Text style={{color: "#AAA"}}>Reading Challenge</Text>
            <Text style={{fontWeight: "bold"}}><Text style={{fontSize: 20}}>?/?</Text> books read</Text>
          </View>

          <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
            <View>
              <Text style={{color: "#AAA"}}>Reading streak</Text>
              <Text style={{fontSize: 20}}><Text style={{fontWeight: "bold"}}>{streak}</Text> days</Text>
            </View>
            <View>
              <Text style={{color: "#AAA"}}>Minutes read</Text>
              <Text style={{fontSize: 20}}><Text style={{fontWeight: "bold"}}>{minutes}</Text> minutes</Text>
            </View>
            
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

export default HomeScreen
