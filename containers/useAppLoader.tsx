import { Inter_900Black } from '@expo-google-fonts/inter'
import { useState, useEffect, useCallback } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import * as Font from 'expo-font'
import { tryLoginFromStorageAsync } from '../utils/authUtils'
import { useDispatch } from 'react-redux'
import { startSession } from '../redux/slices/sessionSlice'
import { preloadFonts } from '../utils/fontUtils'

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

export function useAppLoader(): {
  onLayoutRootView: () => Promise<void>
  appIsReady: boolean
} {
  const [appIsReady, setAppIsReady] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(preloadFonts)
        await tryLoginFromStorageAsync()
        dispatch(startSession({ id: '1234', token: 'abcdefg' }))
      } catch (e) {
        console.warn(e)
      } finally {
        // Tell the application to render
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync()
    }
  }, [appIsReady])

  return { onLayoutRootView, appIsReady }
}
