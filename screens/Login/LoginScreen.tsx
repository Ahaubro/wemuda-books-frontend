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
import DefaultView from "../../components/DefaultView"
import BackArrowContainer from "../../components/BackArrowContainer"

interface LoginScreenProps {
    navigation: any,
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {

    const [loginInputs, setLoginInputs] = useState<{ username: string, password: string }>({ username: "", password: "" })
    const [signupInputs, setSignupInputs] = useState<{ firstname: string, lastname: string, username: string, email: string, password: string }>({ firstname: "", lastname: "", username: "", email: "", password: "" })
    const [forgotPasswordInputs, setForgotPasswordInputs] = useState<{ email: string }>({ email: "" })
    const [screen, setScreen] = useState<string>("welcome")

    const dispatch = useDispatch();
    const [login] = useLoginMutation();
    const [signup] = useSignupMutation();
    //const [changePassword] = useChangePasswordMutation();

    return (
        <View>

            {screen == "welcome" &&
                <DefaultView>

                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignContent: 'center', marginVertical: 250 }}>

                        <Text style={{ fontSize: 25, fontWeight: 'bold', fontFamily: 'sans-serif', textAlign: 'center', paddingBottom: 80 }}>Velkommen</Text>


                        <Pressable style={styles.buttonBlack} onPress={() => {
                            setScreen("signup")
                        }}>
                            <Text style={{ color: 'white', fontFamily: 'sans-serif' }}>Get started</Text>
                        </Pressable>



                        <View>
                            <Pressable style={styles.welcomeLoginPressable} onPress={() => {
                                setScreen("login")
                            }}>
                                <Text style={{ color: 'black', fontFamily: 'sans-serif' }}>Log ind</Text>
                            </Pressable>
                        </View>

                        <View style={{ padding: 15 }}>
                            <Pressable style={{}} onPress={() => {
                                dispatch(startSession({ id: 0, token: "guest" }))
                            }}>
                                <Text style={{ color: 'black', fontFamily: 'sans-serif', fontWeight: 'bold', textAlign: 'center', fontSize: 12 }}>Continue without login</Text>
                            </Pressable>
                        </View>
                    </View>
                </DefaultView>
            }

            {screen == "login" &&
                <DefaultView>

                    <BackArrowContainer>
                        <Pressable onPress={() => {
                            setScreen("welcome")
                        }}>
                            <Ionicons name={'chevron-back'} size={25} color={'black'} />
                        </Pressable>
                    </BackArrowContainer>


                    <Text style={styles.heading}>Log ind</Text>


                    <View style={{ flexDirection: "column" }}>
                        <View style={{ marginVertical: 5 }}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput placeholder="eksempel@email.dk" placeholderTextColor={"#AAAAAA"} onChangeText={username => {
                                setLoginInputs({ ...loginInputs, username })
                            }} style={styles.textInput}></TextInput>
                        </View>

                        <View style={{ marginVertical: 5 }}>
                            <Text style={styles.label}>Kodeord</Text>
                            <TextInput placeholder="Indtast kodeord" placeholderTextColor={"#AAAAAA"} onChangeText={password => {
                                setLoginInputs({ ...loginInputs, password })
                            }} secureTextEntry={true} style={styles.textInput}></TextInput>
                        </View>

                        <View style={{ paddingVertical: 10 }}>
                            <Pressable style={styles.buttonBlack} onPress={() => {
                                if (loginInputs.username && loginInputs.password) {
                                    login({ ...loginInputs }).unwrap().then(res => {
                                        if (res.token)
                                            dispatch(startSession({ token: res.token, id: res.id }))
                                    })
                                }
                            }}>
                                <Text style={{ color: 'white', fontFamily: 'sans-serif' }}>Log in</Text>
                            </Pressable>
                        </View>

                        <View style={{ marginVertical: 5 }}>
                            <Pressable style={styles.buttonWhite} onPress={() => { setScreen("forgot password") }}>
                                <Text style={{ fontWeight: 'bold' }}><Text style={{ fontWeight: "bold" }}>Forgot password</Text></Text>
                            </Pressable>
                        </View>
                    </View>
                </DefaultView>
            }

