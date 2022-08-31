import React, { useState } from 'react'
import { Button, StyleSheet, Text, View, TextInput, Pressable } from 'react-native'
import {useLoginMutation, useSignupMutation, User} from '../../redux/services/userApi'
import { useStore, useDispatch } from 'react-redux'
// import { RootState } from '../../redux/store'
import store from '../../redux/store'
import { startSession } from '../../redux/slices/sessionSlice'
import Ionicons from '@expo/vector-icons/Ionicons'
// import Entypo from '@expo/vector-icons/Entypo'
// import { StatusBar } from 'expo-status-bar'
// import { FONTS } from '../../utils/fontUtils'
// import i18n from 'i18n-js'

interface LoginScreenProps {}

const LoginScreen: React.FC<LoginScreenProps> = () => {

    const [loginInputs, setLoginInputs] = useState<{ username: string, password: string }>({ username: "", password: "" })
    const [signupInputs, setSignupInputs] = useState<{ firstname: string, lastname: string, username: string, email: string, password: string }>({ firstname: "", lastname: "", username: "", email: "", password: "" })
    const [forgotPasswordInputs, setForgotPasswordInputs] = useState<{ username: string, email: string }>({ username: "", email: "" })
    const [screen, setScreen] = useState<string>("login")

    const dispatch = useDispatch()
    const [login] = useLoginMutation()
    const [signup] = useSignupMutation()

    return (<View style={styles.container}>
        {screen == "login" &&
            <View>
                <View style={{width: "100%", justifyContent: "center"}}><Text style={styles.heading}>Log in</Text></View>
                <View  style={{flexDirection: "column"}}>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.label}>Brugernavn</Text>
                        <TextInput placeholder="Indtast Brugernavn" placeholderTextColor={"#AAAAAA"} onChangeText={username => {
                            setLoginInputs({...loginInputs, username})
                        }} style={styles.textInput}></TextInput>
                    </View>

                    <View style={{marginVertical: 5}}>
                        <Text style={styles.label}>Kodeord</Text>
                        <TextInput placeholder="Indtast Kodeord" placeholderTextColor={"#AAAAAA"} onChangeText={password => {
                            setLoginInputs({...loginInputs, password})
                        }} secureTextEntry={true} style={styles.textInput}></TextInput>
                    </View>

                    <View>
                        <Pressable style={styles.buttonBlack} onPress={() => {
                            if(loginInputs.username && loginInputs.password){
                                login({...loginInputs}).unwrap().then(res => {
                                    console.log("response:", res)
                                    if(res.token) {
                                        console.log("session values:", { token: res.token, id: res.id })
                                        dispatch( startSession({ token: res.token, id: res.id }) )
                                    }
                                })
                            }
                        }}>Log ind</Pressable>
                    </View>

                    <View style={{marginVertical: 5}}>
                        <Pressable style={styles.buttonWhite} onPress={() => {setScreen("forgot password")}}>Glemt kodeord</Pressable>
                    </View>

                    <View>
                        <Pressable style={styles.buttonWhite} onPress={() => {setScreen("signup")}}>Opret bruger</Pressable>
                    </View>
                </View>
            </View>
        }

        {screen == "signup" &&
            <View>

                <View style={{marginVertical: 10}}>
                    <Pressable onPress={() => {setScreen("login")}}><Ionicons name={"ios-arrow-back" as any} color="black" style={{fontSize: 30}}/></Pressable>
                </View>

                <View><Text style={styles.heading}>Opret bruger</Text></View>
                <View  style={{flexDirection: "column"}}>
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.label}>Fornavn:</Text>
                        <TextInput placeholder="Indtast fornavn" placeholderTextColor={"#AAAAAA"} onChangeText={firstname => {
                            setSignupInputs({...signupInputs, firstname})
                        }} style={styles.textInput}></TextInput>
                    </View>

                    <View style={{marginVertical: 5}}>
                        <Text style={styles.label}>Efternavn:</Text>
                        <TextInput placeholder="Indtast efternavn" placeholderTextColor={"#AAAAAA"} onChangeText={lastname => {
                            setSignupInputs({...signupInputs, lastname})
                        }} style={styles.textInput}></TextInput>
                    </View>

                    <View style={{marginVertical: 5}}>
                        <Text style={styles.label}>Brugernavn:</Text>
                        <TextInput placeholder="Indtast brugernavn" placeholderTextColor={"#AAAAAA"} onChangeText={username => {
                            setSignupInputs({...signupInputs, username})
                        }} style={styles.textInput}></TextInput>
                    </View>

                    <View style={{marginVertical: 5}}>
                        <Text style={styles.label}>Email:</Text>
                        <TextInput placeholder="Indtast email" placeholderTextColor={"#AAAAAA"} onChangeText={email => {
                            setSignupInputs({...signupInputs, email})
                        }} style={styles.textInput}></TextInput>
                    </View>
    
                    <View style={{marginVertical: 5}}>
                        <Text style={styles.label}>Kodeord:</Text>
                        <TextInput placeholder="Indtast kodeord" placeholderTextColor={"#AAAAAA"} onChangeText={password => {
                            setSignupInputs({...signupInputs, password})
                        }} secureTextEntry={true} style={styles.textInput}></TextInput>
                    </View>

                    <View style={{paddingVertical: 10}}>
                        <Pressable style={styles.buttonBlack} onPress={() => {
                            if(signupInputs.firstname && signupInputs.lastname && signupInputs.username && signupInputs.password){
                                signup(signupInputs).unwrap().then(() => {
                                    setScreen("login")
                                })
                            }
                        }}>Opret bruger</Pressable>
                    </View>
    
                </View>
            </View>
        }

        {screen == "forgot password" && 
            <View>
                <View style={[{width: "100%", justifyContent: "center"}, styles.heading]}><Text>Forgot Password</Text></View>
                <View  style={{flexDirection: "column"}}>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={styles.label}>Username:</Text>
                        <TextInput onChangeText={username => {
                            setForgotPasswordInputs({...forgotPasswordInputs, username})
                        }} style={styles.textInput}></TextInput>
                    </View>

                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={styles.label}>Email:</Text>
                        <TextInput onChangeText={email => {
                            setForgotPasswordInputs({...forgotPasswordInputs, email})
                        }} style={styles.textInput}></TextInput>
                    </View>

                    <View style={{paddingVertical: 20, borderBottomColor: "black", borderBottomWidth: 1}}>
                        <Button title="Change Password" onPress={() => {
                            if(forgotPasswordInputs.username && forgotPasswordInputs.email){
                                
                            }
                        }}></Button>
                    </View>

                    <View style={{marginVertical: 20}}>
                        <Button title="Log In" onPress={() => {setScreen("login")}}></Button>
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
      //fontWeight: 500,
      fontSize: 25,
      marginBottom: 30
    },
    label: {
      fontSize: 12,
      fontWeight: "bold",
      marginEnd: 20
    },
    textInput: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "gray",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginVertical: 10,
        fontSize: 15
    },
    buttonBlack: {
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "sans-serif",
        width: "100%",
        textAlign: "center",
        backgroundColor: "black",
        borderRadius: 10,
        color: "white",
        padding: 15
    },
    buttonWhite: {
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "sans-serif",
        width: "100%",
        textAlign: "center",
        backgroundColor: "none",
        borderRadius: 10,
        color: "black",
        padding: 15
    }
  })

export default LoginScreen