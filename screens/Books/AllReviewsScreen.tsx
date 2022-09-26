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


            <View style={{flex: 1}}>
                <FlatList
                    contentContainerStyle={{}}
                    showsHorizontalScrollIndicator={true}
                    keyExtractor={(item) => item.content} data={fetchedReviews.data?.reviews || []} renderItem={({ item, index }) => (

                        <View style={{ paddingRight: 10 }}>
                            <View style={styles.reviewContainer}>
                                <View style={{ width: 350 }}>
                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginLeft: -10, paddingVertical: 10}}>
                                        <AirbnbRating
                                            reviewSize={0}
                                            reviewColor={'black'}                                          
                                            size={20}
                                            defaultRating={item.rating}
                                            isDisabled={true}
                                            starContainerStyle={{paddingLeft: 60}}
                                            ratingContainerStyle={{backgroundColor: 'rgb(247,247,250)', flexDirection: 'row', justifyContent:'space-between', width: '100%' }}
                                        />
                                    </View>
                                    <View style={{marginTop: -30}}>
                                        <Text style={{ color: 'black', fontFamily: 'GraphikSemibold', fontSize: 14, width: 350}}>{item.title}</Text>
                                    </View>
                                    <View style={{height: 65, overflow: 'scroll'}}>
                                        <Text style={{ color: 'grey', fontFamily: 'GraphikRegular', fontSize: 12, width: 350, paddingTop: 15, paddingBottom: 10}}>{item.content}</Text>
                                    </View>
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
        height: 140,
        paddingHorizontal: 20,
        marginTop: 15,
        fontFamily: 'GraphikRegular',
    },
    header: {
        fontSize: 25,
        color: 'black',
        textAlign: 'left',
        paddingTop: 5,
        paddingBottom: 15,
        fontFamily: 'GraphikMedium',
    },
})

export default AllReviewsScreen
