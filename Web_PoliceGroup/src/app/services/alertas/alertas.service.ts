import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor() { }

  Swal_alert(tipoIcon:any, mensaje:any){
    // success	 
    // error	
    // warning	
    // info	
    // question

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: tipoIcon,
      title: mensaje
    })
  }


  Swal_Question(titulo :string, mensaje: string ){
    const question = Swal.fire({
        title: titulo,
        text: mensaje,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar'
      }) 
      return question;
    }


    Swal_Success(mensaje: string){
      Swal.fire(
        'Sistemas',
         mensaje,
        'success'
      )
    }
    
    Swal_Success_Socket(titulo:string, mensaje: string){
      // Swal.fire({
      //   title: titulo,
      //   position: 'top-end',
      //   icon: 'info',
      //   text: mensaje,
      // })

      Swal.fire({
        title: titulo, 
        text: mensaje,
        allowOutsideClick: false,
        backdrop: `
          url("./assets/img/stars.gif")
          center
          no-repeat
        `
      })

 
    }


  




}
