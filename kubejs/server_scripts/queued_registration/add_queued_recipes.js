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
        }
        event.custom(recipe).id(id)
        if (recipeLogging) {
            console.log(`Recipe Added`)
        }
    })
    global.special_recipes.deploying.forEach(recipe => {
        if (recipeLogging) {
            console.log(`Adding deploying recipe: ${recipe.id}`)
        }
        event.recipes.create.deploying(recipe.output, [recipe.input, recipe.tool]).id(recipe.id)
        if (recipeLogging) {
            console.log(`Recipe Added`)
        }
    })
    global.special_recipes.filling.forEach(recipe => {
        if (recipeLogging) {
            console.log(`Adding filling recipe: ${recipe.id}`)
        }
        event.recipes.create.filling(recipe.output, [recipe.input, Fluid.of(recipe.fluid, recipe.amount)]).id(recipe.id)
        if (recipeLogging) {
            console.log(`Recipe Added`)
        }
    })
    global.special_recipes.pressing.forEach(recipe => {
        if (recipeLogging) {
            console.log(`Adding pressing recipe: ${recipe.id}`)
        }
        event.recipes.create.pressing(recipe.output, recipe.input).id(recipe.id)
        if (recipeLogging) {
            console.log(`Recipe Added`)
        }
    })
    global.special_recipes.compacting.forEach(recipe => {
        if (recipeLogging) {
            console.log(`Adding compacting recipe: ${recipe.id}`)
        }
        event.recipes.create.compacting(recipe.output, recipe.inputs).id(recipe.id)
        if (recipeLogging) {
            console.log(`Recipe Added`)
        }
    })
    event.recipes.create.finalize()
})