import React, { useState } from 'react'
import { Button, StyleSheet, Text, View, TextInput } from 'react-native'
import {useLoginMutation} from '../../redux/services/userApi'
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

    const [inputs, setInputs] = useState<{ username: string, password: string }>({ username: "", password: "" })

    const dispatch = useDispatch()
    const [login, { isLoading }] = useLoginMutation()

    return (<View style={styles.container}>
        <Text style={styles.heading}>Login</Text>
        <View>
            <View  style={{flexDirection: "column"}}>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <Text style={styles.label}>Username:</Text>
                    <TextInput onChangeText={u => {
                        setInputs({...inputs, username: u})
                    }} style={styles.textInput}></TextInput>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <Text style={styles.label}>Password:</Text>
                    <TextInput onChangeText={p => {
                        setInputs({...inputs, password: p})
                    }} secureTextEntry={true} style={styles.textInput}></TextInput>
                </View>
                <View style={{marginTop: 20}}>

                    <Button title="Login" onPress={() => {
                        if(inputs.username && inputs.password){
                            login({...inputs}).unwrap().then(res => {
                                if(res.token) {
                                    console.log(res.token)
                                    dispatch(
                                        startSession({
                                            token: res.token,
                                            id: store.getState().session.id
                                        })
                                    )
                                    //store.dispatch({type: 'session/token', payload: res.token})
                                }
                                console.log(store.getState().session)
                            })
                        }
                    }}></Button>
                </View>
            </View>
        </View>
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