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
})