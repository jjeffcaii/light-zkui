import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {SidebarComponent} from "./sidebar/sidebar.component";
import {StatsComponent} from './stats/stats.component';
import {BrowserXhr, HttpModule} from "@angular/http";
import {RouterModule, Routes} from "@angular/router";
import {ZnodesComponent} from './znodes/znodes.component';
import {ProfileComponent} from './profile/profile.component';
import {AboutComponent} from './about/about.component';
import {ButtonsModule, ModalModule, TabsModule} from "ngx-bootstrap";
import {NgProgressBrowserXhr, NgProgressModule} from "ngx-progressbar";
import {ContextMenuModule} from "ngx-contextmenu";
import {ZnodeEditorComponent} from './znode-editor/znode-editor.component';

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
    ZnodeEditorComponent,
  ],
  imports: [
    BrowserModule,
    ButtonsModule.forRoot(),
    ContextMenuModule,
    HttpModule,
    ModalModule.forRoot(),
    NgProgressModule,
    RouterModule.forRoot(router),
    TabsModule.forRoot(),
  ],
  providers: [
    {provide: BrowserXhr, useClass: NgProgressBrowserXhr}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
