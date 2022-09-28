import { produceWithPatches } from 'immer'
import React, { ReactNode } from 'react'
import { Text, View, StyleSheet, ScrollView} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { FONTS } from '../utils/fontUtils'


interface DefaultViewProps {
  children: ReactNode
}

const DefaultView: React.FC<DefaultViewProps> = (props) => {


  return (
    <ScrollView style={{ ...styles.container }}>
      <View style={{...styles.center}}>
        {props.children}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    maxHeight: 896,
    maxWidth: 414,
  },
  center:{
    justifyContent:'center',
  }
})

export default DefaultView
