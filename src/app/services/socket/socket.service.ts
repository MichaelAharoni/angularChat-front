import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io'; 

@Injectable({
  providedIn: 'root'
})

export class SocketService {

  constructor(private socket: Socket) { }
  
  public on<T>(eventName: string, cb: (str:T) => (void | Promise<void>)) {
    this.socket?.on(eventName, cb)
  }
  public off(eventName: string, cb = null) {
    if (!this.socket) return;
    if (!cb) this.socket.removeAllListeners(eventName)
    else this.socket.removeListener(eventName, cb)
  }
  public emit<T>(eventName: string, data?: T) {
    this.socket?.emit(eventName, data)
  }
  public terminate() {
    this.socket.disconnect()
  }
}
