import { Router } from '@angular/router';
import { UserService } from './../../services/user/user.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { QrServiceService } from '../../services/qr/qr-service.service';
import { SocketService } from '../../services/socket/socket.service';

@Component({
  selector: 'qr-img',
  templateUrl: './qr-img.component.html',
  styleUrls: ['./qr-img.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrImgComponent implements OnInit {


  socketId!: string
  qrImg!: string
  constructor(
    private qrService: QrServiceService,
    private socketService: SocketService,
    private userService: UserService,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    this.socketService.on('get-user-details', async (phoneNum: string) => {
      console.log('GETINGETINGETINGETINGETINGETINGETINGETINGETINGETINGETINGETINGETINGETINGETINGETINGETINGETINGETINGETINGETINGETINGETINGETIN')
      await this.userService.login({ phoneNum })
      this.router.navigateByUrl('/')
    })
    this.socketId = this.qrService.getQrId() as string
    this.socketService.emit('join-room', this.socketId)

    // subscribe to socket service here
    this.qrImg = this.qrService.generateQr(this.socketId)
  }

}
