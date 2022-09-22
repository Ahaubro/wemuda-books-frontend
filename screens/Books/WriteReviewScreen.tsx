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
import { useAddReviewMutation } from "../../redux/services/reviewApi"
import { Rating, AirbnbRating } from "react-native-ratings"



type SelectedBookScreenMoreNavigationProps = StackNavigationProp<BookNavigatorParamList, 'WriteReviewScreen'>
type SelectedBookScreenMoreRouteProps = RouteProp<BookNavigatorParamList, 'WriteReviewScreen'>

type Props = {
    navigation: SelectedBookScreenMoreNavigationProps
    route: SelectedBookScreenMoreRouteProps
}

function WriteReviewScreen({ navigation, route }: Props) {
    const session = useSelector((state: RootState) => state.session)

    const dispatch = useDispatch()
    

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


            <View style={styles.starRating}>              
                <AirbnbRating
                    reviews={['Terrible', 'Okay', 'Good', 'Great book', 'Love this book']}
                    reviewSize={0}
                    count={5}
                    size={35}
                    defaultRating={3}
                    onFinishRating={( n: number ) => { 
                            addReviewAtributes.rating = n
                    }}
                />
            </View>


            <View style={styles.inputContainer}>
                <TextInput style={styles.input} multiline={true} placeholder='How was the book?' placeholderTextColor={'grey'} onChangeText={(content) => {
                    addReviewAtributes.content = content
                }}>

                </TextInput>
            </View>


            <View style={{ marginTop: 20 }}></View>


            <Pressable style={styles.saveReview} onPress={() => {
                //Setting dcefault value for rating if none is given
                if(addReviewAtributes.rating == 0) {
                    addReviewAtributes.rating = 3
                }
                addReview(addReviewAtributes)
                navigation.pop();
            }}>

                <Text style={{ color: 'white' }}>Save review</Text>

            </Pressable>

        </DefaultView>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 25,
        color: 'black',
        textAlign: 'left',
        paddingTop: 5,
        paddingBottom: 15,
        fontFamily: 'GraphikMedium'
    },
    saveReview: {
        fontSize: 12,
        fontFamily: "GraphikMedium",
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
        backgroundColor: 'rgb(247,247,247)',
        borderRadius: 15,
        height: 150,
        borderBottomWidth: 1,
        border: 'none',
        outline: 'none',
        opacity: 0.8,
    },
    starRating: {
        paddingHorizontal: 25,
        paddingVertical: 35,
    },
    input: {
        flex: 1,
        outline: 'none',
        paddingHorizontal: 20,
        height: 130,
        marginTop: 20
    },
})

export default WriteReviewScreen
