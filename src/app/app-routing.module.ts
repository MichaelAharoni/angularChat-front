import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { QrImgComponent } from './pages/qr-img/qr-img.component'
import { RootComponent } from './pages/root/root.component';
import { QrScannerComponent } from './pages/qr-scanner/qr-scanner.component'
import { VideoChatComponent } from './pages/video-chat/video-chat.component'
import { RegisterComponent } from './pages/register/register.component'
import { AuthenticateGuard } from './guards/authenticate.guard'
import { ContactResolver } from './resolvers/contact.resolver';

const routes: Routes = [
  { path: 'scan', component: QrScannerComponent, canActivate: [AuthenticateGuard],resolve:{contacts:ContactResolver} },
  { path: 'qr', component: QrImgComponent },
  { path: 'video-chat', component: VideoChatComponent, canActivate: [AuthenticateGuard] },
  { path: 'register', component: RegisterComponent },
  { path: '', component: RootComponent, canActivate: [AuthenticateGuard] },
]
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

