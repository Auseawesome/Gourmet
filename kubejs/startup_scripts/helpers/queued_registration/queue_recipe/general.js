// priority: 200

// Load Helpers
let { recipeHelper, stringHelper } = global

// Define Helper

global.queueRecipe = {}
global.recipes = {}
global.specialRecipes = {}

// Add Recipe Types

let recipe_count = {}

global.queueRecipe.custom = (recipe, id) => {
    if (typeof id === 'undefined') {
        if (!Object.keys(recipe_count).includes(recipe.type)) {
            recipe_count[recipe.type] = 0
        }
        id = `kubejs:${recipe.type.split(":").join("_")}_${recipe_count[recipe.type]++}`
    }
    global.recipes[id] = recipe
}