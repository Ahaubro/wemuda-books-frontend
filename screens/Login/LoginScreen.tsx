import React, { useState } from 'react'
import { Button, StyleSheet, Text, View, TextInput } from 'react-native'
import {useLoginMutation, useSignupMutation, User} from '../../redux/services/userApi'
import { useStore, useDispatch } from 'react-redux'
import { RootState } from '../../redux/store'
import store from '../../redux/store'
import { endSession, startSession } from '../../redux/slices/sessionSlice'
// import Ionicons from '@expo/vector-icons/Ionicons'
// import Entypo from '@expo/vector-icons/Entypo'
// import { StatusBar } from 'expo-status-bar'
// import { FONTS } from '../../utils/fontUtils'
// import i18n from 'i18n-js'

interface LoginScreenProps {}

const LoginScreen: React.FC<LoginScreenProps> = () => {

    const [loginInputs, setLoginInputs] = useState<{ username: string, password: string }>({ username: "", password: "" })
    const [signupInputs, setSignupInputs] = useState<{ firstname: string, lastname: string, username: string, password: string }>({ firstname: "", lastname: "", username: "", password: "" })
    const [signupScreen, setSignupScreen] = useState<boolean>(false)

    const dispatch = useDispatch()
    const [login] = useLoginMutation()
    const [signup] = useSignupMutation()

    return (<View style={styles.container}>
        {!signupScreen &&
            <View>
                <Text style={styles.heading}>Login</Text>
                <View  style={{flexDirection: "column"}}>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={styles.label}>Username:</Text>
                        <TextInput onChangeText={u => {
                            setLoginInputs({...loginInputs, username: u})
                        }} style={styles.textInput}></TextInput>
                    </View>

                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={styles.label}>Password:</Text>
                        <TextInput onChangeText={p => {
                            setLoginInputs({...loginInputs, password: p})
                        }} secureTextEntry={true} style={styles.textInput}></TextInput>
                    </View>

                    <View style={{marginTop: 20, marginBottom: 30}}>
                        <Button title="Login" onPress={() => {
                            if(loginInputs.username && loginInputs.password){
                                login({...loginInputs}).unwrap().then(res => {
                                    if(res.token) {
                                        console.log(res.token)
                                        dispatch( startSession({ token: res.token, id: store.getState().session.id }) )
                                    }
                                    console.log(store.getState().session)
                                })
                            }
                        }}></Button>
                    </View>

                    <View>
                        <Button title="Go to Signup" onPress={() => {setSignupScreen(true)}}></Button>
                    </View>
                </View>
            </View>
        }
        {signupScreen &&
            <View>
                <Text style={styles.heading}>Sign Up</Text>
                <View  style={{flexDirection: "column"}}>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={styles.label}>First name:</Text>
                        <TextInput onChangeText={f => {
                            setSignupInputs({...signupInputs, firstname: f})
                        }} style={styles.textInput}></TextInput>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={styles.label}>Last name:</Text>
                        <TextInput onChangeText={l => {
                            setSignupInputs({...signupInputs, lastname: l})
                        }} style={styles.textInput}></TextInput>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={styles.label}>Username:</Text>
                        <TextInput onChangeText={u => {
                            setSignupInputs({...signupInputs, username: u})
                        }} style={styles.textInput}></TextInput>
                    </View>
    
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={styles.label}>Password:</Text>
                        <TextInput onChangeText={p => {
                            setSignupInputs({...signupInputs, password: p})
                        }} secureTextEntry={true} style={styles.textInput}></TextInput>
                    </View>

                    <View style={{marginTop: 20, marginBottom: 30}}>
                        <Button title="Sign Up" onPress={() => {
                            if(signupInputs.firstname && signupInputs.lastname && signupInputs.username && signupInputs.password){
                                signup(signupInputs).unwrap().then(() => {
                                    setSignupScreen(false)
                                })
                            }
                        }}></Button>
                    </View>

                    <View>
                        <Button title="Go to Login" onPress={() => {setSignupScreen(false)}}></Button>
                    </View>
    
                </View>
            </View>
        }
    </View>)
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    heading: {
      fontSize: 40,
      marginBottom: 20
    },
    label: {
      fontSize: 20,
      marginEnd: 20
    },
    textInput: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "black",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginVertical: 10,
        fontSize: 20
    }
  })

export default LoginScreen