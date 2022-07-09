import { Calls, chatRoom, ContactUser } from '../interfaces/user'
// const user = new User('moshe', phoneNumber)
export class User {
    constructor(
        private userName: string = '',
        private phoneNumber: string = '',

    ) {
        this.asContactUser = {
            userName: this.userName,
            phoneNumber: this.phoneNumber,
            userImg: this.userImg
        }
    }

    _id?: string
    private userImg: string = 'defultImg'
    private contacts: string = ''
    private about: string = ''
    private privacySettings?: {}
    private lastSeen: (Date | number) = Date.now()
    private blockedContacts: ContactUser[] = []
    private pinnedContacts: ContactUser[] = []
    private callsHistory: Calls[] = []
    public asContactUser: ContactUser = {}
    private chatRooms: chatRoom[] = []
    // userName: string = ''
    // userImg: string = 'defaultImg'
    // contacts: ContactUser[] = []
    // about: string = ''
    // privacySettings?: {}


}
