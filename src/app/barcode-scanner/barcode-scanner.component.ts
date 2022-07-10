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
  @ViewChild('canvas', { static: false }) elCanvas!: ElementRef<HTMLCanvasElement>
  scanIsActive: boolean = false
  scanResult :string|null = null
  constructor(private socketService : SocketService) { }

  videoElement!: any
  canvasElement!: HTMLCanvasElement
  canvasContext!: any

  ngOnInit(): void {
    this.socketService.on('get-user-details',(data)=>{
      console.log(data)
    })
  }
  ngAfterViewInit(): void {
    this.videoElement = this.elLocalVideo.nativeElement
    this.canvasElement = this.elCanvas.nativeElement
    this.canvasContext = this.canvasElement.getContext('2d')

  }
  
  async startScan() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    })
    this.videoElement.srcObject = stream
    this.videoElement.setAttribute('playsinline', true)
    console.log(this.videoElement.constructor.name)
    this.scanIsActive = true
    this.videoElement.play()
    requestAnimationFrame(this.scan.bind(this))
  }
  scan() {
    // this.scanIsActive = true
    console.log('scan')
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {

      this.canvasElement.height = this.videoElement.videoHeight
      this.canvasElement.width = this.videoElement.videoWidth

      this.canvasContext.drawImage(
        this.videoElement,
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
  connectUserViaBarCode(){
    console.log(this.scanResult)
    this.socketService.emit('send-user-details',{userId:'michael-alex-123',roomId:this.scanResult})

  }

}
