import React from 'react'
import {
  createStackNavigator,
} from '@react-navigation/stack'

import HomeScreen from "../screens/Home/HomeScreen"
import UpdateStatusScreen from "../screens/Home/UpdateStatusScreen"

import {HomeNavigatorParamList} from "../types/navigationTypes"

const Stack = createStackNavigator<HomeNavigatorParamList>()

export default function HomeNavigator(){
    return (
        <Stack.Navigator
            initialRouteName = 'Home'
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Home" component={HomeScreen}/>
            <Stack.Screen name="UpdateStatus" component={UpdateStatusScreen} />
        </Stack.Navigator>
    )
}