import { types } from "mobx-state-tree";

const SearchMatch = types.model({
  foodId: types.identifier(types.number),
  searchId: types.number,
  foodName: types.string,
  sourceName: types.maybe(types.string)
});

export default SearchMatch;
