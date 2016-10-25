import {NavController} from 'ionic-angular';
import {Component}     from '@angular/core';

import {DiaryService}           from '../providers/diary';

import {FoodSearchEntryPage}    from '../wizards/food-search-entry';
import {FoodHistoryListingPage} from '../wizards/food-history-listing';


@Component({
  templateUrl: 'food-mealtime-selector.html',
})
export class FoodMealtimeSelectorPage {

  constructor(public navController: NavController, private diaryService: DiaryService) {
    this.navController = navController;
  }

  useMealtime(mealtime) {
    this.diaryService.chooseMealtime(mealtime);
  }

  useSearch() {
    this.navController.push(FoodSearchEntryPage);
  }

  useBrowse() {
    this.navController.push(FoodHistoryListingPage);
  }

  useScan() {
    //this.navController.push(FoodHistoryListingPage);
  }

}
