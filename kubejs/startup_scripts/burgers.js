// Load Helpers
let { configHelper, stringHelper, queueItem, queueLang, queueModel, queueRecipe, queueTag, queueTooltip } = global

const PATTIES = {
    "beef": {
        "id": "farmersdelight:beef_patty",
        "height": 1,
        "lang": {
            "en_us": "Beef",
        },
    },
    "chicken": {
        "id": "kubejs:chicken_patty",
        "height": 1,
        "lang": {
            "en_us": "Chicken",
        },
    },
    "vegetable": {
        "id": "kubejs:vegetable_patty",
        "height": 1,
        "lang": {
            "en_us": "Vegetable",
        },
    },
}
const FILLINGS = {
    "onion": {
        "id": "#c:foods/onion",
        "height": 1,
        "lang": {
            "en_us": "Onion",
        },
    },
    "tomato": {
        "id": "#c:foods/tomato",
        "height": 1,
        "lang": {
            "en_us": "Tomato",
        },
    },
    "mushroom": {
        "id": "minecraft:brown_mushroom",
        "height": 1,
        "lang": {
            "en_us": "Mushroom",
        }
    },
    "cabbage": {
        "id": "#c:foods/cabbage",
        "height": 1,
        "lang": {
            "en_us": "Cabbage",
        },
    },
    "cheese": {
        "id": "#c:foods/cheese",
        "height": 0,
        "lang": {
            "en_us": "Cheese",
        },
    },
}
const SAUCES = {
    "ketchup": {
        "id": "kubejs:ketchup",
        "container": "kubejs:ketchup_bottle",
        "height": 0,
        "lang": {
            "en_us": "Ketchup",
        },
    },
    "relish": {
        "id": "kubejs:burger_relish",
        "container": "kubejs:burger_relish_bottle",
        "height": 0,
        "lang": {
            "en_us": "Burger Relish",
        },
    },
    "mustard": {
        "id": "kubejs:mustard",
        "container": "kubejs:mustard_bottle",
        "height": 0,
        "lang": {
            "en_us": "Mustard",
        }
    },
    "mayonnaise": {
        "id": "kubejs:mayonnaise",
        "container": "kubejs:mayonnaise_bottle",
        "height": 0,
        "lang": {
            "en_us": "Mayonnaise"
        }
    }
}

const PREFIX_DICT = {
    0: "open",
    1: "closed",
    2: "layered",
    3: "filled",
    4: "stacked",
    5: "stuffed",
    6: "sauced",
    7: "saucy",
    8: "sticky",
    9: "super",
    10: "overflowing",
    11: "deluxe",
}

const INVERSE_PREFIX_DICT = {
    "open": 0,
    "closed": 1,
    "layered": 2,
    "filled": 3,
    "stacked": 4,
    "stuffed": 5,
    "sauced": 6,
    "saucy": 7,
    "sticky": 8,
    "super": 9,
    "overflowing": 10,
    "deluxe": 11,
}

/**
 * Return 
 * @param {{"patty": String, "closed": Boolean, "sauce"?: String, "firstFilling"?: String, "secondFilling"?: String}} ingredients 
 * @returns {String}
 */
function getIdFromIngredients(ingredients) {
    /** @type {String} */
    let id = "kubejs:burger_"
    /** @type {String[]} */
    let keys = Object.keys(ingredients)
    /** @type {Number} */
    let fillings = keys.includes("firstFilling") + keys.includes("secondFilling")
    /** @type {Boolean} */
    let hasSauce = keys.includes("sauce")
    // Add prefix to id
    id += PREFIX_DICT[ingredients.closed + fillings * 2 + hasSauce * 6]
    // Add patty to id
    id += `_${ingredients.patty}`
    if (hasSauce) {
        id += `_${ingredients.sauce}`
    }
    if (fillings > 0) {
        id += `_${ingredients.firstFilling}`
    }
    if (fillings > 1) {
        id += `_${ingredients.secondFilling}`
    }
    return id
}

/**
 * Returns tooltip from id string
 * @param {String} id 
 * @returns {Text[]}
 */
function getTooltipFromId(id) {
    if (configHelper.getValue("tooltipLogging")) {
        console.log(`Adding tooltip for ${id}`)
    }
    /** @type {String[]} */
    let idParts = id.split("_").reverse()
    // Remove 'kubejs:burger'
    idParts.pop()
    /** @type {String} */
    let prefix = idParts.pop()
    /** @type {Number} */
    let prefixId = INVERSE_PREFIX_DICT[prefix]
    /** @type {Text[]} */
    let tooltip = []
    // Pop the patty from the id
    idParts.pop()
    // If burger has sauce add sauce to the tooltip
    if (prefixId > 5) {
        tooltip.push(Text.gray("Sauce: ").append(Text.translatable(`kubejs.burger.sauce.${idParts.pop()}`).gray()))
    }
    // Loop through remaining parts and add to new tooltip lines
    for (; idParts.length > 0;) {
        tooltip.push(Text.translatable(`kubejs.burger.filling.${idParts.pop()}`).gray())
    }
    return tooltip
}

