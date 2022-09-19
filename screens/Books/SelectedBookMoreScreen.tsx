import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Image, Pressable } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../redux/store'
import { endSession } from '../../redux/slices/sessionSlice'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { BookNavigatorParamList } from '../../types/NavigationTypes'
import Ionicons from '@expo/vector-icons/Ionicons'
import DefaultView from "../../components/DefaultView"
import BackArrowContainer from "../../components/BackArrowContainer"


type SelectedBookScreenMoreNavigationProps = StackNavigationProp<BookNavigatorParamList, 'SelectedBookMoreScreen'>
type SelectedBookScreenMoreRouteProps = RouteProp<BookNavigatorParamList, 'SelectedBookMoreScreen'>

type Props = {
    navigation: SelectedBookScreenMoreNavigationProps
    route: SelectedBookScreenMoreRouteProps
}

function SelectedBookScreen({ navigation, route }: Props) {
    const session = useSelector((state: RootState) => state.session)

    //Destrcuturing
    const {title, description } = route.params

    const dispatch = useDispatch()

    return (
        <DefaultView>

            <BackArrowContainer>
                <Pressable onPress={() => {
                    navigation.pop()
                
                }}>
                    <Ionicons name={'chevron-back'} size={25} color={'black'} />
                </Pressable>
            </BackArrowContainer>


            <View style={{}}>
                <Text style={styles.title}>{title}</Text>
            </View>


            <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionHeader}>Full description </Text>
                <Text style={styles.description}>{description}</Text>
            </View>                    

        </DefaultView>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignContent: 'center',
        paddingTop: 15,
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
        fontWeight: '700',
        fontFamily: 'GraphikMedium'
    },
    descriptionHeader: {
        fontWeight: '600', 
        fontSize: 18, 
        textAlign: 'center', 
        paddingVertical: 10,
    },
    description:{
        textAlign: 'justify', 
        padding: 5, 
        color: 'grey', 
        fontSize: 14,
        hyphens: 'auto',
    },
    descriptionContainer:{
        marginRight: 20,
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 10,
        overflowY: 'scroll',
        maxHeight: 650,
        padding: 8,
    }
})

export default SelectedBookScreen