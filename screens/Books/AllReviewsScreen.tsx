import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, Button, Pressable, FlatList } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../redux/store'
import { endSession } from '../../redux/slices/sessionSlice'
import DefaultView from "../../components/DefaultView"
import BackArrowContainer from '../../components/BackArrowContainer'
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { BookNavigatorParamList } from '../../types/NavigationTypes'
import { Rating, AirbnbRating } from "react-native-ratings"
import { Review, useGetReviewsByBookIdQuery } from "../../redux/services/reviewApi"


type AllReviewsScreenScreenMoreNavigationProps = StackNavigationProp<BookNavigatorParamList, 'AllReviewsScreen'>
type AllReviewsScreenScreenMoreRouteProps = RouteProp<BookNavigatorParamList, 'AllReviewsScreen'>

type Props = {
    navigation: AllReviewsScreenScreenMoreNavigationProps
    route: AllReviewsScreenScreenMoreRouteProps
}


function AllReviewsScreen({ navigation, route }: Props) {
    const session = useSelector((state: RootState) => state.session)

    const dispatch = useDispatch()


    //DS on bookId
    const { bookId } = route.params
    

    //Fetching reviews by bookId
    const [reviews, setReviews] = useState<Review[]>([]);
    const fetchedReviews = useGetReviewsByBookIdQuery(bookId);

    useEffect(() => {
        if (fetchedReviews.data) {
            let reviewArr = fetchedReviews.data.reviews
        }
    }, [fetchedReviews.data])


    return (
        <DefaultView>

            <BackArrowContainer>
                <Pressable onPress={() => {
                    navigation.pop();
                }}>
                    <Ionicons name={'chevron-back'} size={25} color={'black'} />
                </Pressable>
            </BackArrowContainer>

            <View>
                <Text style={styles.header}>Reviews</Text>
            </View>


            <View>
                <FlatList
                    contentContainerStyle={{}}
                    showsHorizontalScrollIndicator={true}
                    keyExtractor={(item) => item.content} data={fetchedReviews.data?.reviews || []} renderItem={({ item, index }) => (

                        <View style={{ paddingRight: 10 }}>
                            <View style={styles.reviewContainer}>
                                <View style={{ width: 350 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: -10, paddingVertical: 10}}>
                                        <AirbnbRating
                                            reviews={['Terrible', 'Okay', 'Good', 'Great book', 'Love this book']}
                                            reviewSize={16}
                                            reviewColor={'black'}                                          
                                            size={20}
                                            defaultRating={item.rating}
                                            isDisabled={true}
                                            starContainerStyle={{paddingLeft: 60}}
                                            ratingContainerStyle={{backgroundColor: 'rgb(247,247,250)', flexDirection: 'row', justifyContent:'space-between', width: '100%' }}
                                        />
                                    </View>
                                    <Text style={{ color: 'grey', fontFamily: 'sans-serif', fontSize: 14, width: 350 }}>{item.content}</Text>
                                </View>
                            </View>
                        </View>

                    )} />
            </View>



        </DefaultView>
    )
}

const styles = StyleSheet.create({
    reviewContainer: {
        backgroundColor: "rgb(247,247,250)",
        borderRadius: 15,
        height: 110,
        paddingHorizontal: 20,
        marginTop: 15,
    },
    header: {
        fontSize: 25,
        color: 'black',
        textAlign: 'left',
        fontWeight: '700',
        paddingTop: 5,
        paddingBottom: 15
    },
})

export default AllReviewsScreen
