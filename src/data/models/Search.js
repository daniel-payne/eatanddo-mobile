import { types, flow } from "mobx-state-tree";

import Match from "./SearchMatch";

import getFoodNames from "../conectors/remote/getFoodNames";

const Search = types
  .model({
    reference: types.identifier(types.string),

    text: types.string,
    source: types.string,

    isAllMatches: types.optional(types.boolean, false),

    matches: types.optional(types.array(Match), [])
  })
  .actions(self => ({
    loadAllMatches: flow(function* loadAllMatches() {
      const data = yield getFoodNames(self.source, self.text, 999, false);

      self.isAllMatches = true;

      data.forEach(item => {
        if (!self.matches.find(match => match.foodId === item.foodId)) {
          self.matches.push(item);
        }
      });

      return data;
    })
  }));

export default Search;
