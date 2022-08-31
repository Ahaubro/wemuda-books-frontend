import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Image, Pressable } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../redux/store'
import { endSession } from '../../redux/slices/sessionSlice'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { BookNavigatorParamList } from '../../types/NavigationTypes'
import Ionicons from '@expo/vector-icons/Ionicons'


type SelectedBookScreenNavigationProps = StackNavigationProp<BookNavigatorParamList, 'SelectedBookScreen'>
type SelectedBookScreenRouteProps = RouteProp<BookNavigatorParamList, 'SelectedBookScreen'>

type Props = {
    navigation: SelectedBookScreenNavigationProps
    route: SelectedBookScreenRouteProps
}

function SelectedBookScreen({ navigation, route }: Props) {
    const session = useSelector((state: RootState) => state.session)

    // Destructuring fra navigation.navigate (Books.tsx linje 75 - 81)
    const { bookId, title, author, description, thumbnail, averageRating, ratingsCount } = route.params

    // Slice description (Check if undefined)
    let slicedDescription;
    if(description != undefined) {
        slicedDescription = description.substring(0, 150)
    } else {
        slicedDescription = "";
    }

    

    const dispatch = useDispatch()

    return (
        <View style={{ backgroundColor: 'white', height: '100%' }}>

            <Pressable style={{ padding: 20 }} onPress={() => {
                navigation.navigate('Books')
            }}>
                <Ionicons name={'chevron-back'} size={25} color={'black'} />
            </Pressable>

            <View style={styles.imageView}>
                {thumbnail ?
                  <Image
                    source={{ uri: thumbnail }}
                    style={{ width: 110, height: 150, borderRadius: 5 }}
                  />
                  :
                  <div style={{ width: 110, height: 150, backgroundColor: "#ccc", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 5}}>
                    No image
                  </div>
                }
            </View>
            

            <View style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', padding: 5}}>

                { averageRating ? 
                
                <Text>
                    <Ionicons style={{color: '#d3d3d3', opacity: 0.95, marginTop: 3}} name={'star-sharp'} size={13} color={'grey'} /> 
                    <Text style={{color: '#d3d3d3', opacity: 0.95}}> {averageRating} </Text>
                    <Text style={{color: '#d3d3d3', opacity: 0.95, marginLeft: 6, marginRight: 4,}}> - </Text>
                    <Text style={{color: '#d3d3d3', opacity: 0.95}}> {ratingsCount} votes </Text> 
                </Text>
                
                :
                    <Text style={{color: '#d3d3d3', opacity: 0.95}}>No votes yet</Text>
                
                }

            </View>

            <Text>{'\n'}</Text>

            <View>
                <Text style={styles.title}>{title}</Text>
                 <Text style={styles.auhtors}>{author}</Text> 
            </View>

            <Text>{'\n'}</Text>


            <View style={styles.centerContainer}>
         
                <Pressable style={styles.blackPressableReading} onPress={() => {
                    console.log("Coming soon")
                }}>
                    <Text style={{color: 'white', fontFamily: 'sans-serif'}}> Currently reading </Text>
                    <Ionicons name={'chevron-down'} size={18} color={'white'} />
                </Pressable>
               
            </View>

            <Text>{'\n'}</Text>
            <Text>{'\n'}</Text>


            <Text style={{ fontWeight: 'bold', fontSize: 14, textAlign: 'center', padding: 5 }}>Description </Text>
            <Text style={{ textAlign: 'center', padding: 5, marginRight: 5, marginLeft: 5, color: 'grey', fontFamily: 'sans-serif', fontSize: 12}}>{slicedDescription}...</Text>

            <View style={styles.centerContainer}>
                <Pressable style={styles.blackPressableSeemore} onPress={() => {
                    navigation.navigate('SelectedBookMoreScreen', {
                        
                        title: title,
                        
                        description: description,
                        
                        })
                }}>
                    <Text style={{color: 'white', fontFamily: 'sans-serif'}}>See more</Text>
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
        fontSize: 20,
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
        padding: 6,
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