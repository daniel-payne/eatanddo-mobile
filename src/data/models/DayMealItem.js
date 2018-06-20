import { types } from "mobx-state-tree";

import Search from "./Search";
import Match from "./SearchMatch";
import Food from "./Food";

// import postSearchUsed from "../conectors/remote/postSearchUsed";

export const CALCULATION_INCOMPLETE = "CALCULATION_INCOMPLETE";
export const CALCULATION_COMPLETE = "CALCULATION_COMPLETE";

const EntryLine = types.model({
  text: types.string,
  additionalText: types.maybe(types.string),
  alternativeFoodText: types.maybe(types.string),

  quantity: types.maybe(types.number),
  unit: types.maybe(types.string),
  foodName: types.maybe(types.string),
  foodId: types.maybe(types.number),

  search: types.maybe(types.reference(Search)),

  selectedMatch: types.maybe(types.reference(Match)),
  selectedFood: types.maybe(types.reference(Food))
});

export default EntryLine;
