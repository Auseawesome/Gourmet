//priority: 1

// Load Helpers
let { configHelper } = global;

let recipeLogging = configHelper.getValue("recipeLogging")

ServerEvents.recipes(event => {
    addCreateRecipeHandler(event)
    global.recipes.deploying.forEach(recipe => {
        event.recipes.create.deploying(recipe.output, [recipe.input, recipe.tool]).id(recipe.id)
        if (recipeLogging) {
            console.log(`Adding deploying recipe: ${recipe.id}`)
        }
    })
    global.recipes.filling.forEach(recipe => {
        event.recipes.create.filling(recipe.output, [recipe.input, Fluid.of(recipe.fluid, recipe.amount)]).id(recipe.id)
        if (recipeLogging) {
            console.log(`Adding filling recipe: ${recipe.id}`)
        }
    })
    global.recipes.pressing.forEach(recipe => {
        event.recipes.create.pressing(recipe.output, recipe.input).id(recipe.id)
        if (recipeLogging) {
            console.log(`Adding pressing recipe: ${recipe.id}`)
        }
    })
    global.recipes.preparation.forEach(recipe => {
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

        if (recipeLogging) {
            console.log(`Adding preparation recipe: ${recipe.id}`)
        }
    })
    event.recipes.create.finalize()
})