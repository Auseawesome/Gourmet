// priority: 100

global.english_dialects = ["en_au","en_ca","en_gb","en_nz"]

global.queueLang = {}
global.lang = {}
global.rename = {
    "item": {},
    "block": {},
    "biome": {},
    "entity": {},
}

global.queueLang.add = (language, namespace, key, translation) => {
    if (!Object.keys(global.lang).includes(language)) {
        global.lang[language] = []
    }
    global.lang[language].push({
        "namespace": namespace,
        "key": key,
        "translation": translation
    })
}

global.queueLang.english = (lang, namespace, key) => {
    global.english_dialects.forEach(dialect => {
        if (!Object.keys(lang).includes(dialect)) {
            global.queueLang.add(dialect, namespace, key, lang["en_us"])
        } else {
            global.queueLang.add(dialect, namespace, key, lang[dialect])
        }
    })
    global.queueLang.add("en_us", namespace, key, lang["en_us"])
}

global.queueLang.rename = (type, language, id, translation) => {
    if (!Object.keys(global.rename[type]).includes(language)) {
        global.rename[type][language] = []
    }
    global.rename[type][language].push({
        "id": id,
        "translation": translation,
    })
}

global.queueLang.renameEnglish = (type, lang, id) => {
    global.english_dialects.forEach(dialect => {
        if (!Object.keys(lang).includes(dialect)) {
            global.queueLang.rename(type, dialect, id, lang["en_us"])
        } else {
            global.queueLang.rename(type, dialect, id, lang[dialect])
        }
    })
    global.queueLang.add(type, "en_us", id, lang["en_us"])
}

// Initialise rename with english dialects
global.english_dialects.forEach(dialect => {
    global.lang[dialect] = []
    Object.keys(global.rename).forEach(type => {
        global.rename[type][dialect] = []
    })
})
global.lang.en_us = []
Object.keys(global.rename).forEach(type => {
    global.rename[type].en_us = []
})