import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/Home/HomeScreen'
import SettingsScreen from '../screens/Settings/SettingsScreen'
import BooksScreen from '../screens/Books/Books'
import MyPageScreen from '../screens/MyPage/MyPageScreen'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import LoginScreen from '../screens/Login/LoginScreen'
import { TabNavigationParamList } from '../types/NavigationTypes'
import BookNavigator from './BookNavigator'
import MyPageNavigator from './MyPageNavigator'
import HomeNavigator from './HomeNavigator'
import { Colors } from 'react-native/Libraries/NewAppScreen'

interface NavigationProps {}

const Tab = createBottomTabNavigator<TabNavigationParamList>()

const Navigation: React.FC<NavigationProps> = () => {

  const session = useSelector((state: RootState) => state.session)

  const myTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'rgb(255, 45, 85)',
      background:'white'
    },
  };

  return (
    <NavigationContainer theme={myTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "black",
          tabBarStyle:{},
          tabBarIcon: ({ focused, color, size }) => {
            let iconName

            if (route.name === 'HomeNavigator') {
              iconName = focused ? 'book': 'book'
            } else if (route.name === 'Settings') {
              iconName = focused ? 'ios-list' : 'ios-list-outline'
            } else if(route.name === 'MyPageNavigator') {
              iconName = focused ? 'person': 'person'
            } else if(route.name === 'BooksNavigator') {
              iconName = focused ? 'search': 'search-sharp'
            } else if(route.name === 'Login') {
              iconName = focused ? 'key-sharp': 'key-outline'
            }

            return <Ionicons name={iconName as any} size={30} color={color} />
          },
        })}
      >
        {session.token && session.token != "guest" &&
          <>
            <Tab.Screen name="HomeNavigator" component={HomeNavigator} options={{title: "Home"}} />
            <Tab.Screen name="BooksNavigator" component={BookNavigator} options={{title: 'Search'}} />
            <Tab.Screen name="MyPageNavigator" component={MyPageNavigator} options={{title: 'Profile'}} />
          </>
        }

        { session.token && session.token == "guest" &&
          <>
            <Tab.Screen name="BooksNavigator" component={BookNavigator} options={{title: 'Search', tabBarStyle: {display: 'none'}}} />
          </>
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
