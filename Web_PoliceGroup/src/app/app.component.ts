import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './services/sockets/websocket.service';
import { LoginService } from './services/login/login.service';
 
import { Subscription } from 'rxjs';
import { AlertasService } from './services/alertas/alertas.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 

  alertaSocket$: Subscription;
  idUserGlobal = 0;
  idPerfil =0;
  serviciosMenu :any[]=[]; 
  notificaciones :any[]=[]; 


  constructor(   private loginService: LoginService, private alertasService : AlertasService ){
    this.idUserGlobal = this.loginService.get_idUsuario(); 
    this.idPerfil = this.loginService.get_idPerfil(); 
    this.serviciosMenu = this.loginService.getServiciosMenu();
  }

  ngOnInit() { 
    // this.recibirAlertasSocket();
   }

    

  //  public recibirAlertasSocket(){
  //   this.alertaSocket$ = this.websocketService.escucharEventos('Alertas_movil_web_OT').subscribe((res:any)=>{

  //     console.log('entro lo que devuelve movil')
  //     console.log(res)

  //     this.notificaciones = JSON.parse(res);     

  //     for (const servicio of this.serviciosMenu) {

  //       for (const noti of this.notificaciones) {  
  //         if (servicio.id_servicio == noti.idServicio ) {
  //           this.alertasService.Swal_Success_Socket('Notificacion', noti.mensaje)
  //         }
  //       }

  //     }
 
  //   })
  //  }
 
  //  public enviarNotificacionSocket(){
  //     const dataOt = {
  //       id_usuario : 99,
  //       valor : 'tienes 5 Ot pendientes bienvenido languasco barron julio cesar la vida es bella, y mas bella cuando tienes a tus hijos'
  //     }
 
  //    this.websocketService.NotificacionOT_WebSocket(dataOt)
  //    .then( (res:any) =>{
  //      if (res.ok==true) {
  //        console.log(res.data)
  //      }
  //    }).catch((error)=>{
  //       console.log(error);
  //    })
  //  }
 
   ngOnDestroy(){
    //  this.alertaSocket$.unsubscribe();
   }


}
