import {Storage}                        from '@ionic/storage';
import {Injectable}                     from '@angular/core';
import {Http, Headers, RequestOptions}  from '@angular/http';

import {SecurityService}     from './security';
import {SearchService}       from './search';

import connection from './connection';

import 'rxjs/add/operator/map';

const REST_ADDRESS = connection + 'diary/';

@Injectable()
export class DiaryService {

  public days:              any[]     = [];
  public currentDetails:    any       = {};

  public selectedDate:      string    = null;
  public selectedMealtime:  string    = null;

  private useLocalStorage: boolean    = true;

  constructor(
    public http: Http, 
    public securityService: SecurityService, 
    public searchService: SearchService, 
    public localStorage: Storage
    ) {


  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  public clearCache(): void {
    this.localStorage.clear();
  }

  public disableCache(): void {
    this.localStorage.clear();

    this.useLocalStorage = false;
  }

  public enableCache(): void {
    this.useLocalStorage = true;
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  chooseRange(dayCount: number = 1) {
 
    if (dayCount > this.days.length){

      return this.loadDays(dayCount);

    }

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  chooseDate(date: string) {

    if ((!date) || (date.toUpperCase() === 'TODAY')) {

      date = (new Date()).toISOString().substr(0, 10);

    } else if (date.toUpperCase() === 'YESTERDAY'){

      date = (new Date((new Date()).getTime() + (86400000 * -1))).toISOString().substr(0, 10);

    }

    this.selectedDate = date;

    return new Promise(resolve => {

       this.loadDetails(date).then((details: any) => {

         resolve(details);

       });

    });

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  chooseMealtime(mealtime: string) {

    this.selectedMealtime = mealtime;

    return Promise.resolve(mealtime);

  }

  chooseCalculation(calculation: any) {

    return new Promise( resolve => {

      this.storeCalculation(calculation).then((details: any) => {

        resolve(details);

      });

    });

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private processDays(days): any {

    let savedDetails;
    let listToAdd    = [];
    let listToUpdate = [];

    days.forEach( item => {

      const dayIndex =  this.days.findIndex(function(item) {
          return item.dayDate === item.dayDate;
      })

      if (dayIndex === -1){

         listToAdd.push( item );

      }

      if (this.useLocalStorage === true){

         this.localStorage.get('detail:' + item.dayDate).then(saved => {

           if ((! saved) || (saved.editCount < item.editCount) ){

             this.loadDetails(item.dayDate);

           } else {

             item.details = saved;

           }

         });

      } else if ( (item.dayDate > 0) && (item.dayDate !== this.selectedDate)) {

        this.loadDetails(item.dayDate);

      }


    });

    this.days = this.days.concat(listToAdd)  

    return listToAdd;
  }


  private processDay(day): any {


  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private processDetails(details): any[] {

    let result = [];

    details.forEach( item => {

      result.push( this.processDetail(item) );

    });

    return result;

  }

  private processDetail(detail): any {

    let newItem;
    let dayIndex;

    let daysOfWeek = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

    if (detail.totalEnergyKiloJoulesPerDay) { detail.totalEnergyCaloriesPerDay = detail.totalEnergyKiloJoulesPerDay / 4.184; }

    ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(function (meal) {

      detail[meal + 'Items'] = [];

      ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'].forEach(function (itemNo) {

        if (detail[meal + itemNo + 'EnergyKiloJoulesPerEntry']) {

          detail[meal + itemNo + 'EnergyCaloriesPerEntry'] =  (detail[meal + itemNo + 'EnergyKiloJoulesPerEntry'] / 4.184).toFixed(0);

          if (detail[meal + itemNo + 'SodiumGramsPerEntry']) {
            detail[meal + itemNo + 'SaltGramsPerEntry'] = (detail[meal + itemNo + 'SodiumGramsPerEntry'] / 2.5000).toFixed(2);
          }

          newItem = {

              meal:     meal,
              itemNo:   itemNo,

              foodDescription:             detail[meal + itemNo + 'FoodDescription'],
              amountDescription:           detail[meal + itemNo + 'AmountDescription'],

              energyKiloJoulesPerEntry:    detail[meal + itemNo + 'EnergyKiloJoulesPerEntry'],
              proteinGramsPerEntry:        detail[meal + itemNo + 'ProteinGramsPerEntry'],
              carbohydrateGramsPerEntry:   detail[meal + itemNo + 'CarbohydrateGramsPerEntry'],
              sugarGramsPerEntry:          detail[meal + itemNo + 'SugarGramsPerEntry'],
              starchGramsPerEntry:         detail[meal + itemNo + 'StarchGramsPerEntry'],
              fatGramsPerEntry:            detail[meal + itemNo + 'FatGramsPerEntry'],
              saturatedFatGramsPerEntry:   detail[meal + itemNo + 'SaturatedFatGramsPerEntry'],
              unsaturatedFatGramsPerEntry: detail[meal + itemNo + 'UnsaturatedFatGramsPerEntry'],
              cholesterolGramsPerEntry:    detail[meal + itemNo + 'CholesterolGramsPerEntry'],
              transFatGramsPerEntry:       detail[meal + itemNo + 'TransFatGramsPerEntry'],
              dietaryFibreGramsPerEntry:   detail[meal + itemNo + 'DietaryFibreGramsPerEntry'],
              solubleFibreGramsPerEntry:   detail[meal + itemNo + 'SolubleFibreGramsPerEntry'],
              insolubleFibreGramsPerEntry: detail[meal + itemNo + 'InsolubleFibreGramsPerEntry'],
              sodiumGramsPerEntry:         detail[meal + itemNo + 'SodiumGramsPerEntry'],
              alcoholGramsPerEntry:        detail[meal + itemNo + 'AlcoholGramsPerEntry'],

              energyCaloriesPerEntry:      detail[meal + itemNo + 'EnergyCaloriesPerEntry'],
              saltGramsPerEntry:           detail[meal + itemNo + 'SaltGramsPerEntry']
          }

          detail[meal + 'Items'].push(newItem);

        }


      });

    });

    if (detail.dayDate) {

      detail.dayName = daysOfWeek[new Date(detail.dayDate).getDay()];

      if (this.useLocalStorage === true){
            this.localStorage.set('detail:' + detail.dayDate, JSON.stringify(detail));
      }

    }

    dayIndex =  this.days.findIndex(function(item) {
        return item.dayDate === detail.dayDate;
    })

    if (dayIndex > -1) {

      this.days[dayIndex] =  Object.assign( {}, this.days[dayIndex], {details: detail} );


    } else {

      this.days.push( {dayDate: detail.dayDate, editCount: detail.editCount, details: detail} );

    }

    if (detail.dayDate == this.selectedDate) {
      this.currentDetails = detail;
    }

    return detail;

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private loadDays(dayCount: number) {

    const skipCount: number =  this.days.length;

    return new Promise( (resolve, reject) => {

        let session = this.securityService.checkAuthorization();
        let url     = REST_ADDRESS + 'days?session=' + session + '&dayCount=' + dayCount;
        let headers = new Headers({ 'Content-Type': 'text/plain' });
        let options = new RequestOptions({ headers: headers });

        if (skipCount) {
          url = url + '&skipDays=' + skipCount;
        }

        this.http
            .get(url, options)
            .map(res => res.json())
            .subscribe(days => {

                resolve( this.processDays(days) );

              },
              error => {

                alert(JSON.stringify(error));

                reject(error);

                this.securityService.disconnect();

              });

      });
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private loadDetails(dates) {

    return new Promise( (resolve, reject) => {

        let session = this.securityService.checkAuthorization();
        let url     = REST_ADDRESS + 'details?session=' + session + '&dayDates=' + dates.toString();
        let headers = new Headers({ 'Content-Type': 'text/plain' });
        let options = new RequestOptions({ headers: headers });


        this.http
            .get(url, options)
            .map(res => res.json())
            .subscribe(details => {

                resolve( this.processDetail(details[0]) );

              },
              error => {

                alert(JSON.stringify(error));

                reject(error);

                this.securityService.disconnect();

              });

      });

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private storeCalculation(calculation) {

    let data      = {};
    let session   = this.securityService.checkAuthorization();
    let date      = this.selectedDate;
    let mealName  = this.selectedMealtime;

    let url       = REST_ADDRESS + 'foodEntries?session=' + session+ '&dayDate=' + date+ '&mealName=' + mealName;

    data['foodDescription']   = calculation.foodName;
    data['amountDescription'] = calculation.amountDescription;

    if (calculation.energyKiloJoulesPerEntry   ) { data['energy']         = calculation.energyKiloJoulesPerEntry.toFixed(0)    }
    if (calculation.proteinGramsPerEntry       ) { data['protein']        = calculation.proteinGramsPerEntry.toFixed(1)        }
    if (calculation.carbohydrateGramsPerEntry  ) { data['carbohydrate']   = calculation.carbohydrateGramsPerEntry.toFixed(1)   }
    if (calculation.sugarGramsPerEntry         ) { data['sugar']          = calculation.sugarGramsPerEntry.toFixed(1)          }
    if (calculation.starchGramsPerEntry        ) { data['starch']         = calculation.starchGramsPerEntry.toFixed(1)         }
    if (calculation.fatGramsPerEntry           ) { data['fat']            = calculation.fatGramsPerEntry.toFixed(1)            }
    if (calculation.saturatedFatGramsPerEntry  ) { data['saturatedFat']   = calculation.saturatedFatGramsPerEntry.toFixed(1)   }
    if (calculation.unsaturatedFatGramsPerEntry) { data['unsaturatedFat'] = calculation.unsaturatedFatGramsPerEntry.toFixed(1) }
    if (calculation.cholesterolGramsPerEntry   ) { data['cholesterol']    = calculation.cholesterolGramsPerEntry.toFixed(1)    }
    if (calculation.transFatGramsPerEntry      ) { data['transFat']       = calculation.transFatGramsPerEntry.toFixed(1)       }
    if (calculation.dietaryFibreGramsPerEntry  ) { data['dietaryFibre']   = calculation.dietaryFibreGramsPerEntry.toFixed(1)   }
    if (calculation.solubleFibreGramsPerEntry  ) { data['solubleFibre']   = calculation.solubleFibreGramsPerEntry.toFixed(1)   }
    if (calculation.insolubleFibreGramsPerEntry) { data['insolubleFibre'] = calculation.insolubleFibreGramsPerEntry.toFixed(1) }
    if (calculation.sodiumGramsPerEntry        ) { data['sodium']         = calculation.sodiumGramsPerEntry.toFixed(2)         }
    if (calculation.alcoholGramsPerEntry       ) { data['alcohol']        = calculation.alcoholGramsPerEntry.toFixed(1)        }

    let body    = JSON.stringify(data);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return new Promise((resolve, reject) => {
      this.http
        .post(url, body, options )
        .map(res => res.json())
        .subscribe(details => {

          resolve( this.processDetail(details[0]) );

        },
        error => {

          alert(JSON.stringify(error));

          reject(error);

          this.securityService.disconnect();

        })
    });

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}

