import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, Pressable, Keyboard, TouchableOpacity } from 'react-native'
import { useLoginMutation } from '../../redux/services/userApi'
import { useDispatch } from 'react-redux'
import { startSession } from '../../redux/slices/sessionSlice'
import Ionicons from '@expo/vector-icons/Ionicons'
import DefaultView from "../../components/DefaultView"
import BackArrowContainer from "../../components/BackArrowContainer"
import { useForm, SubmitHandler } from "react-hook-form"
import * as yup from 'yup'
import { Formik } from 'formik'

interface LoginScreenProps {
    navigation: any,
}

type LoginFormData = {
    email: string,
    password: string
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {

    const [loginState, setLoginState] = useState<{ loading: boolean; success: boolean }>({
        loading: false,
        success: false,
    });
    const [loginError, setLoginError] = useState<string>("");

    const dispatch = useDispatch();
    const [login] = useLoginMutation();

    const loginSchema: yup.SchemaOf<LoginFormData> = yup.object({
        email: yup
          .string()
          .email('Invalid Email')
          .required('Email Required'),
        password: yup
          .string()
          .required('Password Required'),
    });

    const onLoginSubmit: SubmitHandler<LoginFormData> = (data) => {
        Keyboard.dismiss()

        login({
            email: data.email,
            password: data.password
        })
        .unwrap()
        .then(res => {
            if(res.statusText != "LoggedIn"){
                let errorMessage = "";
                switch(res.statusText){
                    case "UserNotFound": errorMessage = "Invalid email."; break;
                    case "EmailNotConfirmed": errorMessage = "The user is not activated. Confirm the email."; break;
                    case "IncorrectPassword": errorMessage = "Incorrect password."; break;
                }
                setLoginError(errorMessage)
            }
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
            <DefaultView>

                <BackArrowContainer>
                    <Pressable onPress={() => {
                        navigation.navigate("Welcome")
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
                                    <TextInput placeholder="eksempel@email.dk" placeholderTextColor={"#AAAAAA"} onChangeText={handleChange('email')} style={styles.textInput}></TextInput>
                                </View>

                                {errors.password && (<Text style={{color: "#FF0000"}}>{errors.password}</Text>)}

                                <View style={styles.nextInput}>
                                    <Text style={styles.label}>Password</Text>
                                    <TextInput placeholder="Insert password" placeholderTextColor={"#AAAAAA"} value={values.password} onChangeText={handleChange('password')} secureTextEntry={true} style={styles.textInput}></TextInput>
                                </View>

                                <View>
                                    <TouchableOpacity activeOpacity={0.7} style={styles.buttonBlack} onPress={() => {
                                        handleSubmit()
                                    }}>
                                        <Text style={styles.btnWhiteText}>Log in</Text>
                                    </TouchableOpacity>
                                </View>
                            </>)
                        }

                    </Formik>

                    <View style={{ paddingVertical: 25 }}>
                        <TouchableOpacity activeOpacity={0.7} style={styles.forgotPasswordBtn} onPress={() => { navigation.navigate("ForgotPassword") }}>
                            <Text style={[styles.btnBlackText, {fontFamily: 'GraphikMedium'}]}>Forgot password</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {loginError &&
                        <View>
                            <Text style={{fontFamily: 'GraphikMedium', color: "#FF0000", textAlign: "center"}}>{loginError}</Text>
                        </View>
                    }
                    
                </View>
            </DefaultView>
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
    nextInput:{
        paddingBottom: 20
    }
})

export default LoginScreen