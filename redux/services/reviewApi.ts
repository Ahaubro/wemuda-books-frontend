// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../../constants'
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


export type Review = {
  id: number,
  content: string,
  title: string,
  rating: number
}


export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery,
  tagTypes: ["Reviews"],
  endpoints: builder => ({

    //Get all reviews
    getReviews: builder.query<{ reviews: Review[] }, null>({
      query: () => `/review`,
    }),

    //Get all reviews by bookId
    getReviewsByBookId: builder.query<{ reviews: Review[] }, string>({
      query: bookId => `/review/${bookId}`,
      providesTags: ["Reviews"]
    }),
    
    //Create review
    addReview: builder.mutation<
    { statusText: string },
    { 
      content: string,
      title: string,
      rating: number,
      bookId: string,
      userId: number,
    }
    >({
    query: body => ({
      url: '/review',
      method: 'POST',
      body
    }),
    invalidatesTags: ["Reviews"]
    }),
  }),
})


export const { useGetReviewsQuery, useGetReviewsByBookIdQuery, useAddReviewMutation } = reviewApi