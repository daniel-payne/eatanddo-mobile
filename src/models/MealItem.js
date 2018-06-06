import { types, flow } from "mobx-state-tree";

import Match from "./Match";
import Food from "./Food";

import getFoodMatches from "./conectors/remote/getFoodMatches";
import getFoodData from "./conectors/remote/getFoodData";

const MealItem = types
  .model({
    text: types.maybe(types.string),

    additionalText: types.maybe(types.string),
    alternativeText: types.maybe(types.string),

    quantity: types.maybe(types.number),
    unit: types.maybe(types.string),
    foodName: types.maybe(types.string),

    matches: types.optional(types.array(Match), []),

    selectedMatch: types.maybe(types.reference(Match)),
    selectedFood: types.maybe(Food),

    mealItemStatus: types.maybe(types.string),
    mealItemInformation: types.maybe(types.string),

    mealItemQuantityStatus: types.maybe(types.string),
    mealItemSearchStatus: types.maybe(types.string)
  })
  .actions(self => ({
    clearMatches() {
      self.matches.clear();
    }
  }))
  .actions(self => ({
    updateWeight(quantity, unit) {
      self.quantity = quantity;
      self.unit = unit;

      self.additionalText = `, ${quantity} ${unit}`;

      if (self.matches && self.matches.length > 0) {
        self.mealItemStatus = "OK";
        self.mealItemInformation =
          "Use '" + self.matches[0].foodName + "' for nutritional information";
      }
    }
  }))
  .actions(self => ({
    chooseMatch(match) {
      self.selectedMatch = match.foodId;
      self.mealItemStatus = "OK";
      self.mealItemInformation =
        "Use '" + match.foodName + "' for nutritional information";
      self.selectedFood = undefined;
    }
  }))
  .actions(self => ({
    updateMatches(matches) {
      if (matches && matches.length > 0) {
        self.matches = matches.map(item => Match.create(item));

        self.chooseMatch(matches[0]);
      } else {
        self.mealItemStatus = "NO_MATCHES";
        self.mealItemInformation = "Search for a food";
      }

      if (!self.quantity || !self.unit) {
        self.mealItemStatus = "NO_MEASUREMENT";
        self.mealItemInformation = "How much does '" + self.text + "' weigh?";
      }
    }
  }))
  .actions(self => ({
    fetchMatches: flow(function* fetchMatches() {
      self.clearMatches();

      self.state = "pending";

      try {
        const matches = yield getFoodMatches(
          self.replacmentText || self.foodName
        );

        self.updateMatches(matches);

        self.state = "done";
      } catch (error) {
        // ... including try/catch error handling
        console.error(`Failed to fetch matches for ${self.text}`, error);

        self.state = "error";
      }
    })
  }))

  .actions(self => ({
    updateCalculations: flow(function* updateCalculations() {
      self.state = "pending";

      try {
        if (self.selectedMatch && !self.selectedFood && self.quantity) {
          const data = yield getFoodData(
            self.selectedMatch.foodId,
            self.quantity,
            self.unit
          );

          self.selectedFood = Food.create(data);

          console.log(data);
        }

        self.state = "done";
      } catch (error) {
        // ... including try/catch error handling
        console.error(`Failed to update summary`, error);

        self.state = "error";
      }
    })
  }));

export default MealItem;
