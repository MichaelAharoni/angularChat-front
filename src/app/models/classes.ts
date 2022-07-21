import { ContactUser, chatRoom, Calls } from './interfaces'
export class User {
    constructor(
        userName: string = '',
        phoneNum: string = '',

    ) {
        this.userName = userName
        this.asContactUser = {
            userName: userName,
            phoneNum: phoneNum,
            imgUrl: this.imgUrl
        }
    }
    phoneNum!: string 
    userName!: string 
    _id?: string
    imgUrl: string = 'defultImg'
    contacts: ContactUser[] = []
    description: string = ''
    privacySettings?: {}
    lastSeen: (Date | number) = Date.now()
    blockedContacts: ContactUser[] = []
    pinnedContacts: ContactUser[] = []
    callsHistory: Calls[] = []
    asContactUser: ContactUser = {}
    chatRooms: chatRoom[] = []
}