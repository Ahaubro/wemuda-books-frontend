import * as Font from 'expo-font'
import Ionicons from '@expo/vector-icons/Ionicons'
import Entypo from '@expo/vector-icons/Entypo'
import { Inter_900Black } from '@expo-google-fonts/inter'

export const preloadFonts: Record<string, Font.FontSource> = {
  ...Ionicons.font,
  'Inter-Black': Inter_900Black,
  ...Entypo.font,
}

export const FONTS = {
  bold: 'Inter-Black',
}
