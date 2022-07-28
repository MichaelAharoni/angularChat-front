import { lastValueFrom ,map ,mergeMap,pipe, take, takeLast, tap } from 'rxjs';
import { Route, Router, RouterModule, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { User } from 'src/app/models/classes';
import { UserService } from 'src/app/services/user/user.service';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import jsQR from 'jsqr'
import { SocketService } from '../../services/socket/socket.service';
@Component({
  selector: 'qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss']
})
export class QrScannerComponent implements OnInit, AfterViewInit {

  @ViewChild('scanner', { static: false }) elLocalVideo!: ElementRef<HTMLVideoElement>
  @ViewChild('canvas', { static: false }) elCanvas!: ElementRef<HTMLCanvasElement>
  scanIsActive: boolean = false
  scanResult!: string
  user!: User
  contacts!:any

  constructor(
    private socketService: SocketService,
    private userService: UserService,
    private route:ActivatedRoute
  ) { }

  canvasElement!: HTMLCanvasElement
  canvasContext!: CanvasRenderingContext2D
  async ngOnInit(): Promise<void> {
      console.log('before')
      this.userService.$currUser.subscribe(user=>{this.user = user})
      // this.route.data.pipe(mergeMap(({contacts})=>contacts )).subscribe(mydata=>console.log('mydata', mydata) )
      this.route.data.subscribe(({contacts})=>this.contacts = contacts)      // this.route.data.subscribe(({contacts})=>{
      //   contacts.subscribe((con:any)=>console.log('con', con) )
      // })
    

  }
  async ngAfterViewInit(): Promise<void> {
    // const res = await lastValueFrom(this.route.data.subscribe(contacts=>contacts))
    // const res = 
    // console.log(res,'INSHALA')
    console.log('BAAAAA')
    this.canvasElement = this.elCanvas.nativeElement
    this.canvasContext = this.canvasElement.getContext('2d')!
    const rearCamera = (await navigator.mediaDevices.enumerateDevices()).filter((device) => device.kind === 'videoinput')[3]
    this.elLocalVideo.nativeElement.srcObject = await navigator.mediaDevices.getUserMedia(
      {
        video: {
          [(rearCamera) ? 'deviceId' : 'facingMode']: (rearCamera) ? rearCamera.deviceId : 'environment',
        }
      }) || await this.getSource()
  }


  async getSource(): Promise<MediaProvider> {
    const rearCamera = (await navigator.mediaDevices.enumerateDevices()).filter((device) => device.kind === 'videoinput')[3]

    return await navigator.mediaDevices.getUserMedia({
      video: {
        [(rearCamera) ? 'deviceId' : 'facingMode']: (rearCamera) ? rearCamera.deviceId : 'environment',
      }
    })
  }

  async startScan() {
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
        this.connectUserViaqr()
      } else {
        if (this.scanIsActive) requestAnimationFrame(this.scan.bind(this))

      }

    } else {
      requestAnimationFrame(this.scan.bind(this))
    }
  }

  stopScan() {
    this.scanIsActive = false
  }
  connectUserViaqr() {
    this.socketService.emit('send-user-details', { phoneNum: this.user.phoneNum, deviceId: this.scanResult })
  }
}
