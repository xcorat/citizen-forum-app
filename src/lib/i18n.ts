import { register, init, getLocaleFromNavigator, locale, _ } from 'svelte-i18n';
import { derived, get } from 'svelte/store'
import { browser } from "$app/env";

// List of locales supported with labels to display. Used by the localeSwitcher
const locales = [
  {name: 'en', label: 'EN'},
  {name: 'si', label: 'SI'},
  {name: 'ta', label: 'TA'}
];

function detectLocale(){
  let initialLocale: string;
  const localeIds = locales.map(localeDict => localeDict.name);

  const detectedLocale = ((browser)? localStorage.getItem('svelte-i18n-locale'): null) 
                          || getLocaleFromNavigator();
  if (localeIds.indexOf(detectedLocale) > -1){
    initialLocale = detectedLocale;
  }
  if (!initialLocale && detectedLocale?.indexOf('-') > 0) {
    const foundLang = localeIds.find((lang) => detectedLocale.indexOf(lang + '-') === 0);
    if (foundLang) initialLocale = foundLang;
  }
  return initialLocale;
}

function setupI18n({ withLocale: _locale } = { withLocale: 'en' }) {
  // DEBUG: why do we need to set? how come the store get called before 
  //    the setup is done?
  locale.set(_locale)
  register('en', () => import('../lang/en_GB.json') );
  register('si', () => import('../lang/si_LK.json') );
  register('ta', () => import('../lang/ta_LK.json') );
  
  // DEBUG: shouldn't we set fallbackLocale to _locale?
  let fallbackLocale = 'en';
  let initialLocale = detectLocale();

  // DEBUG: why do we need this? shouldn't fallback work if init is not set?
  if (!initialLocale) initialLocale = fallbackLocale;
  
  
  // Store the locale on the browser local storage for later retrieval
  locale.subscribe((loc) => {
    if (loc && browser){
      localStorage.setItem('svelte-i18n-locale', loc);
    }
  });
  
  // TODO: getlocale doesnt work either, check fix! -- also might be en-UK
  init({
    fallbackLocale,
    initialLocale,
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

export { locale, setupI18n, pageFormatter, locales };
