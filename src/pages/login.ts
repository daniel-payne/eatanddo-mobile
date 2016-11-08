import {NavController, AlertController , Platform} from 'ionic-angular';
import {Component}                      from '@angular/core';

import {SummaryPage}          from './summary';

import {SecurityService}      from '../providers/security';
import {DiaryService}         from '../providers/diary';


@Component({
  templateUrl: 'login.html',
})
export class LoginPage {

  private email:               string;
  private password:            string;
  private isRunningInBrowser:  boolean;
  private isCacheDisabled:     boolean;

  constructor(private platform: Platform, private navController: NavController, private alertController : AlertController, private securityService: SecurityService, private diaryService: DiaryService) {
    this.email           = 'daniel.payne@keldan.co.uk';
    this.isCacheDisabled = true;

    this.isRunningInBrowser = this.platform.is('core');
  }


  connectAnonymously() {

    this.securityService.clearCache();
    this.diaryService.clearCache();

    if (! this.isCacheDisabled){
      this.diaryService.enableCache();
     this.securityService.enableCache();
    }

    this.securityService.connectAnonymously().then(() => {

      return this.diaryService.chooseDate('TODAY');

    }).then(() => {

      this.navController.setRoot(SummaryPage);

    });

  }

  connectIdentifed() {

    if (this.isCacheDisabled){
      this.securityService.disableCache();
      this.diaryService.disableCache();
    } else {
      this.securityService.enableCache();
      this.diaryService.enableCache();
    }

    this.securityService.connectIdentifed(this.email, this.password).then(() => {

      this.password = '';

      return this.diaryService.chooseDate('TODAY').then(() => {

        this.navController.setRoot(SummaryPage);

      });

    }, (error) => {

      this.password = '';

      let alert = this.alertController.create({
        title: 'Login Failed',
        subTitle: 'Please check your email and retry your password',
        buttons: ['Try Again']
      });

      alert.present(alert);

    }) ;

  }

}
