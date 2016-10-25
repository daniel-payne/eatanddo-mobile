import {Storage}                        from '@ionic/storage';
import {Injectable}                     from '@angular/core';
import {Http, Headers, RequestOptions}  from '@angular/http';

import {List}                           from 'immutable';

import {SecurityService}     from './security';
import {SearchService}       from './search';


import connection from './connection';

import 'rxjs/add/operator/map';

const REST_ADDRESS = connection + 'diary/';

@Injectable()
export class DiaryService {

  public selectedDate:  string = null;
  public currentDay:    any    = null;

  public selectedMealtime:  string;
  public selectedLookback:  number;
  public currentEntries:    any[];

  private useLocalStorage: boolean = true;

  constructor(private http: Http, private securityService: SecurityService, private searchService: SearchService, public localStorage: Storage) {

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

  private processDay(day): any {

    let newItem;

    let daysOfWeek = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

    if (day.totalEnergyKiloJoulesPerDay) { day.totalEnergyCaloriesPerDay = day.totalEnergyKiloJoulesPerDay / 4.184; }

    ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(function (meal) {

      day[meal + 'Items'] = [];

      ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'].forEach(function (itemNo) {

        if (day[meal + itemNo + 'EnergyKiloJoulesPerEntry']) {

          day[meal + itemNo + 'EnergyCaloriesPerEntry'] =  (day[meal + itemNo + 'EnergyKiloJoulesPerEntry'] / 4.184).toFixed(0);

          if (day[meal + itemNo + 'SodiumGramsPerEntry']) {
            day[meal + itemNo + 'SaltGramsPerEntry'] = (day[meal + itemNo + 'SodiumGramsPerEntry'] / 2.5000).toFixed(2);
          }

          newItem = {

              meal:     meal,
              itemNo:   itemNo,

              foodDescription:             day[meal + itemNo + 'FoodDescription'],
              amountDescription:           day[meal + itemNo + 'AmountDescription'],

              energyKiloJoulesPerEntry:    day[meal + itemNo + 'EnergyKiloJoulesPerEntry'],
              proteinGramsPerEntry:        day[meal + itemNo + 'ProteinGramsPerEntry'],
              carbohydrateGramsPerEntry:   day[meal + itemNo + 'CarbohydrateGramsPerEntry'],
              sugarGramsPerEntry:          day[meal + itemNo + 'SugarGramsPerEntry'],
              starchGramsPerEntry:         day[meal + itemNo + 'StarchGramsPerEntry'],
              fatGramsPerEntry:            day[meal + itemNo + 'FatGramsPerEntry'],
              saturatedFatGramsPerEntry:   day[meal + itemNo + 'SaturatedFatGramsPerEntry'],
              unsaturatedFatGramsPerEntry: day[meal + itemNo + 'UnsaturatedFatGramsPerEntry'],
              cholesterolGramsPerEntry:    day[meal + itemNo + 'CholesterolGramsPerEntry'],
              transFatGramsPerEntry:       day[meal + itemNo + 'TransFatGramsPerEntry'],
              dietaryFibreGramsPerEntry:   day[meal + itemNo + 'DietaryFibreGramsPerEntry'],
              solubleFibreGramsPerEntry:   day[meal + itemNo + 'SolubleFibreGramsPerEntry'],
              insolubleFibreGramsPerEntry: day[meal + itemNo + 'InsolubleFibreGramsPerEntry'],
              sodiumGramsPerEntry:         day[meal + itemNo + 'SodiumGramsPerEntry'],
              alcoholGramsPerEntry:        day[meal + itemNo + 'AlcoholGramsPerEntry'],

              energyCaloriesPerEntry:      day[meal + itemNo + 'EnergyCaloriesPerEntry'],
              saltGramsPerEntry:           day[meal + itemNo + 'SaltGramsPerEntry']
          }

          day[meal + 'Items'].push(newItem);

        }


      });

    });

    if (day.dayDate) {
      day.dayName = daysOfWeek[new Date(day.dayDate).getDay()];
    }

    return day;

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  chooseDate(date: string) {

    if ((!date) || (date.toUpperCase() === 'TODAY')) {

      date = (new Date()).toISOString().substr(0, 10);

    } else if (date.toUpperCase() === 'YESTERDAY'){

      date = (new Date((new Date()).getTime() + (86400000 * -1))).toISOString().substr(0, 10);

    }

    this.selectedDate = date;

    return this.loadDetails(date).then((day: Day) => {

      this.currentDay = day;

      return Promise.resolve(day);

    });

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  chooseMealtime(mealtime: string) {

    this.selectedMealtime = mealtime;

    return Promise.resolve(mealtime);

  }

  chooseCalculation(calculation: any) {

    return this.storeCalculation(calculation).then((day: Day) => {

      this.currentDay = day;

      return Promise.resolve(day);

    });

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private loadDetails(date) {

    return new Promise( (resolve, reject) => {

      this.localStorage.get('day:' + date).then(data => {

        let savedDay;

        let session = this.securityService.checkAuthorization();
        let url     = REST_ADDRESS + 'details?session=' + session + '&dayDate=' + date;
        let headers = new Headers({ 'Content-Type': 'text/plain' });
        let options = new RequestOptions({ headers: headers });

        if (data) {

          savedDay = JSON.parse(data);

          url = url + '&editCount=' + savedDay.editCount;

        };

        this.http
            .get(url, options)
            .map(res => res.json())
            .subscribe(data => {

                let day = data[0];

                if ((savedDay) && (day.editCount === savedDay.editCount)) {

                  resolve(savedDay);

                } else {

                  day =  this.processDay(day);

                  resolve(day);

                  if (this.useLocalStorage === true){

                    this.localStorage.set( 'day:' + date, JSON.stringify(day) );

                  }
                }

              },
              error => {

                alert(JSON.stringify(error));

                reject(error);

                this.securityService.disconnect();

              });

      });

    });

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private storeCalculation(calculation) {

    let data      = {};
    let session   = this.securityService.checkAuthorization();
    let date      = this.currentDay.dayDate;
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
        .subscribe(data => {

          let day = this.processDay(data[0]);

          resolve(day);

          this.localStorage.set('day:' + date, JSON.stringify(day));

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

