//priority: 1

// Load Helpers
let { recipeHelper, configHelper } = global;

let recipeLogging = configHelper.getValue("recipeLogging")

ServerEvents.recipes(event => {
    addCreateRecipeHandler(event)
    Object.keys(global.recipes).forEach(id => {
        let recipe = global.recipes[id]
        if (recipeLogging) {
            console.log(`Adding '${recipe.type}' recipe: '${id}'`)
            if (configHelper.getValue("verboseCustomRecipes")) {
                console.log(JSON.stringify(recipe))
            }
        }
        event.custom(recipe).id(id)
        if (recipeLogging) {
            console.log(`Recipe Added`)
        }
    })
    global.specialRecipes.pressing.forEach(recipe => {
        if (recipeLogging) {
            console.log(`Adding pressing recipe: ${recipe.id}`)
        }
        event.recipes.create.pressing(recipe.result, recipe.ingredient).id(recipe.id)
        if (recipeLogging) {
            console.log(`Recipe Added`)
        }
    })
    global.specialRecipes.compacting.forEach(recipe => {
        if (recipeLogging) {
            console.log(`Adding compacting recipe: ${recipe.id}`)
        }
        event.recipes.create.compacting(recipe.result, recipe.ingredients).id(recipe.id)
        if (recipeLogging) {
            console.log(`Recipe Added`)
        }
    })
    event.recipes.create.finalize()
})