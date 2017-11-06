import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NovoElementsModule, NovoElementProviders } from 'novo-elements';

import { AppComponent } from './app.component';
import { AppBridgeService } from './service/app-bridge.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NovoElementsModule,
    NovoElementProviders.forRoot(),
  ],
  providers: [
    AppBridgeService,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
