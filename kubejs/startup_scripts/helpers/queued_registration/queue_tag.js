// priority: 100

global.queueTag = {}
global.tags = {}

global.queueTag.addTagToItem = (tag, item) => {
    if (!Object.keys(global.tags).includes(tag)) {
        global.tags[tag] = []
    }
    global.tags[tag].push(item)
}