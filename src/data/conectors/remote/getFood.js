function getFood(foodId, useCache = true) {
  if (useCache === true && window.localStorage) {
    const result = localStorage.getItem(`food[${foodId}]`);

    if (result) {
      return Promise.resolve(JSON.parse(result));
    }
  }

  return fetch(
    `${process.env.REACT_APP_REST_ENDPOINT}/search/foods?ids=${foodId}`
  )
    .then(response => {
      if (response.status !== 200) {
        console.log("ERROR /search/foodnames: " + response.status);
        return;
      }

      return response.json();
    })
    .then(data => {
      return data.map(item => {
        COERSE_TO_NUMBER.forEach(field => {
          if (item[field]) {
            item[field] = +item[field];
          }
        });

        COERCE_TO_BOOLEAN.forEach(field => {
          if (item[field]) {
            item[field] = !!item[field];
          }
        });

        return item;
      });
    })
    .then(result => {
      const item = result.length === 1 ? result[0] : null;

      if (localStorage && item) {
        localStorage.setItem(`food[${foodId}]`, JSON.stringify(item));
      }

      return item;
    });
}

const COERSE_TO_NUMBER = [
  "foodId",
  "energyCaloriesPer100g",
  "energyKiloJoulesPer100g",
  "proteinGramsPer100g",
  "carbohydrateGramsPer100g",
  "sugarGramsPer100g",
  "starchGramsPer100g",
  "fatGramsPer100g",
  "saturatedFatGramsPer100g",
  "unsaturatedFatGramsPer100g",
  "cholesterolGramsPer100g",
  "transFatGramsPer100g",
  "dietaryFibreGramsPer100g",
  "solubleFibreGramsPer100g",
  "insolubleFibreGramsPer100g",
  "saltGramsPer100g",
  "sodiumGramsPer100g",
  "alcoholGramsPer100g",

  "energyCaloriesPer100ml",
  "energyKiloJoulesPer100ml",
  "proteinGramsPer100ml",
  "carbohydrateGramsPer100ml",
  "sugarGramsPer100ml",
  "starchGramsPer100ml",
  "fatGramsPer100ml",
  "saturatedFatGramsPer100ml",
  "unsaturatedFatGramsPer100ml",
  "cholesterolGramsPer100ml",
  "transFatGramsPer100ml",
  "dietaryFibreGramsPer100ml",
  "solubleFibreGramsPer100ml",
  "insolubleFibreGramsPer100ml",
  "saltGramsPer100ml",
  "sodiumGramsPer100ml",
  "alcoholGramsPer100ml",

  "energyCaloriesPerPortion",
  "energyKiloJoulesPerPortion",
  "proteinGramsPerPortion",
  "carbohydrateGramsPerPortion",
  "sugarGramsPerPortion",
  "starchGramsPerPortion",
  "fatGramsPerPortion",
  "saturatedFatGramsPerPortion",
  "unsaturatedFatGramsPerPortion",
  "cholesterolGramsPerPortion",
  "transFatGramsPerPortion",
  "dietaryFibreGramsPerPortion",
  "solubleFibreGramsPerPortion",
  "insolubleFibreGramsPerPortion",
  "saltGramsPerPortion",
  "sodiumGramsPerPortion",
  "alcoholGramsPerPortion"
];

const COERCE_TO_BOOLEAN = [
  "hasNutritionWeightInformation",
  "hasNutritionVolumeInformation",
  "hasNutritionServingInformation",
  "hasNutritionPortionInformation"
];

export default getFood;
