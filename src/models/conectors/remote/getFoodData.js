function getFoodMatches(foodID, amount, unit) {
  return fetch(
    `http://192.168.1.67:1337/search/foodCalculations?foodID=${foodID}&amount=${amount}&unitName=${unit}`
  )
    .then(response => {
      if (response.status !== 200) {
        console.log("ERROR /search/foodCalculations:" + response.status);
        return;
      }

      return response.json();
    })
    .then(data => {
      if (data.length === 1) {
        const item = data[0];
        return {
          foodId: +item.foodId,

          amountDescription: item.amountDescription,
          foodName: item.foodName,
          baselineDescription: item.baselineDescription,

          energyKiloJoulesPerEntry: +item.energyKiloJoulesPerEntry,
          proteinGramsPerEntry: +item.proteinGramsPerEntry,
          carbohydrateGramsPerEntry: +item.carbohydrateGramsPerEntry,
          sugarGramsPerEntry: +item.sugarGramsPerEntry,
          starchGramsPerEntry: +item.starchGramsPerEntry,
          fatGramsPerEntry: +item.fatGramsPerEntry,
          saturatedFatGramsPerEntry: +item.saturatedFatGramsPerEntry,
          cholesterolGramsPerEntry: +item.cholesterolGramsPerEntry,
          transFatGramsPerEntry: +item.transFatGramsPerEntry,
          dietaryFibreGramsPerEntry: +item.dietaryFibreGramsPerEntry,
          sodiumGramsPerEntry: +item.sodiumGramsPerEntry,
          alcoholGramsPerEntry: +item.alcoholGramsPerEntry,

          energyKiloJoulesPerBaseline: +item.energyKiloJoulesPerBaseline,
          proteinGramsPerBaseline: +item.proteinGramsPerBaseline,
          carbohydrateGramsPerBaseline: +item.carbohydrateGramsPerBaseline,
          sugarGramsPerBaseline: +item.sugarGramsPerBaseline,
          starchGramsPerBaseline: +item.starchGramsPerBaseline,
          fatGramsPerBaseline: +item.fatGramsPerBaseline,
          saturatedFatGramsPerBaseline: +item.saturatedFatGramsPerBaseline,
          cholesterolGramsPerBaseline: +item.cholesterolGramsPerBaseline,
          transFatGramsPerBaseline: +item.transFatGramsPerBaseline,
          dietaryFibreGramsPerBaseline: +item.dietaryFibreGramsPerBaseline,
          sodiumGramsPerBaseline: +item.sodiumGramsPerBaseline,
          alcoholGramsPerBaseline: +item.alcoholGramsPerBaseline
        };
      }
    });
}

export default getFoodMatches;
