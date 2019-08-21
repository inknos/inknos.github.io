$(document).ready(function(){
    i18next
        .use(i18nextXHRBackend)
        .init({
            fallbackLng: 'en',
            debug: true,
            ns: ['translation', 'debug'],
            defaultNS: 'debug',
            backend: {
                loadPath: 'locales/{{lng}}/{{ns}}.json',
                crossDomain: true
            }
        }, function(err, t) {
            updateContent();
        });
});


function updateContent(){
    jqueryI18next.init(i18next, $, {
        tName: 't', // --> appends $.t = i18next.t
        i18nName: 'i18n', // --> appends $.i18n = i18next
        handleName: 'localize', // --> appends $(selector).localize(opts);
        selectorAttr: 'data-i18n', // selector for translating elements
        targetAttr: 'i18n-target', // data-() attribute to grab target element to translate (if different than itself)
        optionsAttr: 'i18n-options', // data-() attribute that contains options, will load/set if useOptionsAttr = true
        useOptionsAttr: false, // see optionsAttr
        parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
    });
    // start localizing, details:
    $('.nav').localize();
    // https://github.com/i18next/jquery-i18next#usage-of-selector-function
}


function changeLng(lng) {
    i18next.changeLanguage(lng);
}
