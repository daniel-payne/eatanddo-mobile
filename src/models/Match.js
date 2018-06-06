import { types } from "mobx-state-tree";

const Match = types.model({
  foodId: types.identifier(types.number),
  foodName: types.string,

  brandName: types.maybe(types.string),
  sourceName: types.maybe(types.string),
  servingUnitName: types.maybe(types.string),

  hasNutritionWeightInformation: types.optional(types.boolean, false),
  hasNutritionVolumeInformation: types.optional(types.boolean, false),
  hasNutritionServingInformation: types.optional(types.boolean, false),
  hasNutritionPortionInformation: types.optional(types.boolean, false)
});

export default Match;
