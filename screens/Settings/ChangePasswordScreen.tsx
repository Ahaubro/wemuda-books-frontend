import React from 'react'
import { Text, View, StyleSheet, Button, Pressable } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../redux/store'
import { endSession } from '../../redux/slices/sessionSlice'
import DefaultView from '../../components/DefaultView'
import BackArrowContainer from '../../components/BackArrowContainer'
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { MyPageNavigatorParamList } from '../../types/NavigationTypes'


type changePasswordScreenNavigationProps = StackNavigationProp<MyPageNavigatorParamList, 'ChangePasswordScreen'>
type changePasswordScreenRouteProps = RouteProp<MyPageNavigatorParamList, 'ChangePasswordScreen'>

interface Props {
  navigation: changePasswordScreenNavigationProps,
  route: changePasswordScreenRouteProps
}

function ChangePasswordScreen({ navigation, route }: Props) {
  const session = useSelector((state: RootState) => state.session)
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

      <Text style={styles.heading}>Change password</Text>  


    </DefaultView>
  )
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 25,
    textAlign: 'left',
    paddingVertical: 15,
    fontFamily: "GraphikMedium",
  },
})

export default ChangePasswordScreen
