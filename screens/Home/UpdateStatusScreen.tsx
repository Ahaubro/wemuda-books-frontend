import React, { useState } from 'react'
import { View, Pressable, Image, Text, StyleSheet, TextInput, ActivityIndicator } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackNavigationProp } from '@react-navigation/stack'
import { HomeNavigatorParamList } from '../../types/NavigationTypes'
import { RouteProp } from '@react-navigation/native'
import { useEditStatusMutation, useGetBooksByUserIdQuery, Book } from '../../redux/services/bookApi'
import { useAddStatusUpdateMutation } from '../../redux/services/statusUpdateApi'
import { useSetBooksGoalMutation, useResetBooksReadMutation } from '../../redux/services/userApi'
import DefaultView from "../../components/DefaultView"


type UpdateStatusScreenNavigationProps = StackNavigationProp<HomeNavigatorParamList, "UpdateStatus">
type UpdateStatisScreenRouteProps = RouteProp<HomeNavigatorParamList, "UpdateStatus">

interface HomeScreenProps {
    navigation: UpdateStatusScreenNavigationProps,
    route: UpdateStatisScreenRouteProps
}

const UpdateStatusScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {

    const { bookId, userId } = route.params

    const userBooks = useGetBooksByUserIdQuery(userId)

    const [editBookStatus, { isLoading, isSuccess }] = useEditStatusMutation()

    const [addStatusUpdate] = useAddStatusUpdateMutation()

    const [minutesRead, setMinutesRead] = useState(0)

    const [message, setMessage] = useState("")


    return <>
        <DefaultView>

            {isLoading &&
                <View style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99, justifyContent: 'center' }}>
                    <ActivityIndicator style={{ marginTop: 40 }} size="large" />
                </View>
            }

            <Pressable style={styles.backArrowPos} onPress={() => { navigation.pop() }}>
                <Ionicons name={'chevron-back'} size={25} color={'black'} />
            </Pressable>

            <Text style={styles.heading}>Update reading progress</Text>


            <View>
                <Text style={styles.subHeader}>Enter the amount of minutes you have read since last time.</Text>

                <TextInput keyboardType="number-pad" placeholder="Enter minutes" placeholderTextColor={"#AAA"} onChangeText={(minutes) => {
                    setMinutesRead(Number(minutes))
                }} style={styles.textInput}></TextInput>
            </View>


            <Text style={{ color: "#F00" }}>{message}</Text>


            <View style={{ paddingVertical: 4 }}>
                <Pressable style={{ ...styles.buttonBlack, marginTop: 10 }} onPress={(() => {
                    if (minutesRead != NaN) {
                        if (minutesRead > 0)
                            addStatusUpdate({ userId, minutesAdded: minutesRead })
                    } else
                        setMessage("Minutes read must be a number!")

                    if (minutesRead != NaN)
                        navigation.navigate("Home")
                })}>
                    <Text style={styles.btnWhiteText}>Update progress</Text>
                </Pressable>
            </View>


            <View style={{ paddingVertical: 4 }}>
                <Pressable style={{ ...styles.buttonGrey, flexDirection: 'row', justifyContent: 'center' }} onPress={(() => {
                    editBookStatus({ userId, bookId, bookStatus: "History" }).unwrap().then(res => {
                        navigation.navigate("Home")
                    })
                })}>
                    <Text style={styles.btnBlackText}>Finish Book</Text>
                </Pressable>
            </View>
        </DefaultView>
    </>
}

const styles = StyleSheet.create({
    buttonBlack: {
        fontFamily: "GraphikMedium",
        textAlign: "center",
        backgroundColor: "black",
        borderRadius: 10,
        paddingVertical: 15,
    },
    textInput: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "gray",
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 15,
        fontSize: 14,
        opacity: 0.9,
        fontFamily: 'GraphikMedium'
    },
    backArrowPos: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        marginTop: 50,
        marginLeft: -6,
        paddingVertical: 5
    },
    container: {
        flex: 1,
        padding: 12,
    },
    heading: {
        fontSize: 25,
        textAlign: 'left',
        paddingVertical: 15,   
        fontFamily: 'GraphikMedium'
    },
    subHeader: {
        fontSize: 12,
        paddingVertical: 15,
        fontFamily: 'GraphikMedium'
    },
    btnWhiteText:{
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'GraphikMedium'
    },
    btnBlackText:{
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'GraphikMedium'
    },
    buttonGrey: {
        fontFamily: 'GraphikMedium',
        textAlign: "center",
        backgroundColor: "rgb(247,247,250)",
        borderRadius: 10,
        paddingVertical: 15,
    },
})

export default UpdateStatusScreen