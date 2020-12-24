
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import { from, combineLatest } from 'rxjs';
import Swal from 'sweetalert2';

import { CargoPersonalService } from '../../../services/Mantenimientos/cargo-personal.service';
import { SolicitudInformacionPersonalService } from '../../../services/Procesos/solicitud-informacion-personal.service';
import { ProveedorService } from '../../../services/Mantenimientos/proveedor.service';
import { UsuariosService } from '../../../services/Mantenimientos/usuarios.service';

declare var $:any;

@Component({
  selector: 'app-solicitud-informacion-personal',
  templateUrl: './solicitud-informacion-personal.component.html',
  styleUrls: ['./solicitud-informacion-personal.component.css']
})
 

export class SolicitudInformacionPersonalComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false
  
  solicitudesCab :any[]=[]; 
  filtrarMantenimiento = "";

  empresas :any[]=[];
  estados :any[]=[];
  documentosMasivas :any[]=[];

  id_Ibp_Cab_Global = 0;
  id_estado_Global = 0
  cantSolicitud_Global = 0
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService, private funcionesglobalesService : FuncionesglobalesService, private cargoPersonalService : CargoPersonalService, private solicitudInformacionPersonalService : SolicitudInformacionPersonalService, private proveedorService : ProveedorService, private usuariosService : UsuariosService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.getCargarCombos();
   this.inicializarFormularioFiltro();
   this.inicializarFormulario();
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idEmpresa : new FormControl('0'),
      idEstado : new FormControl('0')
     }) 
 }

 inicializarFormulario(){ 
   this.formParams= new FormGroup({
      id_Ibp_Cab: new FormControl('0'), 
      id_Empresa: new FormControl('0'),
      id_TipoDoc: new FormControl('1'),
      
      nro_Documento: new FormControl(''),
      apellidos_Peronal: new FormControl(''),
      nombre_personal: new FormControl(''),

      estado : new FormControl('13'),   
      usuario_creacion : new FormControl('')
    }) 
 }  

 getCargarCombos(){ 

  this.spinner.show();
  combineLatest([ this.proveedorService.get_estados(), this.solicitudInformacionPersonalService.get_empresas(this.idUserGlobal) , this.usuariosService.get_documentosSolicitarMasivas()  ]).subscribe( ([_estados, _empresas, _empresasMasivas])=>{
      this.estados = _estados.filter((estado) => estado.tipoproceso_estado =='IBP'); 
      this.empresas = _empresas; 
      this.documentosMasivas = _empresasMasivas.map((doc)=>{
                return { checkeado : false, id_doc : doc.id_detalleTabla , descripcion_doc : doc.descripcion_grupoTabla }
      });


      setTimeout(() => {
        if ( this.empresas.length > 0 ) {
          this.formParamsFiltro.patchValue({ "idEmpresa" : _empresas[0].id_Empresa }); 
          this.mostrar_cantidadSolicitudesEmpresa(_empresas[0].id_Empresa );
        }
       }, 100);

      this.spinner.hide(); 
  })

}

 mostrarInformacion(){

      if (this.formParamsFiltro.value.idEmpresa == '' || this.formParamsFiltro.value.idEmpresa == 0) {
        this.alertasService.Swal_alert('error','Por favor la empresa');
        return 
      }

      this.spinner.show();
      this.solicitudInformacionPersonalService.get_mostrar_solicitudInformacionPersonalCab(this.formParamsFiltro.value.idEmpresa , this.formParamsFiltro.value.idEstado, this.idUserGlobal )
          .subscribe((res:RespuestaServer)=>{            
              this.spinner.hide();
              console.log(res)
              if (res.ok==true) {        
                  this.solicitudesCab = res.data; 
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
   
    if (this.formParamsFiltro.value.idEmpresa == '' || this.formParamsFiltro.value.idEmpresa == 0) {
      this.alertasService.Swal_alert('error','Por favor seleccione una Empresa');
      return 
    }


    this.flag_modoEdicion = false;
    this.id_Ibp_Cab_Global = 0;
    this.id_estado_Global = 13;
    this.inicializarFormulario();   
    
    setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('show');
      this.formParams.patchValue({ "id_Empresa" : this.formParamsFiltro.value.idEmpresa }); 
    },0);

    this.desmarcarChek();  
 
 }
 
 async saveUpdate(){

  let flagMarcado = false;
  flagMarcado = this.funcionGlobalServices.verificarCheck_marcado(this.documentosMasivas);

  if (flagMarcado == false) {
    this.alertasService.Swal_alert('error','Por favor debe marcar un elemento de Información a Solicitar');
    return ;
  } 
 
  if ( this.flag_modoEdicion== true) { // editar
     if (this.formParams.value.id_Ibp_Cab == '' || this.formParams.value.id_Ibp_Cab == 0) {
       this.alertasService.Swal_alert('error','No se cargó el Id , por favor actulize su página');
       return 
     }   
  }
 
  if (this.formParams.value.nro_Documento == '' || this.formParams.value.nro_Documento == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el nro Documento');
    return 
  }
  if (this.formParams.value.apellidos_Peronal == '' || this.formParams.value.apellidos_Peronal == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese los apellidos');
    return 
  }
  if (this.formParams.value.nombre_personal == '' || this.formParams.value.nombre_personal == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese los nombres');
    return 
  }
  
 
 
  this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal }); 
  
    ////--- grabando el detalle ----
    const grabarActualizar_solicitudDet= ()=>{

      if (this.id_Ibp_Cab_Global == 0) {
        return;
      }

      const docMarcadas =  this.funcionesglobalesService.obtenerCheck_IdPrincipal(this.documentosMasivas, 'id_doc');
  
      this.usuariosService.set_grabarSolicitudInformacionDetMasivo( this.id_Ibp_Cab_Global , docMarcadas.join() , this.idUserGlobal  ).subscribe((res:RespuestaServer)=>{
       if (res.ok ==true) {     
          console.log('grabado la empresa correctamente');
          this.cerrarModal();
       }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
       }
     })
    }
    
 
   if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading(); 
     this.solicitudInformacionPersonalService.set_save_solicitudInformacionPersonal(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_Ibp_Cab" : Number(res.data) });
         this.id_Ibp_Cab_Global = Number(res.data) ;

         this.mostrarInformacion();
         grabarActualizar_solicitudDet();
         //----- actualizando la cantidad---
         this.mostrar_cantidadSolicitudesEmpresa(this.formParamsFiltro.value.idEmpresa);         

         this.alertasService.Swal_Success('Se agrego correctamente..');
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.solicitudInformacionPersonalService.set_edit_solicitudInformacionPersonal(this.formParams.value , this.formParams.value.id_Ibp_Cab).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) {   

        const { descripcion_estado } = this.estados.find((estado) => estado.id_Estado == this.formParams.value.estado); 
         
         for (const obj of this.solicitudesCab) {
           if (obj.id_Ibp_Cab == this.formParams.value.id_Ibp_Cab ) {
             obj.nro_Documento = this.formParams.value.nro_Documento ;
             obj.apellidos_Peronal = this.formParams.value.apellidos_Peronal ;
             obj.nombre_personal = this.formParams.value.nombre_personal ;
             obj.estado = this.formParams.value.estado ;
             obj.descripcion_estado = descripcion_estado
             break;
           }
         }

         grabarActualizar_solicitudDet();

         this.alertasService.Swal_Success('Se actualizo correctamente..');  
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
   }

 } 

 editar({ id_Ibp_Cab, nro_Documento, apellidos_Peronal, nombre_personal, id_estado}){

   this.flag_modoEdicion=true;

   this.id_Ibp_Cab_Global = id_Ibp_Cab;
   this.id_estado_Global = id_estado;

   this.formParams.patchValue({ "id_Ibp_Cab" : id_Ibp_Cab, "nro_Documento" :  nro_Documento ,"apellidos_Peronal" :  apellidos_Peronal, "nombre_personal" :  nombre_personal,  "estado" : id_estado,   "usuario_creacion" : this.idUserGlobal });

   setTimeout(()=>{ // 
    $('#modal_mantenimiento').modal('show');
  },0);

  this.desmarcarChek();
  this.usuariosService.set_grabarSolicitudInformacionDet_checkeado_Masivo(this.id_Ibp_Cab_Global).subscribe((res:RespuestaServer)=>{
   if (res.ok ==true) {     
      for (let index = 0; index < res.data.length; index++) { 
        for (const doc of this.documentosMasivas) {
         if (doc.id_doc == res.data[index].id_TipoIbp  ) {
            doc.checkeado = true;
            break;
         }
        }        
      }
   }else{
    this.alertasService.Swal_alert('error', JSON.stringify(res.data));
    alert(JSON.stringify(res.data));
   }
  })

 
 } 
 
 desmarcarChek(){  
  for (const doc of this.documentosMasivas) {
    doc.checkeado = false;
  } 
 }


 anular(objBD:any){

   if (objBD.id_estado === 16 || objBD.id_estado =='16') {      
     return;      
   }

   this.alertasService.Swal_Question('Sistemas', 'Esta seguro de anular ?')
   .then((result)=>{
     if(result.value){

       Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
       Swal.showLoading();
       this.solicitudInformacionPersonalService.set_anular_solicitudInformacionPersonal(objBD.id_Ibp_Cab ).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.solicitudesCab) {
             if (user.id_Ibp_Cab == objBD.id_Ibp_Cab ) {               
                 user.id_estado = 16;
                 user.descripcionEstado =  "ANULADO" ;
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

 onChange_empresa(empresa:any){  
    if (empresa == 0) {
      this.cantSolicitud_Global = 0;
      return;
    }
    this.mostrar_cantidadSolicitudesEmpresa(empresa)  ;
 }

 mostrar_cantidadSolicitudesEmpresa(empresa: number){
  Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
  Swal.showLoading();
  this.solicitudInformacionPersonalService.get_cantidadSolicitudesRealizadas(empresa, this.idUserGlobal, 'SOL' )
      .subscribe((res:RespuestaServer)=>{            
        Swal.close();    
          if (res.ok==true) {        
 
            if (res.data.length > 0) {
              this.cantSolicitud_Global = Number(res.data[0].cantSolicitudes);  
            }else {
              this.cantSolicitud_Global = 0; 
            }

          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
  })
 }

  

}

