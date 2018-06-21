function getVersion() {
  return fetch(`${process.env.REACT_APP_REST_ENDPOINT}/version`).then(
    response => {
      if (response.status !== 200) {
        console.log("ERROR /search/foodnames: " + response.status);
        return;
      }

      return response.json();
    }
  );
}

export default getVersion;
