// Add english dialect translations
global.english_dialects.forEach(dialect => {
    ClientEvents.lang(dialect, event => {
        global.lang[dialect].forEach(lang => {
            event.add(lang.namespace, lang.key, lang.translation)
        })
    })
})

// Add default US translations
ClientEvents.lang("en_us", event => {
    global.lang.en_us.forEach(lang => {
        event.add(lang.namespace, lang.key, lang.translation)
    })
})