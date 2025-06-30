// priority: -1000

// Register items in the global.items object
StartupEvents.registry("item", event => {
    Object.keys(global.items).forEach(id => {
        let item = global.items[id]
        let item_builder = event.create(id)
        if (Object.keys(item).includes("displayName")) {
            item_builder.displayName(item.displayName)
        }
    })
})