// Load Helpers
let { langHelper, queueFluid, queueItem, queueLang, queueModel, queueRecipe, queueTag } = global;

const FRUIT = {
    "apple": {
        "id": "minecraft:apple",
        "color": 0xFFDD33,
        "lang": {
            "en_us": "Apple"
        }
    },
    "melon": {
        "id": "minecraft:melon_slice",
        "color": 0xFF9999,
        "lang": {
            "en_us": "Melon"
        }
    },
    "lingonberry": {
        "id": "minecraft:sweet_berries",
        "color": 0xDD6666,
        "lang": {
            "en_us": "Lingonberry"
        }
    },
    "glowberry": {
        "id": "minecraft:glow_berries",
        "color": 0xFFEE66,
        "lang": {
            "en_us": "Glow Berry"
        }
    },
    "cranberry": {
        "id": "expandeddelight:cranberries",
        "color": 0xAA0000,
        "lang": {
            "en_us": "Cranberry"
        }
    },
}

Object.keys(FRUIT).forEach(fruit => {
    let { id, color, lang } = FRUIT[fruit]

    // Register Juice
    let juiceId = FRUIT[fruit].juiceId = `kubejs:${fruit}_juice`
    let juiceItemId = FRUIT[fruit].juiceItemId = `kubejs:${fruit}_juice_jug`

    queueFluid.basic(juiceId, "thin", color)
    queueItem.basic(juiceItemId)
    queueModel.texture(juiceItemId,`kubejs:item/fruit/juice/${fruit}_juice_jug`)
    queueTag.addTagToItem("create:upright_on_belt", juiceItemId)
    queueRecipe.automatableJuicing({
        "id": juiceId,
        "container": "minecraft:glass_bottle",
        "result": juiceItemId,
        "fluidResult": [juiceId, 250],
        "primary": id,
        "secondary": "minecraft:sugar"
    })
    queueRecipe.bottleFluid(juiceId, juiceItemId)

    // Register Jelly
    let jellyId = FRUIT[fruit].jellyId = `kubejs:${fruit}_jelly`
    let jellyItemId = FRUIT[fruit].jellyItemId = `kubejs:${fruit}_jelly_jar`

    queueFluid.basic(jellyId, "thick", color)
    queueItem.basic(jellyItemId)
    queueModel.texture(jellyItemId,`kubejs:item/fruit/jelly/${fruit}_jelly_jar`)
    queueTag.addTagToItem("create:upright_on_belt", jellyItemId)
    queueRecipe.automatableCooking({
        "id": jellyId,
        "container": "minecraft:glass_bottle",
        "result": jellyItemId,
        "fluidResult": [jellyId, 250],
        "ingredients": [
            id,
            "minecraft:sugar",
            "minecraft:sugar"
        ]
    })
    queueRecipe.bottleFluid(jellyId, jellyItemId)

    // Add Jelly/Jam Translations
    queueLang.renameEnglish("fluid", {
        "en_us": `${langHelper.dialectOrUS(lang, "en_us")} Jelly`,
        "en_au": `${langHelper.dialectOrUS(lang, "en_au")} Jam`,
        "en_ca": `${langHelper.dialectOrUS(lang, "en_ca")} Jelly`,
        "en_gb": `${langHelper.dialectOrUS(lang, "en_gb")} Jam`,
        "en_nz": `${langHelper.dialectOrUS(lang, "en_nz")} Jam`,
    }, jellyId)

    queueLang.renameEnglish("item", {
        "en_us": `${langHelper.dialectOrUS(lang, "en_us")} Jelly Jar`,
        "en_au": `${langHelper.dialectOrUS(lang, "en_au")} Jam Jar`,
        "en_ca": `${langHelper.dialectOrUS(lang, "en_ca")} Jelly Jar`,
        "en_gb": `${langHelper.dialectOrUS(lang, "en_gb")} Jam Jar`,
        "en_nz": `${langHelper.dialectOrUS(lang, "en_nz")} Jam Jar`,
    }, jellyItemId)
})