import { configureStore } from '@reduxjs/toolkit'
import { bookApi } from './services/bookApi'
import sessionReducer from './slices/sessionSlice'
import { setupListeners } from '@reduxjs/toolkit/query'
import { rtkQueryErrorLogger } from './rtkQueryErrorLogger'
import { googleBookApi } from './services/googleBookApi'
import { userApi } from './services/userApi'

const store = configureStore({
  reducer: {
    session: sessionReducer,
    [bookApi.reducerPath]: bookApi.reducer,
    [googleBookApi.reducerPath]: googleBookApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat([bookApi.middleware, googleBookApi.middleware, userApi.middleware,  rtkQueryErrorLogger]),
})
// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
