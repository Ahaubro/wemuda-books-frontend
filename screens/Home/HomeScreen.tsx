import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import Entypo from '@expo/vector-icons/Entypo'
import { StatusBar } from 'expo-status-bar'
import { FONTS } from '../../utils/fontUtils'
import i18n from 'i18n-js'

interface HomeScreenProps {}

const HomeScreen: React.FC<HomeScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Inter Black</Text>
      <Text style={styles.text}>Platform Default</Text>
      <Text style={styles.text}>{i18n.t('hello')}</Text>
      <Ionicons name="md-checkmark-circle" size={32} color="green" />
      <Entypo name="rocket" size={30} />

      <StatusBar style="dark" />
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
    fontFamily: FONTS.bold,
    fontSize: 40,
  },
  text: {
    fontSize: 40,
  },
})

export default HomeScreen
