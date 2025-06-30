// priority: 100

global.queueItem = {}
global.items = {}

/**
 * Queue item to be added
 * @param {String} id
*/
global.queueItem.basic = (id) => {
    global.items[id] = {}
}

global.queueItem.customName = (id, displayName) => {
    global.items[id] = {"displayName": displayName}
}