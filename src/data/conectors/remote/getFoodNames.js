function getFoodNames(match, count = 10, useCache = true) {
  if (useCache === true && window.localStorage) {
    const result = window.localStorage.getItem(`search[${match}]`);

    if (result) {
      return Promise.resolve(JSON.parse(result));
    }
  }

  return fetch(
    `${
      process.env.REACT_APP_REST_ENDPOINT
    }/search/foodnames?match=${match}&count=${count}`
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
        return {
          foodId: +item.foodId,
          foodName: item.foodName,

          searchId: +item.searchId,

          sourceName: item.sourceName
        };
      });
    })
    .then(result => {
      if (window.localStorage && result) {
        window.localStorage.setItem(`search[${match}]`, JSON.stringify(result));
      }

      return result;
    });
}

export default getFoodNames;
