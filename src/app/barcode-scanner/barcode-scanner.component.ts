import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import jsQR from 'jsqr'
import { SocketService } from '../services/socket.service';
@Component({
  selector: 'barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})

export class BarcodeScannerComponent implements OnInit, AfterViewInit {

  @ViewChild('scanner', { static: false }) elLocalVideo!: ElementRef<HTMLVideoElement>
  @ViewChild('canvas', { static: false }) elCanvas!: ElementRef
  scanIsActive: boolean = false
  scanResult: string | null = null
  constructor(private socketService: SocketService) { }

  videoElement: Promise<MediaStream> = navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' }
  })
  canvasElement!: HTMLCanvasElement
  canvasContext!: CanvasRenderingContext2D
  ngOnInit(): void {
    this.socketService.on('get-user-details', (data) => {
      console.log(data)
    })
  }
  ngAfterViewInit(): void {
    this.canvasElement = this.elCanvas.nativeElement
    this.canvasContext = this.canvasElement.getContext('2d')!
  }
  development : any 
  async startScan() {
    this.elLocalVideo.nativeElement.srcObject = await this.videoElement
    this.elLocalVideo.nativeElement.setAttribute('displayinline','true')
    this.development = 'THIS IS THE NEW BUILD'
    this.scanIsActive = true
    this.elLocalVideo.nativeElement.play()
    requestAnimationFrame(this.scan.bind(this))
  }
  scan() {
    if (this.elLocalVideo.nativeElement.readyState === this.elLocalVideo.nativeElement.HAVE_ENOUGH_DATA) {

      this.canvasElement.height = this.elLocalVideo.nativeElement.videoHeight
      this.canvasElement.width = this.elLocalVideo.nativeElement.videoWidth

      this.canvasContext.drawImage(
        this.elLocalVideo.nativeElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      )
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      )
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      })

      if (code) {
        this.scanIsActive = false
        this.scanResult = code.data
        this.connectUserViaBarCode()
      } else {
        if (this.scanIsActive) requestAnimationFrame(this.scan.bind(this))

      }

    } else {
      requestAnimationFrame(this.scan.bind(this))
    }
  }

  reset() {
    this.scanResult = null
  }
  stopScan() {
    this.scanIsActive = false
  }
  connectUserViaBarCode() {
    this.socketService.emit('send-user-details', { userId: 'michael-alex-123', roomId: this.scanResult })

  }

}
