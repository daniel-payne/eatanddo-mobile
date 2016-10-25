import {NavController} from 'ionic-angular';
import {Component}     from '@angular/core';

import {SearchService}       from '../providers/search';

import {FoodEntryConfirmationPage} from '../wizards/food-entry-confirmation';


const DEFAULT_MESSAGE = 'Enter an amount'

@Component({
  templateUrl: 'food-amount-selector.html',
})
export class FoodAmountSelectorPage {

  private match: any;

  private display = {

     amount:            undefined,
     fraction:          undefined,
     unitName:          undefined,
     amountIsDisabled:  undefined,
     fractionsIsHidden: undefined
  }

  //private displayAmount:     string;
  //private displayFraction:   string;
  //private displayUnit:       string;
  //private amountIsDisabled:  boolean;
  //private fractionsIsHidden: boolean;

  constructor(public navController: NavController, private searchService: SearchService) {
  }

  ionViewDidLoad() {
    this.match                     = this.searchService.selectedMatch;
    this.display.amount            = DEFAULT_MESSAGE;
    this.display.unitName          = '';
    this.display.amountIsDisabled  = true;
    this.display.fractionsIsHidden = true;
  }

  chooseUnit(unit) {

    if (this.display.amount === DEFAULT_MESSAGE) {
      this.display.amount = DEFAULT_MESSAGE + ' in ';
    }

    if (unit.toUpperCase().indexOf('GRAM') === -1) {
      this.display.fractionsIsHidden = false;
    } else {
      this.display.fractionsIsHidden = true;
    }

    this.display.unitName = unit;

  }

  chooseAmount(amount) {

    if (this.display.amount.indexOf(DEFAULT_MESSAGE) > -1) {
      this.display.amount = '';
    }

    if (amount.toUpperCase() === 'B') {

      if (this.display.fraction) {
        this.display.fraction = undefined;
      } else {
        this.display.amount = this.display.amount.slice(0, -1);
      }
    }
    else {
      this.display.amount = this.display.amount + amount;
    }


    this.display.amountIsDisabled  = null;

  }

  chooseFraction(fraction) {

    if (this.display.amount.indexOf(DEFAULT_MESSAGE) > -1) {
      this.display.amount = '';
    }

    this.display.fraction = fraction;

    this.display.amountIsDisabled = null;

  }

  confirmAmount() {

    let amount:   number = 0;
    let foodId: string = this.searchService.selectedMatch.foodId;

    if (this.display.amount.length > 0) {
      amount = Number(this.display.amount);
    }

    switch (this.display.fraction) {
      case '1/4':
        amount = amount + 0.25;
        break;
      case '1/2':
        amount = amount + 0.50;
        break;
      case '3/4':
        amount = amount + 0.25;
        break;
    }

    this.searchService.chooseCalculation(foodId, amount, this.display.unitName).then(() => {

      this.navController.push(FoodEntryConfirmationPage);

    });


  }

}
