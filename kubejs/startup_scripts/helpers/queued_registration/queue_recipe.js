// priority: 100

// Load Helpers
let { stringHelper } = global

// Define Helper

global.queueRecipe = {}
global.recipes = {}

// Add Recipe Types

global.recipes.deploying = []

/**
 * Queue deploying recipe to be added
 * @param {{"input": String, "tool": String, "output": String, "id"?: String}} recipe
 */
global.queueRecipe.deploying = (recipe) => {
    if (!Object.keys(recipe).includes("id")) {
        recipe.id = `deploying_${stringHelper.removeNamespace(recipe.output)}_from_${stringHelper.removeNamespace(recipe.input)}_using_${stringHelper.removeNamespace(recipe.tool)}`
    }
    global.recipes.deploying.push(recipe)
}

global.recipes.filling = []

/**
 * Queue filling recipe to be added
 * @param {{"input": String, "fluid": String, "amount"?: Number, "output": String, "id"?: String}} recipe
 */
global.queueRecipe.filling = (recipe) => {
    if (!Object.keys(recipe).includes("id")) {
        recipe.id = `filling_${stringHelper.removeNamespace(recipe.output)}_from_${stringHelper.removeNamespace(recipe.input)}_and_${stringHelper.removeNamespace(recipe.fluid)}`
    }
    if (!Object.keys(recipe).includes("amount")) {
        recipe.amount = 250
    }
    global.recipes.filling.push(recipe)
}

global.recipes.pressing = []

/**
 * Queue pressing recipe to be added
 * @param {{"input": String, "output": String, "id"?: String}} recipe
 */
global.queueRecipe.pressing = (recipe) => {
    if (!Object.keys(recipe).includes("id")) {
        recipe.id = `pressing_${stringHelper.removeNamespace(recipe.output)}_from_${stringHelper.removeNamespace(recipe.input)}`
    }
    global.recipes.pressing.push(recipe)
}

global.recipes.preparation = []

/**
 * Queue preparation recipe to be added
 * @param {{"input": String, "tool": String, "output": String, "id"?: String}} recipe
 */
global.queueRecipe.preparation = (recipe) => {
    if (!Object.keys(recipe).includes("id")) {
        recipe.id = `preparing_${stringHelper.removeNamespace(recipe.output)}_from_${stringHelper.removeNamespace(recipe.input)}_using_${stringHelper.removeNamespace(recipe.tool)}`
    }
    global.recipes.preparation.push(recipe)
}

// Recipe Helpers

global.queueRecipe.assembly = (recipe) => {
    global.queueRecipe.deploying({
        "input": recipe.input,
        "tool": recipe.tool,
        "output": recipe.output,
        "id": stringHelper.getNamespace(recipe.id) + ":deploying_" + stringHelper.removeNamespace(recipe.id),
    })
    global.queueRecipe.preparation({
        "input": recipe.input,
        "tool": recipe.tool,
        "output": recipe.output,
        "id": stringHelper.getNamespace(recipe.id) + ":preparation_" + stringHelper.removeNamespace(recipe.id),
    })
}

global.queueRecipe.fluidAssembly = (recipe) => {
    let fillingRecipe = {
        "input": recipe.input,
        "fluid": recipe.fluid,
        "output": recipe.output,
        "id": stringHelper.getNamespace(recipe.id) + ":filling_" + stringHelper.removeNamespace(recipe.id)
    }
    if (Object.keys(recipe).includes("amount")) {
        fillingRecipe.amount = recipe.amount
    }
    global.queueRecipe.filling(fillingRecipe)
    global.queueRecipe.assembly({
        "input": recipe.input,
        "tool": recipe.container,
        "output": recipe.output,
        "id": recipe.id,
    })
}