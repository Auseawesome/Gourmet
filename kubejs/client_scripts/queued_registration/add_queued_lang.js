// Load Helpers
let { langHelper } = global

let queueTranslation = (dialect) => {
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
        global.rename.fluid[dialect].forEach(lang => {
            event.add(lang.namespace, langHelper.fluidKey(lang.id), lang.translation)
            event.add(lang.namespace, langHelper.fluidFlowingKey(lang.id), langHelper.flowingTranslation(dialect, lang.translation))
            event.add(lang.namespace, langHelper.fluidTypeKey(lang.id), lang.translation)
            event.add(lang.namespace, langHelper.fluidBlockKey(lang.id), lang.translation)
        })
    })
}

// Add english dialect translations
global.englishDialects.forEach(dialect => {
    queueTranslation(dialect)
})

// Add default US translations
queueTranslation("en_us")