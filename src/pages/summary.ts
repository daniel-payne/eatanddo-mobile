
import {NavController}       from 'ionic-angular';
import {PopoverController}   from 'ionic-angular';
import {ModalController }    from 'ionic-angular';
import {Component}           from '@angular/core';

import {FoodDiaryModal}                   from '../modals/food-diary';

import {LoginPage}                       from './login';

import {FoodMealtimeSelectorPage} from '../wizards/food-mealtime-selector';
import {SetupFoodDisplayPopover}  from '../popovers/setup-food-display';

import {SecurityService}     from '../providers/security';
import {DiaryService}        from '../providers/diary';

@Component({
  templateUrl: 'summary.html'
})
export class SummaryPage {

  constructor(
    private navController:     NavController, 
    private popoverController: PopoverController, 
    private modalController:   ModalController, 
    private securityService:   SecurityService, 
    private diaryService:      DiaryService
    ) {

  }

  presentSetupPopover(event){
    let popover = this.popoverController.create(SetupFoodDisplayPopover);

    popover.present({ ev: event });
  }

  addFoodEntry() {

    this.navController.push(FoodMealtimeSelectorPage);

  }

  disconnect() {

    this.securityService.disconnect();

    this.navController.setRoot(LoginPage);
  }

  showFoodDiary(){
    let modal = this.modalController.create(FoodDiaryModal);

    modal.present();
  }

}
