import { types, getParent } from "mobx-state-tree";

import extractEntryData from "../conectors/local/extractEntryData";

import DayMealItem from "./DayMealItem";

export const CALCULATION_INCOMPLETE = "CALCULATION_INCOMPLETE";
export const CALCULATION_COMPLETE = "CALCULATION_COMPLETE";

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

      get calculationStatus() {
        return self.items.reduce((result, item) => {
          if (
            result === CALCULATION_COMPLETE &&
            item.calculationStatus === CALCULATION_COMPLETE
          ) {
            return CALCULATION_COMPLETE;
          }
          return CALCULATION_INCOMPLETE;
        }, CALCULATION_COMPLETE);
      },

      nutritionPerMeal(nutrition = "energyCalories") {
        return self.items.reduce((total, item) => {
          let value = item[`${nutrition}PerItem`];

          if (!Number.isNaN(value)) {
            if (total === null) {
              return value;
            } else {
              return total + value;
            }
          }

          return null;
        }, null);
      }
    };
  })
  .actions(self => ({
    addItems(description) {
      const data = extractEntryData(description.toLowerCase());

      data.lines.forEach(line => {
        self.items.unshift(DayMealItem.create(line));
      });

      self.day.store.validateDay(self.day);
    },
    removeItem(item) {
      const day = self.day;
      const store = day.store;

      self.items.remove(item);

      store.storeDay(day);
    }
  }));

export default DayMeal;
