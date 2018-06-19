import fetch from "node-fetch";

import store from "./store";

window.fetch = fetch;
process.env.REACT_APP_REST_ENDPOINT = "http://localhost:1337";

it("store is created", () => {
  expect(store).toBeDefined();
});

it("food is loaded", done => {
  store.loadFood(1).then(() => {
    expect(store.foods.length).toBe(1);

    done();
  });
});

it("search is loaded", done => {
  store.loadSearch("pork pie").then(() => {
    expect(store.searches.length).toBe(1);

    done();
  });
});

it("diary is loaded", done => {
  const isoDate = new Date().toISOString();

  store
    .loadDiary(isoDate)
    .then(() => {
      expect(store.days.length).toBe(1);
      expect(store.days[0].meals.length).toBe(4);

      expect(store.display.selectedDay).toBeDefined();
      expect(store.display.selectedMeal).toBeDefined();

      expect(store.display.selectedMeal.mealtime).toBe("BREAKFAST");
    })
    .then(() => {
      store.loadDiary(isoDate, "LUNCH").then(() => {
        expect(store.days[0].meals.length).toBe(4);

        expect(store.display.selectedMeal.mealtime).toBe("LUNCH");

        done();
      });
    });
});
