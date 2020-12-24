
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
import { ListaPreciosService } from '../../../services/Mantenimientos/lista-precios.service';

declare var $:any;
@Component({
  selector: 'app-lista-precios',
  templateUrl: './lista-precios.component.html',
  styleUrls: ['./lista-precios.component.css']
})
 

export class ListaPreciosComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false
  estados :any[]=[];   
  tipoOrdenTrabajo :any[]=[];
 
  precios :any[]=[]; 
  filtrarMantenimiento = "";
 
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService, private funcionesglobalesService : FuncionesglobalesService, private listaPreciosService : ListaPreciosService, private uploadService : UploadService) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.getCargarCombos();
   this.inicializarFormularioFiltro();
   this.inicializarFormulario();
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idtipoOrdenT : new FormControl('0'),
      idEstado : new FormControl('1')
     }) 
 }

 inicializarFormulario(){ 
  // id_Precio, id_TipoOrdenTrabajo, precio, cubicaje, estado, usuario_creacion 

    this.formParams= new FormGroup({
      id_Precio: new FormControl('0'), 
      id_TipoOrdenTrabajo: new FormControl('0'),
      precio: new FormControl(''),
      cubicaje: new FormControl(''),
      cubicajeFinal: new FormControl(''),
      estado : new FormControl('1'),   
      usuario_creacion : new FormControl('')
    }) 
 } 

 getCargarCombos(){ 
    this.spinner.show();
    combineLatest([ this.listaPreciosService.get_estados(), this.listaPreciosService.get_tipoOrdenTrabajo()]).subscribe( ([_estados,  _tipoOrdenTrabajo ])=>{
      this.estados = _estados;
      this.tipoOrdenTrabajo = _tipoOrdenTrabajo; 
      this.spinner.hide(); 
    })

 }

 mostrarInformacion(){
      //  if (this.formParamsFiltro.value.idtipoOrdenT == '' || this.formParamsFiltro.value.idtipoOrdenT == 0) {
      //   this.alertasService.Swal_alert('error','Por favor seleccione el Tipo de Orden Trabajo');
      //   return 
      // }  

      // if (this.formParamsFiltro.value.idEstado == '' || this.formParamsFiltro.value.idEstado == 0) {
      //   this.alertasService.Swal_alert('error','Por favor seleccione un estado');
      //   return 
      // }
  
      this.spinner.show();
      this.listaPreciosService.get_mostrarPrecio_general(this.formParamsFiltro.value.idtipoOrdenT, this.formParamsFiltro.value.idEstado)
          .subscribe((res:RespuestaServer)=>{            
              this.spinner.hide();
              if (res.ok==true) {        
                  this.precios = res.data; 
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
    const listProveedor = this.precios.find(u=> u.ruc_Empresa.toUpperCase() === rucEmpresa.toUpperCase());
    return listProveedor;
 }

 saveUpdate(){
  if ( this.flag_modoEdicion==true) { //// nuevo
     if (this.formParams.value.id_Precio == '' || this.formParams.value.id_Precio == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id de la lista de precio, por favor actulize su página');
       return 
     }   
  }
 
  if (this.formParams.value.id_TipoOrdenTrabajo == '' || this.formParams.value.id_TipoOrdenTrabajo == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione el Tipo de Orden Trabajo');
    return 
  }    

  if (this.formParams.value.precio == '' || this.formParams.value.precio == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el precio');
    return 
  }

  if (this.formParams.value.cubicaje == '' || this.formParams.value.cubicaje == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el cubicaje');
    return 
  }

  if (this.formParams.value.cubicajeFinal == '' || this.formParams.value.cubicajeFinal == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el cubicaje Final');
    return 
  }
  
 
   this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });

   if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();
 
     this.listaPreciosService.set_savePrecio(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_Precio" : Number(res.data[0].id_Precio) });
         this.precios.push(res.data[0])
         this.alertasService.Swal_Success('Se agrego correctamente..');
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.listaPreciosService.set_editPrecio(this.formParams.value , this.formParams.value.id_Precio).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) {   
         
        const tipoOTSeleccionada = $('#cbo_tipoOT option:selected').text();

         for (const obj of this.precios) {

           if (obj.id_Precio == this.formParams.value.id_Precio ) {
             obj.id_TipoOrdenTrabajo= this.formParams.value.id_TipoOrdenTrabajo ;
             obj.descripcion_tipoOT = tipoOTSeleccionada ;
             obj.precio= this.formParams.value.precio ;
             obj.cubicaje= this.formParams.value.cubicaje ;
             obj.cubicajeFinal= this.formParams.value.cubicajeFinal ;
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

 editar({ id_Precio, id_TipoOrdenTrabajo, precio, cubicaje,cubicajeFinal, estado}){
   this.flag_modoEdicion=true;
   setTimeout(()=>{ // 
    $('#modal_mantenimiento').modal('show');
  },0);

   this.formParams.patchValue({ "id_Precio" : id_Precio, "id_TipoOrdenTrabajo" :  id_TipoOrdenTrabajo  , "precio" : precio ,"cubicaje" : cubicaje,  "cubicajeFinal" : cubicajeFinal,  "estado" : estado, "usuario_creacion" : this.idUserGlobal }
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
       this.listaPreciosService.set_anularPrecio(objBD.id_Precio ).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.precios) {
             if (user.id_Precio == objBD.id_Precio ) {
               
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

