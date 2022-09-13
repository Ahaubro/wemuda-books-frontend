import React from 'react'
import { Text, View, StyleSheet, Pressable } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../redux/store'
import { endSession } from '../../redux/slices/sessionSlice'
import Ionicons from '@expo/vector-icons/Ionicons'
import BackArrowContainer from "../../components/BackArrowContainer"
import DefaultView from "../../components/DefaultView"
import { RouteProp } from '@react-navigation/native'
import { BookNavigatorParamList } from '../../types/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'


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







    return (
        <DefaultView>

            <BackArrowContainer>
                <Pressable onPress={() => {
                    navigation.pop();
                }}>
                    <Ionicons name={'chevron-back'} size={25} color={'black'} />
                </Pressable>
            </BackArrowContainer>


        </DefaultView>
    )
}

const styles = StyleSheet.create({

})

export default WriteReviewScreen
