import React, { useState } from 'react'
import {View, Pressable, Image, Text, StyleSheet, TextInput} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackNavigationProp } from '@react-navigation/stack'
import { HomeNavigatorParamList } from '../../types/NavigationTypes'
import { RouteProp } from '@react-navigation/native'
import {useEditStatusMutation, useGetBooksByUserIdQuery, Book} from '../../redux/services/bookApi'
import {useAddStatusUpdateMutation} from '../../redux/services/statusUpdateApi'
import {useSetBooksGoalMutation, useResetBooksReadMutation} from '../../redux/services/userApi'


type UpdateGoalScreenNavigationProps = StackNavigationProp<HomeNavigatorParamList, "UpdateGoalScreen">
type UpdateGoalScreenRouteProps = RouteProp<HomeNavigatorParamList, "UpdateGoalScreen">

interface UpdateGoalScreenProps {
    navigation: UpdateGoalScreenNavigationProps,
    route: UpdateGoalScreenRouteProps
}


const UpdateGoalScreen: React.FC<UpdateGoalScreenProps> = ({navigation, route}) => {

    const {bookId, userId} = route.params

    const userBooks = useGetBooksByUserIdQuery(userId)
    const currentlyReadingBook : Book | undefined = userBooks.data?.books.find(book => book.bookId == bookId)

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
        <View style={{margin: 20}}>

            <Pressable onPress={() => { navigation.navigate('Home') }}>
                <Ionicons name={'chevron-back'} size={25} color={'black'} />
            </Pressable>

            <View style={{flex: 1, alignItems: "center", marginTop: 5}}>

                    {/* HERFRA SKAL PÅ EN NY SIDE */}




                <View style={{marginTop: 15}}>
                    <Text style={{ fontWeight: "700", fontSize: 12 }}>Reading goal:</Text>
                    
                    <TextInput keyboardType="number-pad" placeholder="Enter book count" placeholderTextColor={"#AAA"} onChangeText={(books) => {
                        setBooksGoal(Number(books))
                    }} style={styles.textInput}></TextInput>
                </View>

                <Pressable style={{ ...styles.buttonGray, marginTop: 15, flex: 1, flexDirection: 'row' }} onPress={(() => {
                    setResetProgress(!resetProgress)
                })}><Text style={{ fontWeight: "500", fontSize: 12 }}>Reset Progress</Text>
                    {resetProgress ?
                        <Ionicons name={'checkmark-sharp'} size={15} color={'green'} /> :
                        <Ionicons name={'close-sharp'} size={15} color={'red'} />
                    }
                </Pressable>

                <Text style={{color: "#F00"}}>{message}</Text>

                <Pressable style={{ ...styles.buttonGray, marginTop: 15 }} onPress={(() => {
                    if(finishedBook)
                        editBookStatus({userId, bookId, bookStatus: "History"})

                    if(resetProgress)
                        resetBooksRead(userId)
                    
                    setMessage("")

                    if(minutesRead != NaN){
                        if(minutesRead > 0)
                            addStatusUpdate({userId, minutesAdded: minutesRead})
                    }else
                        setMessage("Minutes read must be a number!")
                    
                    
                    if(booksGoal != NaN){
                        if(booksGoal > 0)
                            updateBooksGoal({userId, booksGoal: booksGoal})
                    }else
                        setMessage((message.length > 0 ? message + "\n" : "") +  + "Books goal must be a number!")
                    
                    if(minutesRead != NaN && booksGoal != NaN)
                        navigation.navigate("Home")
                })}>
                    <Text style={{ fontWeight: "500", fontSize: 12 }}>Save</Text>
                </Pressable>

            </View>
        </View>
    </>
}

const styles = StyleSheet.create({
    buttonGray: {
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "sans-serif",
        textAlign: "center",
        backgroundColor: "#DDD",
        borderRadius: 18,
        width: "fit-content",
        paddingHorizontal: 15,
        paddingVertical: 10,
        height: "fit-content"
    },
    textInput: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "gray",
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10, 
        fontSize: 12,
        marginLeft: 5,
        marginRight: 5,
        opacity: 0.9,
        marginTop: 5
    }
})

export default UpdateGoalScreen