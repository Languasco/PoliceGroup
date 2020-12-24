import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

 
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;

  constructor(private socket: Socket) { 
    this.checkStatus();
  }

  checkStatus(){
    this.socket.on('connect', ()=>{
      console.log('conectado al servidor');
      this.socketStatus= true;
    })
 
    this.socket.on('disconnect', ()=>{
      console.log('desconectado del servidor');
      this.socketStatus= false;
    })
  }

  emitirEventos(evento:string, payload ?:any, callback?:Function){  /// emit
      this.socket.emit(evento,payload, callback);
  }

  escucharEventos(evento:string){   /// on 
    return this.socket.fromEvent(evento);
  }
 
  NotificacionOT_WebSocket( obj_data :any){
    //como no sabemos cuando termina el socket lo metemos dentro de una promesa
    return new Promise((resolve, reject) => {      
      this.emitirEventos('Notificacion_web_OT', JSON.stringify(obj_data) , (resp)=>{ 
        if (resp.ok==true) {
          resolve(resp);
        }else{
          reject(resp);
        }  
      })
    })
  }
}
