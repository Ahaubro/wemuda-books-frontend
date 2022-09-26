import React, { useState } from 'react'
import { Button, StyleSheet, Text, View, TextInput, Pressable, Keyboard } from 'react-native'
import { useLoginMutation, useSignupMutation, useForgotPasswordMutation } from '../../redux/services/userApi'
import { useStore, useDispatch } from 'react-redux'
// import { RootState } from '../../redux/store'
import store from '../../redux/store'
import { startSession } from '../../redux/slices/sessionSlice'
import Ionicons from '@expo/vector-icons/Ionicons'
import { enableAllPlugins } from 'immer'
import BookNavigator from '../../containers/BookNavigator'
import DefaultView from "../../components/DefaultView"
import BackArrowContainer from "../../components/BackArrowContainer"
import { useForm, SubmitHandler } from "react-hook-form"
import * as yup from 'yup'
import { Formik } from 'formik'
import { yupResolver } from "@hookform/resolvers/yup";
import { values } from 'lodash'

interface LoginScreenProps {
    navigation: any,
}

// type SignUpFormData = {
//     email: string
//     password: string
// }

type LoginFormData = {
    email: string,
    password: string
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {

    const [loginInputs, setLoginInputs] = useState<{ email: string, password: string }>({ email: "", password: "" })
    const [signupInputs, setSignupInputs] = useState<{ fullname: string, email: string, password: string }>({ fullname: "", email: "", password: "" })
    const [password2, setPassword2] = useState<string>("");
    const [forgotPasswordInputs, setForgotPasswordInputs] = useState<{ email: string }>({ email: "" })
    const [screen, setScreen] = useState<string>("welcome")
    const [loginState, setLoginState] = useState<{ loading: boolean; success: boolean }>({
        loading: false,
        success: false,
      });

    const dispatch = useDispatch();
    const [login] = useLoginMutation();
    const [signup] = useSignupMutation();
    const [forgotPassword] = useForgotPasswordMutation();
    //const [changePassword] = useChangePasswordMutation();

    // const onSubmit: SubmitHandler<LoginFormData> = async data => {

    // }

    const loginSchema: yup.SchemaOf<LoginFormData> = yup.object({
        email: yup
          .string()
          .email('Invalid Email')
          .required('Email Required'),
        password: yup
          .string()
          .required('Password Required'),
    });

    const {
        register:loginRegister,
        handleSubmit:handleLoginSubmit,
        setValue,
        formState: { errors:loginErrors },
    } = useForm<FormData>({
        resolver: yupResolver(loginSchema),
        defaultValues: {},
    });

    const onLoginSubmit: SubmitHandler<LoginFormData> = (data) => {
        Keyboard.dismiss()

        login({
            email: data.email,
            password: data.password
        })
        .unwrap()
        .then(res => {
            dispatch(
                startSession({
                    token: res.token,
                    id: res.id
                })
            )
        })
        .catch(err => {
            console.log(err)
        })
    
    };

    return (
        <View style={{height: '100%'}}>

            {screen == "welcome" &&
                <DefaultView>

                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignContent: 'center', marginVertical: 250 }}>

                        <Text style={ styles.welcomeText }>Welcome</Text>


                        <Pressable style={styles.buttonBlack} onPress={() => {
                            setScreen("signup")
                        }}>
                            <Text style={styles.btnWhiteText}>Get started</Text>
                        </Pressable>



                        <View style={{paddingVertical: 10}}>
                            <Pressable style={styles.welcomeLoginPressable} onPress={() => {
                                setScreen("login")
                            }}>
                                <Text style={styles.btnBlackText}>Log in</Text>
                            </Pressable>
                        </View>

                        <View style={{ paddingVertical: 25 }}>
                            <Pressable style={{}} onPress={() => {
                                dispatch(startSession({ id: 0, token: "guest" }))
                            }}>
                                <Text style={styles.btnBlackText}>Continue without login</Text>
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


                    <Text style={styles.heading}>Log in</Text>


                    <View style={{ flexDirection: "column" }}>
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            onSubmit={values => onLoginSubmit(values)}
                            validationSchema={loginSchema}
                            validateOnChange={false}
                        >
                            {
                                ({
                                    handleChange,
                                    handleSubmit,
                                    values,
                                    errors,
                                    setFieldValue,
                                }) => (<>
                                    {errors.email && (<Text style={{color: "#FF0000"}}>{errors.email}</Text>)}

                                    <View style={styles.nextInput}>
                                        <Text style={styles.label}>Email</Text>
                            <TextInput placeholder="eksempel@email.dk" placeholderTextColor={"#AAAAAA"} onChangeText={email => {
                                setLoginInputs({ ...loginInputs, email })
                            }} style={styles.textInput}></TextInput>
                        </View>

                                    {errors.password && (<Text style={{color: "#FF0000"}}>{errors.password}</Text>)}

                                    <View style={styles.nextInput}>
                                        <Text style={styles.label}>Password</Text>
                                        <TextInput placeholder="Insert password" placeholderTextColor={"#AAAAAA"} value={values.password} onChangeText={handleChange('password')} secureTextEntry={true} style={styles.textInput}></TextInput>
                                    </View>

                                    <View>
                                        <Pressable style={styles.buttonBlack} onPress={() => {
                                            handleSubmit()
                                            // if (loginInputs.email && loginInputs.password) {
                                            //     login({ ...loginInputs }).unwrap().then(res => {
                                            //         if (res.token)
                                            //             dispatch(startSession({ token: res.token, id: res.id }))
                                            //     })
                                            // }
                                        }}>
                                            <Text style={styles.btnWhiteText}>Log in</Text>
                                        </Pressable>
                                    </View>
                                </>)
                            }

                        </Formik>

                        <View style={{ paddingVertical: 25 }}>
                            <Pressable style={styles.forgotPasswordBtn} onPress={() => { setScreen("forgot password") }}>
                                <Text style={[styles.btnBlackText, {fontFamily: 'GraphikMedium'}]}>Forgot password</Text>
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
                        <View style={styles.nextInput}>
                            <Text style={styles.label}>Full name</Text>
                            <TextInput style={styles.textInput} placeholder="Enter full name" placeholderTextColor={"#AAAAAA"} onChangeText={fullname => {
                                setSignupInputs({ ...signupInputs, fullname })
                            }}></TextInput>
                        </View>

                        <View style={styles.nextInput}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput placeholder="Enter email" placeholderTextColor={"#AAAAAA"} onChangeText={email => {
                                setSignupInputs({ ...signupInputs, email })
                            }} style={styles.textInput}></TextInput>
                        </View>

                        <View style={styles.nextInput}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput placeholder="Enter password" placeholderTextColor={"#AAAAAA"} onChangeText={password => {
                                setSignupInputs({ ...signupInputs, password })
                            }} secureTextEntry={true} style={styles.textInput}></TextInput>
                        </View>

                        <View style={styles.nextInput}>
                            <Text style={styles.label}>Confirm password</Text>
                            <TextInput placeholder="Enter password again to confirm" placeholderTextColor={"#AAAAAA"} onChangeText={password => {
                                setPassword2( password )
                            }} secureTextEntry={true} style={styles.textInput}></TextInput>
                        </View>

                        <View>
                            
                            <Pressable style={styles.buttonBlack} onPress={() => {
                                if (signupInputs.fullname && signupInputs.email && signupInputs.password && password2) {
                                    if(signupInputs.password == password2){
                                        signup(signupInputs).unwrap().then(res => {
                                            setScreen("login")
                                        })
                                    }
                                }
                            }}>
                                <Text style={styles.btnWhiteText}>Sign up now</Text>
                            </Pressable>
                        </View>

                    </View>
                </DefaultView>
            }

            {screen == "forgot password" &&
                <DefaultView>

                    <BackArrowContainer>
                        <Pressable onPress={() => {
                            setScreen("login");
                        }}>
                            <Ionicons name={'chevron-back'} size={25} color={'black'} />
                        </Pressable>
                    </BackArrowContainer>


                    <View>
                        <Text style={styles.heading}>Forgot password</Text>
                    </View>

                    <View style={{ flexDirection: "column", justifyContent: 'center', alignContent: 'center' }}>

                        <View style={{ flexDirection: "column", marginVertical: 5 }}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput placeholder='eksempel@email.com' placeholderTextColor={"#AAAAAA"} onChangeText={email => {
                                setForgotPasswordInputs({ email })
                            }} style={styles.textInput}>
                            </TextInput>
                        </View>

                        <View style={{ paddingVertical: 10 }}>
                            <Pressable style={styles.buttonBlack} onPress={() => {
                                if (forgotPasswordInputs.email) {
                                    forgotPassword(forgotPasswordInputs)
                                }
                            }}>
                                <Text style={styles.btnWhiteText}>Send</Text>
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
        textAlign: 'left',
        paddingVertical: 15,   
        fontFamily: "GraphikMedium",
    },
    label: {
        fontSize: 12,
        paddingVertical: 8,
        fontFamily: "GraphikSemibold",
    },
    textInput: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "gray",
        borderRadius: 10,
        padding: 14,
        fontSize: 15,
        fontFamily: "GraphikRegular"
    },
    buttonBlack: {
        fontFamily: "GraphikMedium",
        textAlign: "center",
        backgroundColor: "black",
        borderRadius: 10,
        paddingVertical: 20,
    },
    welcomeLoginPressable: {
        fontFamily: "GraphikMedium",
        textAlign: "center",
        backgroundColor: "none",
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
        paddingVertical: 20,
    },
    forgotPasswordBtn: {
        fontSize: 12,
        textAlign: "center",
        backgroundColor: "none",
        borderRadius: 10,
        paddingVertical: 8,
        marginTop: 3,
    },
    btnWhiteText:{
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        fontFamily: "GraphikMedium",
    },
    btnBlackText:{
        fontSize: 14,
        textAlign: 'center',
        fontFamily: "GraphikMedium",
    },
    welcomeText:{
        fontSize: 30, 
        textAlign: 'center', 
        paddingBottom: 80,
        fontFamily: "GraphikMedium",
    },
    nextInput:{
        paddingBottom: 20
    }
})

export default LoginScreen