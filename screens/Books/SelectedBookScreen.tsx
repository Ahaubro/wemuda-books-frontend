import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Image, Pressable, TouchableOpacity, FlatList } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../redux/store'
import { endSession } from '../../redux/slices/sessionSlice'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { BookNavigatorParamList } from '../../types/NavigationTypes'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useEditStatusMutation, useAddBookMutation, useGetBooksByUserIdQuery, Book } from '../../redux/services/bookApi'
import { useLazyGetBookByIdQuery } from '../../redux/services/googleBookApi'
import DefaultView from "../../components/DefaultView"
import BackArrowContainer from "../../components/BackArrowContainer"
import { Review, useGetReviewsQuery, useGetReviewsByBookIdQuery } from "../../redux/services/reviewApi"
import { Rating, AirbnbRating } from "react-native-ratings"


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
        slicedDescription = description.substring(0, 70)
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
    const userBooksArr = fetchedUserBooks.data?.books
    let isCurrentlyReading: boolean = false
    let isHistory: boolean = false

    let currentBook: Book = {
        bookId: "",
        title: "",
        author: "",
        description: "",
        thumbnail: "",
        averageRating: 0,
        ratingsCount: 0,
        bookStatus: ""
    }

    userBooksArr?.forEach((book) => {
        if (book.bookId === bookId) {
            currentBook.bookId = book.bookId,
                currentBook.title = book.title,
                currentBook.author = book.author,
                currentBook.description = book.description,
                currentBook.thumbnail = book.thumbnail,
                currentBook.averageRating = book.averageRating,
                currentBook.ratingsCount = book.ratingsCount,
                currentBook.bookStatus = book.bookStatus

            if (currentBook.bookStatus === "CurrentlyReading") {
                isCurrentlyReading = true
            }

            if (currentBook.bookStatus === "History") {
                isHistory = true
            }
        }
    })


    //Reviews
    const [reviews, setReviews] = useState<Review[]>([]);
    const fetchedReviews = useGetReviewsByBookIdQuery(bookId);


    //SLice review content function for display
    let slicedContentString = ""
    const getContent = (content: string) => {
        if (!content) {
          slicedContentString = "No content.."
          return slicedContentString
        } else if (content.length > 80) {
            slicedContentString = content.substring(0,90) + " ..."
          return slicedContentString
        } else {
            slicedContentString = content
          return slicedContentString
        }
      }


    //Use effect fetched books
    useEffect(() => {
        if (fetchedUserBooks.data) {
            let arr = fetchedUserBooks.data.books.map(item => item.bookId)
            setSavedBookIds(arr);
        }
    }, [fetchedUserBooks.data])


    useEffect(() => {
        if (fetchedReviews.data) {
            let reviewArr = fetchedReviews.data.reviews
        }
    }, [fetchedReviews.data])


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
                        style={{ width: 140, height: 200, borderRadius: 5 }}
                    />
                    :
                    <div style={{ width: 140, height: 200, backgroundColor: "#ccc", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 5 }}>
                        No image
                    </div>
                }
            </View>


            <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', padding: 5 }}>

                {averageRating ?
                    <Text>
                        <Text style={{ color: '#d3d3d3', opacity: 0.95, fontSize: 16 }}>
                            <Ionicons style={{ color: '#d3d3d3', opacity: 0.95, paddingHorizontal: 5 }} name={'star-sharp'} size={18} color={'grey'} />
                            {averageRating}
                        </Text>
                        <Text style={{ color: '#d3d3d3', opacity: 0.95, marginLeft: 6, marginRight: 4, fontSize: 16 }}> - </Text>
                        <Text style={{ color: '#d3d3d3', opacity: 0.95, fontSize: 16 }}> {ratingsCount} votes </Text>
                    </Text>
                    :
                    <Text style={{ color: '#d3d3d3', opacity: 0.95, fontSize: 16 }}>No votes yet</Text>
                }
            </View>

            <View style={{ marginBottom: 15, marginTop: 15 }}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.auhtors}>{authors}</Text>
            </View>


            {/* HISTORY */}

            <View>

                {!isHistory ?

                    <View style={styles.centerContainer}>
                        {session.id && (
                            <View style={{ width: "42%" }}>
                                {savedBookIds.filter(elm => elm === bookId).length === 1 ?
                                    <Pressable style={styles.onMyListBtn} onPress={() => {
                                        addBookAtributes.userId = session.id;
                                        addBookAtributes.bookId = bookId;
                                        addBookAtributes.title = title;
                                        addBookAtributes.author = authors;
                                        addBookAtributes.description = description;
                                        addBookAtributes.thumbnail = thumbnail ? thumbnail : undefined;
                                        addBookAtributes.averageRating = averageRating;
                                        addBookAtributes.ratingCount = ratingsCount
                                        addBookAtributes.bookStatus = "WantToRead"
                                        console.log(addBookAtributes)
                                        addBook(addBookAtributes);

                                    }}>
                                        <Text style={{ fontWeight: '700', fontSize: 12, color: "white" }}>
                                            <Ionicons style={{}} name={'checkmark-sharp'} size={16} color={'white'} />
                                            On reading list
                                        </Text>
                                    </Pressable>
                                    :
                                    <Pressable style={styles.selectedBookBtn} onPress={() => {
                                        addBookAtributes.userId = session.id;
                                        addBookAtributes.bookId = bookId;
                                        addBookAtributes.title = title;
                                        addBookAtributes.author = authors;
                                        addBookAtributes.description = description;
                                        addBookAtributes.thumbnail = thumbnail ? thumbnail : undefined;
                                        addBookAtributes.averageRating = averageRating;
                                        addBookAtributes.ratingCount = ratingsCount
                                        addBookAtributes.bookStatus = "WantToRead"
                                        console.log(addBookAtributes)
                                        addBook(addBookAtributes);

                                    }}>
                                        <Text style={{ fontWeight: '700', fontSize: 12 }}>Add to reading list</Text>
                                    </Pressable>
                                }
                            </View>
                        )}

                        <View style={{ width: "2%" }}></View>

                        {/* CURRENTLYREADING */}

                        <View style={{ width: "42%" }}>

                            {isCurrentlyReading ?

                                <Pressable style={styles.onMyListBtn} onPress={() => {
                                    if (session.id != 0)
                                        editBookStatus({ userId: session.id, bookId, bookStatus: "WantToRead" });
                                }}>

                                    <Text style={{ fontWeight: '700', fontSize: 12, color: 'white' }}>
                                        Currently reading
                                        <Ionicons style={{}} name={'checkmark-sharp'} size={16} color={'white'} />
                                    </Text>

                                </Pressable>

                                :

                                <Pressable style={styles.selectedBookBtn} onPress={() => {
                                    if (session.id != 0)
                                        editBookStatus({ userId: session.id, bookId, bookStatus: "CurrentlyReading" });
                                }}>

                                    <Text style={{ fontWeight: '700', fontSize: 12 }}> Set as currently reading </Text>

                                </Pressable>

                            }

                        </View>
                    </View>

                    :

                    <Pressable style={styles.onMyListBtn}>
                        <Text style={{ fontWeight: '700', fontSize: 12, color: 'white' }}>
                            You already read this book
                            <Ionicons style={{}} name={'checkmark-sharp'} size={16} color={'white'} />
                        </Text>
                    </Pressable>

                }

            </View>


            <View style={styles.descriptionContainer}>
                <Text style={{ fontWeight: 'bold', fontSize: 14, paddingVertical: 15 }}>Description </Text>
                <Text style={{ color: 'grey', fontFamily: 'sans-serif', fontSize: 14, lineHeight: 25 }}>
                    {slicedDescription}...

                    <Pressable onPress={() => {
                        navigation.navigate('SelectedBookMoreScreen', {

                            title: title,
                            description: description,

                        })
                    }}>
                        <Text style={{ color: 'black', fontFamily: 'sans-serif', fontSize: 14, fontWeight: "bold" }}> See more</Text>
                    </Pressable>
                </Text>
            </View>


            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.reviewHeader}>Reviews</Text>
                <Pressable style={{ marginTop: 20 }} onPress={() => {
                    navigation.navigate('AllReviewsScreen', {
                        bookId: bookId
                    })
                }}>
                    <Text style={{ color: "#ccc", fontWeight: '700' }}>See all</Text>
                </Pressable>
            </View>


            <View> 
                <FlatList
                    contentContainerStyle={{}} 
                    showsHorizontalScrollIndicator={true}
                    horizontal={true}
                    keyExtractor={(item) => item.content} data={fetchedReviews.data?.reviews || []} renderItem={({ item, index }) => (

                        <View style={{paddingRight:10}}>
                            <View style={styles.reviewContainer}>
                            <View style={{ width: 350 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: -10, paddingVertical: 10}}>
                                        <AirbnbRating
                                            reviews={['Terrible', 'Okay', 'Good', 'Great book', 'Love this book']}
                                            reviewSize={14}
                                            reviewColor={'black'}                                          
                                            size={20}
                                            defaultRating={item.rating}
                                            isDisabled={true}
                                            starContainerStyle={{paddingLeft: 60}}
                                            ratingContainerStyle={{backgroundColor: 'rgb(247,247,250)', flexDirection: 'row', justifyContent:'space-between', width: '100%' }}
                                        />
                                    </View>
                                    <Text style={{ color: 'grey', fontFamily: 'sans-serif', fontSize: 14, width: 350 }}>{item.content}</Text>
                                </View>
                            </View>
                        </View>

                    )} />
            </View>


            <View style={{ marginTop: 15 }}>
                <Pressable style={styles.selectedBookBtn} onPress={() => {
                    navigation.navigate("WriteReviewScreen", {
                        bookId: bookId,
                        userId: session.id
                    })
                }}>
                    <Text style={{ fontWeight: '700', fontSize: 16 }}> <Ionicons name={'pencil-outline'} size={20} color={'black'} style={{ paddingHorizontal: 5 }} /> Write a review </Text>
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
        fontSize: 22,
        textAlign: 'center',
        fontWeight: 'bold',
        paddingVertical: 5
    },
    auhtors: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '400',
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
    centerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    },
    selectedBookBtn: {
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "sans-serif",
        textAlign: "center",
        backgroundColor: "rgb(247,247,250)",
        borderRadius: 20,
        color: "black",
        paddingVertical: 10,
        height: 40
    },
    descriptionContainer: {
        backgroundColor: "rgb(247,247,250)",
        borderRadius: 15,
        height: 110,
        paddingHorizontal: 20,
        marginTop: 35,
    },
    reviewHeader: {
        marginTop: 20,
        fontWeight: "bold",
        fontSize: 16,
    },
    reviewContainer: {
        backgroundColor: "rgb(247,247,250)",
        borderRadius: 15,
        height: 110,
        paddingHorizontal: 20,
        marginTop: 15,
    },
    reviewBtn: {
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "sans-serif",
        textAlign: "center",
        backgroundColor: "rgb(247,247,250)",
        borderRadius: 15,
        color: "black",
        paddingVertical: 10,
        height: 40,
    },
    onMyListBtn: {
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "sans-serif",
        textAlign: "center",
        backgroundColor: "black",
        borderRadius: 15,
        color: "White",
        paddingVertical: 10,
        height: 40
    }
})

export default SelectedBookScreen