import React, { useState, useEffect } from 'react'
import { Button, StyleSheet, Text, ToastAndroid, View, ActivityIndicator } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import Entypo from '@expo/vector-icons/Entypo'
import { StatusBar } from 'expo-status-bar'
import { FONTS } from '../../utils/fontUtils'
import i18n from 'i18n-js'
import {useGetBooksQuery, Book, useGetBookByIdQuery, useDeleteBookMutation, useAddBookMutation, useUpdateBookMutation } from "../../redux/services/bookApi"
import {useGetUserByIdQuery} from "../../redux/services/userApi"


interface HomeScreenProps {}

const HomeScreen: React.FC<HomeScreenProps> = () => {

  return (
    <View style={styles.container}>

      <Text style={styles.welcome_text}>Welcome to Wemuda Books</Text>
      

      <StatusBar style="dark" />
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingTop: 10
  },
  heading: {
    fontFamily: FONTS.bold,
    fontSize: 40,
  },
  text: {
    fontSize: 35,
  },
  welcome_text: {
    fontSize: 35,
    textAlign: 'center',
  },
  bookBox:{
    backgroundColor: "#ccc",
    height: 30,
    padding: 30,
    marginBottom: 10,
    borderRadius: 10,
    width: "100%",
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between"
  }
})

export default HomeScreen
