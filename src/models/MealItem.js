import { types, flow } from "mobx-state-tree";

import MealItemMatch from "./MealItemMatch";
import MealItemNutrition from "./MealItemNutrition";

import getFoodMatches from "./conectors/getFoodMatches";
import getFoodData from "./conectors/getFoodData";

const MealItem = types
  .model({
    text: types.maybe(types.string),
    additionalText: types.maybe(types.string),

    replacmentText: types.maybe(types.string),

    quantity: types.maybe(types.number),
    unit: types.maybe(types.string),
    foodName: types.maybe(types.string),

    matches: types.optional(types.array(MealItemMatch), []),
    selectedMatch: types.maybe(types.reference(MealItemMatch)),

    selectedNutrition: types.maybe(MealItemNutrition),

    information: types.maybe(types.string),
    status: types.maybe(types.string)
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
        self.status = "OK";
        self.information =
          "Use '" + self.matches[0].foodName + "' for nutritional information";
      }
    }
  }))
  .actions(self => ({
    chooseMatch(match) {
      self.selectedMatch = match.foodId;
      self.status = "OK";
      self.information =
        "Use '" + match.foodName + "' for nutritional information";
      self.selectedNutrition = undefined;
    }
  }))
  .actions(self => ({
    updateMatches(matches) {
      if (matches && matches.length > 0) {
        self.matches = matches.map(item => MealItemMatch.create(item));

        self.chooseMatch(matches[0]);
      } else {
        self.status = "NO_MATCHES";
        self.information = "Search for a food";
      }

      if (!self.quantity || !self.unit) {
        self.status = "NO_MEASUREMENT";
        self.information = "How much does '" + self.text + "' weigh?";
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
        if (self.selectedMatch && !self.selectedNutrition && self.quantity) {
          const data = yield getFoodData(
            self.selectedMatch.foodId,
            self.quantity,
            self.unit
          );

          self.selectedNutrition = MealItemNutrition.create(data);

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
