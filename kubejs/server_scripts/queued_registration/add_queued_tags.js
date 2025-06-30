ServerEvents.tags("item", event => {
    Object.keys(global.tags).forEach(tag => {
        event.add(tag, global.tags[tag])
    })
})