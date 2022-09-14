import React from 'react'
import { Text, View, StyleSheet, Button, Pressable } from 'react-native'
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


type SelectedBookScreenMoreNavigationProps = StackNavigationProp<BookNavigatorParamList, 'WriteReviewScreen'>
type SelectedBookScreenMoreRouteProps = RouteProp<BookNavigatorParamList, 'WriteReviewScreen'>

type Props = {
    navigation: SelectedBookScreenMoreNavigationProps
    route: SelectedBookScreenMoreRouteProps
}


function AllReviewsScreen({ navigation, route }: Props) {
    const session = useSelector((state: RootState) => state.session)

    const dispatch = useDispatch()

    return (
        <DefaultView>

            <BackArrowContainer>
                <Pressable onPress={() => {
                    navigation.pop();
                }}>
                    <Ionicons name={'chevron-back'} size={25} color={'black'} />
                </Pressable>
            </BackArrowContainer>

            <View style={{ paddingRight: 10 }}>
                <View style={styles.reviewContainer}>
                    <View style={{ width: 350 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15 }}>
                            <Text style={{ fontWeight: 'bold' }}>Title</Text>
                            <Rating
                                type='star'
                                tintColor='rgb(242,242,242)'
                                ratingCount={5}
                                imageSize={20}
                                jumpValue={1.0}
                                startingValue={3}
                                style={{}}
                                readonly={true}
                            />
                        </View>
                        <Text style={{ color: 'grey', fontFamily: 'sans-serif', fontSize: 14, width: 350 }}>content</Text>
                    </View>
                </View>
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
})

export default AllReviewsScreen