/**
 * Returns name from id string
 * @param {String} id 
 * @returns {Text}
 */
function getNameFromId(id) {
     /** @type {String[]} */
    let idParts = id.split("_").reverse()
    // Remove 'kubejs:burger'
    idParts.pop()
    return Text.gray(`${stringHelper.capitalize(idParts.pop())} ${PATTIES[idParts.pop()].lang.en_us} Burger`)
}

/**
 * Returns tooltip from id string
 * @param {String} id 
 * @returns {import("com.google.gson.JsonElement").$JsonElement$$Type}
 */
function getModelFromId(id) {
    /** @type {String[]} */
    let idParts = id.split("_").reverse()
    // Remove 'kubejs:burger'
    idParts.pop()
    /** @type {String} */
    let prefix = idParts.pop()
    /** @type {Number} */
    let prefixId = INVERSE_PREFIX_DICT[prefix]

    let fillingHeight = 0

    let patty = idParts.pop()

    /** @type {import("com.google.gson.JsonElement").$JsonElement$$Type} */
    let model = {
        "loader": "neoforge:composite",
        "gui_light": "front",
        "children": {
            "part_1": {
                "loader": "neoforge:item_layers",
                "textures": {
                    "layer0": "kubejs:item/burger/bun_base",
                    "layer1": `kubejs:item/burger/patty/${patty}`,
                },
            }
        },
        "display": {
            "ground": {
                "rotation": [ 0, 0, 0 ],
                "translation": [ 0, 2, 0],
                "scale":[ 0.5, 0.5, 0.5 ]
            },
            "head": {
                "rotation": [ 0, 180, 0 ],
                "translation": [ 0, 13, 7],
                "scale":[ 1, 1, 1]
            },
            "thirdperson_righthand": {
                "rotation": [ 0, 0, 0 ],
                "translation": [ 0, 3, 1 ],
                "scale": [ 0.55, 0.55, 0.55 ]
            },
            "firstperson_righthand": {
                "rotation": [ 0, -90, 25 ],
                "translation": [ 1.13, 3.2, 1.13],
                "scale": [ 0.68, 0.68, 0.68 ]
            },
            "fixed": {
                "rotation": [ 0, 180, 0 ],
                "scale": [ 1, 1, 1 ]
            }
        }
    }

    fillingHeight += PATTIES[patty].height

    // If burger has sauce add sauce to the model
    if (prefixId > 5) {
        let sauce = idParts.pop()
        model["children"]["part_1"]["textures"]["layer2"] = `kubejs:item/burger/sauce/${sauce}`
        fillingHeight += SAUCES[sauce].height
    }

let partNum = 2

    // Add filling layers to model
    for (; idParts.length > 0;) {
        let filling = idParts.pop()
        model["children"][`part_${partNum}`] = {
            "loader": "neoforge:item_layers",
            "textures": {
                "layer0": `kubejs:item/burger/filling/${filling}`
            },
            "transform": {
                "origin": "center",
                "translation": [0, (fillingHeight-1)/16, 0],
                "scale": [1+(0.01*fillingHeight), 1, 1+(0.01*fillingHeight)],
            }
        }
        fillingHeight += FILLINGS[filling].height
        partNum++
    }
    // If burger is closed add bun top to model
    if (prefixId % 2 == 1) {
        model["children"][`part_${partNum}`] = {
            "loader": "neoforge:item_layers",
            "textures": {
                "layer0": `kubejs:item/burger/bun_top`
            },
            "transform": {
                "origin": "center",
                "translation": [0, (fillingHeight-1)/16, 0],
                "scale": [1+(0.01*fillingHeight), 1, 1+(0.01*fillingHeight)],
            }
        }
    }
    return model
}

/**
 * 
 * @param {String} id 
 * @param {{"patty": String, "closed": Boolean, "sauce"?: String, "firstFilling"?: String, "secondFilling"?: String}} ingredients 
 */
