import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/Home/HomeScreen'
import SettingsScreen from '../screens/Settings/SettingsScreen'
import BooksScreen from '../screens/Books/Books'
import MyPageScreen from '../screens/MyPage/MyPage'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import LoginScreen from '../screens/Login/LoginScreen'

interface NavigationProps {}

const Tab = createBottomTabNavigator()

const Navigation: React.FC<NavigationProps> = () => {

  const session = useSelector((state: RootState) => state.session)

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
            } else if(route.name === 'Login') {
              iconName = focused ? 'key-sharp': 'key-outline'
            }

            return <Ionicons name={iconName as any} size={size} color={color} />
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        {session.token ? (<>
          <Tab.Screen name="Books" component={BooksScreen} />
          <Tab.Screen name="MyPage" component={MyPageScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </>) : (<>
          <Tab.Screen name="Login" component={LoginScreen}></Tab.Screen>
        </>)}
        
        
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default Navigation
