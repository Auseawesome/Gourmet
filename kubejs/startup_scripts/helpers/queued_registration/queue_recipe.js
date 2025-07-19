// priority: 100

// Load Helpers
let { recipeHelper, stringHelper } = global

// Define Helper

global.queueRecipe = {}
global.recipes = {}
global.specialRecipes = {}

// Add Recipe Types

global.queueRecipe.deploying = (recipe) => {
    let recipeKeys = Object.keys(recipe)
    let recipeId
    let recipeObject = {
        "type": "create:deploying",
        "ingredients": [
            recipeHelper.itemOrTag(recipe.ingredient),
            recipeHelper.itemOrTag(recipe.tool)
        ],
        "results": [
            recipeHelper.result(recipe.result)
        ]
    }
    if (recipeKeys.includes("id")) {
        recipeId = recipe.id
    } else {
        recipeId = `kubejs:deploying_${stringHelper.removeNamespace(recipe.result)}_from_${stringHelper.removeNamespace(recipe.ingredient)}_using_${stringHelper.removeNamespace(recipe.tool)}`
    }
    if (recipeKeys.includes("keepHelpItem")) {
        recipeObject.keep_help_item = recipe.keepHeldItem
    }
    global.queueRecipe.custom(recipeObject, recipeId)
}

global.specialRecipes.filling = []

/**
 * Queue filling recipe to be added
 * @param {{"ingredient": String, "fluid": String, "amount"?: Number, "result": String, "id"?: String}} recipe
 */
global.queueRecipe.filling = (recipe) => {
    if (!Object.keys(recipe).includes("id")) {
        recipe.id = `filling_${stringHelper.removeNamespace(recipe.result)}_from_${stringHelper.removeNamespace(recipe.ingredient)}_and_${stringHelper.removeNamespace(recipe.fluid)}`
    }
    if (!Object.keys(recipe).includes("amount")) {
        recipe.amount = 250
    }
    global.specialRecipes.filling.push(recipe)
}

global.specialRecipes.pressing = []

/**
 * Queue pressing recipe to be added
 * @param {{"ingredient": String, "result": String, "id"?: String}} recipe
 */
global.queueRecipe.pressing = (recipe) => {
    if (!Object.keys(recipe).includes("id")) {
        recipe.id = `pressing_${stringHelper.removeNamespace(recipe.result)}_from_${stringHelper.removeNamespace(recipe.ingredient)}`
    }
    global.specialRecipes.pressing.push(recipe)
}

global.specialRecipes.compacting = []

// Doesn't appear to properly support fluids
global.queueRecipe.compacting = (recipe) => {
    if (!Object.keys(recipe).includes("id")) {
        recipe.id = `compacting_${stringHelper.removeNamespace(recipe.result)}_from_${recipe.ingredients[0].toString.split(" ")[0]}`
    }
    global.specialRecipes.compacting.push(recipe)
}

/**
 * Queue preparation recipe to be added
 * @param {{"ingredient": String, "tool": String, "result": String, "id"?: String}} recipe
 */
