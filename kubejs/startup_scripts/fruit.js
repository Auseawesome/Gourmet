// Load Helpers
let { langHelper, queueFluid, queueItem, queueLang, queueRecipe, queueTag } = global;

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
    queueFluid.basic(`kubejs:${fruit}_juice`, "thin", color)
    queueItem.basic(`kubejs:${fruit}_juice_bottle`)
    queueRecipe.automatableJuicing({
        "id": `kubejs:${fruit}_juice`,
        "container": "minecraft:glass_bottle",
        "output": `kubejs:${fruit}_juice_bottle`,
        "outputFluid": `kubejs:${fruit}_juice`,
        "primary": id,
        "secondary": "minecraft:sugar"
    })
    queueRecipe.bottleFluid(`kubejs:${fruit}_juice`,`kubejs:${fruit}_juice_bottle`)

    // Register Jelly
    queueFluid.basic(`kubejs:${fruit}_jelly`, "thick", color)
    queueItem.basic(`kubejs:${fruit}_jelly_bottle`)
    // Add recipe for simmering jelly from juice, fruit and extra sugar
    queueRecipe.bottleFluid(`kubejs:${fruit}_jelly`,`kubejs:${fruit}_jelly_bottle`)

    queueLang.renameEnglish("fluid", {
        "en_us": `${langHelper.dialectOrUS(lang, "en_us")} Jelly`,
        "en_au": `${langHelper.dialectOrUS(lang, "en_au")} Jam`,
        "en_ca": `${langHelper.dialectOrUS(lang, "en_ca")} Jelly`,
        "en_gb": `${langHelper.dialectOrUS(lang, "en_gb")} Jam`,
        "en_nz": `${langHelper.dialectOrUS(lang, "en_nz")} Jam`,
    },`kubejs:${fruit}_jelly`)

    queueLang.renameEnglish("item", {
        "en_us": `${langHelper.dialectOrUS(lang, "en_us")} Jelly Bottle`,
        "en_au": `${langHelper.dialectOrUS(lang, "en_au")} Jam Bottle`,
        "en_ca": `${langHelper.dialectOrUS(lang, "en_ca")} Jelly Bottle`,
        "en_gb": `${langHelper.dialectOrUS(lang, "en_gb")} Jam Bottle`,
        "en_nz": `${langHelper.dialectOrUS(lang, "en_nz")} Jam Bottle`,
    },`kubejs:${fruit}_jelly_bottle`)
})