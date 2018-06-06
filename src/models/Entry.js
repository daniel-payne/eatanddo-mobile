import { types, flow } from "mobx-state-tree";

import MealItem from "./MealItem";

const Entry = types
  .model({
    mealDescription: types.maybe(types.string),

    mealStatus: types.maybe(types.string),
    mealInformation: types.maybe(types.string),

    mealDay: types.maybe(types.string),
    mealDayStatus: types.maybe(types.string),
    mealDayInformation: types.maybe(types.string),

    mealTime: types.maybe(types.string),
    mealTimeStatus: types.maybe(types.string),
    mealTimeInformation: types.maybe(types.string),

    lines: types.optional(types.array(MealItem), [])

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
  })
  .actions(self => ({
    updateMealDescription(mealDescription) {
      self.mealDescription = mealDescription.toLowerCase();

      const data = extractDataFromString(mealDescription);
      const now = new Date();

      self.mealDay = undefined;
      self.mealDayStatus = undefined;
      self.mealDayInformation = undefined;

      self.mealTime = undefined;
      self.mealTimeStatus = undefined;
      self.mealTimeInformation = undefined;

      self.lines.clear();

      if (data.tokens.indexOf(TODAY) > -1) {
        self.mealDay = TODAY;
        self.mealDayInformation = now.toDateString();
      } else if (data.tokens.indexOf(YESTERDAY) > -1) {
        self.mealDay = YESTERDAY;
        self.mealDayInformation = new Date(now - 1 * DAYS).toDateString();
      }

      if (self.mealDay) {
        self.mealDayStatus = "OK";
      } else {
        self.mealDay = "Meal Day";
        self.mealDayInformation = "Select a day from the list";
      }

      if (data.tokens.indexOf(BREAKFAST) > -1) {
        self.mealTime = BREAKFAST;
      } else if (data.tokens.indexOf(LUNCH) > -1) {
        self.mealTime = LUNCH;
      } else if (data.tokens.indexOf(DINNER) > -1) {
        self.mealTime = DINNER;
      } else if (data.tokens.indexOf(SNACKS) > -1) {
        self.mealTime = SNACKS;
      }

      if (self.mealTime) {
        self.mealTimeStatus = "OK";
      } else {
        self.mealTime = "Meal Time";
        self.mealTimeInformation = "Select a day from the list";
      }

      let lastChar;
      let stringArray = data.output.split("");
      let text = "";
      let quantity = "";
      let isQuantity;
      let unit = "";
      let foodName = "";
      let saveNewItem = false;
      let firstWord;

      stringArray.forEach((item, i) => {
        saveNewItem = false;
        isQuantity = false;

        if (
          lastChar &&
          lastChar === " " &&
          item !== " " &&
          item !== "." &&
          Number.isInteger(+item) === true
        ) {
          saveNewItem = true;
        } else if (i === stringArray.length - 1) {
          text = text + item;
          saveNewItem = true;
        }

        if (
          item !== " " &&
          (item === "." || Number.isInteger(+item) === true)
        ) {
          isQuantity = true;
        }

        if (saveNewItem === true) {
          foodName = text.replace(quantity, "");

          const matches = foodName.trim().match(/^([\w-]+)/gm);

          if (matches && matches.length > -1) {
            firstWord = matches[0];
          }

          UNIT_MATCHES.some(item => {
            if (item.word === firstWord) {
              unit = item.replace;

              foodName = foodName.replace(firstWord, "").trim();

              return true;
            }
            return false;
          });

          foodName = foodName.trim();
          foodName = foodName.replace(/^of\s+/gm, "");
          foodName = foodName.replace(/^a\s+/gm, "");
          foodName = foodName.replace(/\s+and$/gm, "");

          text = text.trim();
          text = text.replace(/\s+and$/gm, "");

          text = text.replace("0.25 ", "quater ");
          text = text.replace("0.5 ", "half ");
          text = text.replace("0.75 ", "three quaters ");

          const newItem = MealItem.create({
            text,
            quantity: +quantity,
            unit,
            foodName
          });

          self.lines.push(newItem);

          console.log(newItem.toJSON());

          text = item;
          quantity = "";
          unit = "";
          foodName = "";
          saveNewItem = false;

          quantity = isQuantity === true ? item : "";
        } else {
          text = text + item;

          quantity = isQuantity === true ? quantity + item : quantity;
        }

        lastChar = item;
      });

      self.updateMealSummary();
    }
  }))

  .actions(self => ({
    updateMealSummary: flow(function* updateMealSummary() {
      self.state = "pending";

      try {
        for (let i = 0; i < self.lines.length; i++) {
          yield self.lines[i].fetchMatches();
        }

        self.state = "done";
      } catch (error) {
        // ... including try/catch error handling
        console.error(`Failed to update summary`, error);

        self.state = "error";
      }
    })
  }))

  .actions(self => ({
    updateAllCalculations: flow(function* updateCalculations() {
      self.state = "pending";

      try {
        for (let i = 0; i < self.lines.length; i++) {
          yield self.lines[i].updateCalculations();
        }

        self.isNutritionComplete = false;

        self.energyKiloJoulesPerMeal = 0;
        self.proteinGramsPerMeal = 0;
        self.carbohydrateGramsPerMeal = 0;
        self.sugarGramsPerMeal = 0;
        self.starchGramsPerMeal = 0;
        self.fatGramsPerMeal = 0;
        self.saturatedFatGramsPerMeal = 0;
        self.cholesterolGramsPerMeal = 0;
        self.transFatGramsPerMeal = 0;
        self.dietaryFibreGramsPerMeal = 0;
        self.sodiumGramsPerMeal = 0;
        self.alcoholGramsPerMeal = 0;

        self.lines.forEach(item => {
          if (item.selectedFood) {
            if (item.selectedFood.energyKiloJoulesPerEntry) {
              self.energyKiloJoulesPerMeal +=
                item.selectedFood.energyKiloJoulesPerEntry;

              self.energyKiloCaloriesPerMeal = Math.round(
                self.energyKiloJoulesPerMeal * 0.239006
              );
            }
            if (item.selectedFood.proteinGramsPerEntry) {
              self.proteinGramsPerMeal +=
                item.selectedFood.proteinGramsPerEntry;
            }
            if (item.selectedFood.carbohydrateGramsPerEntry) {
              self.carbohydrateGramsPerMeal +=
                item.selectedFood.carbohydrateGramsPerEntry;
            }
            if (item.selectedFood.sugarGramsPerEntry) {
              self.sugarGramsPerMeal += item.selectedFood.sugarGramsPerEntry;
            }
            if (item.selectedFood.starchGramsPerEntry) {
              self.starchGramsPerMeal += item.selectedFood.starchGramsPerEntry;
            }
            if (item.selectedFood.fatGramsPerEntry) {
              self.fatGramsPerMeal += item.selectedFood.fatGramsPerEntry;
            }
            if (item.selectedFood.saturatedFatGramsPerEntry) {
              self.saturatedFatGramsPerMeal +=
                item.selectedFood.saturatedFatGramsPerEntry;
            }
            if (item.selectedFood.cholesterolGramsPerEntry) {
              self.cholesterolGramsPerMeal +=
                item.selectedFood.cholesterolGramsPerEntry;
            }
            if (item.selectedFood.transFatGramsPerEntry) {
              self.transFatGramsPerMeal +=
                item.selectedFood.transFatGramsPerEntry;
            }
            if (item.selectedFood.dietaryFibreGramsPerEntry) {
              self.dietaryFibreGramsPerMeal +=
                item.selectedFood.dietaryFibreGramsPerEntry;
            }
            if (item.selectedFood.sodiumGramsPerEntry) {
              self.sodiumGramsPerMeal += item.selectedFood.sodiumGramsPerEntry;
            }
            if (item.selectedFood.alcoholGramsPerEntry) {
              self.alcoholGramsPerMeal +=
                item.selectedFood.alcoholGramsPerEntry;
            }
          }
        });

        if (self.energyKiloCaloriesPerMeal > 0) {
          self.mealTimeInformation = `${
            self.energyKiloCaloriesPerMeal
          } kilocalories`;
        }

        self.state = "done";
      } catch (error) {
        // ... including try/catch error handling
        console.error(`Failed to update summary`, error);

        self.state = "error";
      }
    })
  }));

