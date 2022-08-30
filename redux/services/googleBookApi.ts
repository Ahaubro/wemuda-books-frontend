// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../../constants'
import { RootState } from '../store'

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://www.googleapis.com/books/v1/volumes',
  prepareHeaders: (headers, api) => {
    const state = api.getState() as RootState
    headers.set('Pragma', 'no-cache');
    
    return headers
  },
})

export type GoogleBook = {
  etag: string,
  volumeInfo: {
      title: string,
      authors: [],
      categories: [],
      description: string,
      infoLink: string,
      publisher: string,
      imageLinks: {
        thumbnail: string,
      }
    }
}

export const googleBookApi = createApi({
    reducerPath: 'googleBookApi',
    baseQuery,
    endpoints: builder => ({ 

      //Get books by query - MÅ ALDRIG LiGGE I FRONTEND, FLYT FLYT FLYT
      getBooks: builder.query<{ books: GoogleBook [] , items:GoogleBook[]}, { query: string }>({
        query: ({  query }) => `/?q=${query}+inauthor:keyes&key=AIzaSyChWhnOsiYQiGWaMwwJD-Ms8iypyNWS3qo`,
        //transformResponse: (response) =>  response.data.items,
        keepUnusedDataFor: 0
      }),
    })
})

export const { useGetBooksQuery } = googleBookApi