import { StackNavigationProp } from '@react-navigation/stack'
import { produceWithPatches } from 'immer'
import React, { ReactNode, useRef, useState } from 'react'
import { Text, View, StyleSheet, Button, Animated, Image, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Book } from '../redux/services/bookApi'
import { BookNavigatorParamList } from '../types/NavigationTypes'
import useInterval from './useInterval'

type SelectedBookScreenNavigationProps = StackNavigationProp<BookNavigatorParamList, 'SelectedBookScreen'>

interface CarouselProps {
    items: Book[],
    navigation: SelectedBookScreenNavigationProps
}

const Carousel: React.FC<CarouselProps> = ({ items, navigation }) => {

    const animation = useRef(new Animated.Value(0));
    const [currentImage, setCurrentImage] = useState(0);
    useInterval(() => handleAnimation(), 3000)

    const handleAnimation = () => {
        let newCurrentImage = currentImage + 1;

        if (newCurrentImage === items.length) {
            newCurrentImage = 0;
        }

        Animated.spring(animation.current, {
            toValue: -(250 * newCurrentImage),
            useNativeDriver: false,
        }).start();

        setCurrentImage(newCurrentImage);
    }

    return (
        <React.Fragment>
            <View style={{ width: 200, overflow: 'scroll' }}>
                <Animated.View style={[styles.container, {
                    transform: [{ translateX: animation.current }],
                }]}>

                    {items.map((item, index) => {
                        // return <Image style={[styles.img, index === currentImage ? styles.currentImage : undefined]} key={`${item.thumbnail}_${index}`} source={{uri: item.thumbnail}} />
                        return <View key={item.title}>
                            <TouchableOpacity key={item.bookId}
                                onPress={() => {
                                    navigation.navigate('SelectedBookScreen', {
                                        bookId: item.bookId,
                                        title: item.title,
                                        authors: item.author,
                                        description: item.description,
                                        thumbnail: item.thumbnail ? item.thumbnail : undefined,
                                        averageRating: item.averageRating,
                                        ratingsCount: item.ratingsCount,
                                    })
                                }}>

                                <Image style={styles.img} key={item.thumbnail} source={{ uri: item.thumbnail }} />

                            </TouchableOpacity>
                        </View>
                    })}

                </Animated.View>
                <View style={styles.indicatorContainer}>
                    {items.map((item, index) => {
                        return <View style={[styles.indicator, index === currentImage ? styles.activeIndicator : undefined]} key={`${item}_${index}`}></View>
                    })}
                </View>
            </View>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        transform: [{ translateX: 200 }],
    },
    indicatorContainer: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        bottom: 10,
        zIndex: 2,
    },
    indicator: {
        width: 15,
        height: 15,
        borderRadius: 7.5,
        borderColor: 'white',
        borderWidth: 1,
        marginHorizontal: 10,
        marginBottom: 10
    },
    activeIndicator: {
        backgroundColor: '#ccc'
    },
    img: {
        width: 200,
        height: 280,
        resizeMode: 'cover',
        marginRight: 50,
        borderRadius: 5,
        opacity: 0.8
    },
    currentImage: {
        width: 200,
        height: 280,
    }
})

export default Carousel
