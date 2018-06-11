import { types, getParent } from "mobx-state-tree";

import EntryLine from "./EntryLine";

import extractEntryData from "../conectors/local/extractEntryData";

export const CALCULATION_INCOMPLETE = "CALCULATION_INCOMPLETE";
export const CALCULATION_COMPLETE = "CALCULATION_COMPLETE";

const Entry = types
  .model({
    description: types.maybe(types.string),

    dayDate: types.maybe(types.string),
    mealTime: types.maybe(types.string),

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
    updateEntryDescription(description) {
      const store = getParent(self, 1);
      const data = extractEntryData(description.toLowerCase());

      self.description = description;

      self.dayDate = data.dayDate;
      self.mealTime = data.mealTime;
      self.lines = data.lines;

      store.validateEntry(self);
    },
    addEntryDescription(description) {
      const store = getParent(self, 1);
      const data = extractEntryData(description.toLowerCase());

      self.description = self.description + "\n" + description;

      self.dayDate = data.dayDate || self.dayDate;
      self.mealTime = data.mealTime || self.mealTime;
      self.lines = [...self.lines, data.lines];

      store.validateEntry(self);
    },
    updateDay(dayDate) {
      self.dayDate = dayDate;
    }
  }));

export default Entry;

//mealStatus: types.maybe(types.string),
//mealInformation: types.maybe(types.string),

//mealDayStatus: types.maybe(types.string),
//mealDayInformation: types.maybe(types.string),

//mealTimeStatus: types.maybe(types.string),
// mealTimeInformation: types.maybe(types.string),
// energyKiloJoulesPerMeal: types.maybe(types.number),
// proteinGramsPerMeal: types.maybe(types.number),
// carbohydrateGramsPerMeal: types.maybe(types.number),
// sugarGramsPerMeal: types.maybe(types.number),
// starchGramsPerMeal: types.maybe(types.number),
// fatGramsPerMeal: types.maybe(types.number),
// saturatedFatGramsPerMeal: types.maybe(types.number),
// cholesterolGramsPerMeal: types.maybe(types.number),
// transFatGramsPerMeal: types.maybe(types.number),
// dietaryFibreGramsPerMeal: types.maybe(types.number),
// sodiumGramsPerMeal: types.maybe(types.number),
// alcoholGramsPerMeal: types.maybe(types.number)

// .actions(self => ({
//   updateDescription(description) {
//     self.description = description;

//     const data = extractEntryData(description.toLowerCase());

//     self.day = data.day;
//     self.time = data.time;
//     self.lines = data.lines;
//   }
// }));

// .actions(self => ({
//   updateMealSummary: flow(function* updateMealSummary() {
//     self.state = "pending";

//     try {
//       for (let i = 0; i < self.lines.length; i++) {
//         yield self.lines[i].fetchMatches();
//       }

//       self.state = "done";
//     } catch (error) {
//       // ... including try/catch error handling
//       console.error(`Failed to update summary`, error);

//       self.state = "error";
//     }
//   })
// }))

// .actions(self => ({
//   updateAllCalculations: flow(function* updateCalculations() {
//     self.state = "pending";

//     try {
//       for (let i = 0; i < self.lines.length; i++) {
//         yield self.lines[i].updateCalculations();
//       }

//       self.isNutritionComplete = false;

//       self.energyKiloJoulesPerMeal = 0;
//       self.proteinGramsPerMeal = 0;
//       self.carbohydrateGramsPerMeal = 0;
//       self.sugarGramsPerMeal = 0;
//       self.starchGramsPerMeal = 0;
//       self.fatGramsPerMeal = 0;
//       self.saturatedFatGramsPerMeal = 0;
//       self.cholesterolGramsPerMeal = 0;
//       self.transFatGramsPerMeal = 0;
//       self.dietaryFibreGramsPerMeal = 0;
//       self.sodiumGramsPerMeal = 0;
//       self.alcoholGramsPerMeal = 0;

//       self.lines.forEach(item => {
//         if (item.selectedFood) {
//           if (item.selectedFood.energyKiloJoulesPerEntry) {
//             self.energyKiloJoulesPerMeal +=
//               item.selectedFood.energyKiloJoulesPerEntry;

//             self.energyKiloCaloriesPerMeal = Math.round(
//               self.energyKiloJoulesPerMeal * 0.239006
//             );
//           }
//           if (item.selectedFood.proteinGramsPerEntry) {
//             self.proteinGramsPerMeal +=
//               item.selectedFood.proteinGramsPerEntry;
//           }
//           if (item.selectedFood.carbohydrateGramsPerEntry) {
//             self.carbohydrateGramsPerMeal +=
//               item.selectedFood.carbohydrateGramsPerEntry;
//           }
//           if (item.selectedFood.sugarGramsPerEntry) {
//             self.sugarGramsPerMeal += item.selectedFood.sugarGramsPerEntry;
//           }
//           if (item.selectedFood.starchGramsPerEntry) {
//             self.starchGramsPerMeal += item.selectedFood.starchGramsPerEntry;
//           }
//           if (item.selectedFood.fatGramsPerEntry) {
//             self.fatGramsPerMeal += item.selectedFood.fatGramsPerEntry;
//           }
//           if (item.selectedFood.saturatedFatGramsPerEntry) {
//             self.saturatedFatGramsPerMeal +=
//               item.selectedFood.saturatedFatGramsPerEntry;
//           }
//           if (item.selectedFood.cholesterolGramsPerEntry) {
//             self.cholesterolGramsPerMeal +=
//               item.selectedFood.cholesterolGramsPerEntry;
//           }
//           if (item.selectedFood.transFatGramsPerEntry) {
//             self.transFatGramsPerMeal +=
//               item.selectedFood.transFatGramsPerEntry;
//           }
//           if (item.selectedFood.dietaryFibreGramsPerEntry) {
//             self.dietaryFibreGramsPerMeal +=
//               item.selectedFood.dietaryFibreGramsPerEntry;
//           }
//           if (item.selectedFood.sodiumGramsPerEntry) {
//             self.sodiumGramsPerMeal += item.selectedFood.sodiumGramsPerEntry;
//           }
//           if (item.selectedFood.alcoholGramsPerEntry) {
//             self.alcoholGramsPerMeal +=
//               item.selectedFood.alcoholGramsPerEntry;
//           }
//         }
//       });

//       if (self.energyKiloCaloriesPerMeal > 0) {
//         self.mealTimeInformation = `${
//           self.energyKiloCaloriesPerMeal
//         } kilocalories`;
//       }

//       self.state = "done";
//     } catch (error) {
//       // ... including try/catch error handling
//       console.error(`Failed to update summary`, error);

//       self.state = "error";
//     }
//   })
// }))
