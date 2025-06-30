// Add english dialect translations
global.english_dialects.forEach(dialect => {
    ClientEvents.lang(dialect, event => {
        global.lang[dialect].forEach(lang => {
            event.add(lang.namespace, lang.key, lang.translation)
        })
        global.rename.items[dialect].forEach(lang => {
            event.renameItem(lang.id, lang.translation)
        })
        global.rename.blocks[dialect].forEach(lang => {
            event.renameBlock(lang.id, lang.translation)
        })
        global.rename.entities[dialect].forEach(lang => {
            event.renameEntity(lang.id, lang.translation)
        })
        global.rename.biomes[dialect].forEach(lang => {
            event.renameBiome(lang.id, lang.translation)
        })
    })
})

// Add default US translations
ClientEvents.lang("en_us", event => {
    global.lang.en_us.forEach(lang => {
        event.add(lang.namespace, lang.key, lang.translation)
    })
    global.rename.items.en_us.forEach(lang => {
        event.renameItem(lang.id, lang.translation)
    })
    global.rename.blocks.en_us.forEach(lang => {
        event.renameBlock(lang.id, lang.translation)
    })
    global.rename.entities.en_us.forEach(lang => {
        event.renameEntity(lang.id, lang.translation)
    })
    global.rename.biomes.en_us.forEach(lang => {
        event.renameBiome(lang.id, lang.translation)
    })
})