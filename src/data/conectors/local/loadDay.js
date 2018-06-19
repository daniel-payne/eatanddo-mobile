function loadDay(isoDate) {
  if (window.localStorage) {
    const result = window.localStorage.getItem(`day[${isoDate}]`);

    if (result) {
      return Promise.resolve(JSON.parse(result));
    }
  }

  return Promise.resolve({ isoDate });
}

export default loadDay;
