import React, { useState } from 'react'
import {View, Pressable, Image, Text, StyleSheet, TextInput} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackNavigationProp } from '@react-navigation/stack'
import { HomeNavigatorParamList } from '../../types/NavigationTypes'
import { RouteProp } from '@react-navigation/native'
import {useEditStatusMutation, useGetBooksByUserIdQuery, Book} from '../../redux/services/bookApi'
import {useAddStatusUpdateMutation} from '../../redux/services/statusUpdateApi'
import {useSetBooksGoalMutation, useResetBooksReadMutation} from '../../redux/services/userApi'

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

    const [resetBooksRead] = useResetBooksReadMutation()

    const [finishedBook, setFinishedBook] = useState(false)

    const [minutesRead, setMinutesRead] = useState(0)

    const [booksGoal, setBooksGoal] = useState(0)

    const [resetProgress, setResetProgress] = useState(false)

    const [message, setMessage] = useState("")

    return <>
        <View style={{margin: 20, overflow: "scroll"}}>

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
                <Pressable style={{ ...styles.buttonGray, marginTop: 25, flex: 1, flexDirection: 'row' }} onPress={(() => {
                    setFinishedBook(!finishedBook)
                })}>
                    <Text style={{ fontWeight: "bold" }}>Finished Book</Text>
                    {finishedBook ?
                        <Ionicons name={'checkmark-sharp'} size={20} color={'green'} /> :
                        <Ionicons name={'close-sharp'} size={20} color={'red'} />
                    }
                </Pressable>
                
                <View style={{marginBottom: 20, marginTop: 10}}>
                    <Text style={{ fontWeight: "bold" }}>Minutes read:</Text>

                    <TextInput keyboardType="number-pad" placeholder="Enter minutes" placeholderTextColor={"#AAA"} onChangeText={(minutes) => {
                        setMinutesRead(Number(minutes))
                    }} style={styles.textInput}></TextInput>
                </View>

                

                <View style={{marginBottom: 20, marginTop: 10}}>
                    <Text style={{ fontWeight: "bold" }}>Reading goal:</Text>
                    
                    <TextInput keyboardType="number-pad" placeholder="Enter book count" placeholderTextColor={"#AAA"} onChangeText={(books) => {
                        setBooksGoal(Number(books))
                    }} style={styles.textInput}></TextInput>
                </View>

                <Pressable style={{ ...styles.buttonGray, marginTop: 10, flex: 1, flexDirection: 'row' }} onPress={(() => {
                    setResetProgress(!resetProgress)
                })}><Text style={{ fontWeight: "bold" }}>Reset Progress</Text>
                    {resetProgress ?
                        <Ionicons name={'checkmark-sharp'} size={20} color={'green'} /> :
                        <Ionicons name={'close-sharp'} size={20} color={'red'} />
                    }
                </Pressable>

                <Text style={{color: "#F00"}}>{message}</Text>

                <Pressable style={{ ...styles.buttonGray, marginTop: 25 }} onPress={(() => {
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
                    <Text style={{ fontWeight: "bold" }}>Save</Text>
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
        marginRight: 5
    }
})

export default UpdateStatusScreen