// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../../constants'
import { RootState } from '../store'

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, api) => {
    const state = api.getState() as RootState
    const token = state.session.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

// Define a service using a base URL and expected endpoints
export const exampleApi = createApi({
  reducerPath: 'exampleApi',
  baseQuery,
  endpoints: builder => ({
    login: builder.mutation<
      {
        id: string
        jwt: string
      },
      { username: string; password: string }
    >({
      query: body => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useLoginMutation } = exampleApi
