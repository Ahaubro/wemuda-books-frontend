// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { UserInterfaceIdiom } from 'expo-constants'
import { API_URL } from '../../constants'
import { RootState } from '../store'

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://localhost:7066/',
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
  firstName: string
  lastName: string
  username: string
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  endpoints: builder => ({

    //Get all users
    // getUsers: builder.query<{ books: User[] }, null>({
    //   query: () => `/user`
    // }),
    
    // Add user
    signup: builder.mutation<
      { statusText: string },
      { firstname: string, lastname: string, username: string, password: string }
    >({
      query: body => ({
        url: '/user',
        method: 'POST',
        body
      })
    }),

    //Get user by id
    // getUserById: builder.query<
    //   {user: User},
    //   {id: number}
    // >({
    //   query: id => `/book/${id}`,
    // }),

    login: builder.mutation<
      {user: User, token: string},
      {username: string, password: string}
    >({
      query: body => ({
        url: '/user/authenticate',
        method: 'POST',
        body
      })
    })

  })
})


export const { /*useGetUsersQuery, useGetUserkByIdQuery,*/ useSignupMutation, useLoginMutation } = userApi