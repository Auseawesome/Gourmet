// priority: 100

// Load Helpers
let { recipeHelper, stringHelper } = global

// Define Helper

global.queueRecipe = {}
global.recipes = {}
global.special_recipes = {}

// Add Recipe Types

global.special_recipes.deploying = []

/**
 * Queue deploying recipe to be added
 * @param {{"input": String, "tool": String, "output": String, "id"?: String}} recipe
 */
global.queueRecipe.deploying = (recipe) => {
    if (!Object.keys(recipe).includes("id")) {
        recipe.id = `deploying_${stringHelper.removeNamespace(recipe.output)}_from_${stringHelper.removeNamespace(recipe.input)}_using_${stringHelper.removeNamespace(recipe.tool)}`
    }
    global.special_recipes.deploying.push(recipe)
}

global.special_recipes.filling = []

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
    global.special_recipes.filling.push(recipe)
}

global.special_recipes.pressing = []

/**
 * Queue pressing recipe to be added
 * @param {{"input": String, "output": String, "id"?: String}} recipe
 */
global.queueRecipe.pressing = (recipe) => {
    if (!Object.keys(recipe).includes("id")) {
        recipe.id = `pressing_${stringHelper.removeNamespace(recipe.output)}_from_${stringHelper.removeNamespace(recipe.input)}`
    }
    global.special_recipes.pressing.push(recipe)
}

global.special_recipes.compacting = []

// Doesn't appear to properly support fluids
global.queueRecipe.compacting = (recipe) => {
    if (!Object.keys(recipe).includes("id")) {
        recipe.id = `compacting_${stringHelper.removeNamespace(recipe.output)}_from_${recipe.inputs[0].toString.split(" ")[0]}`
    }
    global.special_recipes.compacting.push(recipe)
}

/**
 * Queue preparation recipe to be added
 * @param {{"input": String, "tool": String, "output": String, "id"?: String}} recipe
 */
global.queueRecipe.preparation = (recipe) => {
    if (!Object.keys(recipe).includes("id")) {
        recipe.id = `preparing_${stringHelper.removeNamespace(recipe.output)}_from_${stringHelper.removeNamespace(recipe.input)}_using_${stringHelper.removeNamespace(recipe.tool)}`
    }
    global.recipes[recipe.id] = {
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
    }
}

global.queueRecipe.juicing = (recipe) => {
    if (!Object.keys(recipe).includes("id")) {
        recipe.id = `juicing_${stringHelper.removeNamespace(recipe.primary)}_with_${stringHelper.removeNamespace(recipe.secondary)}_into_${stringHelper.removeNamespace(recipe.container)}`
    }
    global.recipes[recipe.id] = {
        "type": "expandeddelight:juicing",
        "container": {
            "count": 1,
            "id": recipe.container
        },
        "experience": 0.0,
        "ingredients": [
            recipeHelper.itemOrTag(recipe.primary),
            recipeHelper.itemOrTag(recipe.secondary)
        ],
        "result": {
            "count": 1,
            "id": recipe.output
        }
    }
}

let recipe_count = {}

global.queueRecipe.custom = (recipe, id) => {
    if (typeof id === 'undefined') {
        if (typeof recipe_count[recipe.type] === 'undefined') {
            recipe_count[recipe.type] == 0
        }
        id = `kubejs:${recipe.type.split(":").join("_")}_${recipe_count[recipe.type]++}`
    }
    global.recipes[id] = recipe
}

// Recipe Helpers

global.special_recipes.assembly = {}

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
    // Make sure item gets consumed when assembling
    if (!Object.keys(global.special_recipes.assembly).includes(recipe.tool)) {
        global.special_recipes.assembly[recipe.tool] = []
    }
    global.special_recipes.assembly[recipe.tool].push(recipe.input)
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

global.queueRecipe.automatableJuicing = (recipe) => {
    global.queueRecipe.juicing({
        "primary": recipe.primary,
        "secondary": recipe.secondary,
        "container": recipe.container,
        "output": recipe.output,
        "id": stringHelper.getNamespace(recipe.id) + ":juicing_" + stringHelper.removeNamespace(recipe.id)
    })
    global.queueRecipe.custom({
        "type": "create:compacting",
        "ingredients": recipeHelper.itemOrTagArray([recipe.primary, recipe.secondary]),
        "results": [
            {
                "amount": 250,
                "id": recipe.outputFluid
            }
        ]
    })
}

global.queueRecipe.fluidStorage = (fluid, container, full_container, amount) => {
    global.queueRecipe.filling({
        "id": `filling_${stringHelper.removeNamespace(container)}_with_${stringHelper.removeNamespace(fluid)}`,
        "input": container,
        "amount": amount,
        "fluid": fluid,
        "output": full_container
    })
    global.queueRecipe.custom({
        "type": "create:emptying",
        "ingredients": [
            {
                "item": full_container
            }
        ],
        "results": [
            {
                "id": container
            },
            {
                "amount": amount,
                "id": fluid
            }
        ]
    })
}
/**
 * Creates recipes for emptying and filling a bottle
 * @param {Special.Fluid} fluid 
 * @param {Special.Item} full_container
 */
global.queueRecipe.bottleFluid = (fluid, full_container) => {
    global.queueRecipe.fluidStorage(fluid, "minecraft:glass_bottle", full_container, 250)
}
/**
 * Creates recipes for emptying and fitting a bowl
 * @param {Special.Fluid} fluid 
 * @param {Special.Item} full_container 
 */
global.queueRecipe.bowlFluid = (fluid, full_container) => {
    global.queueRecipe.fluidStorage(fluid, "minecraft:bowl", full_container, 250)
}
/**
 * Creates recipes for emptying and fitting a bowl
 * @param {Special.Fluid} fluid 
 * @param {Special.Item} full_container 
 */
global.queueRecipe.bucketFluid = (fluid, full_container) => {
    global.queueRecipe.fluidStorage(fluid, "minecraft:bucket", full_container, 1000)
}