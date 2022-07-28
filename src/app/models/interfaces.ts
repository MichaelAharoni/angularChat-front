export interface ContactUser {
    userName?: string
    phoneNum?: string
    imgUrl?: string
}

export interface Calls {
}


export interface chatRoom {
    roomId: string
    roomName: string
    participents: string[]
    roomImg: string
    createdAt: Date
    msgs: msg[]
    lastMsg: msg
}

export interface msg {
    from: ContactUser
    txt: string
    timestamp: Date
}

export interface RtcAnswer {
    data:RTCSessionDescriptionInit,
    phoneNum:string
}

export interface RtcOffer {
    data:RTCSessionDescription,
    phoneNum:string
}

export interface RtcCandidate {
    data:RTCIceCandidateInit,
    phoneNum:string
}

export interface RtcStreamer {
    phoneNum: string,
    stream: MediaStream
}

export interface RtcPeerConn {
    phoneNum: string,
    peer: RTCPeerConnection,
}

export interface NavigatorWithContacts extends Navigator {
    contacts?:any
}