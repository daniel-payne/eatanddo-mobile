import {ViewController}                       from 'ionic-angular';
import {Component}                            from '@angular/core';

import {DiaryService}                         from '../providers/diary';


@Component({
  templateUrl: 'food-diary.html',
})
export class FoodDiaryModal {

  public data: any;

  constructor(private viewController: ViewController, private diaryService: DiaryService) {
  }

  close(){
    this.viewController.dismiss();
  }

}
