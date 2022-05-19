import { register, init, getLocaleFromNavigator, locale, _ } from 'svelte-i18n';
import { derived, get } from 'svelte/store'

function setupI18n({ withLocale: _locale } = { withLocale: 'en' }) {
  register('en_GB', () => import('../lang/en_GB.json') );
  register('si_LK', () => import('../lang/si_LK.json') );
  register('ta_LK', () => import('../lang/ta_LK.json') );
  
  locale.set(_locale);


  // TODO: getlocale doesnt work either, check fix! -- also might be en-UK
  init({
    fallbackLocale: 'en_GB',
    initialLocale: getLocaleFromNavigator() || _locale,
  });
}

/**
 * 
 * @param page_id the page or component label on the translations dictionaries
 * @returns a store that's similar the svelte-i18n `$formatter` store, but uses 
 *  the registered page 
 */
const pageFormatter = 
  (page_id) => 
    derived([ _ ], ( (page_id) => 
      () => 
        (id: string, defaultTxt?: string) => 
          get(_)(page_id + '.' + id, { default: defaultTxt })
      )(page_id)
    );


export { setupI18n, pageFormatter };
