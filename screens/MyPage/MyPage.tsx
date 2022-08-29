import {useState, useEffect} from 'react'
import { Text, View, StyleSheet, Button } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'


interface MyPageScreenProps {}

const MyPageScreen: React.FC<MyPageScreenProps> = () => {
  const session = useSelector((state: RootState) => state.session)

  return (
    <View style={styles.container}>
      <View style={{marginBottom: 20, alignItems: "center"}}>
        <Text style={{width: 250, height: 250, backgroundColor: "#aaa"}}></Text>
        <Text style={styles.heading}>(Firstname) (Lastname)</Text>
        <Text style={styles.subHeading}>(Username)</Text>
      </View>
      
      <View style={{alignItems: "flex-start"}}>
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
