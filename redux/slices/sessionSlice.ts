import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SessionState {
  id: string
  token?: string
  isLoading: boolean
}

const initialState: SessionState = {
  token: undefined,
  id: '',
  isLoading: true,
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    startSession: (
      state: SessionState,
      action: PayloadAction<{
        id: string
        token: string
      }>
    ) => {
      state.id = action.payload.id
      state.token = action.payload.token
      state.isLoading = false
      // window.localStorage.setItem('userId', action.payload.id.toString())
      // window.localStorage.setItem('token', action.payload.token)
    },
    endSession: (state: SessionState) => {
      state.id = initialState.id
      state.token = initialState.token
      // window.localStorage.removeItem('userId')
      // window.localStorage.removeItem('token')
    },
    setSessionLoading: (
      state: SessionState,
      action: PayloadAction<{ isLoading: boolean }>
    ) => {
      state.isLoading = action.payload.isLoading
    },
    // Below is often used for refresh tokens (check MIO)
    // updateTokens: (
    //   state,
    //   action: PayloadAction<{
    //     token: string
    //   }>
    // ) => {
    //   state.token = action.payload.token

    //   window.localStorage.setItem('token', action.payload.token)
    // },
  },
})

export const { startSession, endSession, setSessionLoading } =
  sessionSlice.actions

export default sessionSlice.reducer
