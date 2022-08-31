import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://localhost:7066/api/',
    prepareHeaders: (headers, api) => {
      const state = api.getState() as RootState
      const token = state.session.token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
})

export type StatusUpdate = {
    userId: number,
    bookId: number,
    timeOfUpdate: Date,
    pages: number,
    minutesRead: number,
    finishedBook: boolean
}

export const statusUpdateApi = createApi({
    reducerPath: 'statusUpdateApi',
    baseQuery,
    endpoints: builder => ({
        getStatusUpdatesByUser: builder.query<
            {statusUpdates: StatusUpdate[]},
            number
        >({
            query: userId => `/statusupdate/${userId}`
        })
    })
})

export const { useGetStatusUpdatesByUserQuery } = statusUpdateApi