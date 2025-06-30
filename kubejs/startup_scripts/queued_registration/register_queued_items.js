// priority: -1000

// Register items in the global.items object
StartupEvents.registry("item", event => {
    Object.keys(global.items).forEach(id => {
        //TODO: Fix tooltip
        event.create(id).displayName(global.items[id].tooltip[0])
    })
})