import React, { useState } from 'react'
import { View, Pressable, Image, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackNavigationProp } from '@react-navigation/stack'
import { HomeNavigatorParamList } from '../../types/NavigationTypes'
import { RouteProp } from '@react-navigation/native'
import { useEditStatusMutation, useGetBooksByUserIdQuery, Book } from '../../redux/services/bookApi'
import { useAddStatusUpdateMutation } from '../../redux/services/statusUpdateApi'
import { useSetBooksGoalMutation, useResetBooksReadMutation } from '../../redux/services/userApi'
import DefaultView from "../../components/DefaultView"
import BackArrowContainer from '../../components/BackArrowContainer'


type ChooseBookPropsNavigationProps = StackNavigationProp<HomeNavigatorParamList, "ChooseBookToUpdateScreen">
type ChooseBookPropsRouteProps = RouteProp<HomeNavigatorParamList, "ChooseBookToUpdateScreen">

interface ChooseBookProps {
    navigation: ChooseBookPropsNavigationProps,
    route: ChooseBookPropsRouteProps
}

const ChooseBookToUpdateScreen: React.FC<ChooseBookProps> = ({ navigation, route }) => {

    const { userId } = route.params

    const userBooks = useGetBooksByUserIdQuery(userId)

    const currentlyReadingBooks: Book[] = []

    userBooks.data?.books.map((book) => {
        if (book.bookStatus == "CurrentlyReading") {
            currentlyReadingBooks.push(book)
        }
    });





    return <>
        <DefaultView>

            <BackArrowContainer>
                <Pressable onPress={() => { navigation.pop(); }}>
                    <Ionicons name={'chevron-back'} size={25} color={'black'} />
                </Pressable>
            </BackArrowContainer>

            <Text style={styles.heading}>Choose which book to update</Text>


            <View style={{ flex: 1, maxWidth: 390, marginTop: 75 }}>
                <FlatList
                    style={{ flex: 1 }}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={currentlyReadingBooks}
                    numColumns={1}
                    renderItem={(({ item: book, index: i }) =>
                        <View style={{ paddingHorizontal: 10, paddingVertical: 8}}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('UpdateStatus', {
                                        bookId: book.bookId,
                                        userId: userId
                                    })
                                }}>
                                <Image
                                    source={{ uri: book.thumbnail }}
                                    style={{ width: 150, height: 230, borderRadius: 5 }}
                                />
                            </TouchableOpacity>
                        </View>

                    )}
                />
            </View>
        </DefaultView>
    </>
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 25,
        textAlign: 'left',
        paddingVertical: 15,   
        fontFamily: "GraphikMedium",
    },
})

export default ChooseBookToUpdateScreen