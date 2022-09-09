import React, { useState } from 'react'
import { View, Pressable, Image, Text, StyleSheet, TextInput } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackNavigationProp } from '@react-navigation/stack'
import { HomeNavigatorParamList } from '../../types/NavigationTypes'
import { RouteProp } from '@react-navigation/native'
import { useEditStatusMutation, useGetBooksByUserIdQuery, Book } from '../../redux/services/bookApi'
import { useAddStatusUpdateMutation } from '../../redux/services/statusUpdateApi'
import { useSetBooksGoalMutation, useResetBooksReadMutation } from '../../redux/services/userApi'


type UpdateGoalScreenNavigationProps = StackNavigationProp<HomeNavigatorParamList, "UpdateGoalScreen">
type UpdateGoalScreenRouteProps = RouteProp<HomeNavigatorParamList, "UpdateGoalScreen">

interface UpdateGoalScreenProps {
    navigation: UpdateGoalScreenNavigationProps,
    route: UpdateGoalScreenRouteProps
}


const UpdateGoalScreen: React.FC<UpdateGoalScreenProps> = ({ navigation, route }) => {

    const { bookId, userId } = route.params

    const userBooks = useGetBooksByUserIdQuery(userId)
    const currentlyReadingBook: Book | undefined = userBooks.data?.books.find(book => book.bookId == bookId)

    const [editBookStatus] = useEditStatusMutation()

    const [addStatusUpdate] = useAddStatusUpdateMutation()

    const [updateBooksGoal] = useSetBooksGoalMutation()

    const [resetBooksRead] = useResetBooksReadMutation()

    const [finishedBook, setFinishedBook] = useState(false)

    const [minutesRead, setMinutesRead] = useState(0)

    const [booksGoal, setBooksGoal] = useState(0)

    const [resetProgress, setResetProgress] = useState(false)

    const [message, setMessage] = useState("")

    return <>
        <View style={styles.container}>

            <Pressable style={styles.backArrowPos} onPress={() => { navigation.navigate('Home') }}>
                <Ionicons name={'chevron-back'} size={25} color={'black'} />
            </Pressable>


            <Text style={styles.header}>Edit goal</Text>


            <View>
                <Text style={styles.subHeader}>Enter the amount of books you want to read</Text>

                <TextInput keyboardType="number-pad" placeholder="Enter book count" placeholderTextColor={"#AAA"} onChangeText={(books) => {
                    setBooksGoal(Number(books))
                }} style={styles.textInput}></TextInput>
            </View>


            <Text style={{ color: "#F00" }}>{message}</Text>


            <View style={{ paddingVertical: 4 }}>
                <Pressable style={{ ...styles.buttonBlack, marginTop: 10 }} onPress={(() => {                                          
                    if (booksGoal != NaN) {
                        if (booksGoal > 0)
                            updateBooksGoal({ userId, booksGoal: booksGoal })
                    } else
                        setMessage((message.length > 0 ? message + "\n" : "") + + "Books goal must be a number!")

                    if (booksGoal != NaN)
                        navigation.navigate("Home")
                })}>
                    <Text style={styles.btnText}>Save</Text>
                </Pressable>
            </View>

            <View style={{ paddingVertical: 4 }}>
                <Pressable style={{ ...styles.buttonGrey, flexDirection: 'row', justifyContent: 'center'  }} onPress={(() => {
                    resetBooksRead(userId)
                    navigation.navigate("Home")
                })}>
                    <Text style={styles.btnTextBlack}>Reset Progress</Text>

                    {/* {resetProgress ?
                        <Ionicons style={{ marginLeft: 5 }} name={'checkmark-sharp'} size={15} color={'green'} /> :
                        <Ionicons style={{ marginLeft: 5 }} name={'close-sharp'} size={15} color={'red'} />
                    } */}
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
    buttonGrey: {
        fontFamily: "sans-serif",
        textAlign: "center",
        backgroundColor: "rgb(247,247,250)",
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
        margin: 12,
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
    
})

export default UpdateGoalScreen