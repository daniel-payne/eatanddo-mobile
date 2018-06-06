import { types } from "mobx-state-tree";
import makeInspectable from "mobx-devtools-mst";

import Entry from "./Entry";
// import Day from "./Day";
// import Food from "./Food";
// import Search from "./Search";

const Store = types.model({
  entry: Entry

  // days: types.optional(types.array(Day), []),
  // foods: types.optional(types.array(Food), []),
  // searches: types.optional(types.array(Search), [])
});

// DEBUG CODE
const store = Store.create({
  entry: {
    mealDescription:
      "today's breakfast two eggs 35 grams of cheese 30g of tinned tuna half a tomato and 75g of fresh asparagus "
  }
});

export default makeInspectable(store);
