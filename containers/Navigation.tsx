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
import { TabNavigationParamList } from '../types/NavigationTypes'
import BookNavigator from './BookNavigator'

interface NavigationProps {}

const Tab = createBottomTabNavigator<TabNavigationParamList>()

const Navigation: React.FC<NavigationProps> = () => {

  const session = useSelector((state: RootState) => state.session)

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName

            if (route.name === 'Home') {
              iconName = focused ? 'book': 'book-outline'
            } else if (route.name === 'Settings') {
              iconName = focused ? 'ios-list' : 'ios-list-outline'
            } else if(route.name === 'MyPage') {
              iconName = focused ? 'person': 'person-outline'
            } else if(route.name === 'BooksNavigator') {
              iconName = focused ? 'search': 'search-outline'
            } else if(route.name === 'Login') {
              iconName = focused ? 'key-sharp': 'key-outline'
            }

            return <Ionicons name={iconName as any} size={size} color={color} />
          },
        })}
      >
        {session.token && session.token != "guest" &&
          <>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="BooksNavigator" component={BookNavigator} options={{title: 'Search'}} />
            <Tab.Screen name="MyPage" component={MyPageScreen} options={{title: 'Profile'}} />
          </>
        }

        { session.token && session.token == "guest" &&
          <Tab.Screen name="BooksNavigator" component={BookNavigator} options={{title: 'Search'}} />
        }


        {!session.token && 
          <>
            <Tab.Screen name="Login" component={LoginScreen} options={{tabBarStyle: {display: 'none'}}}></Tab.Screen>
          </>
        }
        
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default Navigation
