import { produceWithPatches } from 'immer'
import React, { ReactNode, useState } from 'react'
import { Text, View, StyleSheet, Button, ActivityIndicator, Pressable } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons/'


interface Props {
    onPressSelected?: () => void
    onPressNotSelected?: () => void
    icon:
    | 'eye'
    | 'bookmark-sharp'
    | 'history'
    isLoading: boolean
    isSelected: boolean
}

function SelectedBookButtons({
    onPressSelected,
    onPressNotSelected,
    icon,
    isLoading,
    isSelected,

}: Props) {
    const bgcolor = icon === 'bookmark-sharp' && isSelected ? "orange" : icon === 'eye' && isSelected ? "#00ab41" : icon === "history" && isSelected ? "#0277bd" : "rgb(247,247,250)"
    const renderIcon = () => {
        switch (icon) {
            case 'eye':

                if (isLoading) {
                    return <ActivityIndicator style={{}} size="small" color={'#0000FF'} />
                } else {
                    if (isSelected) {
                        return <Ionicons style={{ alignSelf: 'center' }} name={'eye'} size={20} color={'white'} />
                    } else {
                        return <Ionicons style={{ alignSelf: 'center' }} name={'eye'} size={20} color={'black'} />
                    }
                }
            case 'bookmark-sharp':

                if (isLoading) {
                    return <ActivityIndicator style={{}} size="small" color={'#0000FF'} />
                } else {
                    if (isSelected) {
                        return <Ionicons style={{ alignSelf: 'center' }} name={'bookmark-sharp'} size={20} color={'white'} />
                    } else {
                        return <Ionicons style={{ alignSelf: 'center' }} name={'bookmark-sharp'} size={20} color={'black'} />
                    }
                }
            case 'history':

                if (isLoading) {
                    return <ActivityIndicator style={{}} size="small" color={'#0000FF'} />
                } else {
                    if (isSelected) {
                        return <MaterialIcons style={{ alignSelf: 'center' }} name="more-time" size={20} color="white" />
                    } else {
                        return <MaterialIcons style={{ alignSelf: 'center' }} name="more-time" size={20} color="black" />
                    }
                }


        }
    }


    return (
        <View>
            <Pressable onPress={isSelected ? onPressSelected : onPressNotSelected}>
                <View style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: bgcolor, justifyContent: 'center', alignContent: 'center', marginHorizontal: 5 }}>
                    {renderIcon()}
                </View>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    selectedBookBtn: {
        textAlign: "center",
        backgroundColor: "rgb(247,247,250)",
        borderRadius: 15,
        color: "black",
        height: 40
    },
})

export default SelectedBookButtons
