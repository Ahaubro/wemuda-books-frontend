import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {MyPageNavigatorParamList} from '../types/NavigationTypes'
import MyPageScreen from '../screens/MyPage/MyPageScreen'
import BookListScreen from '../screens/MyPage/BookListScreen'

const Stack = createStackNavigator<MyPageNavigatorParamList>()

export default function MyPageNavigator() {
    return (
      <Stack.Navigator
        initialRouteName="MyPage"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="MyPage" component={MyPageScreen} />
        <Stack.Screen name="BookList" component={BookListScreen} />
  
      </Stack.Navigator>
    )
  }