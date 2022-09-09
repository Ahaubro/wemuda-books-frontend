import React, { useState } from 'react'
import { View, Pressable, Image, Text, StyleSheet, TextInput, ActivityIndicator } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackNavigationProp } from '@react-navigation/stack'
import { HomeNavigatorParamList } from '../../types/NavigationTypes'
import { RouteProp } from '@react-navigation/native'
import { useEditStatusMutation, useGetBooksByUserIdQuery, Book } from '../../redux/services/bookApi'
import { useAddStatusUpdateMutation } from '../../redux/services/statusUpdateApi'
import { useSetBooksGoalMutation, useResetBooksReadMutation } from '../../redux/services/userApi'


type UpdateStatusScreenNavigationProps = StackNavigationProp<HomeNavigatorParamList, "UpdateStatus">
type UpdateStatisScreenRouteProps = RouteProp<HomeNavigatorParamList, "UpdateStatus">

interface HomeScreenProps {
    navigation: UpdateStatusScreenNavigationProps,
    route: UpdateStatisScreenRouteProps
}

const UpdateStatusScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {

    const { bookId, userId } = route.params

    const userBooks = useGetBooksByUserIdQuery(userId)
    const currentlyReadingBook: Book | undefined = userBooks.data?.books.find(book => book.bookId == bookId)

    const [editBookStatus, { isLoading, isSuccess }] = useEditStatusMutation()

    const [addStatusUpdate] = useAddStatusUpdateMutation()

    const [updateBooksGoal] = useSetBooksGoalMutation()

    const [resetBooksRead] = useResetBooksReadMutation()

    const [finishedBook, setFinishedBook] = useState(false)

    const [minutesRead, setMinutesRead] = useState(0)

    const [booksGoal, setBooksGoal] = useState(0)

    const [resetProgress, setResetProgress] = useState(false)

    const [message, setMessage] = useState("")


    return <>
        <View>

            {isLoading &&
                <View style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99, justifyContent: 'center' }}>
                    <ActivityIndicator style={{ marginTop: 40 }} size="large" />
                </View>
            }

            <Pressable style={styles.backArrowPos} onPress={() => { navigation.navigate('Home') }}>
                <Ionicons name={'chevron-back'} size={25} color={'black'} />
            </Pressable>

            <Text style={styles.header}>Update reading progress</Text>


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
                    <Text style={styles.btnText}>Update progress</Text>
                </Pressable>
            </View>


            <View style={{ paddingVertical: 4 }}>
                <Pressable style={{ ...styles.buttonGrey, flexDirection: 'row', justifyContent: 'center' }} onPress={(() => {
                    editBookStatus({ userId, bookId, bookStatus: "History" }).unwrap().then(res => {
                        navigation.pop()
                    })
                })}>
                    <Text style={styles.btnTextBlack}>Finish Book</Text>
                </Pressable>
            </View>
        </View>
    </>
}

const styles = StyleSheet.create({
    buttonBlack: {
        fontFamily: "sans-serif",
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
        fontSize: 12,
        opacity: 0.9,
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
    header: {
        fontWeight: "700",
        fontSize: 24,
        marginTop: 5
    },
    subHeader: {
        fontWeight: "500",
        fontSize: 12,
        paddingVertical: 15
    },
    btnText: {
        fontWeight: "600",
        fontSize: 14,
        color: "white"
    },
    btnTextBlack: {
        fontWeight: "600",
        fontSize: 14,
        color: "black"
    },
    buttonGrey: {
        fontFamily: "sans-serif",
        textAlign: "center",
        backgroundColor: "rgb(247,247,250)",
        borderRadius: 10,
        paddingVertical: 15,
    },
})

export default UpdateStatusScreen