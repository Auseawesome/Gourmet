// priority: -1000

// Register items in the global.items object
StartupEvents.registry("item", event => {
    Object.keys(global.items).forEach(id => {
        let item = global.items[id]
        let itemBuilder = event.create(id)
        if (Object.keys(item).includes("displayName")) {
            itemBuilder.displayName(item.displayName)
        }
    })
})