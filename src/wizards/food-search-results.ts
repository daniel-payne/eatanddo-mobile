import {NavController} from 'ionic-angular';
import {Component}     from '@angular/core';

import {SearchService}         from '../providers/search';

import {FoodAmountSelectorPage} from '../wizards/food-amount-selector';

@Component({
  templateUrl: 'food-search-results.html',
})
export class FoodSearchResultsPage {

  private matches: any[];

  constructor(public navController: NavController, private searchService: SearchService) {
  }

  ionViewDidLoad() {
    this.matches = this.searchService.currentMatches;
  }

  itemSelected(item) {

    this.searchService.chooseMatch(item.foodId);

    this.navController.push(FoodAmountSelectorPage);

  }
}
