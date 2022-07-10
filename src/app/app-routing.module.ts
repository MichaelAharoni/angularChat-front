import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BarcodeImgComponent } from './barcode-img/barcode-img.component';
import { BarcodeScannerComponent } from './barcode-scanner/barcode-scanner.component';
import { VideoChatComponent } from './video-chat/video-chat.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: 'scan', component: BarcodeScannerComponent },
      { path: 'qr', component: BarcodeImgComponent },
      { path: 'video-chat', component: VideoChatComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
