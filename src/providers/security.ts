import {Storage}                        from '@ionic/storage';
import {Injectable}                     from '@angular/core';
import {Http, Headers, RequestOptions}  from '@angular/http';

import connection from './connection';

import 'rxjs/add/operator/map';

const REST_ADDRESS = connection + 'security/';

@Injectable()
export class SecurityService {

  public currentSession:      any     = null;

  private useLocalStorage: boolean    = true;

  constructor(
    public http: Http, 
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

  checkSavedSession(): Promise<any> {
 
    return this.localStorage.get('session').then(data => {
 
      if (data) {

        this.currentSession = JSON.parse(data);

        if (this.currentSession && this.currentSession.authorizationExpires){
          this.currentSession.expires = new Date(this.currentSession.authorizationExpires);
        }

      };

    });
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  checkAuthorization(): String {

    if (this.currentSession && this.currentSession.expires){

      let now = new Date();

      if (now < this.currentSession.expires){

        return this.currentSession.sessionGuid;

      }

    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  processSession(session){

      this.currentSession = session;

      if (this.currentSession && this.currentSession.authorizationExpires){
        this.currentSession.expires = new Date(this.currentSession.authorizationExpires);
      }

      if (this.useLocalStorage === true){
          this.localStorage.set('session', JSON.stringify(this.currentSession) );
      }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  connectAnonymously(): Promise<any> {

    if (this.currentSession) {
      // already loaded data
      return Promise.resolve(this.currentSession);
    }

    return new Promise(resolve => {

      let url     = REST_ADDRESS + 'anonymousUsers/authorizations';
      let headers = new Headers({ 'Content-Type': 'text/plain' });
      let options = new RequestOptions({ headers: headers });

      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(data => {

          this.processSession(data[0]);

          resolve(data[0]);

        });

    });

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  connectIdentifed(email: string, password: string): Promise<any> {

    return new Promise( (resolve, reject) => {

      let authorization = "Basic " + window.btoa(email + ':' + password);
      let url           = REST_ADDRESS + 'existingUsers/authorizations';
      let headers       = new Headers({ 'Content-Type': 'text/plain', authorization: authorization });
      let options       = new RequestOptions({ headers: headers });

      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(data => {

          this.processSession(data[0]);

          resolve(data[0]);

        }, error => {
          reject(error);
        });

    });

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  disconnect() {

    this.processSession(undefined);

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  regiesterAnonymousSession(email: string, password: string) {

    this.currentSession = undefined;

    this.localStorage.set('session', undefined)

    return new Promise( (resolve, reject) => {

      let authorization = "Basic " + window.btoa(email + ':' + password);
      let session       = this.checkAuthorization();
      let url           = REST_ADDRESS + 'registeringUsers/authorizations?session=' + session;
      let headers       = new Headers({ 'Content-Type': 'text/plain', authorization: authorization });
      let options       = new RequestOptions({ headers: headers });

      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(data => {

          this.processSession(data[0]);

          resolve(data[0]);

        }, error => {
          reject(error);
        });

    });

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


}

