import { RootState } from '../../redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { MyPageNavigatorParamList } from '../../types/navigationTypes'
import { Pressable, StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import DeafultView from "../../components/DefaultView"


type BookListScreenNavigationProps = StackNavigationProp<MyPageNavigatorParamList, 'BookList'>
type BookLstScreenRouteProps = RouteProp<MyPageNavigatorParamList, 'BookList'>

type Props = {
  navigation: BookListScreenNavigationProps
  route: BookLstScreenRouteProps
}

function BookListScreen({ navigation, route }: Props) {
  const session = useSelector((state: RootState) => state.session)

  const { books, title } = route.params

  const thumbDefault = 'https://books.google.com/books/content?id=qc8qvXhpLA0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'

  return (<>
    <DeafultView>
      <Pressable onPress={() => {
        navigation.navigate('MyPage')
      }}>
        <Ionicons name={'chevron-back'} size={25} color={'black'} />
      </Pressable>

      <Text style={styles.subHeading}>{title}</Text>

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <FlatList style={{ flex: 1, flexWrap: "wrap" }} numColumns={4} showsHorizontalScrollIndicator={false} data={books} renderItem={(({ item: book }) => (
          <View style={{ paddingVertical: 6, marginRight: 5, marginLeft: 5 }}>
            <TouchableOpacity onPress={() => {
              navigation.navigate('SelectedBookScreen', {
                bookId: book.bookId,
                title: book.title,
                description: book.description,
                thumbnail: book.thumbnail,
                authors: book.author,
                averageRating: book.averageRating,
                ratingsCount: book.ratingsCount
              })
            }}>

              <Image
                source={{ uri: book.thumbnail }}
                defaultSource={{ uri: thumbDefault }}
                style={{ width: 60, height: 110, borderWidth: 0.5, borderColor: "#d3d3d3", borderRadius: 3 }}
              />
            </TouchableOpacity>
          </View>
        ))} />
      </View>
    </DeafultView>
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