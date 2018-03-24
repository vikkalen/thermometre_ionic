import { Component, ViewChild } from '@angular/core';
import { Page, Alert, NavController, Platform , Content, Events} from 'ionic-angular';

import {Observable} from 'rxjs/Rx';

import { Ws } from '../../providers/ws/ws';

import { nativeRaf } from 'ionic-angular/util/dom';

@Component({
  templateUrl: 'build/pages/graph/graph.html'
})
export class GraphPage {
    @ViewChild(Content) content: Content;

    probe = 'temperature';
    img = {};

    constructor(private ws: Ws, private nav: NavController, private platform: Platform, private events: Events) {
    }

	ngOnInit() {
    let self = this;

		this.platform.ready().then(function(){
      self.content.resize();
      nativeRaf(function(){self.doLoadGraph()});
/*
      window.setTimeout(function(){
        self.doLoadGraph();
      }, 300);
*/
		});

    this.events.subscribe('app:rotated', function(){
       self.content.resize();
       nativeRaf(function(){self.doLoadGraph()});
/*
    	window.setTimeout(function(){
      	self.doLoadGraph();
      }, 300);
*/
  	});

    this.events.subscribe('graph:probe', function(args){
      self.probe = args[0];
      self.loadGraph().subscribe(
           img => {self.img = img;},
           error => {console.log(error);}
      );

    });

	}

    doLoadGraph() {
    	this.loadGraph().subscribe(
           img => {this.img = img;},
           error => {console.log(error);}
    	);
	  }

    doRefresh(refresher) {
    	this.loadGraph().subscribe(
           img => {this.img = img; refresher.complete();},
           error => {console.log(error); refresher.complete();}
    	);
	  }

    loadGraph() {
     	let dimensions = this.content.getContentDimensions();
      let width = dimensions.contentWidth;
    	let height = dimensions.contentHeight - this.content.contentTop;
        return Observable.forkJoin(
	        this.ws.getGraph(this.probe, 'daily', width, height),
	        this.ws.getGraph(this.probe, 'weekly', width, height),
	        this.ws.getGraph(this.probe, 'monthly', width, height),
	        this.ws.getGraph(this.probe, 'yearly', width, height)
	    );        	
    }


}
