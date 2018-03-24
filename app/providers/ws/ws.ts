import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx';

/*
  Generated class for the Ws provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Ws {

  private token;
 
  constructor(private http: Http) {
  }

  get(path) {
	  return Observable.create(observer => {
  	    let headers = new Headers({ 'X-Thermo-Token': this.token });
	    let options = new RequestOptions({ headers: headers });

	    this.http.get("http://thermometre.olexa.fr/" + path, options)
	    .map(response => response.json())
	    .subscribe(response => {
	        if(response.status == "OK"){
	        	observer.next(response.data);
	        }
	        else observer.error(response.message);
	    }, error => {
	    	observer.error(error);
        }, () => {
        	observer.complete();
        });        	
	  });  		
  }

  post(path, postData) {
	return Observable.create(observer => {
	    this.http.post("http://thermometre.olexa.fr/" + path, JSON.stringify(postData))
	    .map(response => response.json())
	    .subscribe(response => {
	        if(response.status == "OK"){
	        	observer.next(response.data);
	        }
	        else observer.error(response.message);
	    }, error => {
	    	observer.error(error);
	    }, () => {
	    	observer.complete();
	    });
	});      	
  }

  login() {

  	if(this.token) {
	  return Observable.create(observer => {
            observer.next(this.token);
            observer.complete();
      });
  	}
  	else {
	  return Observable.create(observer => {
	    let data = {
	        "name": "myName",
	        "password": "myPasswd"
	    };

	    this.post("login/", data)
	    .subscribe((response: any) => {
        	this.token = response.token;
        	observer.next(response.token);
	    }, error => {
	    	observer.error(error);
        }, () => {
        	observer.complete();
        });        	
	  });  		
  	
  	}
  }

  getGraph(probe, period, width, height) {
  	return Observable.create(observer => {
  	  this.login().subscribe(token => {
	    this.get("graph/" + probe + "/" + period + "/?width=" + width + "&height=" + height)
	    .subscribe((response: any) => {
            	observer.next('data:' + response.mediatype + ';base64,' + response.data);
	    }, error => {
	    	observer.error(error);
        }, () => {
        	observer.complete();
        });
  	  }, error => {
        observer.error(error);
      });        	
  	});
  }

}

