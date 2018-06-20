import { types, flow } from "mobx-state-tree";
import makeInspectable from "mobx-devtools-mst";

import Day from "./models/Day";
import DayMeal from "./models/DayMeal";
import Food from "./models/Food";
import Search from "./models/Search";

import Preference from "./models/Preference";

import getFoodNames from "./conectors/remote/getFoodNames";
import getFood from "./conectors/remote/getFood";

import loadDay from "./conectors/local/loadDay";
import storeDay from "./conectors/local/storeDay";

const Store = types
  .model({
    days: types.optional(types.array(Day), []),
    foods: types.optional(types.array(Food), []),
    searches: types.optional(types.array(Search), []),

    selectedDay: types.maybe(types.reference(Day)),
    selectedMeal: types.maybe(types.reference(DayMeal)),

    preference: types.optional(Preference, {})
  })
  .actions(self => ({
    chooseDay(day) {
      self.selectedDay = day;

      if (self.selectedMeal) {
        self.selectedMeal = day.meals.find(
          item => item.mealtime === self.selectedMeal.mealtime
        );
      }

      if (!self.selectedMeal) {
        self.selectedMeal = day.meals[0];
      }
    },
    chooseMeal(meal) {
      if (meal) {
        self.selectedMeal = meal;
      } else if (self.selectedDay) {
        self.selectedMeal = self.selectedDay.meals[0];
      }
    },
    chooseMealtime(mealtime) {
      if (mealtime && self.selectedDay) {
        let newSelectedMeal = self.selectedDay.meals.find(
          meal => meal.mealtime === mealtime
        );
        if (newSelectedMeal) {
          self.selectedMeal = newSelectedMeal;
        }
      }
    }
  }))
  .actions(self => ({
    validateDay: flow(function* validateEntry(day) {
      if (!day) {
        return;
      }

      for (let i = 0; i < day.meals.length; i++) {
        let meal = day.meals[i];

        for (let j = 0; j < meal.items.length; j++) {
          const item = meal.items[j];

          if (item.selectedFood === null) {
            yield self.chooseSearch(item);
          }
        }
      }

      yield storeDay(day);
    }),
    chooseSearch: flow(function* chooseSearch(item) {
      const search = item.search;

      if (!search) {
        const search = yield store.loadSearch(
          item.alternativeText || item.foodText
        );
        item.search = search;

        if (item.search && item.search.matches.length > 0) {
          const foodId = item.search.matches[0].foodId;

          yield self.loadFood(foodId);

          item.selectedFood = foodId;
        }
      }
    }),
    chooseMatch: flow(function* chooseMatch(entry, match) {
      // self.selectedMatch = match;
      // if (match) {
      //   postSearchUsed(match.searchId, match.foodId, self.search.text);
      // }
      // if (!match) {
      //   if (!self.search) {
      //     const search = yield store.loadSearch(
      //       self.alternativeFoodName || self.foodName
      //     );
      //     self.search = search;
      //   }
      //   if (self.search && self.search.matches.length > 0) {
      //     self.selectedMatch = self.search.matches[0];
      //   }
      // } else {
      //   self.selectedMatch = self.search
      //     ? self.search.matches.find(item => item.foodId === match.foodId)
      //     : null;
      // }
      // if (self.selectedMatch) {
      //   const food = yield store.loadFood(self.selectedMatch.foodId);
      //   self.selectedFood = food;
      //   return food;
      // }
    }),
    loadDiary: flow(function* loadSearch(isoDate, mealtime) {
      let meal;
      let day = self.days.find(item => item.isoDate === isoDate);

      if (!day) {
        const data = yield loadDay(isoDate);

        if (data.meals) {
          for (let i = 0; i < data.meals.length; i++) {
            let meal = data.meals[i];

            for (let j = 0; j < meal.items.length; j++) {
              const item = meal.items[j];

              if (item.selectedFood) {
                yield self.loadFood(item.selectedFood);
              }
            }
          }
        }

        day = Day.create(data);

        self.days.push(day);
      }

      meal = day.meals.find(item => item.mealtime === mealtime);

      self.chooseDay(day);
      self.chooseMeal(meal);

      self.validateDay(day);
    }),
    loadSearch: flow(function* loadSearch(match) {
      let search = self.searches.find(item => item.text === match);

      if (!search) {
        const data = yield getFoodNames(match);

        search = Search.create({ text: match, matches: data });

        self.searches.push(search);
      }

      return search;
    }),
    loadFood: flow(function* loadFood(foodId) {
      let food = self.foods.find(item => item.fooId === foodId);

      if (!food) {
        const data = yield getFood(foodId);

        food = Food.create(data);

        self.foods.push(food);
      }

      return food;
    })
  }));

// DEBUG CODE
const store = Store.create({});

export default makeInspectable(store);
