// priority: 100

global.queueLang = {}
global.lang = {}

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