// priority: 1000

global.stringHelper = {}

/**
 * Makes the first letter of a string a capital
 * @param {String} string 
 * @returns {String}
 */
global.stringHelper.capitalize = (string) => {
    return string.slice(0,1).toUpperCase() + string.slice(1,string.length)
}

/**
 * Returns the namespace of an id
 * @param {String} id 
 * @returns {String}
 */
global.stringHelper.getNamespace = (id) => {
    return id.split(":")[0]
}

/**
 * Returns the id without the namespace
 * @param {String} id 
 * @returns {String}
 */
global.stringHelper.removeNamespace = (id) => {
    return id.split(":")[1]
}