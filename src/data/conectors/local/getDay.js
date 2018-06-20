function getDay(isoDate) {
  if (window.localStorage) {
    const match = isoDate.substring(0, 10);

    const result = window.localStorage.getItem(`day[${match}]`);

    if (result) {
      return Promise.resolve(JSON.parse(result));
    }
  }

  return Promise.resolve({ isoDate });
}

export default getDay;
