// priority: 500

// Load Helpers
let { stringHelper } = global

global.langHelper = {}

global.langHelper.dialectOrUS = (lang, dialect) => {
    if (!Object.keys(lang).includes(dialect)) {
        return lang.en_us
    }
    return lang[dialect]
}

global.langHelper.fluidKey = (id) => {
    return `fluid.${stringHelper.getNamespace(id)}.${stringHelper.removeNamespace(id)}`
}

global.langHelper.fluidFlowingKey = (id) => {
    return `fluid.${stringHelper.getNamespace(id)}.flowing_${stringHelper.removeNamespace(id)}`
}

global.langHelper.fluidTypeKey = (id) => {
    return `fluid_type.${stringHelper.getNamespace(id)}.${stringHelper.removeNamespace(id)}`
}

global.langHelper.fluidBlockKey = (id) => {
    return `block.${stringHelper.getNamespace(id)}.${stringHelper.removeNamespace(id)}`
}

global.langHelper.flowingTranslation = (dialect, translation) => {
    return `Flowing ${translation}`
}