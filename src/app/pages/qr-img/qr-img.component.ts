import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked, ChangeDetectionStrategy } from '@angular/core';
import { QrServiceService } from '../../services/qr-service.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'qr-img',
  templateUrl: './qr-img.component.html',
  styleUrls: ['./qr-img.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrImgComponent implements OnInit, AfterViewChecked {


  socketId!: string
  qrImg!: string
  constructor(private qrService: QrServiceService, private socketService: SocketService) {

  }
  ngOnInit(): void {

    this.socketId = this.qrService.getQrId() as string
    this.socketService.emit('join-room',this.socketId)

    // subscribe to socket service here
    this.qrImg = this.qrService.generateQr(this.socketId)
  }

  async ngAfterViewChecked(): Promise<void> {
  }
}
