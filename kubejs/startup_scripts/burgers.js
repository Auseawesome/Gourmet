// Load Helpers
let { stringHelper, queueLang, queueModel, queueRecipe, queueTag } = global

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
    "mushroom": {
        "id": "minecraft:brown_mushroom",
        "height": 1,
        "lang": {
            "en_us": "Mushroom",
        }
    },
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
}

/**
 * Queue item to be added
 * @param {String} id
 * @param {import("com.google.gson.JsonElement").$JsonElement$$Type} model
 * @param {Text[]} tooltip
*/
function addItem(id, model, tooltip) {
    if (tooltip.length < 1) {
        tooltip.push([Text.white(stringHelper.removeNamespace(id).split("_").map(stringHelper.capitalize).join(" "))])
    }
    global.items[id] = {model: model, tooltip: tooltip}
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
 * @param {{"patty": String, "closed": Boolean, "sauce"?: String, "first_filling"?: String, "second_filling"?: String}} ingredients 
 * @returns {String}
 */
function getIdFromIngredients(ingredients) {
    /** @type {String} */
    let id = "kubejs:burger_"
    /** @type {String[]} */
    let keys = Object.keys(ingredients)
    /** @type {Number} */
    let fillings = keys.includes("first_filling") + keys.includes("second_filling")
    /** @type {Boolean} */
    let has_sauce = keys.includes("sauce")
    // Add prefix to id
    id += PREFIX_DICT[ingredients.closed + fillings * 2 + has_sauce * 6]
    // Add patty to id
    id += `_${ingredients.patty}`
    if (has_sauce) {
        id += `_${ingredients.sauce}`
    }
    if (fillings > 0) {
        id += `_${ingredients.first_filling}`
    }
    if (fillings > 1) {
        id += `_${ingredients.second_filling}`
    }
    return id
}

/**
 * Returns tooltip from id string
 * @param {String} id 
 * @returns {Text[]}
 */
function getTooltipFromId(id) {
    console.log(`Adding tooltip for ${id}`)
    /** @type {String[]} */
    let id_parts = id.split("_").reverse()
    // Remove 'kubejs:burger'
    id_parts.pop()
    /** @type {String} */
    let prefix = id_parts.pop()
    /** @type {Number} */
    let prefix_id = INVERSE_PREFIX_DICT[prefix]
    /** @type {Text[]} */
    let tooltip = [
        [Text.white(`${stringHelper.capitalize(prefix)} `).append(Text.translatable(`kubejs.burger.patty.${id_parts.pop()}`).append(Text.gray(` Burger`)))]
    ]
    // If burger has sauce add sauce to the tooltip
    if (prefix_id > 5) {
        tooltip.push(Text.gray("Sauce: ").append(Text.translatable(`kubejs.burger.sauce.${id_parts.pop()}`).gray()))
    }
    // Loop through remaining parts and add to new tooltip lines
    for (; id_parts.length > 0;) {
        tooltip.push(Text.translatable(`kubejs.burger.filling.${id_parts.pop()}`).gray())
    }
    return tooltip
}

/**
 * Returns tooltip from id string
 * @param {String} id 
 * @returns {import("com.google.gson.JsonElement").$JsonElement$$Type}
 */
function getModelFromId(id) {
    /** @type {String[]} */
    let id_parts = id.split("_").reverse()
    // Remove 'kubejs:burger'
    id_parts.pop()
    /** @type {String} */
    let prefix = id_parts.pop()
    /** @type {Number} */
    let prefix_id = INVERSE_PREFIX_DICT[prefix]

    let filling_height = 0

    let patty = id_parts.pop()

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

    filling_height += PATTIES[patty].height

    // If burger has sauce add sauce to the model
    if (prefix_id > 5) {
        let sauce = id_parts.pop()
        model["children"]["part_1"]["textures"]["layer2"] = `kubejs:item/burger/sauce/${sauce}`
        filling_height += SAUCES[sauce].height
    }

let part_num = 2

    // Add filling layers to model
    for (; id_parts.length > 0;) {
        let filling = id_parts.pop()
        model["children"][`part_${part_num}`] = {
            "loader": "neoforge:item_layers",
            "textures": {
                "layer0": `kubejs:item/burger/filling/${filling}`
            },
            "transform": {
                "origin": "center",
                "translation": [0, (filling_height-1)/16, 0],
                "scale": [1+(0.01*filling_height), 1, 1+(0.01*filling_height)],
            }
        }
        filling_height += FILLINGS[filling].height
        part_num++
    }
    // If burger is closed add bun top to model
    if (prefix_id % 2 == 1) {
        model["children"][`part_${part_num}`] = {
            "loader": "neoforge:item_layers",
            "textures": {
                "layer0": `kubejs:item/burger/bun_top`
            },
            "transform": {
                "origin": "center",
                "translation": [0, (filling_height-1)/16, 0],
                "scale": [1+(0.01*filling_height), 1, 1+(0.01*filling_height)],
            }
        }
    }
    return model
}

/**
 * 
 * @param {String} id 
 * @param {{"patty": String, "closed": Boolean, "sauce"?: String, "first_filling"?: String, "second_filling"?: String}} ingredients 
 */
function addRecipesForBurger(id, ingredients) {
    /** @type Array */
    let ingredient_keys = Object.keys(ingredients)
    if (ingredients.closed == true) {
        ingredients.closed = false
        let input_id = getIdFromIngredients(ingredients)
        queueRecipe.assembly({
            "id": `${id}_closing`,
            "input": input_id,
            "output": id,
            "tool": "kubejs:bun_top",
        })
        // Reset ingredients
        ingredients.closed = true
    } else {
        if (ingredient_keys.includes("second_filling")) {
            let first_filling = ingredients.first_filling
            let second_filling = ingredients.second_filling
            delete ingredients.second_filling
            let input_id = getIdFromIngredients(ingredients)
            queueRecipe.assembly({
                "id": `${id}_assembling_second`,
                "input": input_id,
                "output": id,
                "tool": FILLINGS[second_filling].id,
            })
            ingredients.first_filling = second_filling
            input_id = getIdFromIngredients(ingredients)
            queueRecipe.assembly({
                "id": `${id}_assembling_first`,
                "input": input_id,
                "output": id,
                "tool": FILLINGS[first_filling].id,
            })
            // Reset ingredients
            ingredients.first_filling = first_filling
            ingredients.second_filling = second_filling
        } else if (ingredient_keys.includes("first_filling")) {
            let filling = ingredients.first_filling
            delete ingredients.first_filling
            let input_id = getIdFromIngredients(ingredients)
            queueRecipe.assembly({
                "id": `${id}_assembling`,
                "input": input_id,
                "output": id,
                "tool": FILLINGS[filling].id
            })
            // Reset ingredients
            ingredients.first_filling = filling
        } else if (ingredient_keys.includes("sauce")) {
            let sauce = ingredients.sauce
            delete ingredients.sauce
            let input_id = getIdFromIngredients(ingredients)
            queueRecipe.fluidAssembly({
                "id": `${id}_sauce`,
                "input": input_id,
                "output": id,
                "fluid": SAUCES[sauce].id,
                "container": SAUCES[sauce].container,
            })
            // Reset ingredients
            ingredients.sauce = sauce
        } else {
            queueRecipe.assembly({
                "id": `${id}_assembling`,
                "input": "kubejs:bun_base",
                "output": id,
                "tool": PATTIES[ingredients.patty].id,
            })
        }
    } 
}

/**
 * Adds a burger with given ingredients
 * @param {{"patty": String, "closed": Boolean, "sauce"?: String, "first_filling"?: String, "second_filling"?: String}} ingredients 
 */
function addBurger(ingredients) {
    let default_id = getIdFromIngredients(ingredients)
    console.log(`Adding Burger ${default_id}`)
    addItem(
        default_id,
        getModelFromId(default_id),
        getTooltipFromId(default_id)
    )
    addRecipesForBurger(default_id, ingredients)
    queueTag.addTagToItem("create:upright_on_belt", default_id)
}

/**
 * Adds both a closed and open burger with given ingredients
 * @param {{"patty": String, "sauce"?: String, "first_filling"?: String, "second_filling"?: String}} ingredients 
 */
function addBurgers(ingredients) {
    ingredients.closed = false
    addBurger(ingredients)
    ingredients.closed = true
    addBurger(ingredients)
}

// Register buns
addItem("kubejs:bun",{parent: "minecraft:item/generated",textures:{layer0:"kubejs:item/burger/bun"}},[])
addItem("kubejs:bun_base",{parent: "minecraft:item/generated",textures:{layer0:"kubejs:item/burger/bun_base"}},[])
addItem("kubejs:bun_top",{parent: "minecraft:item/generated",textures:{layer0:"kubejs:item/burger/bun_top"}},[])

addItem("kubejs:chicken_patty",{},[])
addItem("kubejs:vegetable_patty",{},[])

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
        let first_filling = fillings.pop()
        addBurgers({"patty": patty, "first_filling": first_filling})
        Object.keys(SAUCES).forEach(sauce => {
            // Register sauced patties with one filling
            addBurgers({"patty": patty, "sauce": sauce, "first_filling": first_filling})
        })
        if (fillings.length == 0) {
            break
        }
        fillings.forEach(second_filling => {
            // Register open burgers with two fillings
            addBurgers({"patty": patty, "first_filling": first_filling, "second_filling": second_filling})
            Object.keys(SAUCES).forEach(sauce => {
                // Register sauced patties with two fillings
                addBurgers({"patty": patty, "sauce": sauce, "first_filling": first_filling, "second_filling": second_filling})
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