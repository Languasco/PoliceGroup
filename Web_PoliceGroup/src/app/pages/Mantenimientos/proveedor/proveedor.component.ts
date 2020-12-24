
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import { from } from 'rxjs';
import Swal from 'sweetalert2';
import { ProveedorService } from '../../../services/Mantenimientos/proveedor.service';

declare var $:any;

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
 
export class ProveedorComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsCar: FormGroup;

  idUserGlobal :number = 0;
  idEmpresaGlobal:number = 0;

  flag_modoEdicion :boolean =false;
  flagModo_EdicionCar:boolean =false;

  estados :any[]=[];
  proveedores :any[]=[];
  filtrarMantenimiento = "";
  detalleIconos:any[]=[];
  tabControlDetalle: string[] = ['DATOS GENERALES','REGISTRO DE PLACAS' ]; 
  selectedTabControlDetalle :any;

  detalleVehiculos:any[]=[];
  @ViewChild('_cant') _cantElement: ElementRef;

  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService, private funcionesglobalesService : FuncionesglobalesService, private proveedorService :ProveedorService) {         
     this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
  this.selectedTabControlDetalle = this.tabControlDetalle[0];
   this.getCargarCombos();
   this.inicializarFormularioFiltro();
   this.inicializarFormulario();
   this.inicializarFormularioVehiculo();
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idEstado : new FormControl('1')
     }) 
 }

 inicializarFormulario(){ 
    this.formParams= new FormGroup({
      id_Empresa: new FormControl(''), 
      ruc_Empresa: new FormControl(''),
      razonSocial_Empresa: new FormControl(''),
      direccion_Empresa: new FormControl(''),
      id_Icono: new FormControl('0'),
      esProveedor : new FormControl(false),
      estado : new FormControl('1'),   
      usuario_creacion : new FormControl('')
    }) 
 }

 inicializarFormularioVehiculo(){ 
  this.formParamsCar= new FormGroup({
    id_Empresa_Vehiculo: new FormControl(0), 
    id_Empresa: new FormControl(0),
    nro_Placa: new FormControl(''),
    cantidadM3: new FormControl('')
  }) 
}
 

 getCargarCombos(){ 
    this.spinner.show();
    this.proveedorService.get_estados().subscribe((res:any)=>{
        this.estados = res.filter((estado) => estado.tipoproceso_estado =='M'); 
        this.spinner.hide();  
    })
 }

 mostrarInformacion(){
      //  if (this.formParamsFiltro.value.idEstado == '' || this.formParamsFiltro.value.idEstado == 0) {
      //   this.alertasService.Swal_alert('error','Por favor seleccione un estado');
      //   return 
      // }  
  
      this.spinner.show();
      this.proveedorService.get_mostrarProveedor_general(this.formParamsFiltro.value.idEstado, this.idUserGlobal)
          .subscribe((res:RespuestaServer)=>{            
              this.spinner.hide();
 
              if (res.ok==true) {        
                  this.proveedores = res.data; 
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
    this.idEmpresaGlobal  = 0;

    setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('show');
    },0);
    this.inicializarFormulario();    
    this.get_retornarIconos(0);

    this.blank_Detalle()
    this.selectedTabControlDetalle = this.tabControlDetalle[0];
 }

 get_retornarIconos(idIcon:number){

    Swal.fire({ icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Cargando iconos, Espere por favor'  })
    Swal.showLoading();
    this.proveedorService.get_iconosProveedor(idIcon, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
      Swal.close();    

      if (res.ok ==true) {     
            this.detalleIconos = res.data;
            if (idIcon > 0 ){
              this.get_marcarIcono(idIcon);
            }
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
 }

 

 async saveUpdate(){

   if ( this.flag_modoEdicion==true) { //// nuevo
     if (this.formParams.value.id_Empresa == '' || this.formParams.value.id_Empresa == 0) {
       this.alertasService.Swal_alert('error','No se cargo el id del Proveedor, por favor actulize su página');
       return 
     }   
   }

   if (this.formParams.value.ruc_Empresa == '' || this.formParams.value.ruc_Empresa == 0) {
     this.alertasService.Swal_alert('error','Por favor ingrese el RUC ');
     return 
   }  
   if (this.formParams.value.razonSocial_Empresa == '' || this.formParams.value.razonSocial_Empresa == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese la razon social');
    return 
  }
  if (this.formParams.value.direccion_Empresa == '' || this.formParams.value.direccion_Empresa == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese la direccion');
    return 
  }
 
   this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });

   if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();

     const  rucProveedor  = await this.proveedorService.get_verificarRuc(this.formParams.value.ruc_Empresa);
     if (rucProveedor) {
      Swal.close();
      this.alertasService.Swal_alert('error','El RUC ya se encuentra registrado, verifique..');
      return;
     }

     const  razonSocialProveedor  = await this.proveedorService.get_verificarRazonSocial(this.formParams.value.razonSocial_Empresa.trim());
     if (razonSocialProveedor) {
      Swal.close();
      this.alertasService.Swal_alert('error','La razon social ya se encuentra registrado, verifique..');
      return;
    }
 
     this.proveedorService.set_saveProveedor(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.idEmpresaGlobal  = Number(res.data); 

         this.formParams.patchValue({ "id_Empresa" : Number(res.data) });
         this.alertasService.Swal_Success('Se agrego correctamente..');
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.proveedorService.set_editProveedor(this.formParams.value , this.formParams.value.id_Empresa).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       console.log(res.data)        
       if (res.ok ==true) {      

         for (const obj of this.proveedores) {

           if (obj.id_Empresa == this.formParams.value.id_Empresa ) {

             obj.ruc_Empresa= this.formParams.value.ruc_Empresa ;
             obj.razonSocial_Empresa= this.formParams.value.razonSocial_Empresa ;
             obj.direccion_Empresa= this.formParams.value.direccion_Empresa ;
             obj.id_Icono= this.formParams.value.id_Icono ;
             obj.estado= this.formParams.value.estado ;
             obj.descripcion_estado = this.formParams.value.estado == 0 ? "INACTIVO" : "ACTIVO";
             obj.esProveedor = (this.formParams.value.esProveedor == true) ? 1:0;

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

 editar({id_Empresa, ruc_Empresa, esProveedor, razonSocial_Empresa, direccion_Empresa, id_Icono, estado}){
   this.flag_modoEdicion=true;
   this.idEmpresaGlobal  = id_Empresa;

   setTimeout(()=>{ // 
    $('#modal_mantenimiento').modal('show');
  },0);

   this.formParams.patchValue({ "id_Empresa" : id_Empresa,"esProveedor" : esProveedor, "ruc_Empresa" :  ruc_Empresa  , "razonSocial_Empresa" : razonSocial_Empresa ,"direccion_Empresa" : direccion_Empresa,"id_Icono" : id_Icono,"estado" : estado, "usuario_creacion" : this.idUserGlobal }
   );

   this.get_retornarIconos(id_Icono);

   this.get_detallePlacasVehiculos();
   this.selectedTabControlDetalle = this.tabControlDetalle[0];

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
       this.proveedorService.set_anularProveedor(objBD.id_Empresa ).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.proveedores) {
             if (user.id_Empresa == objBD.id_Empresa ) {
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

 
 changeIcon(opcion, idIcon:number){

   this.formParams.patchValue({"id_Icono": idIcon});   

   for (const icon of this.detalleIconos) {
      icon.checkeado = false;
   }

  this.get_marcarIcono(idIcon);

 }

 get_marcarIcono(idIcon:number){
  for (const icon of this.detalleIconos) {
    if (icon.id_Icono == idIcon){
      icon.checkeado = true;
    }
   }
 }


// ----   TAB DE REGISTRO DE PLACAS DE VEHICULOS



get_detallePlacasVehiculos(){
  this.detalleVehiculos =[];
  this.proveedorService.get_detalleVehiculoPlacas(this.idEmpresaGlobal).subscribe((res:RespuestaServer)=>{
   if (res.ok) {            
     this.detalleVehiculos = res.data; 
     this.blank_Detalle();
   }else{
     this.alertasService.Swal_alert('error', JSON.stringify(res.data));
     alert(JSON.stringify(res.data));
     this.blank_Detalle();
   }   
  
  })        
}


get_verificarPlaca(nroPlaca:string){ 
  const listProveedor = this.detalleVehiculos.find(u=> u.nro_Placa.toUpperCase() === nroPlaca.toUpperCase());
  return listProveedor;
}


 guardarRegistroPlacas(){
  // if (this.formParamsCar.value.id_Empresa_Vehiculo == '' || this.formParamsCar.value.id_Empresa_Vehiculo == 0) {
  //   this.alertasService.Swal_alert('error','No se cargo el id del Proveedor, por favor actulize su página');
  //   return 
  // }   

  if (this.idEmpresaGlobal == 0) {
    this.alertasService.Swal_alert('error','No se cargo el id  de la empresa');
    return 
  }   

  if (this.formParamsCar.value.nro_Placa == '' || this.formParamsCar.value.nro_Placa == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el numero de placa');
    return 
  }   

  if (this.formParamsCar.value.cantidadM3 == '' || this.formParamsCar.value.cantidadM3 == null) {
    this.alertasService.Swal_alert('error','Por favor ingrese la cantidad de metros cúbicos');
    return 
  }  

  this.formParamsCar.patchValue({ "id_Empresa" : this.idEmpresaGlobal });

  Swal.fire({
    icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
  })
  Swal.showLoading();

  if ( this.flagModo_EdicionCar ==false) { /// nuevo

    const  placaVehiculo  = this.get_verificarPlaca(this.formParamsCar.value.nro_Placa);

    if (placaVehiculo) {
       Swal.close();
       this.alertasService.Swal_alert('error','El nro de Placa ya se encuentra registrada, verifique..');
       return;
    } 

    this.proveedorService.set_saveVehiculoPlaca(this.formParamsCar.value).subscribe((res:RespuestaServer)=>{
      Swal.close();    
      if (res.ok ==true) {     
        this.flag_modoEdicion = true;
        this.formParamsCar.patchValue({ "id_Empresa_Vehiculo" : Number(res.data) }); 
        this.get_detallePlacasVehiculos();
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })

  }else { /// editar

    this.proveedorService.set_updateVehiculoPlaca(this.formParamsCar.value, this.formParamsCar.value.id_Empresa_Vehiculo).subscribe((res:RespuestaServer)=>{  
      Swal.close();
      if (res.ok) {   
         const  idEmpresaVehiculo = this.formParamsCar.value.id_Empresa_Vehiculo; 
         for (const objdetalle of this.detalleVehiculos) {
           if (objdetalle.id_Empresa_Vehiculo == idEmpresaVehiculo ) {
              objdetalle.nro_Placa = this.formParamsCar.value.nro_Placa;
              objdetalle.cantidadM3 = this.formParamsCar.value.cantidadM3;
              break;
           }
         }
         this.blank_Detalle();

      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }    
    }) 

  }

 };

 blank_Detalle(){
  this.flagModo_EdicionCar= false;
  this.inicializarFormularioVehiculo();
 }

    
 modificarArchivoSeleccionado({id_Empresa_Vehiculo, id_Empresa, nro_Placa, cantidadM3}){  
    // id_Empresa_Vehiculo, id_Empresa, nro_Placa, cantidadM3
  
  this.formParamsCar.patchValue({
      "id_Empresa_Vehiculo"  : id_Empresa_Vehiculo ,
      "id_Empresa"  : id_Empresa,
      "nro_Placa"  : nro_Placa ,     
      "cantidadM3" : cantidadM3  
  }); 
  this.flagModo_EdicionCar= true;

  setTimeout(()=>{ // enfocando
   this._cantElement.nativeElement.focus();
  },0);

 }


 eliminarArchivoSeleccionado(item:any){      
  Swal.fire({
    icon: 'info',
    allowOutsideClick: false,
    allowEscapeKey: false,
    text: 'Espere por favor'
  })
  Swal.showLoading();
   this.proveedorService.set_deleteVehiculoPlaca(item.id_Empresa_Vehiculo).subscribe((res:RespuestaServer)=>{
    Swal.close();
    if (res.ok) { 
        var index = this.detalleVehiculos.indexOf( item );
        this.detalleVehiculos.splice( index, 1 );
        this.blank_Detalle();
    }else{
      this.alertasService.Swal_alert('error', JSON.stringify(res.data));
      alert(JSON.stringify(res.data));
    }
  })
 }
 
  

}

