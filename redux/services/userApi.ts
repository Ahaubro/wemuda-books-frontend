// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { UserInterfaceIdiom } from 'expo-constants'
import { StringNullableChain } from 'lodash'
import { API_URL } from '../../constants'
import { RootState } from '../store'
import { useGetBookByIdQuery } from './googleBookApi'


const baseQuery = fetchBaseQuery({
  baseUrl: "http://192.168.8.148:5001",
  prepareHeaders: (headers, api) => {
    const state = api.getState() as RootState
    const token = state.session.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export type User = {
  id: number
  fullName: string
  email: string
  booksRead: number
  booksGoal: number
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  tagTypes: ["User"],
  endpoints: builder => ({

    //Get all users
    // getUsers: builder.query<{ books: User[] }, null>({
    //   query: () => `/user`
    // }),
    
    // Add user
    signup: builder.mutation<
      { statusText: string },
      { fullname: string, password: string }
    >({
      query: body => ({
        url: '/user',
        method: 'POST',
        body
      })
    }),

    //Authenticate
    login: builder.mutation<
      {id: number, fullname: string, token: string, statusText: string},
      {email: string, password: string}
    >({
      query: body => ({
        url: '/user/authenticate',
        method: 'POST',
        body
      })
    }),

    //Get user by id
    getUserById: builder.query<
      User,
      number
    >({
      query: id => `/user/${id}`,
      providesTags: ["User"]
    }),

    //Change password
    changePassword: builder.mutation<
      {statusText: string},
      {userId: number, newPassword: string, password: string}
    >({
      query: body => ({
        url: '/user/changePassword',
        method: 'POST',
        body
      })
    }),

    setBooksGoal: builder.mutation<
      {statusText: string},
      {booksGoal: number, userId: number}
    >({
      query: body => ({url: `/user/setBooksGoal/${body.userId}`, method: "PATCH", body: {booksGoal: body.booksGoal} }),
      invalidatesTags: ["User"]
    }),

    resetBooksRead: builder.mutation<
      {statusText: string},
      number
    >({
      query: userId => ({url: `/user/resetBooksRead/${userId}`, method: "PATCH", body: {} }),
      invalidatesTags: ["User"]
    }),

    forgotPassword: builder.mutation<
      {statusText: string},
      {email: string}
    >({
      query: body => ({url: `/user/forgotPassword`, method: "PATCH", body})
    })

  })
})


export const { /*useGetUsersQuery,*/ useGetUserByIdQuery, useSignupMutation, useLoginMutation, useChangePasswordMutation, useSetBooksGoalMutation, useResetBooksReadMutation, useForgotPasswordMutation } = userApi
