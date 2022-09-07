import React, { useState } from 'react'
import {View, Pressable, Image, Text, StyleSheet, TextInput} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackNavigationProp } from '@react-navigation/stack'
import { HomeNavigatorParamList } from '../../types/NavigationTypes'
import { RouteProp } from '@react-navigation/native'
import {useEditStatusMutation, useGetBooksByUserIdQuery, Book} from '../../redux/services/bookApi'
import {useAddStatusUpdateMutation} from '../../redux/services/statusUpdateApi'
import {useSetBooksGoalMutation} from '../../redux/services/userApi'

type UpdateStatusScreenNavigationProps = StackNavigationProp<HomeNavigatorParamList, "UpdateStatus">
type UpdateStatisScreenRouteProps = RouteProp<HomeNavigatorParamList, "UpdateStatus">

interface HomeScreenProps {
    navigation: UpdateStatusScreenNavigationProps,
    route: UpdateStatisScreenRouteProps
}

const UpdateStatusScreen: React.FC<HomeScreenProps> = ({navigation, route}) => {

    const {bookId, userId} = route.params

    const userBooks = useGetBooksByUserIdQuery(userId)
    const currentlyReadingBook : Book | undefined = userBooks.data?.books.find(book => book.bookId == bookId)

    const [editBookStatus] = useEditStatusMutation()

    const [addStatusUpdate] = useAddStatusUpdateMutation()

    const [updateBooksGoal] = useSetBooksGoalMutation()

    const [minutesRead, setMinutesRead] = useState(0)

    const [booksGoal, setBooksGoal] = useState(0)

    const [message, setMessage] = useState("")

    return <>
        <View style={{margin: 20}}>

            <Pressable onPress={() => { navigation.navigate('Home') }}>
                <Ionicons name={'chevron-back'} size={25} color={'black'} />
            </Pressable>

            <View style={{flex: 1, alignItems: "center"}}>

                <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Currently reading</Text>

                {currentlyReadingBook?.thumbnail ?
                    <Image
                        source={{ uri: currentlyReadingBook.thumbnail }}
                        style={{ width: 100, height: 150, borderRadius: 3 }}
                    />
                    :
                    <div style={{ width: 50, height: 65, backgroundColor: "#ccc", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        No image
                    </div>
                }
                <View style={{paddingBottom: 10, borderBottomColor: "#AAA", borderBottomWidth: 2, width: "100%", alignItems: "center", marginBottom: 10}}>
                    <Pressable style={{ ...styles.buttonGray, marginTop: 25 }} onPress={(() => {
                        editBookStatus({userId, bookId, bookStatus: "History"})
                        navigation.navigate("Home")
                    })}>
                        <Text style={{ fontWeight: "bold" }}>Finished Book</Text>
                    </Pressable>
                </View>
                
                <Text>Enter how many minutes you have read in the book this time:</Text>

                <View style={{flexDirection: 'row', marginBottom: 20, marginTop: 10}}>
                    <TextInput keyboardType="number-pad" placeholder="Enter minutes" placeholderTextColor={"#AAA"} onChangeText={(minutes) => {
                        setMinutesRead(Number(minutes))
                    }} style={styles.textInput}></TextInput>

                    <Pressable style={{ ...styles.buttonGray, marginTop: 25 }} onPress={(() => {
                        console.log(minutesRead)
                        if(minutesRead != NaN){
                            if(minutesRead > 0){
                                addStatusUpdate({userId, minutesAdded: minutesRead})
                                navigation.navigate("Home")
                            }else
                                setMessage("You must enter a number higher than 0!")
                        }else
                            setMessage("You must enter a number!")
                    })}>
                        <Text style={{ fontWeight: "bold" }}>Register Minutes</Text>
                    </Pressable>
                </View>

                <Text>Enter your goal for how many books you want to read:</Text>

                <View style={{flexDirection: 'row', marginBottom: 20, marginTop: 10}}>
                    <TextInput keyboardType="number-pad" placeholder="Enter book count" placeholderTextColor={"#AAA"} onChangeText={(books) => {
                        setBooksGoal(Number(books))
                    }} style={styles.textInput}></TextInput>

                    <Pressable style={{ ...styles.buttonGray, marginTop: 25 }} onPress={(() => {
                        console.log(booksGoal)
                        if(booksGoal != NaN){
                            if(booksGoal > 0){
                                updateBooksGoal({userId, booksGoal: booksGoal})
                                navigation.navigate("Home")
                            }else
                                setMessage("You must enter a number higher than 0!")
                        }else
                            setMessage("You must enter a number!")
                    })}>
                        <Text style={{ fontWeight: "bold" }}>Update Goal</Text>
                    </Pressable>
                </View>

                <Text style={{color: "#F00"}}>{message}</Text>

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
        borderRadius: 15,
        width: "fit-content",
        paddingHorizontal: 15,
        paddingVertical: 10,
        height: "fit-content"
    },
    textInput: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "gray",
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 8, 
        fontSize: 15,
        marginLeft: 5,
        marginRight: 5,
        width: 150
    }
})

export default UpdateStatusScreen