import React, { useState } from 'react'
import { useSignupMutation } from '../../redux/services/userApi'
import DefaultView from "../../components/DefaultView"
import BackArrowContainer from "../../components/BackArrowContainer"
import { Pressable, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as yup from 'yup'

interface SignupScreenProps{navigation: any}

type SignUpFormData = {
    fullname: string,
    email: string
    password: string
}

const SignupScreen: React.FC<SignupScreenProps> = ({navigation}) => {

    const [signupInputs, setSignupInputs] = useState<{ fullname: string, email: string, password: string }>({ fullname: "", email: "", password: "" })
    const [password2, setPassword2] = useState<string>("");

    const [signup] = useSignupMutation()

    // const [signupError, setSignupError] = useState<string>("")

    // const signupSchema: yup.SchemaOf<SignUpFormData> = yup.object({
    //     fullname: yup.string().required("Full Name Required"),
    //     email: yup.string().email('Invalid Email').required('Email Required'),
    //     password: yup.string().required('Password Required')
    // })
    

    return (
        <View style={{height: '100%'}}>
            <DefaultView>

                <BackArrowContainer>
                    <Pressable onPress={() => {navigation.navigate("Welcome")}}>
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
                        <TouchableOpacity activeOpacity={0.7} style={styles.buttonBlack} onPress={() => {
                            if (signupInputs.fullname && signupInputs.email && signupInputs.password && password2) {
                                if(signupInputs.password == password2){
                                    signup(signupInputs).unwrap().then(res => {navigation.navigate("Login")})
                                }
                            }
                        }}>
                            <Text style={styles.btnWhiteText}>Sign up now</Text>
                        </TouchableOpacity>
                    </View>

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
    btnWhiteText:{
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        fontFamily: "GraphikMedium",
    },
    nextInput:{
        paddingBottom: 20
    }
})

export default SignupScreen