import {useState, useEffect} from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'


interface MyPageScreenProps {}

const MyPageScreen: React.FC<MyPageScreenProps> = () => {
  const session = useSelector((state: RootState) => state.session)

  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Page</Text>
      <Text> Hello (username)</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'black',
  },
  text: {
    fontSize: 40,
    color: 'white',
  },
  welcome_text: {
    fontSize: 20,
    width:150,
    color: 'white',
  }
})

export default MyPageScreen
