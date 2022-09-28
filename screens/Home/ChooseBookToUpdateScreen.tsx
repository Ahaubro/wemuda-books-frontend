import React, { useEffect, useRef, useState } from 'react'
import { View, Pressable, Image, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackNavigationProp } from '@react-navigation/stack'
import { HomeNavigatorParamList } from '../../types/NavigationTypes'
import { RouteProp } from '@react-navigation/native'
import { useEditStatusMutation, useGetBooksByUserIdQuery, Book } from '../../redux/services/bookApi'
import { useAddStatusUpdateMutation } from '../../redux/services/statusUpdateApi'
import { useSetBooksGoalMutation, useResetBooksReadMutation } from '../../redux/services/userApi'
import DefaultView from "../../components/DefaultView"
import BackArrowContainer from '../../components/BackArrowContainer'
import Looper from "../../components/Looper"


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

     //Flatlist element styling LOOPER BOOK
  const activeIndex = useRef(0);
  const [activeIndexForStyling, setActiveIndexForStyling] = useState(0);
  let scrollViewRef = useRef<FlatList>(null);
  const [intervalScroll, setIntervalScroll] = useState(true);

  function intervalFn() {
    if(intervalScroll) {
      if (scrollViewRef.current) {
        if (activeIndex.current === currentlyReadingBooks.length - 1) {
          activeIndex.current = 0;
        } else {
          activeIndex.current++;
        }
        
        scrollViewRef.current.scrollToOffset({
          animated: true,
          offset: activeIndex.current * Dimensions.get("window").width,
        });
      }
    }
  }

  useEffect(() => {
    if (currentlyReadingBooks.length > 0) {
      const interval = setInterval(intervalFn, 5000);

      return () => clearInterval(interval);
    }

  }, [currentlyReadingBooks]);

  const onScrollHandler = (
    scroll: number,
  ) => {
    if(intervalScroll) setIntervalScroll(false)
    if (scroll %  Dimensions.get("window").width === 0) {
      if (scroll === 0) {
        activeIndex.current = 0;
      } else {
        activeIndex.current = scroll /  Dimensions.get("window").width;
      }
      setActiveIndexForStyling(activeIndex.current);
      setIntervalScroll(true)
    }
  };





    return <>
        <DefaultView>
            <BackArrowContainer>
                <Pressable onPress={() => { navigation.pop(); }}>
                    <Ionicons name={'chevron-back'} size={25} color={'black'} />
                </Pressable>
            </BackArrowContainer>

            <Text style={styles.heading}>Choose book to update progress</Text>

            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={{ flex: 1, marginTop: 75, width: Dimensions.get("window").width, justifyContent: 'center'}}>
                    <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        snapToAlignment={"center"}
                        decelerationRate={"fast"}
                        pagingEnabled={true}
                        ref={scrollViewRef}
                        data={currentlyReadingBooks}
                        onScroll={(e) => {
                        onScrollHandler(e.nativeEvent.contentOffset.x)
                        }}
                        renderItem={(({ item: book, index: i }) =>
                            <View style={{width: Dimensions.get("window").width}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('UpdateStatus', {
                                            bookId: book.bookId,
                                            userId: userId
                                        })
                                    }}>
                                    
                                    <Looper item={book} activeIndex={activeIndex.current} index={i} />

                                </TouchableOpacity>
                            </View>

                        )}
                    />
                </View>
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