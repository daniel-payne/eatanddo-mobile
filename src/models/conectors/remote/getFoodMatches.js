function getFoodMatches(searchFor) {
  return fetch(`http://192.168.1.67:1337/search/foodnames?match=${searchFor}`)
    .then(response => {
      if (response.status !== 200) {
        console.log("ERROR /search/foodnames: " + response.status);
        return;
      }

      return response.json();
    })
    .then(data => {
      return data.map(item => {
        return {
          foodId: +item.foodId,
          foodName: item.foodName,

          brandName: item.brandName,
          sourceName: item.sourceName,
          servingUnitName: item.servingUnitName,

          hasNutritionWeightInformation: !!item.hasNutritionWeightInformation,
          hasNutritionVolumeInformation: !!item.hasNutritionVolumeInformation,
          hasNutritionServingInformation: !!item.hasNutritionServingInformation,
          hasNutritionPortionInformation: !!item.hasNutritionPortionInformation
        };
      });
    });
}

export default getFoodMatches;
