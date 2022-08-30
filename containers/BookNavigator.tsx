import React from 'react'
import {
  createStackNavigator,
} from '@react-navigation/stack'
import BooksScreen from '../screens/Books/Books'
import SelectedBookScreen from "../screens/Books/SelectedBookScreen"

import { BookNavigatorParamList } from '../types/NavigationTypes'

const Stack = createStackNavigator<BookNavigatorParamList>()

export default function BookNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Books"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Books" component={BooksScreen} />
      <Stack.Screen name="SelectedBookScreen" component={SelectedBookScreen} />
    </Stack.Navigator>
  )
}