            {screen == "signup" &&
                <DefaultView>

                    <BackArrowContainer>
                        <Pressable onPress={() => {
                            setScreen("welcome")
                        }}>
                            <Ionicons name={'chevron-back'} size={25} color={'black'} />
                        </Pressable>
                    </BackArrowContainer>

                    <View>
                        <Text style={styles.heading}>Get started</Text>
                    </View>

                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignContent: 'center', }}>
                        <View style={{ marginVertical: 5 }}>
                            <Text style={styles.label}>Fulde navn</Text>
                            <TextInput style={styles.textInput} placeholder="Indtast dit fulde navn" placeholderTextColor={"#AAAAAA"} onChangeText={firstname => {
                                setSignupInputs({ ...signupInputs, firstname })
                            }}></TextInput>
                        </View>

                        <View style={{ marginVertical: 5 }}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput placeholder="Indtast din email" placeholderTextColor={"#AAAAAA"} onChangeText={email => {
                                setSignupInputs({ ...signupInputs, email })
                            }} style={styles.textInput}></TextInput>
                        </View>

                        <View style={{ marginVertical: 5 }}>
                            <Text style={styles.label}>Kodeord</Text>
                            <TextInput placeholder="Indtast kodeord" placeholderTextColor={"#AAAAAA"} onChangeText={password => {
                                setSignupInputs({ ...signupInputs, password })
                            }} secureTextEntry={true} style={styles.textInput}></TextInput>
                        </View>

                        <View style={{ marginVertical: 5 }}>
                            <Text style={styles.label}>Bekræft kodeord</Text>
                            <TextInput placeholder="Bekræft kodeord" placeholderTextColor={"#AAAAAA"} onChangeText={password => {
                                setSignupInputs({ ...signupInputs, password })
                            }} secureTextEntry={true} style={styles.textInput}></TextInput>
                        </View>

                        <View style={{ paddingVertical: 10 }}>
                            <Pressable style={styles.buttonBlack} onPress={() => {
                                if (signupInputs.firstname && signupInputs.lastname && signupInputs.username && signupInputs.password) {
                                    signup(signupInputs).unwrap().then(res => {
                                        console.log("RESPONSE", res)
                                        setScreen("login")
                                    })
                                }
                            }}>
                                <Text style={{ color: 'white', fontFamily: 'sans-serif' }}>Opret bruger</Text>
                            </Pressable>
                        </View>

                    </View>
                </DefaultView>
            }

            {screen == "forgot password" &&
                <DefaultView>

                    <BackArrowContainer>
                        <Pressable style={{}} onPress={() => {
                            setScreen("login");
                        }}>
                            <Ionicons name={'chevron-back'} size={25} color={'black'} />
                        </Pressable>
                    </BackArrowContainer>


                    <View style={{}}>
                        <Text style={styles.heading}>Forgot password</Text>
                    </View>

                    <View style={{ flexDirection: "column", justifyContent: 'center', alignContent: 'center' }}>

                        <View style={{ flexDirection: "column" }}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput placeholder='eksempel@email.com' placeholderTextColor={"#AAAAAA"} onChangeText={email => {
                                setForgotPasswordInputs({ ...forgotPasswordInputs, email })
                            }} style={styles.textInput}>
                            </TextInput>
                        </View>

                        <View style={{ paddingVertical: 10 }}>
                            <Pressable style={styles.buttonBlack} onPress={() => {
                                if (forgotPasswordInputs.email) {
                                    console.log(forgotPasswordInputs.email)
                                    // changePassword(forgotPasswordInputs).unwrap().then( () => {
                                    //     setScreen("login")
                                    // })
                                }
                            }}>
                                <Text style={{ color: 'white' }}>Send</Text>
                            </Pressable>
                        </View>

                    </View>

                </DefaultView>
            }

        </View>)
}

const styles = StyleSheet.create({
    heading: {
    fontSize: 25,
    color: 'black',
    textAlign: 'left',
    fontWeight: '600',
    paddingVertical: 10,   
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        paddingVertical: 5,
    },
    textInput: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "gray",
        borderRadius: 10,
        padding: 14,
        fontSize: 15,

    },
    buttonBlack: {
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "sans-serif",
        textAlign: "center",
        backgroundColor: "black",
        borderRadius: 10,
        color: "white",
        marginTop: 5,
        paddingVertical: 15,
    },
    buttonWhite: {
        fontSize: 12,
        fontWeight: 700,
        textAlign: "center",
        backgroundColor: "none",
        borderRadius: 10,
        paddingVertical: 8,
        marginTop: 3,
    },
    welcomeLoginPressable: {
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "sans-serif",
        textAlign: "center",
        backgroundColor: "none",
        borderRadius: 10,
        color: "black",
        marginTop: 7,
        border: '1px solid black',
        paddingVertical: 15,
    },
})

export default LoginScreen