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

      get energyCaloriesPerEntry() {
        return calculateSummaryFor(self.lines, "energyCaloriesPer100g");
      },
      get energyKiloJoulesPerEntry() {
        return calculateSummaryFor(self.lines, "energyKiloJoulesPer100g");
      },
      get proteinGramsPerEntry() {
        return calculateSummaryFor(self.lines, "proteinPer100g");
      },
      get carbohydrateGramsPerEntry() {
        return calculateSummaryFor(self.lines, "carbohydratePer100g");
      },
      get sugarGramsPerEntry() {
        return calculateSummaryFor(self.lines, "sugarPer100g");
      },
      get starchGramsPerEntry() {
        return calculateSummaryFor(self.lines, "starchPer100g");
      },
      get fatGramsPerEntry() {
        return calculateSummaryFor(self.lines, "fatPer100g");
      },
      get saturatedFatGramsPerEntry() {
        return calculateSummaryFor(self.lines, "saturatedFatPer100g");
      },
      get unsaturatedFatGramsPerEntry() {
        return calculateSummaryFor(self.lines, "unsaturatedFatPer100g");
      },
      get cholesterolGramsPerEntry() {
        return calculateSummaryFor(self.lines, "cholesterolGramsPer100g");
      },
      get transFatGramsPerEntry() {
        return calculateSummaryFor(self.lines, "transFatPer100g");
      },
      get dietaryFibreGramsPerEntry() {
        return calculateSummaryFor(self.lines, "dietaryFibrePer100g");
      },
      get solubleFibreGramsPerEntry() {
        return calculateSummaryFor(self.lines, "solubleFibrePer100g");
      },
      get insolubleFibreGramsPerEntry() {
        return calculateSummaryFor(self.lines, "insolubleFibrePer100g");
      },
      get saltGramsPerEntry() {
        return calculateSummaryFor(self.lines, "saltPer100g");
      },
      get sodiumGramsPerEntry() {
        return calculateSummaryFor(self.lines, "sodiumPer100g");
      },
      get alcoholGramsPerEntry() {
        return calculateSummaryFor(self.lines, "alcoholPer100g");
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
