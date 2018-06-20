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
      }
    };
  })
  .views(self => {
    const calculateTotalFor = (item, name) => {
      if (item.quantity && item.selectedFood) {
        return (item.quantity * item.selectedFood[name]) / 100;
      }
    };
    const calculateSummaryFor = (items, name) => {
      return items.reduce((total, item) => {
        if (item.quantity && item.selectedFood) {
          total += calculateTotalFor(item, name);
        }
        return total;
      }, 0);
    };

    return {
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

      nutritionPerEntry(nutrition = "energyCalories") {
        return self[`${nutrition}PerEntry`];
      },

      get energyCaloriesPerEntry() {
        return calculateSummaryFor(self.items, "energyCaloriesPer100g");
      },
      get energyKiloJoulesPerEntry() {
        return calculateSummaryFor(self.items, "energyKiloJoulesPer100g");
      },
      get proteinGramsPerEntry() {
        return calculateSummaryFor(self.items, "proteinGramsPer100g");
      },
      get carbohydrateGramsPerEntry() {
        return calculateSummaryFor(self.items, "carbohydrateGramsPer100g");
      },
      get sugarGramsPerEntry() {
        return calculateSummaryFor(self.items, "sugarGramsPer100g");
      },
      get starchGramsPerEntry() {
        return calculateSummaryFor(self.items, "starchGramsPer100g");
      },
      get fatGramsPerEntry() {
        return calculateSummaryFor(self.items, "fatGramsPer100g");
      },
      get saturatedFatGramsPerEntry() {
        return calculateSummaryFor(self.items, "saturatedFatGramsPer100g");
      },
      get unsaturatedFatGramsPerEntry() {
        return calculateSummaryFor(self.items, "unsaturatedFatGramsPer100g");
      },
      get cholesterolGramsPerEntry() {
        return calculateSummaryFor(self.items, "cholesterolGramsPer100g");
      },
      get transFatGramsPerEntry() {
        return calculateSummaryFor(self.items, "transFatGramsPer100g");
      },
      get dietaryFibreGramsPerEntry() {
        return calculateSummaryFor(self.items, "dietaryFibreGramsPer100g");
      },
      get solubleFibreGramsPerEntry() {
        return calculateSummaryFor(self.items, "solubleFibreGramsPer100g");
      },
      get insolubleFibreGramsPerEntry() {
        return calculateSummaryFor(self.items, "insolubleFibreGramsPer100g");
      },
      get saltGramsPerEntry() {
        return calculateSummaryFor(self.items, "saltGramsPer100g");
      },
      get sodiumGramsPerEntry() {
        return calculateSummaryFor(self.items, "sodiumGramsPer100g");
      },
      get alcoholGramsPerEntry() {
        return calculateSummaryFor(self.items, "alcoholGramsPer100g");
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
