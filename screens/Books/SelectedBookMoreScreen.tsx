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

    //Destrcuturing
    const {title, description } = route.params

    const dispatch = useDispatch()

    return (
        <View style={{backgroundColor: 'white', height: '100%'}}>

            <Pressable style={{ padding: 20 }} onPress={() => {
                navigation.pop()
               
            }}>
                <Ionicons name={'chevron-back'} size={25} color={'black'} />
            </Pressable>

            <View style={styles.container}>

                <Text style={styles.title}>{title}</Text>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionHeader}>Description </Text>
                    <Text style={styles.description}>{description}</Text>
                </View>
            
            </View>

        </View>
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
        fontWeight: 'bold',
        padding: 10,
    },
    descriptionHeader: {
        fontWeight: 'bold', 
        fontSize: 14, 
        textAlign: 'center', 
        padding: 5
    },
    description:{
        textAlign: 'justify', 
        padding: 5, 
        color: 'grey', 
        fontFamily: 'sans-serif', 
        fontSize: 12,
        hyphens: 'auto',
    },
    descriptionContainer:{
        marginRight: 20,
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 10,
        overflowY: 'scroll',
        height: 380,
        fontFamily: 'sans-serif', 
        padding: 4,
    }
})

export default SelectedBookScreen