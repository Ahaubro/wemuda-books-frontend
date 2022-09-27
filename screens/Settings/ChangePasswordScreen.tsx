import React, { useState } from 'react'
import { Text, View, StyleSheet, Button, Pressable, TextInput, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../redux/store'
import { endSession } from '../../redux/slices/sessionSlice'
import DefaultView from '../../components/DefaultView'
import BackArrowContainer from '../../components/BackArrowContainer'
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { MyPageNavigatorParamList } from '../../types/NavigationTypes'
import { useChangePasswordMutation } from "../../redux/services/userApi"


type changePasswordScreenNavigationProps = StackNavigationProp<MyPageNavigatorParamList, 'ChangePasswordScreen'>
type changePasswordScreenRouteProps = RouteProp<MyPageNavigatorParamList, 'ChangePasswordScreen'>

interface Props {
    navigation: changePasswordScreenNavigationProps,
    route: changePasswordScreenRouteProps
}

function ChangePasswordScreen({ navigation, route }: Props) {
    const session = useSelector((state: RootState) => state.session)
    const dispatch = useDispatch()

    //Change password 
    const [changePassword, {isLoading}] = useChangePasswordMutation();

    const [changePasswordAtributes, setChangePasswordAtributes] = useState<{
        userId: number, newPassword: string, password: string
    }>({
        userId: session.id, newPassword: "", password: ""
    })

    let currentPassword = ""
    let newPassword = ""
    let confirmPassword = ""



    return (
        <DefaultView>

            <BackArrowContainer>
                <Pressable onPress={() => {
                    navigation.pop();
                }}>
                    <Ionicons name={'chevron-back'} size={25} color={'black'} />
                </Pressable>
            </BackArrowContainer>

            <Text style={styles.heading}>Change password</Text>

            <View style={styles.betweenTextinput}>
                <TextInput style={styles.textInput} secureTextEntry={true} placeholder='Current password' placeholderTextColor={"#AAAAAA"} onChangeText={ (cp) => {
                    currentPassword = cp
                }}>
                </TextInput>
            </View>

            <View style={styles.betweenTextinput}>
                <TextInput style={styles.textInput} secureTextEntry={true} placeholder='New password' placeholderTextColor={"#AAAAAA"} onChangeText={ (np) => {
                    newPassword = np
                }}>
                </TextInput>
            </View>

            <View style={styles.betweenTextinput}>
                <TextInput style={styles.textInput} secureTextEntry={true} placeholder='Confirm new password' placeholderTextColor={"#AAAAAA"} onChangeText={ (cnp) => {
                    confirmPassword = cnp
                }}>
                </TextInput>
            </View>

            <View style={{ paddingVertical: 10 }}>
                <TouchableOpacity activeOpacity={0.7} style={styles.buttonBlack} onPress={ () => {
                    if(newPassword == confirmPassword){
                        changePasswordAtributes.newPassword = newPassword
                        changePasswordAtributes.password = currentPassword
                        changePassword(changePasswordAtributes)
                        navigation.navigate("MyPage")
                    }
                }} >
                    <Text style={styles.btnWhiteText}>Send</Text>
                </TouchableOpacity>
            </View>



        </DefaultView>
    )
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
        paddingVertical: 5,
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
    betweenTextinput: {
        flexDirection: "column",
        paddingVertical: 6
    },
    buttonBlack: {
        fontSize: 12,
        fontFamily: "GraphikMedium",
        textAlign: "center",
        backgroundColor: "black",
        borderRadius: 10,
        color: "white",
        marginTop: 5,
        paddingVertical: 15,
    },
    btnWhiteText:{
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        fontFamily: "GraphikMedium",
    },
})

export default ChangePasswordScreen
