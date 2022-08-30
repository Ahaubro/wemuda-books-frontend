import {useState, useEffect} from 'react'
import { Text, View, StyleSheet, Button } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useGetUserByIdQuery, User } from '../../redux/services/userApi'

interface MyPageScreenProps {}

const MyPageScreen: React.FC<MyPageScreenProps> = () => {
  const session = useSelector((state: RootState) => state.session)

  console.log(session.id)
  const user = useGetUserByIdQuery(session.id)

  //console.log(user.data);
  
  return (
    <View style={{margin: 20, marginTop: 50}}>
      <View style={{marginBottom: 20}}>
        <Text style={styles.heading}>{user.data?.firstName} {user.data?.lastName}</Text>
      </View>

      <View style={{ borderBottomColor: "#aaa", borderBottomWidth: 1, paddingBottom: 20, flex: 1, flexDirection: "row", justifyContent: "center", width: "100%", alignItems: "stretch" }}>
        <View style={{}}>
          <Text style={{color: "#aaa"}}>Reading streak</Text>
          <Text style={{fontSize: 20}}>? days</Text>
        </View>
        <View>
          <Text style={{color: "#aaa"}}>Minutes read</Text>
          <Text style={{fontSize: 20}}>? minutes</Text>
        </View>
      </View>
      
      <View style={{alignItems: "flex-start"}}>
        <Text style={styles.text}>My Books: (BookCount)</Text>
        <Text style={styles.text}>Books Read: (BookCount)</Text>
        <Text style={styles.text}>Minutes Read: (ActiveMinutes)</Text>
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
    fontSize: 20,
    color: "#aaa"
  },
  text: {
    fontSize: 20,
  }
})

export default MyPageScreen
