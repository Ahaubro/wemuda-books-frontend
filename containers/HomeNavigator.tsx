import React from 'react'
import {
    createStackNavigator,
} from '@react-navigation/stack'

import HomeScreen from "../screens/Home/HomeScreen"
import UpdateStatusScreen from "../screens/Home/UpdateStatusScreen"
import SelectedBookScreen from '../screens/Books/SelectedBookScreen'
import BookScreen from "../screens/Books/Books"
import UpdateGoalScreen from '../screens/Home/UpdateGoalScreen'
import SelectedBookMoreScreen from "../screens/Books/SelectedBookMoreScreen"
import { HomeNavigatorParamList } from "../types/navigationTypes"
import WriteReviewScreen from '../screens/Books/WriteReviewScreen'
import AllReviewsScreen from '../screens/Books/AllReviewsScreen'
import ChooseBookToUpdateScreen from '../screens/Home/ChooseBookToUpdateScreen'

const Stack = createStackNavigator<HomeNavigatorParamList>()

export default function HomeNavigator() {
    return (
        <Stack.Navigator
            initialRouteName='Home'
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="UpdateStatus" component={UpdateStatusScreen} />
            <Stack.Screen name="SelectedBookScreen" component={SelectedBookScreen} />
            <Stack.Screen name="SelectedBookMoreScreen" component={SelectedBookMoreScreen} />
            <Stack.Screen name="BookScreen" component={BookScreen} />
            <Stack.Screen name="UpdateGoalScreen" component={UpdateGoalScreen} />
            <Stack.Screen name="WriteReviewScreen" component={WriteReviewScreen} />
            <Stack.Screen name="AllReviewsScreen" component={AllReviewsScreen} />
            <Stack.Screen name="ChooseBookToUpdateScreen" component={ChooseBookToUpdateScreen} />


        </Stack.Navigator>
    )
}