import { SocketService } from './../services/socket.service';
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';

@Component({
  selector: 'video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.scss'],
})

export class VideoChatComponent implements OnInit {

  constructor(private socketService: SocketService, private zone: NgZone) { }

  sendRoomName(room: HTMLInputElement) {
    this.socketService.emit('join-room', room.value)
    room.value = ''
  }
  cameraMode = 'environment'
  localStream!: MediaStream
  remoteStream!: MediaStream
  peerConn!: RTCPeerConnection
  isAudio: boolean = true
  isVideo: boolean = true
  isGettingACall: boolean = false
  @ViewChild('videoGrid') elContainer!: ElementRef<HTMLDivElement>
  @ViewChild('localVideo') elLocalVideo!: ElementRef<HTMLVideoElement>
  @ViewChild('remoteVideo') elRemoteVideo!: ElementRef<HTMLVideoElement>
  newOffer!: RTCSessionDescription

  // facingMode : { exact : 'envinronment'},
  // consider adding facingmode

  async createPeerConnection() {

    if (!this.localStream) {
      await this.setLocalStream()
      // this.localStream = await navigator.mediaDevices.getUserMedia({
      //   video: {
      //     facingMode:cameraOpt,
      //     frameRate: 24,
      //     width: {
      //       min: 480, ideal: 720, max: 1280
      //     },
      //     aspectRatio: 1.33333
      //   },
      //   audio: true
      // })
    }

    this.elContainer.nativeElement.style.display = 'inline'
    // this.elLocalVideo.nativeElement.srcObject =   this.localStream
    this.remoteStream = new MediaStream()
    this.elRemoteVideo.nativeElement.srcObject = this.remoteStream
    this.elRemoteVideo.nativeElement.style.display = 'block'

    // https://xirsys.com/ STUN / TURN servers generator
    let configuration: RTCConfiguration = {
      iceServers: [
        { urls: ["stun:fr-turn1.xirsys.com"] }
        , {
          username: "ZclC25cEtLYQ_aecQg-DjFSyjrvJUdfQyBBBfXj3Sme-GMXGy1hSA_q3aucOY1EFAAAAAGLH9e50ZXN0ZXI=",
          credential: "a70074a8-fe9e-11ec-8ef4-0242ac120004",
          urls: ["turn:fr-turn1.xirsys.com:80?transport=udp",
            "turn:fr-turn1.xirsys.com:3478?transport=udp",
            "turn:fr-turn1.xirsys.com:80?transport=tcp",
            "turn:fr-turn1.xirsys.com:3478?transport=tcp",
            "turns:fr-turn1.xirsys.com:443?transport=tcp",
            "turns:fr-turn1.xirsys.com:5349?transport=tcp"
          ]
        }]
    }

    this.peerConn = new RTCPeerConnection(configuration)
    this.localStream.getTracks().forEach(track => this.peerConn.addTrack(track, this.localStream));
    this.peerConn.ontrack = (ev: RTCTrackEvent) => {
      ev.streams[0].getTracks().forEach((track: MediaStreamTrack) => {
        this.remoteStream.addTrack(track)
      })
    }
    this.peerConn.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) this.socketService.emit('store-candidate', event.candidate)
    }
  }

  async createOffer() {
    await this.createPeerConnection()
    const offer: RTCSessionDescriptionInit = await this.peerConn.createOffer()
    await this.peerConn.setLocalDescription(offer)
    this.socketService.emit('store-offer', offer)
  }

  async createAnswer(offer: RTCSessionDescription) {
    await this.createPeerConnection()
    await this.peerConn.setRemoteDescription(offer)
    const answer = await this.peerConn.createAnswer()
    await this.peerConn.setLocalDescription(answer)
    this.socketService.emit('store-answer', answer)
  }

  muteAudio() {
    this.isAudio = !this.isAudio
    this.localStream.getAudioTracks()[0].enabled = this.isAudio
  }

  muteVideo() {
    this.isVideo = !this.isVideo
    this.localStream.getVideoTracks()[0].enabled = this.isVideo
  }

  answerCall(bool: boolean) {
    if (bool) {
      this.createAnswer(this.newOffer)
    }
    this.toggleIsGettingACall(false)
  }

  toggleIsGettingACall(bool: boolean) {
    this.isGettingACall = bool
  }

  switchLocalToRemoteSrc(): void {
    const currLocalSrc = this.elLocalVideo.nativeElement.srcObject
    this.elLocalVideo.nativeElement.srcObject = this.elRemoteVideo.nativeElement.srcObject
    this.elRemoteVideo.nativeElement.srcObject = currLocalSrc
  }
  async toggleCamera() {
    this.cameraMode = (this.cameraMode === 'user') ? 'environment' : 'user'
    await this.setLocalStream()
    this.zone.run(() => {
      console.log('enabled time travel');
    });

  }
  async ngOnInit(): Promise<void> {
    // const cameraOpt  = (this.cameraMode==='front')?  'user' :  'environment' 
    // this.localStream = await navigator.mediaDevices.getUserMedia({
    //   video: {
    //     facingMode:cameraOpt,
    //     frameRate: 24,
    //     width: {
    //       min: 480, ideal: 720, max: 1280
    //     },
    //     aspectRatio: 1.33333
    //   },
    //   audio: true
    // })
    await this.setLocalStream()
    this.socketService.on('got-answer', async (answer) => {
      if (!this.peerConn.currentRemoteDescription) await this.peerConn.setRemoteDescription(answer as RTCSessionDescriptionInit)
    })
    this.socketService.on('got-offer', async (offer) => {
      this.newOffer = offer as RTCSessionDescription
      this.toggleIsGettingACall(true)
    })
    this.socketService.on('got-candidate', async (candidate: RTCIceCandidateInit) => { if (this.peerConn && this.peerConn.remoteDescription?.type) await this.peerConn.addIceCandidate(candidate) })
  }
  async setLocalStream(): Promise<void> {
    if(this.localStream)this.localStream.getTracks().forEach((track) => track.stop())
    const cameraOpt = (this.cameraMode === 'user') ? 'user' : 'environment'
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: cameraOpt,
        frameRate: 24,
        width: {
          min: 480, ideal: 720, max: 1280
        },
        aspectRatio: 1.33333
      },
      audio: true
    })
    this.elLocalVideo.nativeElement.srcObject =   this.localStream
    // this.elContainer.nativeElement.style.display = 'inline'
    // this.remoteStream = new MediaStream()
    // this.elRemoteVideo.nativeElement.srcObject = this.remoteStream
    // this.elRemoteVideo.nativeElement.style.display = 'block'


  }
  

}
