import React from 'react'
import { Text, View, StyleSheet, Button } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../redux/store'
import { endSession } from '../../redux/slices/sessionSlice'

interface SettingsScreenProps {}

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const session = useSelector((state: RootState) => state.session)

  const dispatch = useDispatch()

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings</Text>
      {session.token &&
        <View style={{marginTop: 20}}>
          <Button title="Log Out" onPress={() => endSession()}></Button>
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30
  }
})

export default SettingsScreen
