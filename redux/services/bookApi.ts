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


export type Book = {
  title: string
  author: string
  genre: string
  releaseDate: string
}

export const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery,
  endpoints: builder => ({

    //Get all books
    getBooks: builder.query<{ books: Book[] }, null>({
      query: () => `/book`,
    }),
    
    // addBook: builder.mutation<
    //   {
    //     statusText: string 
    //   },
    //   {
    //     title: string,
    //     author: string,
    //     genre: string,
    //     releaseDate: string;
    //   }
    // >({
    //   query: body => ({
    //     url: '/book',
    //     method: 'POST',
    //     body,
    //   }),
    // }),

    //GoogleBook post
    addBook: builder.mutation<
    { statusText: string },
    // { bookId: string, title: string, authors: string[], description: string, thumbnail: string, averageRating: number, ratingCount: number }
    { userId: number, bookId: string, title: string, thumbnail: string, authors: string[], description: string, averageRating: number, ratingCount: number  }
    >({
    query: body => ({
      url: '/book',
      method: 'POST',
      body
    })
    }),

    //Get book by id
    getBookById: builder.query<
      {
        title: string,
        author: string,
        genre: string,
        releaseDate: string;
      },
      number
    >({
      query: id => `/book/${id}`,
    }),

    //Delete book
    deleteBook: builder.mutation<{ statusText: string },  number >({
      query:  id  => ({
        url: `/book/${id}`,
        method: 'DELETE',
      }),
    }),

    //Update book
    updateBook: builder.mutation<
      { 
        statusText: string 
      },

      { 
        id: number;
        title: string;
        author: string;
        genre: string;
        releaseDate: string; 
      }
    >({
      query: body => ({
        url: `/${body.id}`,
        method: 'PATCH',
        body
      }),
    }),

  }),
})


export const { useGetBooksQuery, useGetBookByIdQuery, useAddBookMutation, useDeleteBookMutation, useUpdateBookMutation } = bookApi