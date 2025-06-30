// Add english dialect translations
global.english_dialects.forEach(dialect => {
    ClientEvents.lang(dialect, event => {
        global.lang[dialect].forEach(lang => {
            event.add(lang.namespace, lang.key, lang.translation)
        })
        global.rename.item[dialect].forEach(lang => {
            event.renameItem(lang.id, lang.translation)
        })
        global.rename.block[dialect].forEach(lang => {
            event.renameBlock(lang.id, lang.translation)
        })
        global.rename.entity[dialect].forEach(lang => {
            event.renameEntity(lang.id, lang.translation)
        })
        global.rename.biome[dialect].forEach(lang => {
            event.renameBiome(lang.id, lang.translation)
        })
    })
})

// Add default US translations
ClientEvents.lang("en_us", event => {
    global.lang.en_us.forEach(lang => {
        event.add(lang.namespace, lang.key, lang.translation)
    })
    global.rename.item.en_us.forEach(lang => {
        event.renameItem(lang.id, lang.translation)
    })
    global.rename.block.en_us.forEach(lang => {
        event.renameBlock(lang.id, lang.translation)
    })
    global.rename.entity.en_us.forEach(lang => {
        event.renameEntity(lang.id, lang.translation)
    })
    global.rename.biome.en_us.forEach(lang => {
        event.renameBiome(lang.id, lang.translation)
    })
})