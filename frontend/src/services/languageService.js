export function getNavigatorLanguage() {
    const navigator = window.navigator;
     if (navigator.languages && navigator.languages.length) {
         return navigator.languages[0];
     } else {
         return navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
     }
}
