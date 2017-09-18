import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SidebarComponent} from "./sidebar/sidebar.component";
import {StatsComponent} from './stats/stats.component';
import {HttpModule} from "@angular/http";

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    StatsComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
