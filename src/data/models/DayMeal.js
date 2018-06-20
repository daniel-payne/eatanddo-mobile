import { types, getParent } from "mobx-state-tree";

import extractEntryData from "../conectors/local/extractEntryData";

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
  })
  .actions(self => ({
    addItems(description) {
      const data = extractEntryData(description.toLowerCase());

      data.lines.forEach(line => {
        self.items.unshift(DayMealItem.create(line));
      });

      self.day.store.validateDay(self);
    },
    removeLine(line) {
      self.lines.remove(line);
    },
    updateDay(dayDate) {
      self.dayDate = dayDate;
    },
    updateMealtime(mealtime) {
      self.mealtime = mealtime;
    }
  }));

export default DayMeal;
