import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app-cmp/app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { VideoChatComponent } from './pages/video-chat/video-chat.component';
import { ContactPickerComponent } from './cmps/contact-picker/contact-picker.component';
import { HttpClientModule } from '@angular/common/http';
import { QrScannerComponent } from './pages/qr-scanner/qr-scanner.component';
import { QrImgComponent } from './pages/qr-img/qr-img.component';
import { RegisterComponent } from './pages/register/register.component';
import { RootComponent } from './pages/root/root.component';
import { FocusDirective } from './directives/focus.directive'

const config: SocketIoConfig = {
  url: environment.socketUrl, // socket server url;
  options: {
    transports: ['websocket']
  }
}

@NgModule({
  declarations: [
    AppComponent,
    VideoChatComponent,
    ContactPickerComponent,
    QrScannerComponent,
    QrImgComponent,
    RegisterComponent,
    RootComponent,
    FocusDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
