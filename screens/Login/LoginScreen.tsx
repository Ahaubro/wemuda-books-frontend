import React, { useState } from 'react'
import { Button, StyleSheet, Text, View, TextInput, Pressable } from 'react-native'
import { useLoginMutation, useSignupMutation, User, useChangePasswordMutation } from '../../redux/services/userApi'
import { useStore, useDispatch } from 'react-redux'
// import { RootState } from '../../redux/store'
import store from '../../redux/store'
import { startSession } from '../../redux/slices/sessionSlice'
import Ionicons from '@expo/vector-icons/Ionicons'
import { enableAllPlugins } from 'immer'
import BookNavigator from '../../containers/BookNavigator'
// import Entypo from '@expo/vector-icons/Entypo'
// import { StatusBar } from 'expo-status-bar'
// import { FONTS } from '../../utils/fontUtils'
// import i18n from 'i18n-js'

interface LoginScreenProps { 
    navigation: any,
}

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {

    const [loginInputs, setLoginInputs] = useState<{ username: string, password: string }>({ username: "", password: "" })
    const [signupInputs, setSignupInputs] = useState<{ firstname: string, lastname: string, username: string, email: string, password: string }>({ firstname: "", lastname: "", username: "", email: "", password: "" })
    const [forgotPasswordInputs, setForgotPasswordInputs] = useState<{ email: string }>({ email: "" })
    const [screen, setScreen] = useState<string>("welcome")

    const dispatch = useDispatch();
    const [login] = useLoginMutation();
    const [signup] = useSignupMutation();
    //const [changePassword] = useChangePasswordMutation();

    return (<View style={styles.container}>

        {screen == "welcome" &&
            <View style={{flexDirection: 'column', justifyContent: 'center', alignContent: 'center', marginVertical: 150}}>

                <Text style={{fontSize: 25, fontWeight: 'bold', fontFamily: 'sans-serif', textAlign: 'center', paddingBottom: 60}}>Velkommen</Text>


                <View style={{padding: 3}}>
                    <Pressable style={styles.buttonBlack} onPress={() => {
                        setScreen("signup")
                    }}>
                        <Text style={{ color: 'white', fontFamily: 'sans-serif' }}>Kom i gang</Text>
                    </Pressable>
                </View>

                <View style={{padding: 3}}>
                    <Pressable style={styles.welcomeLoginPressable} onPress={() => {
                        setScreen("login")
                    }}>
                        <Text style={{ color: 'black', fontFamily: 'sans-serif' }}>Log in</Text>
                    </Pressable>
                </View>

                <View style={{padding: 5}}>
                    <Pressable style={{}} onPress={() => {
                        dispatch(startSession({id: 0, token: "guest"}))
                    }}>
                        <Text style={{ color: 'black', fontFamily: 'sans-serif', fontWeight:'bold', textAlign:'center', fontSize: 12}}>Fortsæt uden login</Text>
                    </Pressable>
                </View>

            </View>
        }

        {screen == "login" &&
            <View>

                <View style={styles.backArrowPos}>
                    <Pressable onPress={() => { 
                        setScreen("welcome") }}>
                            <Ionicons name={"ios-arrow-back" as any} color="black" style={{ fontSize: 30}} />
                        </Pressable>
                </View>

                <View style={{ width: "100%", justifyContent: "center" }}>
                    <Text style={styles.heading}>Log in</Text>
                </View>

                <View style={{ flexDirection: "column" }}>
                    <View style={{ marginVertical: 5 }}>
                        <Text style={styles.label}>Brugernavn</Text>
                        <TextInput placeholder="Indtast Brugernavn" placeholderTextColor={"#AAAAAA"} onChangeText={username => {
                            setLoginInputs({ ...loginInputs, username })
                        }} style={styles.textInput}></TextInput>
                    </View>

                    <View style={{ marginVertical: 5 }}>
                        <Text style={styles.label}>Kodeord</Text>
                        <TextInput placeholder="Indtast Kodeord" placeholderTextColor={"#AAAAAA"} onChangeText={password => {
                            setLoginInputs({ ...loginInputs, password })
                        }} secureTextEntry={true} style={styles.textInput}></TextInput>
                    </View>

                    <View>
                        <Pressable style={styles.buttonBlack} onPress={() => {
                            if (loginInputs.username && loginInputs.password) {
                                login({ ...loginInputs }).unwrap().then(res => {
                                    if (res.token) 
                                        dispatch(startSession({ token: res.token, id: res.id }))
                                })
                            }
                        }}>
                            <Text style={{ color: 'white', fontFamily: 'sans-serif' }}>Log ind</Text>
                        </Pressable>
                    </View>

                    <View style={{ marginVertical: 5 }}>
                        <Pressable style={styles.buttonWhite} onPress={() => { setScreen("forgot password") }}>
                            <Text style={{ fontWeight: 'bold' }}><Text style={{ fontWeight: "bold" }}>Glemt kodeord</Text></Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        }

        {screen == "signup" &&
            <View>

                <View style={styles.backArrowPos}>
                    <Pressable onPress={() => { 
                        setScreen("welcome") 
                        }}>
                            <Ionicons name={"ios-arrow-back" as any} color="black" style={{ fontSize: 30}} />
                        </Pressable>
                </View>

                <View>
                    <Text style={styles.heading}>Kom i gang</Text>
                </View>

                <View style={{ flexDirection: 'column', justifyContent: 'center', alignContent: 'center', }}>


                    <View style={{ marginVertical: 5 }}>
                        <Text style={styles.label}>Fornavn:</Text>
                        <TextInput placeholder="Indtast fornavn" placeholderTextColor={"#AAAAAA"} onChangeText={firstname => {
                            setSignupInputs({ ...signupInputs, firstname })
                        }} style={styles.textInput}></TextInput>
                    </View>

                    <View style={{ marginVertical: 5 }}>
                        <Text style={styles.label}>Efternavn:</Text>
                        <TextInput placeholder="Indtast efternavn" placeholderTextColor={"#AAAAAA"} onChangeText={lastname => {
                            setSignupInputs({ ...signupInputs, lastname })
                        }} style={styles.textInput}></TextInput>
                    </View>

                    <View style={{ marginVertical: 5 }}>
                        <Text style={styles.label}>Brugernavn:</Text>
                        <TextInput placeholder="Indtast brugernavn" placeholderTextColor={"#AAAAAA"} onChangeText={username => {
                            setSignupInputs({ ...signupInputs, username })
                        }} style={styles.textInput}></TextInput>
                    </View>

                    <View style={{ marginVertical: 5 }}>
                        <Text style={styles.label}>Email:</Text>
                        <TextInput placeholder="Indtast email" placeholderTextColor={"#AAAAAA"} onChangeText={email => {
                            setSignupInputs({ ...signupInputs, email })
                        }} style={styles.textInput}></TextInput>
                    </View>

                    <View style={{ marginVertical: 5 }}>
                        <Text style={styles.label}>Kodeord:</Text>
                        <TextInput placeholder="Indtast kodeord" placeholderTextColor={"#AAAAAA"} onChangeText={password => {
                            setSignupInputs({ ...signupInputs, password })
                        }} secureTextEntry={true} style={styles.textInput}></TextInput>
                    </View>

                    <View style={{ paddingVertical: 10 }}>
                        <Pressable style={styles.buttonBlack} onPress={() => {
                            if (signupInputs.firstname && signupInputs.lastname && signupInputs.username && signupInputs.password) {
                                signup(signupInputs).unwrap().then( res => {
                                    console.log("RESPONSE", res)
                                    setScreen("login")
                                })
                            }
                        }}>
                            <Text style={{ color: 'white', fontFamily: 'sans-serif' }}>Opret bruger</Text>
                        </Pressable>
                    </View>

                </View>
            </View>
        }

        {screen == "forgot password" &&
            <View>

                <View style={styles.backArrowPos}>
                    <Pressable style={{}} onPress={() => {
                        setScreen("login");
                    }}>
                        <Ionicons name={"ios-arrow-back" as any} color="black" style={{ fontSize: 30}} />
                    </Pressable>
                </View>


                <View style={{ }}>
                    <Text style={styles.heading}>Glemt kodeord</Text>
                </View>

                <View style={{ flexDirection: "column", justifyContent: 'center', alignContent: 'center' }}>

                    <View style={{ flexDirection: "column" }}>
                        <Text style={styles.label}>Email:</Text>
                        <TextInput placeholder='eksempel@email.com' onChangeText={email => {
                            setForgotPasswordInputs({ ...forgotPasswordInputs, email })
                        }} style={styles.textInput}>
                        </TextInput>
                    </View>

                    <View>
                        <Pressable style={styles.buttonBlack} onPress={() => {
                            if (forgotPasswordInputs.email) {
                                console.log(forgotPasswordInputs.email)
                                // changePassword(forgotPasswordInputs).unwrap().then( () => {
                                //     setScreen("login")
                                // })
                            }
                        }}>
                            <Text style={{ color: 'white' }}>Change password</Text>
                        </Pressable>
                    </View>

                </View>

            </View>
        }

    </View>)
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: '100%',
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 25,
        marginBottom: 30,
        padding: 7,
    },
    label: {
        fontSize: 12,
        fontWeight: "bold",
    },
    textInput: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "gray",
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 8, 
        fontSize: 15,
        marginLeft: 5,
        marginRight: 5,
        
    },
    buttonBlack: {
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "sans-serif",
        textAlign: "center",
        backgroundColor: "black",
        borderRadius: 10,
        color: "white",
        padding: 10,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
    },
    buttonWhite: {
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "sans-serif",
        textAlign: "center",
        backgroundColor: "none",
        borderRadius: 10,
        color: "black",
        padding: 3,
        marginTop: 3,
        marginLeft: 5,
        marginRight: 5,
    },
    welcomeLoginPressable:{
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "sans-serif",
        textAlign: "center",
        backgroundColor: "none",
        borderRadius: 10,
        color: "black",
        padding: 8,
        marginTop: 3,
        border: '1px solid black',
        marginLeft: 5,
        marginRight: 5,
    },
    backArrowPos:{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        marginTop: 30
    }
})

export default LoginScreen