import React from 'react'
import { Text, View, StyleSheet, Button } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../redux/store'
import { endSession } from '../../redux/slices/sessionSlice'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { BookNavigatorParamList } from '../../types/NavigationTypes'


type SelectedBookScreenNavigationProps = StackNavigationProp<BookNavigatorParamList, 'SelectedBookScreen'>
type SelectedBookScreenRouteProps = RouteProp<BookNavigatorParamList, 'SelectedBookScreen'>

type Props = {
  navigation: SelectedBookScreenNavigationProps
  route: SelectedBookScreenRouteProps
}

function SelectedBookScreen ({navigation, route}:Props)  {
  const session = useSelector((state: RootState) => state.session)

  const { bookId, title, authors, description, thumbnail } = route.params
  console.log(`Book id: ${bookId}`);
  console.log(`${title}`);
  console.log(`${description}`);
  

  const dispatch = useDispatch()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.auhtors}>{authors}</Text>

      <View style={styles.descriptionView}>
        <Text style={{}}>{description}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  title: {
    fontSize: 30,
  },
  auhtors:{
    fontSize: 15,
  },
  descriptionView:{
    height: 100,
    overflowY: 'scroll',
  }
})

export default SelectedBookScreen