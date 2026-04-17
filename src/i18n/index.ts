import { createI18n } from 'vue-i18n'
import fr from './fr'
import en from './en'

const savedLocale = localStorage.getItem('locale') || 'fr'

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'fr',
  messages: { fr, en },
})

export default i18n
