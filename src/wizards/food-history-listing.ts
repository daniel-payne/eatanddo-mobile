import {NavController} from 'ionic-angular';
import {Component}     from '@angular/core';


@Component({
  templateUrl: 'food-history-listing.html',
})
export class FoodHistoryListingPage {
  constructor(public nav: NavController) {
    this.nav = nav;
  }
}