export default Entry;

const TODAY = "TODAY";
const YESTERDAY = "YESTERDAY";

const BREAKFAST = "BREAKFAST";
const LUNCH = "LUNCH";
const DINNER = "DINNER";
const SNACKS = "SNACKS";

const REPLACMENTS = [
  { word: "today's", replace: "", token: TODAY },
  { word: "todays", replace: "", token: TODAY },
  { word: "today", replace: "", token: TODAY },

  { word: "yesterday's", replace: "", token: YESTERDAY },
  { word: "yesterdays", replace: "", token: YESTERDAY },
  { word: "yesterday", replace: "", token: YESTERDAY },

  { word: "breakfast", replace: "", token: BREAKFAST },
  { word: "lunch", replace: "", token: LUNCH },
  { word: "dinner", replace: "", token: DINNER },
  { word: "snacks", replace: "", token: SNACKS },
  { word: "snack", replace: "", token: SNACKS },

  { word: "one hundred ", replace: "100 " },

  { word: "half ", replace: "0.5 " },
  { word: "quater  ", replace: "0.25 " },
  { word: "three quaters  ", replace: "0.75 " },

  { word: "one ", replace: "1 " },
  { word: "two ", replace: "2 " },
  { word: "three ", replace: "3 " },
  { word: "four ", replace: "4 " },
  { word: "five ", replace: "5 " },
  { word: "six ", replace: "6 " },
  { word: "seven ", replace: "7 " },
  { word: "eight ", replace: "8 " },
  { word: "nine ", replace: "9 " },

  { word: "ten ", replace: "10 " },
  { word: "twenty ", replace: "20 " },
  { word: "thirity ", replace: "30 " },
  { word: "fourty ", replace: "40 " },
  { word: "fifity ", replace: "50 " },
  { word: "sixity ", replace: "60 " },
  { word: "seventy ", replace: "70 " },
  { word: "eighty ", replace: "80 " },
  { word: "ninity ", replace: "90 " }
];

const UNIT_MATCHES = [
  { word: "g", replace: "grams" },
  { word: "gram", replace: "grams" },
  { word: "grams", replace: "grams" }
];

const DAYS = 86400000;

function extractDataFromString(input) {
  let output = input;
  let tokens = [];

  REPLACMENTS.forEach(item => {
    if (output.indexOf(item.word) > -1) {
      output = output.replace(item.word, item.replace);

      if (item.token) {
        tokens = [...tokens, item.token];
      }
    }
  });

  output = output.trim();

  return { output, tokens };
}
