import React from 'react'
import {
  createStackNavigator,
} from '@react-navigation/stack'
import BooksScreen from '../screens/Books/Books'
import SelectedBookScreen from "../screens/Books/SelectedBookScreen"
import SelectedBookMoreScreen from '../screens/Books/SelectedBookMoreScreen'
import WriteReviewScreen from '../screens/Books/WriteReviewScreen'
import AllReviewsScreen from '../screens/Books/AllReviewsScreen'
import LoginScreen from '../screens/Login/LoginScreen'

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
      <Stack.Screen name="SelectedBookMoreScreen" component={SelectedBookMoreScreen} />
      <Stack.Screen name="WriteReviewScreen" component={WriteReviewScreen} />
      <Stack.Screen name="AllReviewsScreen" component={AllReviewsScreen} />

    </Stack.Navigator>
  )
}