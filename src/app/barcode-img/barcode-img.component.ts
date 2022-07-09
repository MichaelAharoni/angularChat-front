import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked, ChangeDetectionStrategy } from '@angular/core';
import { BarcodeServiceService } from '../services/barcode-service.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'barcode-img',
  templateUrl: './barcode-img.component.html',
  styleUrls: ['./barcode-img.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarcodeImgComponent implements OnInit, AfterViewChecked {


  socketId!: string
  barCodeImg!: string
  constructor(private barCodeService: BarcodeServiceService, private socketService: SocketService) {

  }
  ngOnInit(): void {

    this.socketId = this.barCodeService.getBarcodeId() as string
    this.socketService.emit('join-room',this.socketId)
    console.log(this.socketId)


    // subscribe to socket service here
    this.barCodeImg = this.barCodeService.generateBarcode(this.socketId)
    console.log(this.barCodeImg, ' line 25')
  }

  async ngAfterViewChecked(): Promise<void> {
  }
}
