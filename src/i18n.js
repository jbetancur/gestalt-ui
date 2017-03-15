import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
// import Cache from 'i18next-localstorage-cache';
import { DEBUG } from './constants';

function loadLocales(url, options, callback) {
  // console.log(url, options, callback, data)
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const waitForLocale = require(`bundle-loader!./locales/${url}/common.json`);
    waitForLocale((locale) => {
      callback(locale, { status: '200' });
    });
  } catch (e) {
    callback(null, { status: '404' });
  }
}

i18n
  .use(XHR)
  // .use(Cache)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',

    debug: DEBUG,

    // cache: {
    //   enabled: true
    // },

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
