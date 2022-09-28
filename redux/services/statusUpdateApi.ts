import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'

//const baseUrl = process.env.BASE_URL + "api"


const baseQuery = fetchBaseQuery({
    baseUrl: "http://192.168.8.148:5001/api",
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
    tagTypes: ["Statuses"],
    endpoints: builder => ({
        getStatusUpdatesByUser: builder.query<
            {statusUpdates: StatusUpdate[]},
            number
        >({
            query: userId => `/statusupdate/${userId}`,
            providesTags: ["Statuses"]
        }),

        addStatusUpdate: builder.mutation<
            {statusText: string},
            {userId: number, minutesAdded: number}
        >({
            query: body => ({url: `/statusupdate/${body.userId}`, method: "POST", body: {minutesAdded: body.minutesAdded}}),
            invalidatesTags: ["Statuses"]
        })
    })
})

export const { useGetStatusUpdatesByUserQuery, useAddStatusUpdateMutation } = statusUpdateApi