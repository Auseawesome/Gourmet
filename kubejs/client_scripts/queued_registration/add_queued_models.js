/**
 * 
 * @param {Object} obj 
 * @returns {Boolean}
 */
function isEmpty(obj) {
  return Object.keys(obj).length == 0
}

/**
 * Returns the namespace of an id
 * @param {String} id 
 * @returns {String}
 */
function getNamespace(id) {
    return id.split(":")[0]
}

/**
 * Returns the id without the namespace
 * @param {String} id 
 * @returns {String}
 */
function removeNamespace(id) {
    return id.split(":")[1]
}

// Add tooltips to all items as in the global.items object
ClientEvents.generateAssets('after_mods', event => {
    Object.keys(global.models).forEach(id => {
        event.json(`${getNamespace(id)}:models/item/${removeNamespace(id)}`,global.models[id])
    })
    Object.keys(global.items).forEach(id => {
        if (!isEmpty(global.items[id].model)) {
            event.json(`${getNamespace(id)}:models/item/${removeNamespace(id)}`,global.items[id].model)
        }
    })
})