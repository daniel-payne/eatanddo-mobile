function setDay(day) {
  if (window.localStorage) {
    const isoDate = day.isoDate.substring(0, 10);

    window.localStorage.setItem(
      `day[${isoDate}]`,
      JSON.stringify(day.toJSON())
    );

    return Promise.resolve(true);
  }

  return Promise.resolve(false);
}

export default setDay;
