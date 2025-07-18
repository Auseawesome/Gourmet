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
        if (!Object.keys(recipe_count).includes(recipe.type)) {
            recipe_count[recipe.type] = 0
        }
        id = `kubejs:${recipe.type.split(":").join("_")}_${recipe_count[recipe.type]++}`
    }
    global.recipes[id] = recipe
}

// Recipe Helpers

global.special_recipes.assembly = {}

global.queueRecipe.assembly = (recipe) => {
    let deploying_id
    let preparation_id
    if (Object.keys(recipe).includes("id")) {
        deploying_id = stringHelper.getNamespace(recipe.id) + ":deploying_" + stringHelper.removeNamespace(recipe.id)
        preparation_id = stringHelper.getNamespace(recipe.id) + ":preparation_" + stringHelper.removeNamespace(recipe.id)
    } else {
        deploying_id = `kubejs:deploying_${stringHelper.removeNamespace(recipe.tool)}_on_${stringHelper.removeNamespace(recipe.input)}`
        preparation_id = `kubejs:preparing_${stringHelper.removeNamespace(recipe.input)}_with_${stringHelper.removeNamespace(recipe.tool)}`
    }
    global.queueRecipe.deploying({
        "input": recipe.input,
        "tool": recipe.tool,
        "output": recipe.output,
        "id": deploying_id,
    })
    global.queueRecipe.preparation({
        "input": recipe.input,
        "tool": recipe.tool,
        "output": recipe.output,
        "id": preparation_id,
    })
    // Make sure item gets consumed when assembling
    if (!Object.keys(global.special_recipes.assembly).includes(recipe.tool)) {
        global.special_recipes.assembly[recipe.tool] = {}
    }
    let assembly_object = {}
    if (Object.keys(recipe).includes("tool_result")) {
        assembly_object.tool_result = recipe.tool_result
    }
    
    global.special_recipes.assembly[recipe.tool][recipe.input] = assembly_object
}

global.queueRecipe.fluidAssembly = (recipe) => {
    let filling_id
    if (Object.keys(recipe).includes("id")) {
        filling_id = stringHelper.getNamespace(recipe.id) + ":filling_" + stringHelper.removeNamespace(recipe.id)
    } else {
        filling_id = `kubes:spouting_${stringHelper.removeNamespace(recipe.fluid)}_on_${stringHelper.removeNamespace(recipe.input)}`
    }
    let fillingRecipe = {
        "input": recipe.input,
        "fluid": recipe.fluid,
        "output": recipe.output,
        "id": filling_id,
    }
    if (Object.keys(recipe).includes("amount")) {
        fillingRecipe.amount = recipe.amount
    }
    global.queueRecipe.filling(fillingRecipe)
    let assemblyRecipe = {
        "input": recipe.input,
        "tool": recipe.container,
        "output": recipe.output,
    }
    if (Object.keys(recipe).includes("empty_container")) {
        assemblyRecipe.tool_result = recipe.empty_container
    }
    if (Object.keys(recipe).includes("id")) {
        assemblyRecipe.id = recipe.id
    }
    global.queueRecipe.assembly(assemblyRecipe)
}

global.queueRecipe.automatableJuicing = (recipe) => {
    let juicing_id
    let compacting_id
    if (Object.keys(recipe).includes("id")) {
        juicing_id = stringHelper.getNamespace(recipe.id) + ":juicing_" + stringHelper.removeNamespace(recipe.id)
        compacting_id = stringHelper.getNamespace(recipe.id) + ":compacting_" + stringHelper.removeNamespace(recipe.id)
    } else {
        juicing_id = `kubejs:juicing_${stringHelper.removeNamespace(recipe.primary)}_and_${stringHelper.removeNamespace(recipe.secondary)}_into_${stringHelper.removeNamespace(recipe.container)}`
        compacting_id = `kubejs:compacting_${stringHelper.removeNamespace(recipe.primary)}_and_${stringHelper.removeNamespace(recipe.secondary)}_to_${stringHelper.removeNamespace(recipe.outputFluid)}`
    }
    global.queueRecipe.juicing({
        "primary": recipe.primary,
        "secondary": recipe.secondary,
        "container": recipe.container,
        "output": recipe.output,
        "id": juicing_id
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
    }, compacting_id)
}

global.queueRecipe.fluidStorage = (fluid, container, full_container, amount) => {
    global.queueRecipe.filling({
        "id": `kubejs:filling_${stringHelper.removeNamespace(container)}_with_${stringHelper.removeNamespace(fluid)}`,
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
    }, `kubejs:emptying_${stringHelper.removeNamespace(fluid)}_from_${stringHelper.removeNamespace(container)}`)
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