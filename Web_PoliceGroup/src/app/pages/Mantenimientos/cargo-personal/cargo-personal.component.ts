
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import { from, combineLatest } from 'rxjs';
import Swal from 'sweetalert2';
 
import { UploadService } from '../../../services/Upload/upload.service';
import { CargoPersonalService } from '../../../services/Mantenimientos/cargo-personal.service';

declare var $:any;
@Component({
  selector: 'app-cargo-personal',
  templateUrl: './cargo-personal.component.html',
  styleUrls: ['./cargo-personal.component.css']
})
 
export class CargoPersonalComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false
  
  cargos :any[]=[]; 
  filtrarMantenimiento = "";
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService, private funcionesglobalesService : FuncionesglobalesService, private cargoPersonalService : CargoPersonalService, private uploadService : UploadService) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
 
   this.inicializarFormularioFiltro();
   this.inicializarFormulario();
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idEstado : new FormControl('1')
     }) 
 }

 inicializarFormulario(){ 
    this.formParams= new FormGroup({
      id_Cargo: new FormControl('0'), 
      nombreCargo: new FormControl(''),
      estado : new FormControl('1'),   
      usuario_creacion : new FormControl('')
    }) 
 }  

 mostrarInformacion(){
      this.spinner.show();
      this.cargoPersonalService.get_mostrar_cargo(this.formParamsFiltro.value.idEstado)
          .subscribe((res:RespuestaServer)=>{            
              this.spinner.hide();
              if (res.ok==true) {        
                  this.cargos = res.data; 
              }else{
                this.alertasService.Swal_alert('error', JSON.stringify(res.data));
                alert(JSON.stringify(res.data));
              }
      })
 }   
  
 cerrarModal(){
    setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('hide');  
    },0); 
 }

 nuevo(){
    this.flag_modoEdicion = false;

    setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('show');
    },0);
    this.inicializarFormulario();    
 
 }

 get_verificarRuc(rucEmpresa:string){ 
    const listProveedor = this.cargos.find(u=> u.ruc_Empresa.toUpperCase() === rucEmpresa.toUpperCase());
    return listProveedor;
 }

 async saveUpdate(){
  if ( this.flag_modoEdicion==true) { //// nuevo
     if (this.formParams.value.id_Cargo == '' || this.formParams.value.id_Cargo == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id del cargo, por favor actulize su página');
       return 
     }   
  }
 
  if (this.formParams.value.nombreCargo == '' || this.formParams.value.nombreCargo == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese la descripcion del cargo');
    return 
  }
  
 
   this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });

   if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();

     const  cargoPer  = await this.cargoPersonalService.get_verificar_cargo(this.formParams.value.nombreCargo);
     if (cargoPer) {
      Swal.close();
      this.alertasService.Swal_alert('error','El cargo del personal ya esta  registrada, verifique..');
      return;
     } 
 
     this.cargoPersonalService.set_save_cargo(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_Cargo" : Number(res.data[0].id_Cargo) });
         this.cargos.push(res.data[0])
         this.alertasService.Swal_Success('Se agrego correctamente..');
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.cargoPersonalService.set_edit_cargo(this.formParams.value , this.formParams.value.id_Cargo).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) {   
         
         for (const obj of this.cargos) {
           if (obj.id_Cargo == this.formParams.value.id_Cargo ) {
             obj.nombreCargo = this.formParams.value.nombreCargo ;
             obj.estado = this.formParams.value.estado ;
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

 editar({   id_Cargo, nombreCargo, estado}){
   this.flag_modoEdicion=true;
   this.formParams.patchValue({ "id_Cargo" : id_Cargo, "nombreCargo" :  nombreCargo ,  "estado" : estado, "usuario_creacion" : this.idUserGlobal });
   setTimeout(()=>{ // 
    $('#modal_mantenimiento').modal('show');
  },0);
 
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
       this.cargoPersonalService.set_anular_cargo(objBD.id_Cargo ).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.cargos) {
             if (user.id_Cargo == objBD.id_Cargo ) {               
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
