import { types, getParent } from "mobx-state-tree";

import DayMeal from "./DayMeal";

export const CALCULATION_INCOMPLETE = "CALCULATION_INCOMPLETE";
export const CALCULATION_COMPLETE = "CALCULATION_COMPLETE";

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
      get calculationStatus() {
        return self.meals.reduce((result, item) => {
          if (
            result === CALCULATION_COMPLETE &&
            item.calculationStatus === CALCULATION_COMPLETE
          ) {
            return CALCULATION_COMPLETE;
          }
          return CALCULATION_INCOMPLETE;
        }, CALCULATION_COMPLETE);
      },

      nutritionPerDay(nutrition = "energyCalories") {
        return self.meals.reduce((total, meal) => {
          let value = meal.nutritionPerMeal(nutrition);

          if (!Number.isNaN(value)) {
            if (total === null) {
              return value;
            } else {
              return total + value;
            }
          }
          return total;
        }, null);
      },

      get store() {
        return getParent(self, 2);
      }
    };
  });

export default Day;
