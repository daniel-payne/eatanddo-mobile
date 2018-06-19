import { types } from "mobx-state-tree";

const DayMeal = types.model({
  mealtime: types.identifier(types.string)
});

export default DayMeal;
