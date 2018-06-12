import { types, flow, getParent } from "mobx-state-tree";

import Search from "./Search";
import Match from "./SearchMatch";
import Food from "./Food";

import postSearchUsed from "../conectors/remote/postSearchUsed";

export const CALCULATION_INCOMPLETE = "CALCULATION_INCOMPLETE";
export const CALCULATION_COMPLETE = "CALCULATION_COMPLETE";

const EntryLine = types
  .model({
    text: types.string,

    quantity: types.maybe(types.number),
    unit: types.maybe(types.string),
    foodName: types.maybe(types.string),

    additionalText: types.maybe(types.string),
    alternativeFoodName: types.maybe(types.string),

    search: types.maybe(types.reference(Search)),

    selectedMatch: types.maybe(types.reference(Match)),
    selectedFood: types.maybe(types.reference(Food))

    // mealItemStatus: types.maybe(types.string),
    // mealItemInformation: types.maybe(types.string),

    // mealItemQuantityStatus: types.maybe(types.string),
    // mealItemSearchStatus: types.maybe(types.string)
  })
  .views(self => {
    const calculateTotalFor = name => {
      if (self.quantity && self.selectedFood) {
        return (self.quantity * self.selectedFood[name]) / 100;
      }
    };

    return {
      get calculationStatus() {
        let status = CALCULATION_INCOMPLETE;

        if (self.quantity > 0 && self.unit && self.selectedFood) {
          status = CALCULATION_COMPLETE;
        }

        return status;
      },

      get energyCaloriesPerLine() {
        return calculateTotalFor("energyCaloriesPer100g");
      },
      get energyKiloJoulesPerLine() {
        return calculateTotalFor("energyKiloJoulesPer100g");
      },
      get proteinGramsPerLine() {
        return calculateTotalFor("proteinPer100g");
      },
      get carbohydrateGramsPerLine() {
        return calculateTotalFor("carbohydratePer100g");
      },
      get sugarGramsPerLine() {
        return calculateTotalFor("sugarPer100g");
      },
      get starchGramsPerLine() {
        return calculateTotalFor("starchPer100g");
      },
      get fatGramsPerLine() {
        return calculateTotalFor("fatPer100g");
      },
      get saturatedFatGramsPerLine() {
        return calculateTotalFor("saturatedFatPer100g");
      },
      get unsaturatedFatGramsPerLine() {
        return calculateTotalFor("unsaturatedFatPer100g");
      },
      get cholesterolGramsPerLine() {
        return calculateTotalFor("cholesterolGramsPer100g");
      },
      get transFatGramsPerLine() {
        return calculateTotalFor("transFatPer100g");
      },
      get dietaryFibreGramsPerLine() {
        return calculateTotalFor("dietaryFibrePer100g");
      },
      get solubleFibreGramsPerLine() {
        return calculateTotalFor("solubleFibrePer100g");
      },
      get insolubleFibreGramsPerLine() {
        return calculateTotalFor("insolubleFibrePer100g");
      },
      get saltGramsPerLine() {
        return calculateTotalFor("saltPer100g");
      },
      get sodiumGramsPerLine() {
        return calculateTotalFor("sodiumPer100g");
      },
      get alcoholGramsPerLine() {
        return calculateTotalFor("alcoholPer100g");
      }
    };
  })
  .actions(self => ({
    updateWeight(quantity, unit) {
      if (self.quantity > 0 && self.unit.length > 0) {
        self.text = `${self.quantity} ${self.unit} of ${self.foodName}`;
      } else {
        self.additionalText = `, ${quantity} ${unit}`;
      }

      self.quantity = quantity;
      self.unit = unit;
    },
    updateSearch(alternativeFoodName) {
      self.alternativeFoodName = alternativeFoodName;
      self.search = null;
      self.chooseMatch();
    },
    chooseMatch: flow(function* chooseMatch(match) {
      const store = getParent(self, 3);

      self.selectedMatch = match;

      if (match) {
        postSearchUsed(match.searchId, match.foodId, self.search.text);
      }

      if (!match) {
        if (!self.search) {
          const search = yield store.loadSearch(
            self.alternativeFoodName || self.foodName
          );
          self.search = search;
        }

        if (self.search && self.search.matches.length > 0) {
          self.selectedMatch = self.search.matches[0];
        }
      } else {
        self.selectedMatch = self.search
          ? self.search.matches.find(item => item.foodId === match.foodId)
          : null;
      }

      if (self.selectedMatch) {
        const food = yield store.loadFood(self.selectedMatch.foodId);

        self.selectedFood = food;

        return food;
      }
    })
  }));

export default EntryLine;

// .actions(self => ({
//   clearMatches() {
//     self.matches.clear();
//   }
// }))

// .actions(self => ({
//   chooseMatch(match) {
//     self.selectedMatch = match.foodId;
//     self.mealItemStatus = "OK";
//     self.mealItemInformation =
//       "Use '" + match.foodName + "' for nutritional information";
//     self.selectedFood = undefined;
//   }
// }))
// .actions(self => ({
//   updateMatches(matches) {
//     if (matches && matches.length > 0) {
//       self.matches = matches.map(item => Match.create(item));

//       self.chooseMatch(matches[0]);
//     } else {
//       self.mealItemStatus = "NO_MATCHES";
//       self.mealItemInformation = "Search for a food";
//     }

//     if (!self.quantity || !self.unit) {
//       self.mealItemStatus = "NO_MEASUREMENT";
//       self.mealItemInformation = "How much does '" + self.text + "' weigh?";
//     }
//   }
// }))
// .actions(self => ({
//   fetchMatches: flow(function* fetchMatches() {
//     self.clearMatches();

//     self.state = "pending";

//     try {
//       const matches = yield getFoodNames(
//         self.replacmentText || self.foodName
//       );

//       self.updateMatches(matches);

//       self.state = "done";
//     } catch (error) {
//       // ... including try/catch error handling
//       console.error(`Failed to fetch matches for ${self.text}`, error);

//       self.state = "error";
//     }
//   })
// }))

// .actions(self => ({
//   updateCalculations: flow(function* updateCalculations() {
//     self.state = "pending";

//     try {
//       if (self.selectedMatch && !self.selectedFood && self.quantity) {
//         const data = yield getFoodData(
//           self.selectedMatch.foodId,
//           self.quantity,
//           self.unit
//         );

//         self.selectedFood = Food.create(data);

//         console.log(data);
//       }

//       self.state = "done";
//     } catch (error) {
//       // ... including try/catch error handling
//       console.error(`Failed to update summary`, error);

//       self.state = "error";
//     }
//   })
// }));
