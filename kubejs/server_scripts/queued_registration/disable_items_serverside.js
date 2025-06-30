let modified_tooltips = []

ItemEvents.modifyTooltips(event => {
    global.disabledItems.forEach(items => {
        Ingredient.of(items).itemIds.forEach(id => {
            if (modified_tooltips.includes(id)) {
                return
            }
            modified_tooltips.push(id)
            event.modify(id, tooltip => {
                tooltip.insert(1, Text.darkRed("This item has been disabled for normal survival gameplay"))
                tooltip.insert(2, Text.darkRed("Please report any occurences of this item during gameplay"))
            })
        })
    })
})

ServerEvents.recipes(event => {
    global.disabledItems.forEach(items => {
        event.remove({output: items})
    })
})