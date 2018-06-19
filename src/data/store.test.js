import store from "./store";

function mockFetch(url, data) {
  return jest.fn().mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json: () => data
    });
  });
}

it("store is created", () => {
  expect(store).toBeDefined();
});

it("mock food is loaded", done => {
  window.fetch = mockFetch(null, [{ foodId: 1, foodName: "Food 1" }]);

  store.loadFood(1).then(() => {
    expect(store.foods.length).toBe(1);
    expect(window.fetch).toHaveBeenCalledTimes(1);

    done();
  });
});
