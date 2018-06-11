import { types, flow } from "mobx-state-tree";
import makeInspectable from "mobx-devtools-mst";

import Entry from "./models/Entry";
import Food from "./models/Food";
import Search from "./models/Search";
import Display from "./models/Display";

import getFoodNames from "./conectors/remote/getFoodNames";
import getFood from "./conectors/remote/getFood";

const Store = types
  .model({
    entry: types.optional(Entry, Entry.create({})),

    // days: types.optional(types.map(Day), []),
    foods: types.optional(types.array(Food), []),
    searches: types.optional(types.array(Search), []),

    display: types.optional(Display, {})
  })
  .actions(self => ({
    validateEntry: flow(function* validateEntry(entry) {
      for (let i = 0; i < self.entry.lines.length; i++) {
        const line = self.entry.lines[i];

        yield line.chooseMatch(line.selectedMatch);
      }
    }),
    loadSearch: flow(function* loadSearch(match) {
      let search = self.searches.find(item => item.text === match);

      if (!search) {
        const data = yield getFoodNames(match);

        search = Search.create({ text: match, matches: data });

        self.searches.push(search);
      }

      return search;
    }),
    loadFood: flow(function* loadFood(foodId) {
      let food = self.foods.find(item => item.fooId === foodId);

      if (!food) {
        const data = yield getFood(foodId);

        food = Food.create(data);

        self.foods.push(food);
      }

      return food;
    })
  }));

// DEBUG CODE
const store = Store.create({});

export default makeInspectable(store);
