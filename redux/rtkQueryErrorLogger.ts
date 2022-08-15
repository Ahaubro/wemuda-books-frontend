import {
  MiddlewareAPI,
  isRejectedWithValue,
  Middleware,
} from '@reduxjs/toolkit'
import Sentry from 'sentry-expo'

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => next => action => {
    if (isRejectedWithValue(action)) {
      console.error(
        'WARNING: Redux async middleware rejected an action - the error is logged to Sentry.'
      )
      if (action.payload.status !== 401) {
        Sentry.Native.captureException(new Error(JSON.stringify(action)))
        // Optionally can show some kind of notification/toast here
      }
    }

    return next(action)
  }
