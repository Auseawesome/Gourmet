BlockEvents.rightClicked("farmersdelight:cutting_board", event => {
    if (event.item.empty) return
    if (event.block.inventory.empty) return
    // If no assembly recipe with this item exists, return
    if (!Object.keys(global.special_recipes.assembly).includes(event.item.id)) return
    // If this item cannot be added to the item currently in the cutting board, return
    if (!global.special_recipes.assembly[event.item.id].includes(event.block.inventory.allItems[0].id)) return
    // Decrease item count
    event.item.count--
})