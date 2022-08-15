import React from 'react'
import { Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

interface SettingsScreenProps {}

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const session = useSelector((state: RootState) => state.session)

  return (
    <View>
      <Text>Settings!</Text>
      <Text>{session.token}</Text>
    </View>
  )
}

export default SettingsScreen
