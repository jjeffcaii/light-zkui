import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SidebarComponent} from "./sidebar/sidebar.component";
import {StatsComponent} from './stats/stats.component';
import {HttpModule} from "@angular/http";
import {RouterModule, Routes} from "@angular/router";
import {ZnodesComponent} from './znodes/znodes.component';
import {ProfileComponent} from './profile/profile.component';
import {AboutComponent} from './about/about.component';
import {TabsModule} from "ngx-bootstrap";

const router: Routes = [
  {path: "stats", component: StatsComponent},
  {path: "znodes", component: ZnodesComponent},
  {path: "profile", component: ProfileComponent},
  {path: "about", component: AboutComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    StatsComponent,
    ZnodesComponent,
    ProfileComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(router),
    TabsModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
