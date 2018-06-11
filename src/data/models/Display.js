import { types } from "mobx-state-tree";

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

const Display = types
  .model({
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
    updateNutrition(nutrition) {
      self.selectedNutrition = nutrition;
    },
    updateSource(source) {
      self.selectedSource = source;
    }
  }));

export default Display;
