import { ContactUser, chatRoom, Calls } from './user';
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