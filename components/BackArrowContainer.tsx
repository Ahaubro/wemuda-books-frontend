import { produceWithPatches } from 'immer'
import React, { ReactNode } from 'react'
import { Text, View, StyleSheet, Button } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'


interface BackArrowContainerProps {
    children: ReactNode
}

const BackArrowContainer: React.FC<BackArrowContainerProps> = (props) => {


    return (
        <View style={{ ...styles.container }}>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        marginTop: 35,
        paddingVertical: 5,
        marginLeft: -1
    }
})

export default BackArrowContainer
