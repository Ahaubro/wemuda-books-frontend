import {createStackNavigator} from '@react-navigation/stack'
import { AuthNavigatorParamList } from '../types/NavigationTypes'
import WelcomeScreen from '../screens/Login/WelcomeScreen'
import SignupScreen from '../screens/Login/SignupScreen'
import LoginScreen from '../screens/Login/LoginScreen'
import ForgotPasswordScreen from '../screens/Login/ForgotPasswordScreen'


const Stack = createStackNavigator<AuthNavigatorParamList>()

export default function AuthNavigator(){
    return (
        <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Welcome" component={WelcomeScreen}/>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="SignUp" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
    )
}