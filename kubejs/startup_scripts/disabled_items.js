/**
 * 
 * @param {String} id 
 */
function disable(id) {
    global.disabledItems.push(id)
}

/**
 * 
 * @param {String} category
 */
function disableFoodCategory(category) {
    disable(`/^farmersdelight:[a-z_]*${category}[a-z_]*$/`)
    disable(`/^expandeddelight:[a-z_]*${category}[a-z_]*$/`)
}

// Burgers
disable("farmersdelight:hamburger")

// Replaced Food Categories
disableFoodCategory("sandwich")
disableFoodCategory("juice")

// Sweet Berries
disableFoodCategory("sweet_berry")