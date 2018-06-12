import { types, getParent } from "mobx-state-tree";

import EntryLine from "./EntryLine";

import extractEntryData from "../conectors/local/extractEntryData";

export const CALCULATION_INCOMPLETE = "CALCULATION_INCOMPLETE";
export const CALCULATION_COMPLETE = "CALCULATION_COMPLETE";

const Entry = types
  .model({
    dayDate: types.maybe(types.string),
    mealtime: types.maybe(types.string),

    lines: types.optional(types.array(EntryLine), [])
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
        return self.lines.reduce((result, item) => {
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
        return calculateSummaryFor(self.lines, "energyCaloriesPer100g");
      },
      get energyKiloJoulesPerEntry() {
        return calculateSummaryFor(self.lines, "energyKiloJoulesPer100g");
      },
      get proteinGramsPerEntry() {
        return calculateSummaryFor(self.lines, "proteinGramsPer100g");
      },
      get carbohydrateGramsPerEntry() {
        return calculateSummaryFor(self.lines, "carbohydrateGramsPer100g");
      },
      get sugarGramsPerEntry() {
        return calculateSummaryFor(self.lines, "sugarGramsPer100g");
      },
      get starchGramsPerEntry() {
        return calculateSummaryFor(self.lines, "starchGramsPer100g");
      },
      get fatGramsPerEntry() {
        return calculateSummaryFor(self.lines, "fatGramsPer100g");
      },
      get saturatedFatGramsPerEntry() {
        return calculateSummaryFor(self.lines, "saturatedFatGramsPer100g");
      },
      get unsaturatedFatGramsPerEntry() {
        return calculateSummaryFor(self.lines, "unsaturatedFatGramsPer100g");
      },
      get cholesterolGramsPerEntry() {
        return calculateSummaryFor(self.lines, "cholesterolGramsPer100g");
      },
      get transFatGramsPerEntry() {
        return calculateSummaryFor(self.lines, "transFatGramsPer100g");
      },
      get dietaryFibreGramsPerEntry() {
        return calculateSummaryFor(self.lines, "dietaryFibreGramsPer100g");
      },
      get solubleFibreGramsPerEntry() {
        return calculateSummaryFor(self.lines, "solubleFibreGramsPer100g");
      },
      get insolubleFibreGramsPerEntry() {
        return calculateSummaryFor(self.lines, "insolubleFibreGramsPer100g");
      },
      get saltGramsPerEntry() {
        return calculateSummaryFor(self.lines, "saltGramsPer100g");
      },
      get sodiumGramsPerEntry() {
        return calculateSummaryFor(self.lines, "sodiumGramsPer100g");
      },
      get alcoholGramsPerEntry() {
        return calculateSummaryFor(self.lines, "alcoholGramsPer100g");
      }
    };
  })
  .actions(self => ({
    addEntryDescription(description) {
      const store = getParent(self, 1);
      const data = extractEntryData(description.toLowerCase());

      self.dayDate = data.dayDate || self.dayDate;
      self.mealtime = data.mealtime || self.mealtime;

      self.lines = self.lines ? [...self.lines, ...data.lines] : data.lines;

      store.validateEntry(self);
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

export default Entry;
