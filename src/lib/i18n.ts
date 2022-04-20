import { register, init, getLocaleFromNavigator, locale } from 'svelte-i18n';

locale.set('en_GB');

register('en_GB', () => import('../data/translations.json').then( module => module.en_GB));
register('si_LK', () => import('../data/translations.json').then( module => module.si_LK));
register('ta_LK', () => import('../data/translations.json').then( module => module.ta_LK));

// TODO: getlocale doesnt work either, check fix! -- also might be en-UK
init({
  fallbackLocale: 'en_GB',
  //initialLocale: getLocaleFromNavigator(),
});