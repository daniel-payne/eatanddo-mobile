import { types, flow, getParent } from "mobx-state-tree";

import Search from "./Search";
import Match from "./SearchMatch";
import Food from "./Food";

import postSearchUsed from "../conectors/remote/postSearchUsed";

export const CALCULATION_INCOMPLETE = "CALCULATION_INCOMPLETE";
export const CALCULATION_COMPLETE = "CALCULATION_COMPLETE";

const DayMealItem = types
  .model({
    text: types.string,

    foodText: types.maybe(types.string),
    amountText: types.maybe(types.string),
    alternativeText: types.maybe(types.string),

    quantity: types.maybe(types.number),
    unit: types.maybe(types.string),

    // foodName: types.maybe(types.string),
    // foodId: types.maybe(types.number),

    search: types.maybe(types.reference(Search)),

    selectedMatch: types.maybe(types.reference(Match)),
    selectedFood: types.maybe(types.reference(Food))
  })
  .views(self => {
    return {
      get meal() {
        return getParent(self, 2);
      }
    };
  })
  .views(self => {
    const calculateTotalFor = name => {
      if (self.quantity && self.selectedFood) {
        return (self.quantity * (self.selectedFood[name] || 0)) / 100;
      }
      return null;
    };

    return {
      get calculationStatus() {
        let status = CALCULATION_INCOMPLETE;

        if (self.quantity > 0 && self.unit && self.selectedFood) {
          status = CALCULATION_COMPLETE;
        }

        return status;
      },

      nutritionPerItem(nutrition = "energyCalories") {
        return self[`${nutrition}PerItem`];
      },

      get energyCaloriesPerItem() {
        return calculateTotalFor("energyCaloriesPer100g");
      },
      get energyKiloJoulesPerItem() {
        return calculateTotalFor("energyKiloJoulesPer100g");
      },
      get proteinGramsPerItem() {
        return calculateTotalFor("proteinGramsPer100g");
      },
      get carbohydrateGramsPerItem() {
        return calculateTotalFor("carbohydrateGramsPer100g");
      },
      get sugarGramsPerItem() {
        return calculateTotalFor("sugarGramsPer100g");
      },
      get starchGramsPerItem() {
        return calculateTotalFor("starchGramsPer100g");
      },
      get fatGramsPerItem() {
        return calculateTotalFor("fatGramsPer100g");
      },
      get saturatedFatGramsPerItem() {
        return calculateTotalFor("saturatedFatGramsPer100g");
      },
      get unsaturatedFatGramsPerItem() {
        return calculateTotalFor("unsaturatedFatGramsPer100g");
      },
      get cholesterolGramsPerItem() {
        return calculateTotalFor("cholesterolGramsPer100g");
      },
      get transFatGramsPerItem() {
        return calculateTotalFor("transFatGramsPer100g");
      },
      get dietaryFibreGramsPerItem() {
        return calculateTotalFor("dietaryFibreGramsPer100g");
      },
      get solubleFibreGramsPerItem() {
        return calculateTotalFor("solubleFibreGramsPer100g");
      },
      get insolubleFibreGramsPerItem() {
        return calculateTotalFor("insolubleFibreGramsPer100g");
      },
      get saltGramsPerItem() {
        return calculateTotalFor("saltGramsPer100g");
      },
      get sodiumGramsPerItem() {
        return calculateTotalFor("sodiumGramsPer100g");
      },
      get alcoholGramsPerItem() {
        return calculateTotalFor("alcoholGramsPer100g");
      }
    };
  })
  .actions(self => ({
    updateWeight(quantity, unit) {
      if (self.quantity > 0 && self.unit.length > 0) {
        self.text = `${quantity} ${unit} of ${self.foodText}`;
      } else {
        self.amountText = `, ${quantity} ${unit}`;
      }

      self.quantity = quantity;
      self.unit = unit;

      self.meal.day.store.storeDay(self.meal.day);
    },
    updateSearch(alternativeText) {
      self.alternativeText = alternativeText;

      self.search = null;
      self.selectedMatch = null;
      self.selectedFood = null;

      self.meal.day.store.chooseSearch(self);
    },
    chooseMatch: flow(function* chooseMatch(match) {
      const store = self.meal.day.store;

      if (match) {
        postSearchUsed(match.searchId, match.foodId, self.search.text);

        const food = yield store.loadFood(match.foodId);

        self.selectedMatch = match;
        self.selectedFood = food;

        return food;
      }
    })
  }));

export default DayMealItem;
