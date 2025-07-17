BlockEvents.rightClicked("farmersdelight:cutting_board", event => {
    if (event.item.empty) return
    if (event.block.inventory.empty) return
    // If no assembly recipe with this item exists, return
    let hand_item = event.item
    let hand_item_id = event.item.id
    if (!Object.keys(global.special_recipes.assembly).includes(hand_item_id)) return
    // If this item cannot be added to the item currently in the cutting board, return
    let board_item_id = event.block.inventory.allItems[0].id
    if (!Object.keys(global.special_recipes.assembly[hand_item_id]).includes(board_item_id)) return
    // Schedule in ticks so farmer's delight has chance to process recipe
    event.server.scheduleInTicks(1, ctx => {
        // If assembly recipe should leave an item, give player item
        if (Object.keys(global.special_recipes.assembly[hand_item_id][board_item_id]).includes("tool_result")) {
            event.player.give(global.special_recipes.assembly[hand_item_id][board_item_id].tool_result)
        }
        // Decrease item count
        hand_item.count--
    })
})