global.queueRecipe.preparation = (recipe) => {
    if (!Object.keys(recipe).includes("id")) {
        recipe.id = `preparing_${stringHelper.removeNamespace(recipe.result)}_from_${stringHelper.removeNamespace(recipe.ingredient)}_using_${stringHelper.removeNamespace(recipe.tool)}`
    }
    global.recipes[recipe.id] = {
        "type": "farmersdelight:cutting",
        "ingredients": [
            {
                "item": recipe.ingredient
            }
        ],
        "result": [
            {
                "item": {
                    "count": 1,
                    "id": recipe.result
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
            "id": recipe.result
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

global.specialRecipes.assembly = {}

global.queueRecipe.assembly = (recipe) => {
    let deployingId
    let preparationId
    if (Object.keys(recipe).includes("id")) {
        deployingId = stringHelper.getNamespace(recipe.id) + ":deploying_" + stringHelper.removeNamespace(recipe.id)
        preparationId = stringHelper.getNamespace(recipe.id) + ":preparation_" + stringHelper.removeNamespace(recipe.id)
    } else {
        deployingId = `kubejs:deploying_${stringHelper.removeNamespace(recipe.tool)}_on_${stringHelper.removeNamespace(recipe.ingredient)}`
        preparationId = `kubejs:preparing_${stringHelper.removeNamespace(recipe.ingredient)}_with_${stringHelper.removeNamespace(recipe.tool)}`
    }
    global.queueRecipe.deploying({
        "ingredient": recipe.ingredient,
        "tool": recipe.tool,
        "result": recipe.result,
        "id": deployingId,
    })
    global.queueRecipe.preparation({
        "ingredient": recipe.ingredient,
        "tool": recipe.tool,
        "result": recipe.result,
        "id": preparationId,
    })
    // Make sure item gets consumed when assembling
    if (!Object.keys(global.specialRecipes.assembly).includes(recipe.tool)) {
        global.specialRecipes.assembly[recipe.tool] = {}
    }
    let assembly_object = {}
    if (Object.keys(recipe).includes("toolResult")) {
        assembly_object.toolResult = recipe.toolResult
    }
    
    global.specialRecipes.assembly[recipe.tool][recipe.ingredient] = assembly_object
}

global.queueRecipe.fluidAssembly = (recipe) => {
    let fillingId
    if (Object.keys(recipe).includes("id")) {
        fillingId = stringHelper.getNamespace(recipe.id) + ":filling_" + stringHelper.removeNamespace(recipe.id)
    } else {
        fillingId = `kubes:spouting_${stringHelper.removeNamespace(recipe.fluid)}_on_${stringHelper.removeNamespace(recipe.ingredient)}`
    }
    let fillingRecipe = {
        "ingredient": recipe.ingredient,
        "fluid": recipe.fluid,
        "result": recipe.result,
        "id": fillingId,
    }
    if (Object.keys(recipe).includes("amount")) {
        fillingRecipe.amount = recipe.amount
    }
    global.queueRecipe.filling(fillingRecipe)
    let assemblyRecipe = {
        "ingredient": recipe.ingredient,
        "tool": recipe.container,
        "result": recipe.result,
    }
    if (Object.keys(recipe).includes("emptyContainer")) {
        assemblyRecipe.toolResult = recipe.emptyContainer
    }
    if (Object.keys(recipe).includes("id")) {
        assemblyRecipe.id = recipe.id
    }
    global.queueRecipe.assembly(assemblyRecipe)
}

global.queueRecipe.automatableJuicing = (recipe) => {
    let juicingId
    let compactingId
    if (Object.keys(recipe).includes("id")) {
        juicingId = stringHelper.getNamespace(recipe.id) + ":juicing_" + stringHelper.removeNamespace(recipe.id)
        compactingId = stringHelper.getNamespace(recipe.id) + ":compacting_" + stringHelper.removeNamespace(recipe.id)
    } else {
        juicingId = `kubejs:juicing_${stringHelper.removeNamespace(recipe.primary)}_and_${stringHelper.removeNamespace(recipe.secondary)}_into_${stringHelper.removeNamespace(recipe.container)}`
        compactingId = `kubejs:compacting_${stringHelper.removeNamespace(recipe.primary)}_and_${stringHelper.removeNamespace(recipe.secondary)}_to_${stringHelper.removeNamespace(recipe.fluidResult)}`
    }
    global.queueRecipe.juicing({
        "primary": recipe.primary,
        "secondary": recipe.secondary,
        "container": recipe.container,
        "result": recipe.result,
        "id": juicingId
    })
    global.queueRecipe.custom({
        "type": "create:compacting",
        "ingredients": recipeHelper.itemOrTagArray([recipe.primary, recipe.secondary]),
        "results": [
            {
                "amount": 250,
                "id": recipe.fluidResult
            }
        ]
    }, compactingId)
}

global.queueRecipe.fluidStorage = (fluid, container, full_container, amount) => {
    global.queueRecipe.filling({
        "id": `kubejs:filling_${stringHelper.removeNamespace(container)}_with_${stringHelper.removeNamespace(fluid)}`,
        "ingredient": container,
        "amount": amount,
        "fluid": fluid,
        "result": full_container
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

global.queueRecipe.cooking = (recipe) => {
    let recipeKeys = Object.keys(recipe)
    let recipeId
    if (recipeKeys.includes("id")) {
        recipeId = recipe.id
    } else {
        recipeId = `kubejs:cooking_${stringHelper.removeNamespace(recipe.result)}`
    }
    let recipeObject = {
        "type": "farmersdelight:cooking",
        "ingredients": recipeHelper.itemOrTagArray(recipe.ingredients),
        "result": {
            "count": 1,
            "id": recipe.result
        },
        "recipe_book_tab": "misc"
    }
    if (recipeKeys.includes("container")) {
        recipeObject.container = {
            "count": 1,
            "id": recipe.container
        }
    }
    if (recipeKeys.includes("cookingTime")) {
        recipeObject.cookingtime = recipe.cookingTime
    }
    global.queueRecipe.custom(recipeObject, recipeId)
}

global.queueRecipe.mixing = (recipe) => {
    let recipeObject = {
        "type": "create:mixing",
        "ingredients": [],
        "results": []
    }
    let recipeKeys = Object.keys(recipe)
    let recipeId
    if (recipeKeys.includes("id")) {
        recipeId = recipe.id
    } else {
        recipeId = `kubejs:mixing_${stringHelper.removeNamespace(recipe.result)}`
    }
    if (recipeKeys.includes("heatRequirement")) {
        recipeObject.heat_requirement = recipe.heatRequirement
    }
    if (recipeKeys.includes("ingredients")) {
        recipeObject.ingredients = recipeObject.ingredients.concat(recipeHelper.itemOrTagArray(recipe.ingredients))
    }
    if (recipeKeys.includes("fluidIngredients")) {
        recipeObject.ingredients = recipeObject.ingredients.concat(recipeHelper.fluidIngredientArray(recipe.fluidIngredients))
    }
    if (recipeKeys.includes("results")) {
        recipeObject.results = recipeObject.results.concat(recipeHelper.resultArray(recipe.results))
    }
    if (recipeKeys.includes("fluidResults")) {
        recipeObject.results = recipeObject.results.concat(recipeHelper.fluidResultArray(recipe.fluidResults))
    }
    global.queueRecipe.custom(recipeObject, recipeId)
}

global.queueRecipe.automatableCooking = (recipe) => {
    let recipeKeys = Object.keys(recipe)

    let cookingRecipe = {
        "ingredients": [],
        "result": recipe.result
    }
    let mixingRecipe = {
        "heatRequirement": "heated"
    }

    if (recipeKeys.includes("id")) {
        cookingRecipe.id = `${stringHelper.getNamespace(recipe.id)}:manual_cooking_${stringHelper.removeNamespace(recipe.id)}`
        mixingRecipe.id = `${stringHelper.getNamespace(recipe.id)}:mixing_cooking_${stringHelper.removeNamespace(recipe.id)}`
    } else {
        cookingRecipe.id = `kubejs:manual_cooking_${stringHelper.removeNamespace(recipe.result)}`
        mixingRecipe.id = `kubejs:mixing_cooking_${stringHelper.removeNamespace(recipe.result)}`
    }
    if (recipeKeys.includes("container")) {
        cookingRecipe.container = recipe.container
    }
    if (recipeKeys.includes("ingredients")) {
        cookingRecipe.ingredients = cookingRecipe.ingredients.concat(recipe.ingredients)
        mixingRecipe.ingredients = recipe.ingredients
    }
    if (recipeKeys.includes("containerIngredients")) {
        cookingRecipe.ingredients = cookingRecipe.ingredients.concat(recipe.containerIngredients)
    }
    if (recipeKeys.includes("fluidIngredients")) {
        mixingRecipe.fluidIngredients = recipe.fluidIngredients
    }
    // Make mixing result fluid if possible
    if (recipeKeys.includes("fluidResult")) {
        mixingRecipe.fluidResults = [recipe.fluidResult]
    } else {
        mixingRecipe.results = [recipe.result]
    }

    global.queueRecipe.cooking(cookingRecipe)
    global.queueRecipe.mixing(mixingRecipe)
}