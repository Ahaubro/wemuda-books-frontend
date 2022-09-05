import { RootState } from '../../redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { MyPageNavigatorParamList } from '../../types/navigationTypes'
import { Pressable, StyleSheet, Text, View, FlatList, Image } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'

type BookListScreenNavigationProps = StackNavigationProp<MyPageNavigatorParamList, 'BookList'>
type BookLstScreenRouteProps = RouteProp<MyPageNavigatorParamList, 'BookList'>

type Props = {
    navigation: BookListScreenNavigationProps
    route: BookLstScreenRouteProps
}

function BookListScreen({ navigation, route }: Props){
    const session = useSelector((state: RootState) => state.session)

    const {books} = route.params

    const thumbDefault = 'https://books.google.com/books/content?id=qc8qvXhpLA0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'

    return (<>
        <View style={{margin: 20}}>
            <Pressable onPress={() => {
                navigation.navigate('MyPage')
            }}>
                <Ionicons name={'chevron-back'} size={25} color={'black'} />
            </Pressable>

            <Text style={styles.subHeading}>Want to read</Text>

            <FlatList style={{flex: 1, flexWrap: "wrap", width: "100%"}} numColumns={5} showsHorizontalScrollIndicator={false} data={books} renderItem={( ({item:book}) => (
                <View style={{marginRight: 10, marginBottom: 10}}>
                    <Image
                        source={{ uri: book.thumbnail }}
                        defaultSource={{ uri: thumbDefault }}
                        style={{ width: 50, height: 65 }}
                    />
                </View>
            ) )} />
        </View>
    </>)
}

const styles = StyleSheet.create({
    subHeading: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 10
    }
})

export default BookListScreen