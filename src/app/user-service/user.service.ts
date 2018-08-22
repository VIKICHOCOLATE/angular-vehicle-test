import { DataStorage } from '../data-storage';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Http, Response, RequestOptionsArgs } from '@angular/http';

import { Observable } from 'rxjs';
import { of } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { User } from '../models/user';
import { VehiclePosition } from '../models/vehiclePosition';

import * as _ from 'lodash';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class UserService {

  private usersUrl = 'http://mobi.connectedcar360.net/api/?op=list';  // URL to get all users
  private usersTimeout = 5 * 60;

  private locationsUrl = 'http://mobi.connectedcar360.net/api/?op=getlocations&userid='; // URL to get all vehicle locations
  private locationsTimeout = 30;

  private localStorage: any;

  constructor(
    private http: Http) {
      this.localStorage = window.localStorage;
    }

    /** GET users from the server */
  getUser(id: number): Observable<User> {
      return this.getUsers()
      .map((users) => {
          return _.find(users, (user) => {
              return user.userid === id;
          });
      });
  }

  getUsers(): Observable<User[]> {
      if (!_.isNil(this.localStorage)) {
          var localData = this.getDataFromLocalStorage<User[]>('users');

          if (!_.isNil(localData) && !localData.isExpired(this.usersTimeout)) {
              return of<User[]>(localData.data);
          }
      }
      return this.getUsersRemotely();
  }

  private getUsersRemotely(): Observable<User[]> {
    let options = this.getRequestOptions();

    return this.http.get(this.usersUrl, options)
            .catch(this.handleError)
            .map(this.extractData)
            .do(data => this.setDataToLocalStorage('users', data));
}

getVehicleLocations(userid: number): Observable<VehiclePosition[]> {
  if (!_.isNil(this.localStorage)) {
      var localData = this.getDataFromLocalStorage<VehiclePosition[]>(`vehiclePositions_${userid}`);

      if (!_.isNil(localData) && !localData.isExpired(this.locationsTimeout)) {
          return of<VehiclePosition[]>(localData.data);
      }
  }
  return this.getVehiclePositionsRemotely(userid);
}

private getVehiclePositionsRemotely(userid: number): Observable<VehiclePosition[]> {
  let options = this.getRequestOptions();

  return this.http.get(`${this.locationsUrl}${userid}`, options)
      .catch(this.handleError)
      .map(this.extractData)
      .do(data => this.setDataToLocalStorage(`vehiclePositions_${userid}`, data));
}

  private getDataFromLocalStorage<T>(name: string): DataStorage<T> {
    var data = this.localStorage.getItem(name);

    if (!_.isNil(data)) {
        var rawLocalData = JSON.parse(data);
        return new DataStorage<T>(rawLocalData.modifiedAt, rawLocalData);
    }
    return null;
  }

  getAddress(lat: number, lon: number) {
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}`)
        .map(this.extractData);
}

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
        errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
}
  private getRequestOptions(): RequestOptionsArgs {
    let options = {
      search: new URLSearchParams()
      };
      options.search.set('timestamp', (new Date()).getTime().toString());

        return options;
    }

  private extractData(res: Response): any {
      let body = res.json();
      return body.data || body.results || {};
  }

  private setDataToLocalStorage<T>(name: string, data: any): void {
    this.localStorage.setItem(name, JSON.stringify(data));
  }
}
