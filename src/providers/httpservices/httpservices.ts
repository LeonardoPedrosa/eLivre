import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http'

@Injectable()
export class HttpservicesProvider {
  private url:string = 'http://zaitetecnologia1.tempsite.ws/myPetAPI';

  constructor(public http: Http) {
    console.log('Hello HttpservicesProvider Provider');
  }


  save(endpoint, resources){
  let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    
    let options = new RequestOptions({ headers: headers});
    
    return this.http.post(`${this.url}/${endpoint}`, resources , options)
      .map(res => {
        return res.json()
      });
  }
}
