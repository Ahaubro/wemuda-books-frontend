import {useState, useEffect} from 'react'
import { Text, View, StyleSheet, Button, Pressable, FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useGetUserByIdQuery, User } from '../../redux/services/userApi'
import { useGetStatusUpdatesByUserQuery, StatusUpdate } from '../../redux/services/statusUpdateApi'
import { lte } from 'lodash'

interface MyPageScreenProps {}

const MyPageScreen: React.FC<MyPageScreenProps> = () => {
  const session = useSelector((state: RootState) => state.session)
  
  const user = useGetUserByIdQuery(session.id)

  const [streak, setStreak] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const statusUpdates = useGetStatusUpdatesByUserQuery(session.id)

  useEffect(() => {
    if(statusUpdates.data){
      const totalMinutes = statusUpdates.data.statusUpdates.reduce((prev, next: StatusUpdate) => prev + next.minutesRead, 0)
      setMinutes(totalMinutes)

      let updatesInDay = []

      let dayBeginning = new Date(new Date().setHours(0, 0, 0, 0))
      let dayEnd = new Date(new Date(dayBeginning).setDate(dayBeginning.getDate() + 1))

      updatesInDay = statusUpdates.data.statusUpdates.filter((s:StatusUpdate) => {
        const time = new Date(s.timeOfUpdate)
        return dayBeginning <= time && time < dayEnd
      })

      let streakCounter = 0

      do{
        streakCounter++;
        dayEnd = dayBeginning
        dayBeginning = new Date(new Date(dayBeginning).setDate(dayBeginning.getDate() - 1))
        updatesInDay = statusUpdates.data.statusUpdates.filter((s:StatusUpdate) => {
          const time = new Date(s.timeOfUpdate)
          return dayBeginning <= time && time < dayEnd
        })
      }while(updatesInDay.length > 0);

      setStreak(streakCounter)

    }
  }, [statusUpdates.data])
  
  const [emptyBooks] = useState([1,2,3,4,5,6,7,8,9])
  
  return (
    <View style={{margin: 20, marginTop: 50}}>
      <View style={{marginBottom: 20}}>
        <Text style={styles.heading}>{user.data?.firstName} {user.data?.lastName}</Text>
      </View>

      <View style={{ borderBottomColor: "#aaa", borderBottomWidth: 1, paddingBottom: 20, flex: 1, flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "stretch" }}>
        <View>
          <Text style={{color: "#aaa"}}>Reading streak</Text>
          <Text style={{fontSize: 20}}><Text style={{fontWeight: "bold"}}>{streak}</Text> days</Text>
        </View>
        <View>
          <Text style={{color: "#aaa"}}>Minutes read</Text>
          <Text style={{fontSize: 20}}><Text style={{fontWeight: "bold"}}>{minutes}</Text> minutes</Text>
        </View>
        <View></View>
      </View>
      
      <View style={{marginTop: 20}}>
        <Text style={styles.subHeading}>Want to read</Text>
        <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={emptyBooks} renderItem={( ({item}) => (
          <View style={{marginRight: 10}}>
            <Text style={{width: 75, height: 100, backgroundColor: "#DDD"}}></Text>
          </View>
        ) )}
        />
        <View style={{width: "100%", flex: 1, flexDirection: "row", justifyContent: "center"}}>
          <Pressable style={styles.buttonGray}><Text style={{fontWeight: "bold"}}>Se alle</Text></Pressable>
        </View>
      </View>

      <View style={{marginTop: 20}}>
        <Text style={styles.subHeading}>My history</Text>
        <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={emptyBooks} renderItem={( ({item}) => (
          <View style={{marginRight: 10}}>
            <Text style={{width: 75, height: 100, backgroundColor: "#DDD"}}></Text>
          </View>
        ) )}
        />
        <View style={{width: "100%", flex: 1, flexDirection: "row", justifyContent: "center"}}>
          <Pressable style={styles.buttonGray}><Text style={{fontWeight: "bold"}}>Se alle</Text></Pressable>
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
