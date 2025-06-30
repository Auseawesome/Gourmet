// priority: 0

function withChance(item, chance, count) {
    if (count == undefined) {
        count = 1;
    }
    return {
        item: item,
        count: count,
        chance: chance,
    }
}

// Custom function to replicate Object.fromEntries()
function fromEntries(entries) {
  var result = {};
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var key = entry[0];
    var value = entry[1];
    result[key] = value;
  }
  return result;
}

const basicRecipe = (type) => (output, input) => {
  const result = {
    type: 'create:'+type,
    ingredients: jsonArray(input),
    results: jsonArray(output, true),
  }
  return result;
};

const jsonArray = (items, isOutput) => {
  if (!Array.isArray(items)) items = [items];
  let result = [];
  items.forEach((element) => {
    if (typeof element == "string") {
      if(isOutput) {
        element = Item.of(element)
      } else {
        element = Ingredient.of(element)
      }
    }
    if (typeof element == "object" && "fluid" in element && "toJson" in element && isOutput) {
      // If the element is a fluid and not already a JSON object, convert it to JSON
      element = Fluid.of(element, element.amount).toJson();
    }
    if (typeof element == "object" && "fluid" in element && "toJson" in element && !isOutput) {
        element = {
          fluid: element.id,
          amount: element.amount,
          type: "fluid_stack",
        }
    }
    if (typeof element == "object" && "toJson" in element) {
      element = element.toJson();
    }
    if (typeof element == "object" && "fluid" in element && !("toJson" in element) && isOutput) {
      // If the element is a fluid and not already a JSON object, convert it to a JSON fluid_stack
      element = Fluid.of(element).toJson();
      element = {
        id: element.fluid,
        amount: element.amount,
        type: "fluid_stack",
      }
    }
    if (typeof element == "object" && "id" in element && !isOutput) {
      // rename the key "id" to "item" if it exists
      element.item = element.id;
      delete element.id;
    }
    if (typeof element == "object" && "item" in element && isOutput) {
      // rename the key "item" to "id" if it exists
      element.id = element.item;
      delete element.item;
    }
    if (!isOutput && typeof element == "object" && "count" in element) {
      // delete the key "count" if it exists
      delete element.count;
    }
    if (typeof element == "object" && "chance" in element) {
      // Ensure the "chance" property is preserved
      element.chance = element.chance;
    }
    result.push(element);
  });
  return result;
};

const create = {
  compacting: basicRecipe("compacting"),
  crushing: basicRecipe("crushing"),
  cutting: basicRecipe("cutting"),
  deploying: basicRecipe("deploying"),
  emptying: basicRecipe("emptying"),
  filling: basicRecipe("filling"),
  haunting: basicRecipe("haunting"),
  item_application: basicRecipe("item_application"),
  mechanical_crafting: (output, pattern, key) => ({
    accept_mirrored: true,
    type: "create:mechanical_crafting",
    result: jsonArray(output, true)[0],
    pattern: pattern,
    key: /*Object.*/ fromEntries(
      Object.entries(key).map(([k, v]) => [k, Ingredient.of(v).toJson()])
    ),
  }),
  milling: basicRecipe("milling"),
  mixing: basicRecipe("mixing"),
  pressing: basicRecipe("pressing"),
  sandpaper_polishing: basicRecipe("sandpaper_polishing"),
  sequenced_assembly: (output, input, recipes) => {
    let sequence = recipes.map((recipe) => {
      // Mark each component recipe as intermediate so they don't get registered
      return recipe.markAsIntermediate();
    });
    // Then, create the sequenced assembly recipe
    return {
      type: "create:sequenced_assembly",
      ingredient: Ingredient.of(input).toJson(),
      results: jsonArray(output, true),
      sequence: sequence.map((r) => r.markAsIntermediate().getRecipe()), // Assuming we need to pass the recipe objects here
      loops: 1,
      transitional_item: Ingredient.of(input).toJson(),
    };
  },
  splashing: basicRecipe("splashing"),
};

let pendingRecipes = [];

function createRecipeWrapper(recipeJson) {
  // let recipe = Utils.copy(recipeJson);
  let recipe = Object.assign({}, recipeJson); // Use Object.assign to copy the object
  let customId = null; // Placeholder for the generated ID
  let shouldBeRegistered = true; // Only register if not marked as intermediate

  // Method modifications, keeping them chained but not immediately finalizing
  const methods = {
    acceptMirrored: function (value) {
      recipe.accept_mirrored = value ?? true;
      return this;
    },
    category: function (category) {
      recipe.category = category;
      return this;
    },
    getRecipe() {
      return recipe;
    },
    heated: function () {
      recipe.heat_requirement = "heated";
      return this;
    },
    id: function (id) {
      customId = id;
      return this;
    },
    keepHeldItem: function (value) {
      recipe.keep_held_item = value ?? true;
      return this;
    },
    loops: function (value) {
      recipe.loops = value;
      return this;
    },
    markAsIntermediate: function () {
      shouldBeRegistered = false;
      return this;
    },
    processingTime: function (processingTime) {
      recipe.processing_time = processingTime;
      return this;
    },
    superheated: function () {
      recipe.heat_requirement = "superheated";
      return this;
    },
    transitionalItem: function (item) {
      recipe.transitional_item = Item.of(item).toJson();
      return this;
    },
    register: function () {
      pendingRecipes.push({
        recipe: recipe,
        finalize: (event) => {
          if (shouldBeRegistered) {
            let registeredRecipe = event.custom(recipe);
            if (customId != null) {
              registeredRecipe.id(customId);
            }
            return registeredRecipe;
          }
        },
      });
    },
  };

  // Immediately register the recipe for eventual finalization
  methods.register();

  return methods;
}

function addCreateRecipeHandler(event) {
  event.recipes.create = {};
  Object.keys(create).forEach((type) => {
    event.recipes.create[type] = function () {
      let args = Array.prototype.slice.call(arguments);
      let recipeJson = create[type].apply(null, args);
      return createRecipeWrapper(recipeJson, event);
    };
    if (Utils.snakeCaseToCamelCase(type) != type)
      event.recipes.create[Utils.snakeCaseToCamelCase(type)] =
        event.recipes.create[type];
    event.recipes[
      `create${Utils.snakeCaseToTitleCase(type)}`.replace(" ", "")
    ] = event.recipes.create[type];
  });

  // Introduce a method to finalize all pending recipes
  event.recipes.create.finalize = function () {
    pendingRecipes.forEach((pending) => pending.finalize(event));
    pendingRecipes = []; // Clear the pending list after finalization
  };
}
