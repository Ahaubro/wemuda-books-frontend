import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Image, Pressable } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../redux/store'
import { endSession } from '../../redux/slices/sessionSlice'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { BookNavigatorParamList } from '../../types/NavigationTypes'
import Ionicons from '@expo/vector-icons/Ionicons'


type SelectedBookScreenMoreNavigationProps = StackNavigationProp<BookNavigatorParamList, 'SelectedBookMoreScreen'>
type SelectedBookScreenMoreRouteProps = RouteProp<BookNavigatorParamList, 'SelectedBookMoreScreen'>

type Props = {
    navigation: SelectedBookScreenMoreNavigationProps
    route: SelectedBookScreenMoreRouteProps
}

function SelectedBookScreen({ navigation, route }: Props) {
    const session = useSelector((state: RootState) => state.session)

    const { title, description } = route.params
    console.log(title, description)

    const dispatch = useDispatch()

    return (
        <View style={{ backgroundColor: 'white', height: '100%' }}>

            <Text>{title}</Text>
            <Text>{description}</Text>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        paddingTop: 10,
    },
})

export default SelectedBookScreen