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


type SettingsScreenNavigationProps = StackNavigationProp<MyPageNavigatorParamList, 'SettingsScreen'>
type SettingsScreenRouteProps = RouteProp<MyPageNavigatorParamList, 'SettingsScreen'>

interface Props {
  navigation: SettingsScreenNavigationProps,
  route: SettingsScreenRouteProps
}

function SettingsScreen({ navigation, route }: Props) {
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

      <Text style={styles.heading}>Settings</Text>  

      <View>

      <Pressable style={styles.buttonWhite} onPress={() => {
          navigation.navigate("ChangePasswordScreen")
        }}>
          <Text style={styles.btnWhiteText}>Change password</Text>
        </Pressable>

        <View style={{paddingVertical: 5}}>
          <Pressable style={styles.buttonWhite} onPress={() => {
            dispatch(endSession());
          }}>
            <Text style={styles.btnWhiteText}>Log out</Text>
          </Pressable>
        </View>

      </View>


    </DefaultView>
  )
}

const styles = StyleSheet.create({
  buttonWhite: {
    fontSize: 12,
    fontFamily: "GraphikMedium",
    textAlign: "center",
    backgroundColor: "black",
    borderRadius: 20,
    marginTop: 5,
    paddingVertical: 15,
    border: '1px solid black',
  },
  btnWhiteText: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: "GraphikMedium",
    color: 'white'
  },
  heading: {
    fontSize: 25,
    textAlign: 'left',
    paddingVertical: 15,
    fontFamily: "GraphikMedium",
  },
})

export default SettingsScreen
