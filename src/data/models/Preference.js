import { types } from "mobx-state-tree";

import Day from "./Day";
import DayMeal from "./DayMeal";

export const CALORIES = "energyCalories";
export const KILOJOULES = "energyKiloJoules";
export const PROTEIN = "proteinGrams";
export const CARBOHYDRATE = "carbohydrateGrams";
export const SUGAR = "sugarGrams";
export const STARCH = "starchGrams";
export const FAT = "fatGrams";
export const SATURATEDFAT = "saturatedFatGrams";
export const UNSATURATEDFAT = "unsaturatedFatGrams";
export const CHOLESTEROL = "cholesterolGrams";
export const TRANSFAT = "transFatGrams";
export const DIETARYFIBRE = "dietaryFibreGrams";
export const SOLUBLEFIBRE = "solubleFibreGrams";
export const INSOLUBLEFIBRE = "insolubleFibreGrams";
export const SALT = "saltGrams";
export const SODIUM = "sodiumGrams";
export const ALCOHOL = "alcoholGrams";

export const NUTRITIONS = [
  CALORIES,
  KILOJOULES,
  PROTEIN,
  CARBOHYDRATE,
  SUGAR,
  STARCH,
  FAT,
  SATURATEDFAT,
  UNSATURATEDFAT,
  CHOLESTEROL,
  TRANSFAT,
  DIETARYFIBRE,
  SOLUBLEFIBRE,
  INSOLUBLEFIBRE,
  SALT,
  SODIUM,
  ALCOHOL
];

export const UK_DATA = "cofid phe";
export const US_DATA = "fcd usda";

export const SOURCES = [UK_DATA, US_DATA];

const Preference = types
  .model({
    selectedDay: types.maybe(types.reference(Day)),
    selectedMeal: types.maybe(types.reference(DayMeal)),
    selectedNutrition: types.optional(
      types.enumeration("NutritionStates", NUTRITIONS),
      CALORIES
    ),
    selectedSource: types.optional(
      types.enumeration("SourceStates", SOURCES),
      UK_DATA
    )
  })
  .actions(self => ({
    chooseNutrition(nutrition) {
      self.selectedNutrition = nutrition;
    },
    chooseSource(source) {
      self.selectedSource = source;
    },
    chooseDiary(day, meal) {
      self.selectedDay = day;
      self.selectedMeal = meal || day.meals[0];
    }
  }));

export default Preference;
