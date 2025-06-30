//priority: 1

ServerEvents.recipes(event => {
    addCreateRecipeHandler(event)
    global.recipes.deploying.forEach(recipe => {
        event.recipes.create.deploying(recipe.output, [recipe.input, recipe.tool]).id(recipe.id)
    })
    global.recipes.filling.forEach(recipe => {
        event.recipes.create.filling(recipe.output, [recipe.input, Fluid.of(recipe.fluid, recipe.amount)]).id(recipe.id)
    })
    global.recipes.pressing.forEach(recipe => {
        event.recipes.create.pressing(recipe.output, recipe.input).id(recipe.id)
    })
    global.recipes.deploying.forEach(recipe => {
        let tool_object = {}
        if (recipe.tool.startsWith("#")) {
            tool_object = {
                "tag": recipe.tool.slice(1, recipe.tool.length)
            }
        } else {
            tool_object = {
                "item": recipe.tool
            }
        }
        event.custom({
            "type": "farmersdelight:cutting",
            "ingredients": [
                {
                    "item": recipe.input
                }
            ],
            "result": [
                {
                    "item": {
                        "count": 1,
                        "id": recipe.output
                    }
                }
            ],
            "tool": tool_object,
        }).id(recipe.id)
    })
    event.recipes.create.finalize()
})