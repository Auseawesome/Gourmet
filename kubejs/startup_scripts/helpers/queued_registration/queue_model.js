// priority: 100

global.queueModel = {}
global.models = {}

/**
 * Queue model to be added
 * @param {String} id
 * @param {import("com.google.gson.JsonElement").$JsonElement$$Type} model
*/
global.queueModel.basic = (id, model) => {
    global.models[id] = model
}

global.queueModel.texture = (id, location) => {
    global.models[id] = {
        "parent": "minecraft:item/generated",
        "textures": {
            "layer0": location
        }
    }
}