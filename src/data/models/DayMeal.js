import { types, getParent } from "mobx-state-tree";

import DayMealItem from "./DayMealItem";

const DayMeal = types
  .model({
    mealtime: types.identifier(types.string),

    items: types.optional(types.array(DayMealItem), [])
  })
  .views(self => {
    return {
      get day() {
        return getParent(self, 2);
      },

      nutritionPerEntry(nutrition = "energyCalories") {
        return; //self[`${nutrition}PerEntry`];
      }
    };
  });

export default DayMeal;
