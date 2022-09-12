import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Image, Pressable } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../redux/store'
import { endSession } from '../../redux/slices/sessionSlice'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { BookNavigatorParamList } from '../../types/NavigationTypes'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useEditStatusMutation, useAddBookMutation, useGetBooksByUserIdQuery } from '../../redux/services/bookApi'
import { useLazyGetBookByIdQuery } from '../../redux/services/googleBookApi'
import DefaultView from "../../components/DefaultView"
import BackArrowContainer from "../../components/BackArrowContainer"


type SelectedBookScreenNavigationProps = StackNavigationProp<BookNavigatorParamList, 'SelectedBookScreen'>
type SelectedBookScreenRouteProps = RouteProp<BookNavigatorParamList, 'SelectedBookScreen'>

type Props = {
    navigation: SelectedBookScreenNavigationProps
    route: SelectedBookScreenRouteProps
}

function SelectedBookScreen({ navigation, route }: Props) {
    const session = useSelector((state: RootState) => state.session)

    // Destructuring fra navigation.navigate (Books.tsx linje 75 - 81)
    const { bookId, title, authors, description, thumbnail, averageRating, ratingsCount } = route.params

    // Slice description (Check if undefined)
    let slicedDescription;
    if (description != undefined) {
        slicedDescription = description.substring(0, 150)
    } else {
        slicedDescription = "";
    }


    //Update bookStatus
    const [editBookStatus] = useEditStatusMutation();
    // const [updateProps, setUpdateProps] = useState<{ userId: number, bookId: string, bookStatus: string, title: string, thumbnail: string | undefined }>
    // ({ userId: 0, bookId: "", bookStatus: "", title: "", thumbnail: ""})


    //Add book (want to read for now)
    const [addBook] = useAddBookMutation();
    const [addBookAtributes, setAddBookAtributes] = useState<{
        userId: number, bookId: string, title: string, thumbnail: string | undefined, author: string,
        description: string, averageRating: number, ratingCount: number, bookStatus: string
    }>({
        userId: 0, bookId: "", title: "", thumbnail: "", author: "", description: "",
        averageRating: 0, ratingCount: 0, bookStatus: ""
    })


    //For updating wantToRead
    const fetchedUserBooks = useGetBooksByUserIdQuery(session.id, { refetchOnMountOrArgChange: true });
    const [savedBookIds, setSavedBookIds] = useState<string[]>([]);
    

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

            <View style={styles.imageView}>
                {thumbnail ?
                    <Image
                        source={{ uri: thumbnail }}
                        style={{ width: 110, height: 150, borderRadius: 5 }}
                    />
                    :
                    <div style={{ width: 110, height: 150, backgroundColor: "#ccc", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 5 }}>
                        No image
                    </div>
                }
            </View>


            <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', padding: 5 }}>

                {averageRating ?

                    <Text>
                        <Ionicons style={{ color: '#d3d3d3', opacity: 0.95, marginTop: 3 }} name={'star-sharp'} size={13} color={'grey'} />
                        <Text style={{ color: '#d3d3d3', opacity: 0.95 }}> {averageRating} </Text>
                        <Text style={{ color: '#d3d3d3', opacity: 0.95, marginLeft: 6, marginRight: 4, }}> - </Text>
                        <Text style={{ color: '#d3d3d3', opacity: 0.95 }}> {ratingsCount} votes </Text>
                    </Text>

                    :
                    <Text style={{ color: '#d3d3d3', opacity: 0.95 }}>No votes yet</Text>

                }

            </View>

            <Text>{'\n'}</Text>

            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.auhtors}>{authors}</Text>
            </View>

            <Text>{'\n'}</Text>


            <View style={styles.centerContainer}>
                <Pressable style={styles.blackPressableReading} onPress={() => {
                    if (session.id != 0)
                        editBookStatus({ userId: session.id, bookId, bookStatus: "CurrentlyReading" });
                }}>
                    <Text style={{ color: 'white', fontFamily: 'sans-serif', fontSize: 12, opacity: 0.9 }}> Currently reading </Text>
                    <Ionicons name={'chevron-down'} size={13} color={'white'} />
                </Pressable>


                {session.id && (
                    <View style={{ marginRight: -40 }}>
                        <Pressable style={styles.blackPressableReading} onPress={() => {
                            addBookAtributes.userId = session.id;
                            addBookAtributes.bookId = bookId;
                            addBookAtributes.title = title;
                            addBookAtributes.author = authors;
                            addBookAtributes.description = description;
                            addBookAtributes.thumbnail = thumbnail ? thumbnail : undefined,
                                addBookAtributes.averageRating = averageRating;
                            addBookAtributes.ratingCount = ratingsCount
                            addBookAtributes.bookStatus = "WantToRead"
                            console.log(addBookAtributes)
                            addBook(addBookAtributes);

                        }}>
                            {/* <Text style={{ fontWeight: 'bold', fontSize: 10 }}>
                        {savedBookIds.filter(elm => elm === item.id).length === 1 ?
                          <>On my list <Ionicons name={'checkmark-sharp'} size={20} color={'green'} /> </>
                          :
                          <>Want to read <Ionicons name={'chevron-down'} size={20} color={'black'} /> </>
                        }
                      </Text> */}

                            <Text style={{ color: 'white', fontFamily: 'sans-serif', fontSize: 12, opacity: 0.9 }}>Want to read</Text>

                        </Pressable>
                    </View>
                )}
            </View>

            <Text>{'\n'}</Text>
            <Text>{'\n'}</Text>


            <Text style={{ fontWeight: 'bold', fontSize: 14, textAlign: 'center', padding: 5 }}>Description </Text>
            <Text style={{ textAlign: 'center', padding: 5, marginRight: 5, marginLeft: 5, color: 'grey', fontFamily: 'sans-serif', fontSize: 12 }}>{slicedDescription}...</Text>

            <View style={styles.centerContainer}>
                <Pressable style={styles.blackPressableSeemore} onPress={() => {
                    navigation.navigate('SelectedBookMoreScreen', {

                        title: title,
                        description: description,

                    })
                }}>
                    <Text style={{ color: 'white', fontFamily: 'sans-serif', fontSize: 12, opacity: 0.9 }}>See more</Text>
                </Pressable>
            </View>


        </DefaultView>
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
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    auhtors: {
        fontSize: 15,
        textAlign: 'center',
        fontWeight: '500',
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
        fontWeight: "100",
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontFamily: "sans-serif",
    },
    blackPressableReading: {
        backgroundColor: 'black',
        borderRadius: 20,
        color: 'white',
        textAlign: 'center',
        fontWeight: "200",
        paddingHorizontal: 10,
        paddingVertical: 10,
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