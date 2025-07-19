BlockEvents.rightClicked("farmersdelight:cutting_board", event => {
    if (event.item.empty) return
    if (event.block.inventory.empty) return
    // If no assembly recipe with this item exists, return
    let handItem = event.item
    let handItemId = event.item.id
    if (!Object.keys(global.specialRecipes.assembly).includes(handItemId)) return
    // If this item cannot be added to the item currently in the cutting board, return
    let boardItemId = event.block.inventory.allItems[0].id
    if (!Object.keys(global.specialRecipes.assembly[handItemId]).includes(boardItemId)) return
    // Schedule in ticks so farmer's delight has chance to process recipe
    event.server.scheduleInTicks(1, ctx => {
        // If assembly recipe should leave an item, give player item
        if (Object.keys(global.specialRecipes.assembly[handItemId][boardItemId]).includes("toolResult")) {
            event.player.give(global.specialRecipes.assembly[handItemId][boardItemId].toolResult)
        }
        // Decrease item count
        handItem.count--
    })
})