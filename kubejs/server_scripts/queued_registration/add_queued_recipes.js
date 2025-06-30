//priority: 1

// Load Helpers
let { configHelper } = global;

let recipeLogging = configHelper.getValue("recipeLogging")

ServerEvents.recipes(event => {
    addCreateRecipeHandler(event)
    global.recipes.custom.forEach(recipe => {
        if (recipeLogging) {
            console.log(`Adding custom recipe of type: ${recipe.type}`)
        }
        event.custom(recipe)
        if (recipeLogging) {
            console.log(`Recipe Added`)
        }
    })
    global.recipes.deploying.forEach(recipe => {
        if (recipeLogging) {
            console.log(`Adding deploying recipe: ${recipe.id}`)
        }
        event.recipes.create.deploying(recipe.output, [recipe.input, recipe.tool]).id(recipe.id)
        if (recipeLogging) {
            console.log(`Recipe Added`)
        }
    })
    global.recipes.filling.forEach(recipe => {
        if (recipeLogging) {
            console.log(`Adding filling recipe: ${recipe.id}`)
        }
        event.recipes.create.filling(recipe.output, [recipe.input, Fluid.of(recipe.fluid, recipe.amount)]).id(recipe.id)
        if (recipeLogging) {
            console.log(`Recipe Added`)
        }
    })
    global.recipes.pressing.forEach(recipe => {
        if (recipeLogging) {
            console.log(`Adding pressing recipe: ${recipe.id}`)
        }
        event.recipes.create.pressing(recipe.output, recipe.input).id(recipe.id)
        if (recipeLogging) {
            console.log(`Recipe Added`)
        }
    })
    global.recipes.preparation.forEach(recipe => {
        if (recipeLogging) {
            console.log(`Adding preparation recipe: ${recipe.id}`)
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
            "tool": recipeHelper.itemOrTag(recipe.tool),
        }).id(recipe.id)

        if (recipeLogging) {
            console.log(`Recipe Added`)
        }
        }
    })
    event.recipes.create.finalize()
})