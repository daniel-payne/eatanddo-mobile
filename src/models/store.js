import { types } from "mobx-state-tree";

import Meal from "./Meal";

const Store = types.model({
  meal: Meal
});

// DEBUG CODE
const store = Store.create({
  meal: {
    mealDescription:
      "today's breakfast two eggs 35 grams of cheese 30g of tinned tuna half a tomato and 75g of fresh asparagus "
  }
});

export default store;
