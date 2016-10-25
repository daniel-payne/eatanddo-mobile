import { NgModule }                from '@angular/core' 
import { IonicApp, IonicModule }   from 'ionic-angular' 
import { Storage }                 from '@ionic/storage' 

import { MyApp }                   from './app.component' 

import { SummaryPage }             from '../pages/summary'  
import { LoginPage }               from '../pages/login' 

import {SecurityService}           from '../providers/security'
import {SearchService}             from '../providers/search'
import {DiaryService}              from '../providers/diary'

import {FoodAmountSelectorPage}    from '../wizards/food-amount-selector'
import {FoodEntryConfirmationPage} from '../wizards/food-entry-confirmation'
import {FoodHistoryListingPage}    from '../wizards/food-history-listing'
import {FoodMealtimeSelectorPage}  from '../wizards/food-mealtime-selector'
import {FoodSearchEntryPage}       from '../wizards/food-search-entry'
import {FoodSearchResultsPage}     from '../wizards/food-search-results'
import {FoodSourceSelectorPage}    from '../wizards/food-source-selector'

import {FoodDiaryModal}            from '../modals/food-diary' 

import {SetupFoodDisplayPopover}   from '../popovers/setup-food-display'
 

@NgModule({
  declarations: [
    MyApp,

    SummaryPage,
    LoginPage,

    FoodAmountSelectorPage,
    FoodEntryConfirmationPage,
    FoodHistoryListingPage,
    FoodMealtimeSelectorPage,
    FoodSearchEntryPage,
    FoodSearchResultsPage,
    FoodSourceSelectorPage,

    FoodDiaryModal,

    SetupFoodDisplayPopover
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    MyApp,

    SummaryPage,
    LoginPage,

    FoodAmountSelectorPage,
    FoodEntryConfirmationPage,
    FoodHistoryListingPage,
    FoodMealtimeSelectorPage,
    FoodSearchEntryPage,
    FoodSearchResultsPage,
    FoodSourceSelectorPage,

    FoodDiaryModal,
    
    SetupFoodDisplayPopover
  ],
  providers: [
    Storage,

    SecurityService,
    SearchService,
    DiaryService
  ]
})
export class AppModule {}
