import {NavController} from 'ionic-angular';
import {Component}     from '@angular/core';

import {SearchService}       from '../providers/search';
import {DiaryService}        from '../providers/diary';

@Component({
  templateUrl: 'food-entry-confirmation.html',
})
export class FoodEntryConfirmationPage {

  private calculation: any;
  private mealtime:    string;

  constructor(
    public  navController: NavController,
    private searchService: SearchService,
    private diaryService:  DiaryService) {
  }

  useCalculation() {

    this.diaryService.chooseCalculation(this.searchService.currentCalculation).then( () => {

       this.navController.popToRoot().then( () => {
          this.searchService.clearSelection();
       });

    });

  }
}
