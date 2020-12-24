import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { DistritosService } from '../../../services/Mantenimientos/distritos.service';
import { combineLatest } from 'rxjs';
 

@Component({
  selector: 'app-distritos',
  templateUrl: './distritos.component.html',
  styleUrls: ['./distritos.component.css']
})
export class DistritosComponent implements OnInit {

  formParams : FormGroup; 
  distritos:any [] =  []; 
  zonas:any [] =  []; 
  
  idUserGlobal : number = 0;
  showDetalle = false;
  flagModo_Edicion = false;
  id_OTGlobal=0; 
  filtrarUsuario :string = "";

  flag_modoEdicion=false;
  filtrarMantenimiento = '';

  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,
              private distritosService : DistritosService , private funcionesglobalesService : FuncionesglobalesService ) {            
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
  ngOnInit(): void {
   this.getCargarCombos();
   this.inicializarFormulario();
   this.mostrarInformacion()
  }

  inicializarFormulario(){ 
    this.formParams= new FormGroup({
      id_Distrito: new FormControl('0'), 
      id_Zona: new FormControl('0'), 
      nombreDistrito: new FormControl(''),
      estado : new FormControl('1'),   
      usuario_creacion : new FormControl('')
    }) 
  }

  getCargarCombos(){ 
    this.spinner.show();
    combineLatest([ this.distritosService.get_zonas()]).subscribe( ([_zonas ])=>{
      this.zonas = _zonas;
       this.spinner.hide(); 
    })

 }
 
  mostrarInformacion(){
    this.spinner.show();
    this.distritosService.get_mostrarDistrito_general()
        .subscribe((res:RespuestaServer)=>{           
          if (res.ok==true) {         
              this.distritos = res.data;
              setTimeout(()=>{ 
                this.spinner.hide();
              }, 1000);
          }else{
            this.spinner.hide();
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
    })
  }

  regresarListado(){
    this.showDetalle = false;
  }

  nuevo(){
    this.showDetalle = true;
    this.flag_modoEdicion=false;
    this.inicializarFormulario();    
  }

  saveUpdate(){
     if ( this.flag_modoEdicion==true) { //// nuevo
      if (this.formParams.value.id_Distrito == '' || this.formParams.value.id_Distrito == 0) {
        this.alertasService.Swal_alert('error','No se cargo el id del distrito, por favor actulize su página');
        return 
      }   
    }

    if (this.formParams.value.nombreDistrito == '' || this.formParams.value.nombreDistrito == 0) {
      this.alertasService.Swal_alert('error','Por favor ingrese el nombre del distrito');
      return 
    }  
  
    this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });

    if ( this.flag_modoEdicion==false) { //// nuevo  

      Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
      Swal.showLoading();

      this.distritosService.set_saveDistrito(this.formParams.value).subscribe((res:RespuestaServer)=>{
        Swal.close(); 
      
        if (res.ok ==true) {    

          this.flag_modoEdicion = true;
          this.formParams.patchValue({ "id_Distrito" : Number(res.data[0].id_Distrito) });
          this.distritos.push(res.data[0])
          console.log(Number(res.data[0].id_Distrito))
          this.alertasService.Swal_Success('Se agrego correctamente..');
          
        }else{
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }
      })
      
    }else{ /// editar

      Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
      Swal.showLoading();
      this.distritosService.set_editDistrito(this.formParams.value , this.formParams.value.id_Distrito).subscribe((res:RespuestaServer)=>{
        Swal.close(); 
        console.log(res.data)        
        if (res.ok ==true) {      
          for (const obj of this.distritos) {

            if (obj.id_Distrito == this.formParams.value.id_Distrito ) {
              obj.nombreDistrito= this.formParams.value.nombreDistrito ;
              obj.estado= this.formParams.value.estado ;
              obj.descripcion_estado = this.formParams.value.estado == 0 ? "INACTIVO" : "ACTIVO";
              break;
            }

          }
          this.alertasService.Swal_Success('Se actualizo correctamente..');  
        }else{
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }
      })
    }

  }
 
 

  editar(objBD:any){
    this.showDetalle = true;
    this.flag_modoEdicion=true;
    this.formParams.patchValue({ "id_Distrito" : objBD.id_Distrito, "nombreDistrito" : objBD.nombreDistrito  , "estado" : objBD.estado ,"usuario_creacion" : this.idUserGlobal }
    );
  } 

  anular(objBD:any){
    if (objBD.estado ===0 || objBD.estado =='0') {      
      return;      
    }

    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de anular ?')
    .then((result)=>{
      if(result.value){

        Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
        Swal.showLoading();
        this.distritosService.set_anularDistrito(objBD.id_Distrito ).subscribe((res:RespuestaServer)=>{
          Swal.close();        
          if (res.ok ==true) { 
            
            for (const user of this.distritos) {
              if (user.id_Distrito == objBD.id_Distrito ) {
                  user.estado = 0;
                  user.descripcion_estado =  "INACTIVO" ;
                  break;
              }
            }
            this.alertasService.Swal_Success('Se anulo correctamente..')  
 
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
        })
         
      }
    }) 
    
  }

}
