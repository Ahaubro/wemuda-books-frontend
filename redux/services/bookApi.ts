// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../../constants'
import { RootState } from '../store'

const baseUrl = process.env.BASE_URL + "/api"
console.log("BookApi BASE_URL =", baseUrl)

const baseQuery = fetchBaseQuery({
    baseUrl,
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
  bookStatus: string
}

export const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery,
  tagTypes: ["Books"],
  endpoints: builder => ({

    //Get all books
    getBooks: builder.query<{ books: Book[] }, null>({
      query: () => `/book`,
    }),

    //GoogleBook post
    addBook: builder.mutation<
    { statusText: string },
    { userId: number, bookId: string, title: string, thumbnail: string | undefined, author: string, 
      description: string, averageRating: number, ratingCount: number, bookStatus: string }
    >({
    query: body => ({
      url: '/book',
      method: 'POST',
      body
    }),
    invalidatesTags: ["Books"]
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
    deleteBook: builder.mutation<
    { statusText: string },  
    {userId: number, bookId: string} 
    >({
      query:  body  => ({
        url: `/book/${body.userId}/${body.bookId}`,
        method: 'DELETE',
        body
      }),
      invalidatesTags: ["Books"]
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
      invalidatesTags: ["Books"]
    }),

    //Get books by userId
    getBooksByUserId: builder.query<{ books: Book[] }, number>({
      query: userId => `/book/${userId}`,
      providesTags: ["Books"],
    }),

    //Edit book status
    editStatus: builder.mutation<
      {statusText: string},
      {userId: number, bookId: string, bookStatus: string}
    >({
      query: body => ({url: '/book', method: 'PATCH', body}),
      invalidatesTags: ["Books"]
    })
  }),
})


export const { useGetBooksQuery, useAddBookMutation, useDeleteBookMutation, useUpdateBookMutation, useGetBooksByUserIdQuery, useGetByBookIdQuery, useEditStatusMutation} = bookApi