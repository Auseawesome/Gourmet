// Add tooltips to all items as in the global.items object
ItemEvents.modifyTooltips(event => {
    Object.keys(global.items).forEach(id => {
        if (global.items[id].tooltip.length > 0) {
            event.modify(id, tooltip => {
                for(let line = 1; line < global.items[id].tooltip.length; line++) {
                    tooltip.insert(line, global.items[id].tooltip[line])
                }
            })
        }
    })
})