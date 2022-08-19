import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

interface SettingsScreenProps {}

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const session = useSelector((state: RootState) => state.session)

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings!</Text>
      {/*<Text style={styles.text}>{session.token}</Text>*/}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    fontSize: 30,
    color: 'white',
  }
})

export default SettingsScreen
