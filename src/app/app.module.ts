import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { MapComponent } from './map/map.component';
import { AppRoutingModule } from './app-routing.module';

import { AgmCoreModule } from '@agm/core';

/* bootstrap settings */
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,

    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),

/* google map key */
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBFG_y34LXU8p6LizVPIfXlcKsQF_5qoV4',
      libraries: ['places']
    })
  ],
  declarations: [
    AppComponent,
    MapComponent,
    UsersComponent,
    UserDetailComponent
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
