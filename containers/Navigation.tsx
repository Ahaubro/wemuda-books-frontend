import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/Home/HomeScreen'
import SettingsScreen from '../screens/Settings/SettingsScreen'
import BooksScreen from '../screens/Books/Books'
import MyPageScreen from '../screens/MyPage/MyPage'
import Ionicons from '@expo/vector-icons/Ionicons'

interface NavigationProps {}

const Tab = createBottomTabNavigator()

const Navigation: React.FC<NavigationProps> = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline'
            } else if (route.name === 'Settings') {
              iconName = focused ? 'ios-list' : 'ios-list-outline'
            } else if(route.name === 'MyPage') {
              iconName = focused ? 'person': 'person-outline'
            } else if(route.name === 'Books') {
              iconName = focused ? 'book': 'book-outline'
            }

            return <Ionicons name={iconName as any} size={size} color={color} />
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Books" component={BooksScreen} />
        <Tab.Screen name="MyPage" component={MyPageScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default Navigation
