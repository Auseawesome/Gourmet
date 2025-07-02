// priority: 1000

global.langHelper = {}

global.langHelper.dialectOrUS = (dialect, lang) => {
    if (lang[dialect] == null) {
        return lang.en_us
    }
    return lang[dialect]
}