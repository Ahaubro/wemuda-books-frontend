import { View } from 'react-native'
import { useAppLoader } from './containers/useAppLoader'
import * as Sentry from 'sentry-expo'
import { SENTRY_DSN } from './constants'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Navigation from './containers/Navigation'
import { Provider } from 'react-redux'
import store from './redux/store'
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import en from './lang/en.json'
import da from './lang/da.json'

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en,
  da,
}
// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale
// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: SENTRY_DSN,
    enableInExpoDevelopment: false,
    debug: process.env.NODE_ENV === 'development' ? true : false,
  })
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppLoader />
      </SafeAreaProvider>
    </Provider>
  )
}

const AppLoader: React.FC = () => {
  const { appIsReady, onLayoutRootView } = useAppLoader()

  if (!appIsReady) return null

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <Navigation />
    </View>
  )
}
