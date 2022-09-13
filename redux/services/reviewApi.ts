// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../../constants'
import { RootState } from '../store'

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://localhost:7066/api',
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
  rating: number
}


export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery,
  //tagTypes: ["Reviews"],
  endpoints: builder => ({

    //Get all reviews
    getReviews: builder.query<{ reviews: Review[] }, null>({
      query: () => `/review`,
    }),

    //Get all reviews by bookId
    getReviewsByBookId: builder.query<{ reviews: Review[] }, string>({
      query: bookId => `/review/${bookId}`,
    }),
    
    //Create review
    addReview: builder.mutation<
    { statusText: string },
    { 
      content: string,
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

    }),
  }),
})


export const { useGetReviewsQuery, useGetReviewsByBookIdQuery, useAddReviewMutation } = reviewApi