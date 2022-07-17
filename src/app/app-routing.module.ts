import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { QrImgComponent } from './qr-img/qr-img.component';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { VideoChatComponent } from './video-chat/video-chat.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: 'scan', component: QrScannerComponent },
      { path: 'qr', component: QrImgComponent },
      { path: 'video-chat', component: VideoChatComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
