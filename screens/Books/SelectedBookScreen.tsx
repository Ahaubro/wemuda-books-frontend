import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Image, Pressable } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../redux/store'
import { endSession } from '../../redux/slices/sessionSlice'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { BookNavigatorParamList } from '../../types/NavigationTypes'
import Ionicons from '@expo/vector-icons/Ionicons'
import { GoogleBookById, useGetBooksByIdQuery } from "../../redux/services/googleBookApi"



type SelectedBookScreenNavigationProps = StackNavigationProp<BookNavigatorParamList, 'SelectedBookScreen'>
type SelectedBookScreenRouteProps = RouteProp<BookNavigatorParamList, 'SelectedBookScreen'>

type Props = {
    navigation: SelectedBookScreenNavigationProps
    route: SelectedBookScreenRouteProps
}

function SelectedBookScreen({ navigation, route }: Props) {
    const session = useSelector((state: RootState) => state.session)

    // Destructuring
    const { bookId, title, authors, description, thumbnail } = route.params

    console.log("Booksid", bookId)
    console.log("Bookstitle", title)

    // Slice description
    let slicedDescription = description.substring(0, 175)

    //Get book by id
    const [books, setBooks] = useState<GoogleBookById[]>([]);
    const fetchedBooks = useGetBooksByIdQuery({ id: bookId }, { refetchOnMountOrArgChange: false })
    const { data, error } = fetchedBooks;

    const dispatch = useDispatch()

    //Use effect fetched books
    useEffect(() => {
        setBooks(fetchedBooks.data?.books ?? [])
    }, [])

    // HERTIL
    console.log(fetchedBooks);

    return (
        <View style={{ backgroundColor: 'white', height: '100%' }}>

            <Pressable style={{ padding: 20 }} onPress={() => {
                navigation.navigate('Books')
            }}>
                <Ionicons name={'chevron-back'} size={25} color={'black'} />
            </Pressable>

            <View style={styles.imageView}>
                <Image
                    source={{ uri: thumbnail }}
                    style={{ width: 110, height: 150, borderRadius: 5 }}
                />
            </View>

            <Text>{'\n'}</Text>

            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.auhtors}>{authors}</Text>
            </View>

            <Text>{'\n'}</Text>


            <View style={styles.centerContainer}>
         
                <Pressable style={styles.blackPressableReading} onPress={() => {
                    console.log("Coming soon")
                }}>
                    Currently reading
                    <Ionicons name={'chevron-down'} size={18} color={'white'} />
                </Pressable>
               
            </View>

            <Text>{'\n'}</Text>
            <Text>{'\n'}</Text>


            <Text style={{ fontWeight: 'bold', fontSize: 14, textAlign: 'center', padding: 5 }}>Description </Text>
            <Text style={{ textAlign: 'center', padding: 5, marginRight: 5, marginLeft: 5, }}>{slicedDescription}...</Text>

            <View style={styles.centerContainer}>
                <Pressable style={styles.blackPressableSeemore} onPress={() => {
                    console.log(description)
                }}>
                    See more
                </Pressable>
            </View>


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
    title: {
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    auhtors: {
        fontSize: 15,
        textAlign: 'center',
        fontFamily: '100',
        color: '#d3d3d3',
    },
    imageView: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    blackPressableSeemore: {
        backgroundColor: 'black',
        borderRadius: 20,
        width: 'fit-content',
        color: 'white',
        textAlign: 'center',
        fontWeight: 100,
        fontSize: 12,
        padding: 8,
        fontFamily: "sans-serif",
    },
    blackPressableReading: {
        backgroundColor: 'black',
        borderRadius: 20,
        color: 'white',
        textAlign: 'center',
        fontWeight: 100,
        fontSize: 12,
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        fontFamily: "sans-serif",
    },
    centerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    }
})

export default SelectedBookScreen