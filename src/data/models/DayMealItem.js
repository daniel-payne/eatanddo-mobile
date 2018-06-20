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

    search: types.maybe(types.reference(Search)),

    selectedMatch: types.maybe(types.reference(Match)),
    selectedFood: types.maybe(types.reference(Food))
  })
  .views(self => {
    const calculateTotalFor = name => {
      if (self.quantity && self.selectedFood) {
        return (self.quantity * (self.selectedFood[name] || 0)) / 100;
      }
      return null;
    };

    return {
      get meal() {
        return getParent(self, 2);
      },

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
      const day = self.meal.day;
      const store = day.store;

      if (self.quantity > 0 && self.unit.length > 0) {
        self.text = `${quantity} ${unit} of ${self.foodText}`;
      } else {
        self.amountText = `, ${quantity} ${unit}`;
      }

      self.quantity = quantity;
      self.unit = unit;

      store.storeDay(day);
    },
    updateSearch(alternativeText) {
      const day = self.meal.day;
      const store = day.store;

      self.alternativeText = alternativeText;

      self.search = null;
      self.selectedMatch = null;
      self.selectedFood = null;

      self.loadSearch();

      store.storeDay(day);
    },
    loadSearch: flow(function* chooseSearch() {
      const store = self.meal.day.store;

      let search;
      // let selectedFood;
      let searchString;

      try {
        search = self.search;
      } catch (error) {
        searchString = self.toJSON().search;
      }

      if (!search) {
        const search = yield store.loadSearch(
          searchString || self.alternativeText || self.foodText
        );

        self.search = search;

        if (
          !self.selectedFood &&
          self.search &&
          self.search.matches.length > 0
        ) {
          const foodId = self.search.matches[0].foodId;

          yield store.loadFood(foodId);

          self.selectedFood = foodId;
        }
      }

      yield store.storeDay(self.meal.day);
    }),
    chooseMatch: flow(function* chooseMatch(match) {
      const day = self.meal.day;
      const store = day.store;

      if (match) {
        postSearchUsed(match.searchId, match.foodId, self.search.text);

        const food = yield store.loadFood(match.foodId);

        self.selectedMatch = match;
        self.selectedFood = food;

        yield store.storeDay(day);

        return food;
      }
    })
  }));

export default DayMealItem;
