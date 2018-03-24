import { Component } from '@angular/core';
import { Platform, ionicBootstrap, Events } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
//import { TabsPage } from './pages/tabs/tabs';
import { GraphPage } from './pages/graph/graph';

import { Ws } from './providers/ws/ws';


@Component({
  templateUrl: 'build/app.html'
})
export class MyApp {

  public rootPage: any;

  constructor(private platform: Platform, private events: Events) {
    this.rootPage = GraphPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  setProbe(probe) {
    this.events.publish('graph:probe', probe);
  }
}

ionicBootstrap(MyApp, [Ws]);
