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
  bookId: string,
  title: string,
  description: string,
  author: string,
  thumbnail?: string, 
  averageRating: number,
  ratingsCount: number,
  status: string
}

export const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery,
  endpoints: builder => ({

    //Get all books
    getBooks: builder.query<{ books: Book[] }, null>({
      query: () => `/book`,
    }),

    //GoogleBook post
    addBook: builder.mutation<
    { statusText: string },
    // { bookId: string, title: string, authors: string[], description: string, thumbnail: string, averageRating: number, ratingCount: number }
    { userId: number, bookId: string, title: string, thumbnail: string, authors: string[], 
      description: string, averageRating: number, ratingCount: number, bookStatus: string }
    >({
    query: body => ({
      url: '/book',
      method: 'POST',
      body
    })
    }),

    //Get book by bookId
    getByBookId: builder.query<
      {
        id: number,
        title: string,
        bookStatus: string,
        
      },
      string
    >({
      query: bookId => `/book/getByBookId/${bookId}`,
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
        userId: number;
        bookId: string;
        bookStatus: string;
        title: string;
        thumbnail: string | undefined; 
      }
    >({
      query: body => ({
        url: `/book/${body.userId}/${body.bookId}`,
        method: 'PATCH',
        body
      }),
    }),

    getBooksByUserId: builder.query<{ books: Book[] }, number>({
      query: userId => `/book/${userId}`,
    }),

  }),
})


export const { useGetBooksQuery, useAddBookMutation, useDeleteBookMutation, useUpdateBookMutation, useGetBooksByUserIdQuery, useGetByBookIdQuery } = bookApi