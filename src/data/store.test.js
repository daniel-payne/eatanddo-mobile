import store from "./store";

it("store is created", () => {
  expect(store).toBeDefined();
});

it("entry is created", () => {
  expect(store.entry).toBeDefined();
});
