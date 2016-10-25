import {NavController} from 'ionic-angular';
import {Component}     from '@angular/core';

import {SearchService}         from '../providers/search';

import {FoodSearchResultsPage} from '../wizards/food-search-results';


@Component({
  templateUrl: 'food-search-entry.html',
})
export class FoodSearchEntryPage {

  private term: string;

  constructor(private navController: NavController, private searchService: SearchService) {
    this.term = '';
  }

  search() {

    this.searchService.chooseTerm(this.term).then(() => {

      this.navController.push(FoodSearchResultsPage);

    });

  }

}
