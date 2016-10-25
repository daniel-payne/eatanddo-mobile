import {Injectable}                     from '@angular/core';
import {Http, Headers, RequestOptions}  from '@angular/http';

import connection from './connection';

import 'rxjs/add/operator/map';

const REST_ADDRESS = connection + 'search/';

@Injectable()
export class SearchService {

  //units:           any[];

  selectedTerm:            string;
  currentMatches:          any[];

  selectedMatch:           any;

  selectedAmount:          any;
  selectedUnitName:        any;
  currentCalculation:      any;

  constructor(
    public http: Http
    ) {
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  chooseTerm(term: string) {

    this.selectedTerm = term;

    return this.loadMatches(term).then((matches: any[]) => {

      this.currentMatches = matches;

      return Promise.resolve(matches);

    });
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  chooseMatch(foodId: string) {

    let result: any;

    this.currentMatches.some((item: any) => {

      if (item.foodId === foodId) {
        result = item;
      }

      return result !== undefined;

    });

    this.selectedMatch = result;

    return Promise.resolve(result);

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  chooseCalculation(foodId: string, amount: number, unitName: string) {

    this.selectedAmount   = amount;
    this.selectedUnitName = unitName;

    return this.loadCalculation(foodId, amount, unitName).then((calculation: any[]) => {

      this.currentCalculation = calculation;

      return Promise.resolve(calculation);

    });
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  clearSelection() {

    this.selectedTerm        = undefined;
    this.currentMatches      = [];

    this.selectedAmount      = undefined;
    this.selectedUnitName    = undefined;

    this.currentCalculation  = {};

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private loadMatches(term: string) {

    this.selectedTerm = term;

    return new Promise(resolve => {

      let url     = REST_ADDRESS + 'foodNames?match=' + term + '&sources=ead%20cofid%20phe & maxResults=10';
      let headers = new Headers({ 'Content-Type': 'text/plain' });
      let options = new RequestOptions({ headers: headers });

      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private loadCalculation(foodId: string, amount: number, unitName: string) {

    return new Promise(resolve => {

      let url     = REST_ADDRESS + 'foodCalculations?foodId=' + foodId +'&amount='+ amount +'&unitName=' + unitName;
      let headers = new Headers({ 'Content-Type': 'text/plain' });
      let options = new RequestOptions({ headers: headers });

      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data[0]);
        });
    });

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


}

