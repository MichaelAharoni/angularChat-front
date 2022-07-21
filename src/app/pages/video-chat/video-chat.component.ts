import { SocketService } from '../../services/socket/socket.service';
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, isDevMode, HostListener } from '@angular/core';

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
  remoteStream!: MediaStream
  peerConn!: RTCPeerConnection
  isAudio: boolean = true
  isVideo: boolean = true
  isGettingACall: boolean = false
  isSrcSwitch: boolean = false
  isOrientation: boolean = false
  @ViewChild('videoGrid') elContainer!: ElementRef<HTMLDivElement>
  @ViewChild('localVideo') elLocalVideo!: ElementRef<HTMLVideoElement>
  @ViewChild('remoteVideo') elRemoteVideo!: ElementRef<HTMLVideoElement>
  newOffer!: RTCSessionDescription

  @HostListener('window:deviceorientation', ['$event'])
  load(ev: DeviceOrientationEvent) { this.isOrientation = ev.absolute; this.cd.markForCheck() }

  async ngOnInit(): Promise<void> {
    await this.setLocalStream()
    this.socketService.on('got-answer', async (answer) => {
      if (!this.peerConn.currentRemoteDescription) await this.peerConn.setRemoteDescription(answer as RTCSessionDescriptionInit)
    })
    this.socketService.on('got-offer', async (offer) => {
      this.newOffer = offer as RTCSessionDescription
      this.toggleIsGettingACall(true)
    })
    this.socketService.on('re-got-offer', async (offer) => {
      this.createAnswer(offer as RTCSessionDescription)
    })
    this.socketService.on('got-candidate', async (candidate: RTCIceCandidateInit) => { if (this.peerConn && this.peerConn.remoteDescription?.type) await this.peerConn.addIceCandidate(candidate) })
  }

  async createPeerConnection() {

    if (!this.localStream) {
      await this.setLocalStream()
    }

    this.elContainer.nativeElement.style.display = 'inline'
    this.remoteStream = new MediaStream()
    this.elRemoteVideo.nativeElement.srcObject = this.remoteStream
    this.elRemoteVideo.nativeElement.style.display = 'block'

    // https://xirsys.com/ STUN / TURN servers generator

    let configuration: RTCConfiguration = {
      iceServers: (!isDevMode()) ? [{
        urls: ["stun:fr-turn1.xirsys.com"]
      },
      {
        username: "MkclaOYC1js9p0kUlxSzbq915IqdWBB801aHUaFJMtxTjxOPkfKffr7PLKm8kIgIAAAAAGLLuRx0ZXN0ZXIx",
        credential: "c0dabeca-00dc-11ed-a916-0242ac120004",
        urls: ["turn:fr-turn1.xirsys.com:80?transport=udp",
          "turn:fr-turn1.xirsys.com:3478?transport=udp",
          "turn:fr-turn1.xirsys.com:80?transport=tcp",
          "turn:fr-turn1.xirsys.com:3478?transport=tcp",
          "turns:fr-turn1.xirsys.com:443?transport=tcp",
          "turns:fr-turn1.xirsys.com:5349?transport=tcp"
        ]
      }] : [{
        urls: ["stun:fr-turn1.xirsys.com"]
      },
      {
        username: "HoxGSsM2D8ecZ1eN0HUXa34zrWzPlrlTZk_-2t99S7KSIeoifGRdfnCPMx4Zu7wPAAAAAGLWSeh0ZXN0NQ==",
        credential: "eff406b0-0728-11ed-b29e-0242ac120004",
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
      console.log('ev', ev)
      ev.streams[0].getTracks().forEach((track: MediaStreamTrack) => {
        this.remoteStream.addTrack(track)
      })
    }
    this.peerConn.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) this.socketService.emit('store-candidate', event.candidate)
    }
    this.peerConn.addEventListener("iceconnectionstatechange", async event => {
      if (['failed', 'disconnected', 'close'].includes(this.peerConn.iceConnectionState)) {
        await this.renewOffer()
        this.peerConn.restartIce();
      }
    })
  }

  async createOffer() {
    await this.createPeerConnection()
    const offer: RTCSessionDescriptionInit = await this.peerConn.createOffer()
    await this.peerConn.setLocalDescription(offer)
    this.socketService.emit('store-offer', offer)
  }

  async renewOffer() {
    await this.createPeerConnection()
    const offer: RTCSessionDescriptionInit = await this.peerConn.createOffer()
    await this.peerConn.setLocalDescription(offer)
    this.socketService.emit('re-store-offer', offer)
  }

  async createAnswer(offer: RTCSessionDescription) {
    await this.createPeerConnection()
    await this.peerConn.setRemoteDescription(offer)
    const answer = await this.peerConn.createAnswer()
    await this.peerConn.setLocalDescription(answer)
    this.socketService.emit('store-answer', answer)
  }

  muteAudio(bool?: boolean) {
    this.isAudio = (typeof bool === 'boolean') ? bool : !this.isAudio
    this.localStream.getAudioTracks()[0].enabled = this.isAudio
  }

  muteVideo(bool?: boolean) {
    this.isVideo = (typeof bool === 'boolean') ? bool : !this.isVideo
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

  switchLocalToRemoteSrc(bool?: boolean): void {
    const currLocalSrc = this.elLocalVideo.nativeElement.srcObject
    this.elLocalVideo.nativeElement.srcObject = this.elRemoteVideo.nativeElement.srcObject
    this.elRemoteVideo.nativeElement.srcObject = currLocalSrc
    if (typeof bool === 'boolean' && bool) return
    this.isSrcSwitch = !this.isSrcSwitch
  }
  async toggleCamera() {
    this.cameraMode = (this.cameraMode === 'user') ? 'environment' : 'user'
    await this.setLocalStream()
    await this.renewOffer()
    this.setStreamSettings()
    if (this.isSrcSwitch) this.switchLocalToRemoteSrc(this.isSrcSwitch)
  }

  setStreamSettings() {
    this.muteAudio(this.isAudio)
    this.muteVideo(this.isVideo)
  }

  async setLocalStream(): Promise<void> {
    if (this.localStream) this.localStream.getTracks().forEach((track) => track.stop())
    const rearCamera = (await navigator.mediaDevices.enumerateDevices()).filter((device) => device.kind === 'videoinput')[3]
    const cameraOpt = (this.cameraMode === 'user') ? 'user' : 'environment'
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: {
        [(rearCamera && this.cameraMode === 'environment') ? 'deviceId' : 'facingMode']: (rearCamera && this.cameraMode === 'environment') ? rearCamera.deviceId : cameraOpt,
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
