import React, { } from 'react'
import {View, Pressable, Image, Text, StyleSheet, TextInput} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackNavigationProp } from '@react-navigation/stack'
import { HomeNavigatorParamList } from '../../types/NavigationTypes'
import { RouteProp } from '@react-navigation/native'
import {useEditStatusMutation, useGetBooksByUserIdQuery, Book} from '../../redux/services/bookApi'


type UpdateStatusScreenNavigationProps = StackNavigationProp<HomeNavigatorParamList, "UpdateStatus">
type UpdateStatisScreenRouteProps = RouteProp<HomeNavigatorParamList, "UpdateStatus">

interface HomeScreenProps {
    navigation: UpdateStatusScreenNavigationProps,
    route: UpdateStatisScreenRouteProps
}

const UpdateStatusScreen: React.FC<HomeScreenProps> = ({navigation, route}) => {

    const {bookId, userId} = route.params

    const userBooks = useGetBooksByUserIdQuery(userId)
    const currentlyReadingBook : Book | undefined = userBooks.data?.books.find(book => book.bookId == bookId)

    const [editBookStatus] = useEditStatusMutation();

    return <>
        <View style={{margin: 20}}>

            <Pressable onPress={() => { navigation.navigate('Home') }}>
                <Ionicons name={'chevron-back'} size={25} color={'black'} />
            </Pressable>

            <View style={{flex: 1, alignItems: "center"}}>

                <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Currently reading</Text>

                {currentlyReadingBook?.thumbnail ?
                    <Image
                        source={{ uri: currentlyReadingBook.thumbnail }}
                        style={{ width: 100, height: 150, borderRadius: 3 }}
                    />
                    :
                    <div style={{ width: 50, height: 65, backgroundColor: "#ccc", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        No image
                    </div>
                }

                <Pressable style={{ ...styles.buttonGray, marginTop: 25 }} onPress={(() => {
                    editBookStatus({userId, bookId, bookStatus: "History"})
                    navigation.navigate("Home")
                })}>
                    <Text style={{ fontWeight: "bold" }}>Done</Text>
                </Pressable>

            </View>
        </View>
    </>
}

const styles = StyleSheet.create({
    buttonGray: {
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "sans-serif",
        textAlign: "center",
        backgroundColor: "#DDD",
        borderRadius: 15,
        width: "fit-content",
        marginBottom: 10,
        marginTop: 0,
        paddingHorizontal: 15,
        paddingVertical: 10,
        height: "fit-content"
    }
})

export default UpdateStatusScreen