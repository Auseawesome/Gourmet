// Add tooltips to all items as in the global.items object
ItemEvents.modifyTooltips(event => {
    Object.keys(global.tooltips.basic).forEach(id => {
        if (global.tooltips.basic[id].length > 0) {
            event.modify(id, tooltip => {
                for(let line = 1; line < global.tooltips.basic[id].length; line++) {
                    tooltip.insert(line, global.tooltips.basic[id][line - 1])
                }
            })
        }
    })
})