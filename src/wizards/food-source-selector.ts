import {NavController} from 'ionic-angular';
import {Component}     from '@angular/core';


@Component({
  templateUrl: 'food-source-selector.html',
})
export class FoodSourceSelectorPage {
  constructor(public nav: NavController) {
    this.nav = nav;
  }
}
