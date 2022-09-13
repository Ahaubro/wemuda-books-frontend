import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Pressable, TextInput } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../redux/store'
import { endSession } from '../../redux/slices/sessionSlice'
import Ionicons from '@expo/vector-icons/Ionicons'
import BackArrowContainer from "../../components/BackArrowContainer"
import DefaultView from "../../components/DefaultView"
import { RouteProp } from '@react-navigation/native'
import { BookNavigatorParamList } from '../../types/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import { useAddReviewMutation  } from "../../redux/services/reviewApi"


type SelectedBookScreenMoreNavigationProps = StackNavigationProp<BookNavigatorParamList, 'WriteReviewScreen'>
type SelectedBookScreenMoreRouteProps = RouteProp<BookNavigatorParamList, 'WriteReviewScreen'>

type Props = {
    navigation: SelectedBookScreenMoreNavigationProps
    route: SelectedBookScreenMoreRouteProps
}

function WriteReviewScreen({ navigation, route }: Props){
    const session = useSelector((state: RootState) => state.session)

    const dispatch = useDispatch()

     {/* AREX IGANG HER */}

    // Destructuring fra navigation.navigate (Books.tsx linje 75 - 81)
    const { bookId, userId } = route.params


    //Add book (want to read for now)
    const [addReview] = useAddReviewMutation();
    const [addReviewAtributes, setaddReviewAtributes] = useState<{
        content: string, rating: number, bookId: string, userId: number
    }>({
        content: "", rating: 0, bookId: bookId, userId: userId
    })




    return (
        <DefaultView>

            <BackArrowContainer>
                <Pressable onPress={() => {
                    navigation.pop();
                }}>
                    <Ionicons name={'chevron-back'} size={25} color={'black'} />
                </Pressable>
            </BackArrowContainer>

            <Text style={styles.header}>Write a review</Text>

            
            {/* INDSÆT STJERNER HER */}


            <TextInput style={styles.inputContainer} placeholder='How was the book?' onChangeText={ (content) => {
                addReviewAtributes.content = content
            }}>

            </TextInput>

            <Pressable style={styles.saveReview} onPress={ () => {
                console.log(addReviewAtributes)
                addReview(addReviewAtributes)
            }}>

                <Text style={{color: 'white'}}>Save review</Text>

            </Pressable>


        </DefaultView>
    )
}

const styles = StyleSheet.create({
    header:{
        fontSize: 25,
        fontWeight: "700",
        paddingVertical: 15
    },
    saveReview:{
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "sans-serif",
        textAlign: "center",
        backgroundColor: "black",
        borderRadius: 15,
        color: "White",
        paddingVertical: 10,
        height: 40
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        backgroundColor: 'rgb(242,242,242)',
        borderRadius: 15,
        minHeight: 100,
        borderBottomWidth: 1,
        border: 'none',
        outline: 'none',
        opacity: 0.8,
      },
})

export default WriteReviewScreen
