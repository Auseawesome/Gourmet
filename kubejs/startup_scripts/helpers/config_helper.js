// priority: 1000

global.configHelper = {}

global.config = JsonIO.read("kubejs/config/pack.json")

global.defaultConfig = {
    "recipeLogging": false,
    "verboseCustomRecipes": false,
    "tooltipLogging": false,
}

global.configHelper.writeConfig = () => {
    JsonIO.write("kubejs/config/pack.json", global.config)
}

global.configHelper.resetConfig = () => {
    global.config = global.defaultConfig
    global.configHelper.writeConfig()
}

global.configHelper.defaultValue = (key) => {
    global.config[key] = global.defaultConfig[key]
    global.configHelper.writeConfig()
}

global.configHelper.setValue = (key, value) => {
    global.config[key] = value
    global.configHelper.writeConfig()
}

global.configHelper.getValue = (key) => {
    if (!Object.keys(global.config).includes(key)) {
        global.configHelper.defaultValue(key)
    }
    return global.config[key]
}

if (global.config == null) {
    global.configHelper.resetConfig()
}