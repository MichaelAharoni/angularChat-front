import { SocketService } from './../services/socket.service';
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, isDevMode } from '@angular/core';

@Component({
  selector: 'video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.scss'],
})

export class VideoChatComponent implements OnInit {

  constructor(private socketService: SocketService, private cd: ChangeDetectorRef) { }

  sendRoomName(room: HTMLInputElement) {
    this.socketService.emit('join-room', room.value)
    room.value = ''
  }
  cameraMode = 'user'
  localStream!: MediaStream
  remotesStream: MediaStream[] = []
  peerConn!: RTCPeerConnection
  isAudio: boolean = true
  isVideo: boolean = true
  isGettingACall: boolean = false
  @ViewChild('videoGrid') elContainer!: ElementRef<HTMLDivElement>
  @ViewChild('localVideo') elLocalVideo!: ElementRef<HTMLVideoElement>
  @ViewChild('remotesContainer') elRemotesContainer!: ElementRef<any>
  newOffer!: RTCSessionDescription


  async createPeerConnection(userPhone: string) {
    if (!this.localStream) await this.setLocalStream()
    // if (this.remotesStream.length === 0) this.appendVideoElement(userPhone)
    if (this.remotesStream.length === 0) {
      this.appendVideoElement(userPhone)
      this.elContainer.nativeElement.style.display = 'inline'
      this.remotesStream.push(new MediaStream())

    }
    this.elRemotesContainer.nativeElement.childNodes.forEach((elRemoteVideo: HTMLVideoElement, idx: number) => {
      elRemoteVideo.srcObject = this.remotesStream[idx]
    }) //MUST COME BACK TO HERE
    this.elRemotesContainer.nativeElement.style.display = 'block'
    // https://xirsys.com/ STUN / TURN servers generator
    let configuration: RTCConfiguration = {
      iceServers: (isDevMode()) ? [] : [{
        urls: ["stun:fr-turn1.xirsys.com"]
      },
      {
        username: "xpERkAhL9TZK1EOyJivYiJfHfdvVN_cY1FY1lyiO1rB2_fsyLZgff7WFYf991YYKAAAAAGLNI-90ZXN0ZXIz",
        credential: "0381e2ac-01b5-11ed-8bc8-0242ac120004",
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
      ev.streams.forEach((stream, idx) => {
        stream.getTracks().forEach((track: MediaStreamTrack) => {
          this.remotesStream[idx].addTrack(track)
        })
      })
    }
    this.peerConn.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) this.socketService.emit('store-candidate', event.candidate)
    }
    this.peerConn.addEventListener("iceconnectionstatechange", async event => {
      if (['failed', 'disconnected', 'close'].includes(this.peerConn.iceConnectionState)) {
        console.log('restarting because of connection state changed !')
        await this.renewOffer('phone')
      }
    });
    this.peerConn.addEventListener('signalingstatechange', (event) => {
      console.log(1)
    })
    this.peerConn.addEventListener('icecandidateerror', (event) => {
      console.log(2)
    })
    this.peerConn.addEventListener(('icegatheringstatechange'), (event) => {
      console.log(3)
    })
    this.peerConn.addEventListener(('negotiationneeded'), async (event) => {
      console.log(4)
    })
  }


  appendVideoElement(phone: string) {
    const elVideo = document.createElement("video")
    elVideo.classList.add('remote-video')
    elVideo.style.transform = 'rotateY(180deg)'
    elVideo.autoplay = true
    elVideo.playsInline = true
    elVideo.setAttribute('data-id', phone)
    elVideo.style.boxSizing = 'border-box'
    elVideo.style.border = `3px solid hsl(${Math.round(Math.random() * 360)}deg 100% 50%)`
    this.elRemotesContainer.nativeElement.appendChild(elVideo)
    // this.cd.markForCheck()
  }


  removeVideoElement(phone: string) {
    const elVideo: HTMLVideoElement = Array.from(this.elRemotesContainer.nativeElement.childNodes)
      .find((el) => elVideo.getAttribute('data-id') === phone) as HTMLVideoElement
    const srcObj = elVideo.srcObject as MediaStream
    srcObj.getTracks().forEach(function (track) {
      track.stop()
    })
    elVideo.srcObject = null
    elVideo.parentNode?.removeChild(elVideo)
    // this.cd.markForCheck()
    // MUST COME BACK HERE
  }


  async createOffer(userPhone: string) {
    await this.createPeerConnection(userPhone)
    const offer: RTCSessionDescriptionInit = await this.peerConn.createOffer()
    await this.peerConn.setLocalDescription(offer)
    this.socketService.emit('store-offer', offer)
  }


  async renewOffer(userPhone: string) {
    await this.createPeerConnection(userPhone)
    const offer: RTCSessionDescriptionInit = await this.peerConn.createOffer()
    await this.peerConn.setLocalDescription(offer)
    this.socketService.emit('re-store-offer', offer)
  }


  async createAnswer(offer: RTCSessionDescription) {
    await this.createPeerConnection('phone')
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


  async switchLocalToRemoteSrc(): Promise<void> {
    if (this.remotesStream.length > 1) return
    const currRemoteStream = this.elRemotesContainer.nativeElement.childNodes[0]
    const currLocalSrc = this.elRemotesContainer.nativeElement.childNodes[0]
    this.elLocalVideo.nativeElement = currRemoteStream
    this.elRemotesContainer.nativeElement = currLocalSrc
    await this.setLocalStream()
  }


  async toggleCamera() {
    this.cameraMode = (this.cameraMode === 'user') ? 'environment' : 'user'
    await this.setLocalStream()
    await this.renewOffer('phone')
  }


  async ngOnInit(): Promise<void> {

    this.socketService.on('got-answer', async (answer) => {
      console.log('got new answer')
      if (!this.peerConn.currentRemoteDescription) await this.peerConn.setRemoteDescription(answer as RTCSessionDescriptionInit)
    })
    this.socketService.on('got-offer', async (offer) => {
      console.log('got new offer')
      this.newOffer = offer as RTCSessionDescription
      this.toggleIsGettingACall(true)
    })
    this.socketService.on('re-got-offer', async (offer) => {
      console.log('re new')
      this.createAnswer(offer as RTCSessionDescription)
    })
    this.socketService.on('got-candidate', async (candidate: RTCIceCandidateInit) => { if (this.peerConn && this.peerConn.remoteDescription?.type) await this.peerConn.addIceCandidate(candidate) })
  }


  async setLocalStream(): Promise<void> {
    if (this.localStream) this.localStream.getTracks().forEach((track) => track.stop())
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
    this.elLocalVideo.nativeElement.srcObject = this.localStream
  }
}
