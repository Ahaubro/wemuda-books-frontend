import React, { useState } from 'react'
import { useForgotPasswordMutation } from '../../redux/services/userApi'
import DefaultView from "../../components/DefaultView"
import BackArrowContainer from "../../components/BackArrowContainer"
import { Pressable, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'


interface ForgotPasswordScreenProps{navigation: any}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({navigation}) => {

    const [forgotPasswordInputs, setForgotPasswordInputs] = useState<{ email: string }>({ email: "" })

    const [forgotPassword] = useForgotPasswordMutation();

    return (
        <View style={{height: '100%'}}>
            <DefaultView>

                <BackArrowContainer>
                    <Pressable onPress={() => {
                        navigation.navigate("Login");
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
                        <TouchableOpacity activeOpacity={0.7} style={styles.buttonBlack} onPress={() => {
                            if (forgotPasswordInputs.email) {
                                forgotPassword(forgotPasswordInputs)
                            }
                        }}>
                            <Text style={styles.btnWhiteText}>Send</Text>
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
    }
})

export default ForgotPasswordScreen 