import { types, getParent } from "mobx-state-tree";

import DayMeal from "./DayMeal";

const Day = types
  .model({
    isoDate: types.identifier(types.string),

    meals: types.optional(types.array(DayMeal), [
      { mealtime: "BREAKFAST" },
      { mealtime: "LUNCH" },
      { mealtime: "DINNER" },
      { mealtime: "SNACKS" }
    ])
  })
  .views(self => {
    return {
      get store() {
        return getParent(self, 2);
      }
    };
  });

export default Day;
