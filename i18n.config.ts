import en from '@/locales/en.json';
import id from '@/locales/id.json';

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'id',
  messages: {
    en,
    id,
  },
  datetimeFormats: {
    en: {
      short: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    },
    id: {
      short: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    },
  },
}));
