import { produceWithPatches } from 'immer'
import React, { ReactNode } from 'react'
import { Text, View, StyleSheet, Button } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { FONTS } from '../utils/fontUtils'


interface DefaultViewProps {
  children: ReactNode
}

const DefaultView: React.FC<DefaultViewProps> = (props) => {


  return (
    <View style={{ ...styles.container }}>
      {props.children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  }
})

export default DefaultView
