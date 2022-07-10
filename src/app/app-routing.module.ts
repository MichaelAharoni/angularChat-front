import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { VideoChatComponent } from './video-chat/video-chat.component';

const routes: Routes = [
  {title:'Video chat',path:'video-chat',component:VideoChatComponent},
  {title:'Home',path:'',component:AppComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
