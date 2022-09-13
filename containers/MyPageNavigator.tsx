import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {MyPageNavigatorParamList} from '../types/NavigationTypes'
import MyPageScreen from '../screens/MyPage/MyPageScreen'
import BookListScreen from '../screens/MyPage/BookListScreen'
import SelectedBookScreen from '../screens/Books/SelectedBookScreen'
import WriteReviewScreen from '../screens/Books/WriteReviewScreen'

const Stack = createStackNavigator<MyPageNavigatorParamList>()

export default function MyPageNavigator() {
    return (
      <Stack.Navigator
        initialRouteName="MyPage"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="MyPage" component={MyPageScreen} />
        <Stack.Screen name="BookList" component={BookListScreen} />
        <Stack.Screen name="SelectedBookScreen" component={SelectedBookScreen} />
        <Stack.Screen name="WriteReviewScreen" component={WriteReviewScreen} />
  
      </Stack.Navigator>
    )
  }