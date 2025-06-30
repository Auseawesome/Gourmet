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