/**
 * 
 * @param {$LangKubeEvent} event 
 */
function renameEnglish(event) {
    // Preparation Board
    event.renameBlock("farmersdelight:cutting_board", "Preparation Board")

    event.add("farmersdelight", "farmersdelight.advancement.use_cutting_board", "Chef's Workspace")
    event.add("farmersdelight", "farmersdelight.advancement.use_cutting_board.desc", "Use a preparation board to process some food manually")
    event.add("farmersdelight", "farmersdelight.block.cutting_board.invalid_item", "This item can't be prepared here...")
    event.add("farmersdelight", "farmersdelight.block.cutting_board.invalid_tool", "Maybe a different item...")
    event.add("farmersdelight", "farmersdelight.jei.cutting", "Food Preparation")

    // Lingonberry

    event.renameBlock("sweet_berry_bush", "Lingonberry Bush")
    
    event.renameItem("sweet_berries", "Lingonberries")
    
}

ClientEvents.lang("en_us", event => {
    renameEnglish(event)

})

ClientEvents.lang("en_gb", event => {
    renameEnglish(event)
})
