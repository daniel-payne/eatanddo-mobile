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
      //   for (let i = 0; i < self.entry.lines.length; i++) {
      //     const line = self.entry.lines[i];
      //     yield line.chooseMatch(line.selectedMatch);
      //   }
    }),
    loadDiary: flow(function* loadSearch(isoDate, mealtime) {
      let meal;
      let day = self.days.find(item => item.isoDate === isoDate);

      if (!day) {
        const data = yield loadDay(isoDate);

        day = Day.create(data);

        self.days.push(day);
      }

      meal = day.meals.find(item => item.mealtime === mealtime);

      self.chooseDay(day);
      self.chooseMeal(meal);
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
