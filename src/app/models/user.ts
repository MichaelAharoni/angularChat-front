// import { Calls, chatRoom, ContactUser } from '../interfaces/user'
// const user = new User('moshe', phoneNum)

export interface ContactUser {
    userName?: string
    phoneNum?: string
    imgUrl?: string
}
export class User {
    constructor(
        userName: string = '',
        phoneNum: string = '',
    ) {
        this.asContactUser = {
            userName: userName,
            phoneNum: phoneNum,
        }
    }
    _id?: string
    imgUrl: string = 'defultImg'
    contacts: ContactUser[] = []
    description: string = ''
    privacySettings?: {}
    lastSeen: (Date | number) = Date.now()
    blockedContacts: ContactUser[] = []
    pinnedContacts: ContactUser[] = []
    callsHistory: Calls[] = []
    public asContactUser: ContactUser = {}
    chatRooms: chatRoom[] = []
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

// FRONT
// newMessege not my contant!!
// {
//     from:me
//     phoneNum:00120021
// }

// emit('nonContanctSendMsg,{msg})
// BACK
// on('nonContanctSendMsg,async (msgData)=>{
//     try{
//         const  user = await getUserByphoneNum(msg.phone)
//         createNewRoom(from,to) // update rooms for both users and   contactsList
//     gIo.to((registerToroom,)
//     }e{
//         console.log(e)
//         'no such person'
//     }
// })

// {
// roomId,
// participents:[asdas,asdasd,asdasd,asd,asd,asd,sad,sa,das,da,sd,asd,sa,das,d,asd,sad],
// roomImg,
// createdAt,
// lastMsg : {
//     from:'asdsad'
//     txt:,
// timstamp:123123123}
// }

