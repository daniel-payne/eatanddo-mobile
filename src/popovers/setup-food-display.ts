import {ViewController} from 'ionic-angular';
import {Component}      from '@angular/core';


@Component({
  templateUrl: 'setup-food-display.html',
})
export class SetupFoodDisplayPopover {

  constructor(private viewController: ViewController) {
  }

  close(){
    this.viewController.dismiss();
  }

}





