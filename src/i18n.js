import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import Cache from 'i18next-localstorage-cache';
import { DEBUG } from './constants';

function loadLocales(url, options, callback) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const waitForLocale = require(`bundle-loader!json-loader!./locales/${url}/common.yml`);
    waitForLocale((locale) => {
      callback(locale, { status: '200' });
    });
  } catch (e) {
    callback(null, { status: '404' });
  }
}

i18n
  .use(XHR)
  .use(Cache)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',
    wait: true,
    debug: DEBUG,

    cache: {
      enabled: !DEBUG,
      expirationTime: 86400000, // 24 hours
    },

    backend: {
      loadPath: '{{lng}}',
      parse: data => data,
      ajax: loadLocales,
    },

    interpolation: {
      formatSeparator: ',',
      format(value, format) {
        if (format === 'uppercase') return value.toUpperCase();
        return value;
      }
    }
  });

export default i18n;