function addRecipesForBurger(id, ingredients) {
    /** @type Array */
    let ingredientKeys = Object.keys(ingredients)
    if (ingredients.closed == true) {
        ingredients.closed = false
        let ingredientId = getIdFromIngredients(ingredients)
        queueRecipe.assembly({
            "id": `${id}_closing`,
            "ingredient": ingredientId,
            "result": id,
            "tool": "kubejs:bun_top",
        })
        // Reset ingredients
        ingredients.closed = true
    } else {
        if (ingredientKeys.includes("secondFilling")) {
            let firstFilling = ingredients.firstFilling
            let secondFilling = ingredients.secondFilling
            delete ingredients.secondFilling
            let ingredientId = getIdFromIngredients(ingredients)
            queueRecipe.assembly({
                "id": `${id}_assembling_second`,
                "ingredient": ingredientId,
                "result": id,
                "tool": FILLINGS[secondFilling].id,
            })
            ingredients.firstFilling = secondFilling
            ingredientId = getIdFromIngredients(ingredients)
            queueRecipe.assembly({
                "id": `${id}_assembling_first`,
                "ingredient": ingredientId,
                "result": id,
                "tool": FILLINGS[firstFilling].id,
            })
            // Reset ingredients
            ingredients.firstFilling = firstFilling
            ingredients.secondFilling = secondFilling
        } else if (ingredientKeys.includes("firstFilling")) {
            let filling = ingredients.firstFilling
            delete ingredients.firstFilling
            let ingredientId = getIdFromIngredients(ingredients)
            queueRecipe.assembly({
                "id": `${id}_assembling`,
                "ingredient": ingredientId,
                "result": id,
                "tool": FILLINGS[filling].id
            })
            // Reset ingredients
            ingredients.firstFilling = filling
        } else if (ingredientKeys.includes("sauce")) {
            let sauce = ingredients.sauce
            delete ingredients.sauce
            let ingredientId = getIdFromIngredients(ingredients)
            queueRecipe.fluidAssembly({
                "id": `${id}_sauce`,
                "ingredient": ingredientId,
                "result": id,
                "fluid": SAUCES[sauce].id,
                "container": SAUCES[sauce].container,
                "emptyContainer": "minecraft:glass_bottle",
            })
            // Reset ingredients
            ingredients.sauce = sauce
        } else {
            queueRecipe.assembly({
                "id": `${id}_assembling`,
                "ingredient": "kubejs:bun_base",
                "result": id,
                "tool": PATTIES[ingredients.patty].id,
            })
        }
    } 
}

/**
 * Adds a burger with given ingredients
 * @param {{"patty": String, "closed": Boolean, "sauce"?: String, "firstFilling"?: String, "secondFilling"?: String}} ingredients 
 */
function addBurger(ingredients) {
    let defaultId = getIdFromIngredients(ingredients)

    queueItem.customName(defaultId, getNameFromId(defaultId))
    queueModel.basic(defaultId, getModelFromId(defaultId))
    queueTooltip.basic(defaultId, getTooltipFromId(defaultId))

    addRecipesForBurger(defaultId, ingredients)

    queueTag.addTagToItem("create:upright_on_belt", defaultId)
}

/**
 * Adds both a closed and open burger with given ingredients
 * @param {{"patty": String, "sauce"?: String, "firstFilling"?: String, "secondFilling"?: String}} ingredients 
 */
function addBurgers(ingredients) {
    ingredients.closed = false
    addBurger(ingredients)
    ingredients.closed = true
    addBurger(ingredients)
}

// Register bun parts
queueItem.basic("kubejs:bun_base")
queueItem.basic("kubejs:bun_top")
queueModel.basic("kubejs:bun_base",{parent: "minecraft:item/generated",textures:{layer0:"kubejs:item/burger/bun_base"}})
queueModel.basic("kubejs:bun_top",{parent: "minecraft:item/generated",textures:{layer0:"kubejs:item/burger/bun_top"}})

queueItem.basic("kubejs:chicken_patty")
queueItem.basic("kubejs:vegetable_patty")

// Generate all burgers
Object.keys(PATTIES).forEach(patty => {
    // Register patties on burger buns
    addBurgers({"patty": patty})
    Object.keys(SAUCES).forEach(sauce => {
        // Register sauced patties on burger buns
        addBurgers({"patty":patty,"sauce":sauce})
    })
    let fillings = Array.from(Object.keys(FILLINGS))
    // Loop through all fillings, pop the last one then compute all combinations
    while (true) {
        let firstFilling = fillings.pop()
        addBurgers({"patty": patty, "firstFilling": firstFilling})
        Object.keys(SAUCES).forEach(sauce => {
            // Register sauced patties with one filling
            addBurgers({"patty": patty, "sauce": sauce, "firstFilling": firstFilling})
        })
        if (fillings.length == 0) {
            break
        }
        fillings.forEach(secondFilling => {
            // Register open burgers with two fillings
            addBurgers({"patty": patty, "firstFilling": firstFilling, "secondFilling": secondFilling})
            Object.keys(SAUCES).forEach(sauce => {
                // Register sauced patties with two fillings
                addBurgers({"patty": patty, "sauce": sauce, "firstFilling": firstFilling, "secondFilling": secondFilling})
            })
        })
    }
})

// Register lang for ingredients
Object.keys(PATTIES).forEach(patty => {
    let {lang} = PATTIES[patty]
    queueLang.english(lang, "kubejs", `kubejs.burger.patty.${patty}`)
})
Object.keys(SAUCES).forEach(sauce => {
    let {lang} = SAUCES[sauce]
    queueLang.english(lang, "kubejs", `kubejs.burger.sauce.${sauce}`)
})
Object.keys(FILLINGS).forEach(filling => {
    let {lang} = FILLINGS[filling]
    queueLang.english(lang, "kubejs", `kubejs.burger.filling.${filling}`)
})