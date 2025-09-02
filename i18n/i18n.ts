// i18n.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import tl from './locales/tl.json';

const LANGUAGE_KEY = 'user-language';

export const loadLanguage = async (): Promise<string> => {
  try {
    const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLang) return savedLang;

    const locales = Localization.getLocales();
    return locales.length > 0 ? locales[0].languageCode ?? 'en' : 'en';
  } catch (error) {
    console.warn('Error loading language:', error);
    return 'en';
  }
};

export const saveLanguage = async (lang: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  } catch (error) {
    console.warn('Error saving language:', error);
  }
};

export const initI18n = async () => {
  const initialLang = (await loadLanguage()) ?? 'en';

  const resources: Resource = {
    en: { translation: en },
    tl: { translation: tl },
  };

  await i18n.use(initReactI18next).init({
    resources,
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

  return i18n;
};

export default i18n;
