// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../../constants'
import { RootState } from '../store'

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://www.googleapis.com/books/v1/volumes',
  prepareHeaders: (headers, api) => {
    const state = api.getState() as RootState
    const token = state.session.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export type GoogleBook = {

}

export const googleBookApi = createApi({
    reducerPath: 'googleBookApi',
    baseQuery,
    endpoints: builder => ({ 

    //Get all books
    getBooks: builder.query<{ books: GoogleBook []}, { query: string }>({
        query: ({ query }) => `/?q=${query}+inauthor:keyes&key=AIzaSyDSndfWGDUSNAhLmQ6vd4fbikfj1PDhnp4`,
      }), 

    })
})

export const { useGetBooksQuery } = googleBookApi