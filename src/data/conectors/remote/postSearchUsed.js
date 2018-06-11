function postSearchUsed(searchId, foodId, match) {
  localStorage.removeItem(`search[${match}]`);

  return fetch(
    `${
      process.env.REACT_APP_REST_ENDPOINT
    }/search/searchUsed?foodId=${foodId}&searchId=${searchId}`
  ).then(response => {
    if (response.status !== 200) {
      console.log("ERROR /search/foodnames: " + response.status);
      return;
    }

    return response.json();
  });
}

export default postSearchUsed;
