import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { LoginPage }      from '../pages/login';
import {SummaryPage}      from '../pages/summary';

import {DiaryService}     from '../providers/diary';
import {SecurityService}  from '../providers/security';
import {SearchService}    from '../providers/search';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  
  public rootPage: any = LoginPage;

  constructor(
    private platform:        Platform, 
    private securityService: SecurityService, 
    private diaryService:    DiaryService, 
    private searchService:   SearchService
    ) {
     platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

   ngOnInit() {

    this.securityService.checkSavedSession().then(() => {

      if (this.securityService.checkAuthorization()) {

        this.diaryService.chooseDate('TODAY').then(() => {

          this.diaryService.chooseRange(7);

          this.rootPage = SummaryPage;

        });

      }

    });
}
}