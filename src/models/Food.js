import { types } from "mobx-state-tree";

const Food = types.model({
  foodId: types.identifier(types.number),
  foodName: types.string,

  amountDescription: types.maybe(types.string),
  baselineDescription: types.maybe(types.string),

  energyKiloJoulesPerEntry: types.maybe(types.number),
  proteinGramsPerEntry: types.maybe(types.number),
  carbohydrateGramsPerEntry: types.maybe(types.number),
  sugarGramsPerEntry: types.maybe(types.number),
  starchGramsPerEntry: types.maybe(types.number),
  fatGramsPerEntry: types.maybe(types.number),
  saturatedFatGramsPerEntry: types.maybe(types.number),
  cholesterolGramsPerEntry: types.maybe(types.number),
  transFatGramsPerEntry: types.maybe(types.number),
  dietaryFibreGramsPerEntry: types.maybe(types.number),
  sodiumGramsPerEntry: types.maybe(types.number),
  alcoholGramsPerEntry: types.maybe(types.number),

  energyKiloJoulesPerBaseline: types.maybe(types.number),
  proteinGramsPerBaseline: types.maybe(types.number),
  carbohydrateGramsPerBaseline: types.maybe(types.number),
  sugarGramsPerBaseline: types.maybe(types.number),
  starchGramsPerBaseline: types.maybe(types.number),
  fatGramsPerBaseline: types.maybe(types.number),
  saturatedFatGramsPerBaseline: types.maybe(types.number),
  cholesterolGramsPerBaseline: types.maybe(types.number),
  transFatGramsPerBaseline: types.maybe(types.number),
  dietaryFibreGramsPerBaseline: types.maybe(types.number),
  sodiumGramsPerBaseline: types.maybe(types.number),
  alcoholGramsPerBaseline: types.maybe(types.number)
});

export default Food;
