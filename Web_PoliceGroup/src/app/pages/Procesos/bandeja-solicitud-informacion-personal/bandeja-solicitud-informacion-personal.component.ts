
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
import { InputFileI } from '../../../models/inputFile.models';
import { UploadService } from '../../../services/Upload/upload.service';

declare var $:any;

@Component({
  selector: 'app-bandeja-solicitud-informacion-personal',
  templateUrl: './bandeja-solicitud-informacion-personal.component.html',
  styleUrls: ['./bandeja-solicitud-informacion-personal.component.css']
}) 

export class BandejaSolicitudInformacionPersonalComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsFile: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false
  
  solicitudesCab :any[]=[]; 
  filtrarMantenimiento = "";

  empresas :any[]=[];
  estados :any[]=[];
  documentosPendientes :any[]=[];
  documentosAsignados :any[]=[];
  filesDoc :InputFileI[] = [];
 

  id_Ibp_Cab_Global = 0;
  id_Ibp_DET_Global = 0;
  id_estado_Global = 0
  cantSolicitud_Global = 0
  cantSolicitud_Extra_Global = 0
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService, private funcionesglobalesService : FuncionesglobalesService, private cargoPersonalService : CargoPersonalService, private solicitudInformacionPersonalService : SolicitudInformacionPersonalService, private proveedorService : ProveedorService, private usuariosService : UsuariosService, private uploadService : UploadService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.getCargarCombos();
   this.inicializarFormularioFiltro();
   this.inicializarFormulario();
   this.inicializarFormularioArchivos();
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
      id_Ibp_det: new FormControl('0'), 
      id_Empresa: new FormControl('0'),
      id_TipoDoc: new FormControl('1'),
      
      nro_Documento: new FormControl(''),
      apellidos_Peronal: new FormControl(''),
      nombre_personal: new FormControl(''),

      estado : new FormControl('13'),   
      usuario_creacion : new FormControl('')
    }) 
 }  

 inicializarFormularioArchivos(){ 
  this.formParamsFile= new FormGroup({
      file: new FormControl('') 
   }) 

 }


 getCargarCombos(){ 

  this.spinner.show();
  combineLatest([ this.proveedorService.get_estados(), this.solicitudInformacionPersonalService.get_empresas(this.idUserGlobal) ,   ]).subscribe( ([_estados, _empresas])=>{
      this.estados = _estados.filter((estado) => estado.tipoproceso_estado =='IBP'); 
      this.empresas = _empresas; 
 
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
      this.solicitudInformacionPersonalService.get_mostrar_bandejaSolicitudInformacionPersonalCab(this.formParamsFiltro.value.idEmpresa , this.formParamsFiltro.value.idEstado, this.idUserGlobal )
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


   editar({ id_Ibp_Cab, nro_Documento, apellidos_Peronal, nombre_personal, id_estado}){  
     this.flag_modoEdicion=true;
  
     this.id_Ibp_Cab_Global = id_Ibp_Cab;
     this.id_Ibp_DET_Global = 0;
     this.id_estado_Global = id_estado;
  
     this.formParams.patchValue({ "id_Ibp_Cab" : id_Ibp_Cab, "nro_Documento" :  nro_Documento ,"apellidos_Peronal" :  apellidos_Peronal, "nombre_personal" :  nombre_personal,  "estado" : id_estado,   "usuario_creacion" : this.idUserGlobal, "id_Ibp_det" : 0 });

     this.get_solicitudesDocumentosDet();
  
     setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('show');
    },0);   
   }  
   
   get_solicitudesDocumentosDet(){
    this.spinner.show();
    this.usuariosService.get_SolicitudInformacionDet_checkeado_Masivo(this.id_Ibp_Cab_Global).subscribe((res:RespuestaServer)=>{
      this.spinner.hide();
      if (res.ok ==true) {     
         this.documentosPendientes = res.data.filter((doc)=> doc.nombreArchivo_bd == 0);
         this.documentosAsignados = res.data.filter((doc)=> doc.nombreArchivo_bd > 0);
      }else{
       this.alertasService.Swal_alert('error', JSON.stringify(res.data));
       alert(JSON.stringify(res.data));
      }
     })
   }

 
   onChange_empresa(empresa:any){  
      if (empresa == 0) {
        this.cantSolicitud_Global = 0;
        this.cantSolicitud_Extra_Global = 0;
        return;
      }
      this.mostrar_cantidadSolicitudesEmpresa(empresa)  ;
   }
  
   mostrar_cantidadSolicitudesEmpresa(empresa: number){
    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();
    this.solicitudInformacionPersonalService.get_cantidadSolicitudesRealizadas(empresa, this.idUserGlobal, 'BAN' )
        .subscribe((res:RespuestaServer)=>{            
          Swal.close();    
 
            if (res.ok==true) {                    
              if (res.data.length > 0) {
                this.cantSolicitud_Global = Number(res.data[0].cantSolicitudes); 
                this.cantSolicitud_Extra_Global = Number(res.data[0].cantSolicitudesExtra); 
              }else {
                this.cantSolicitud_Global = 0;
                this.cantSolicitud_Extra_Global = 0;
              }           
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
   }
  
   onFileChange(event:any, opcion:number) {   
    
    var filesTemporal = event.target.files; //FileList object       
     var fileE:InputFileI [] = []; 
     for (var i = 0; i < event.target.files.length; i++) { //for multiple files          
       fileE.push({
           'file': filesTemporal[i],
           'namefile': filesTemporal[i].name,
           'status': '',
           'message': ''
       })  
     }
      this.filesDoc = fileE;
   
   }


     
  subirArchivo(){

    if (this.id_Ibp_DET_Global ==0 ) {
      this.alertasService.Swal_alert('error', 'Por favor seleccione el Tipo de documento.');
      return;
    }
  
    if (!this.formParamsFile.value.file) {
      this.alertasService.Swal_alert('error', 'Por favor seleccione el archivo que va a cargar.');
      return;
    }
  
    if (this.obtnerArchivoYacargado( this.filesDoc[0].file.name ) ==true) {
      this.alertasService.Swal_alert('error', 'El archivo que intenta subir, Ya se encuentra cargado');
      return;
    }
  
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      allowEscapeKey: false,
      text: 'Espere por favor'
    })
    Swal.showLoading(); 
    this.uploadService.upload_documentos_solicitudInformacionDet( this.filesDoc[0].file, this.id_Ibp_DET_Global, this.idUserGlobal ).subscribe(
      (res:RespuestaServer) =>{
        Swal.close();
 
        if (res.ok==true) { 
          this.filesDoc = [];
          this.alertasService.Swal_Success('Proceso de carga realizado correctamente..');
          this.blank();
          this.get_solicitudesDocumentosDet();          

        }else{
            this.filesDoc[0].message = String(res.data);
            this.filesDoc[0].status = 'error';   
        }
        },(err) => {
          Swal.close();
          this.filesDoc[0].message = JSON.stringify(err);
          this.filesDoc[0].status = 'error';
        }
    );
  
   }
  
   obtnerArchivoYacargado(nombreArchivo:string){  
    var flagRepetida=false;
    for (const obj of this.documentosAsignados) {
      if (  obj.nombreArchivo == nombreArchivo ) {
           flagRepetida = true;
           break;
      }
    }
    return flagRepetida;
  }
  
  blank(){
    this.inicializarFormularioArchivos();
    this.id_Ibp_DET_Global = 0;
   }
    
  onChange_tipoDocumento(idDet:any){  
    if (idDet == 0) {
      this.id_Ibp_DET_Global = 0;
    }else{
      this.id_Ibp_DET_Global = idDet;
    }
 
  }

  eliminarArchivoSeleccionado(item:any){    
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.solicitudInformacionPersonalService.get_eliminarArchivos_bandejaSolicitudInformacion(item.id_Ibp_det).subscribe((res:RespuestaServer)=>{
      Swal.close();
 
      if (res.ok) { 
          this.alertasService.Swal_Success("Proceso realizado correctamente..")
          this.blank();
          this.get_solicitudesDocumentosDet();        
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }

  downloadFileExport(id_Ibp_det:number){    
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.solicitudInformacionPersonalService.get_descargarArchivos_bandejaSolicitudInformacion(id_Ibp_det, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
      Swal.close();
 
      if (res.ok) { 
        window.open(String(res.data),'_blank');
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }

  terminarSolicitud(){

    if ( this.documentosPendientes.length > 0 ) {
      this.alertasService.Swal_alert('error', 'Aun hay documentos para adjuntar, complete por favor..');
      return;
    }

    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de Terminar la solicitud ?')
    .then((result)=>{
      if(result.value){

        Swal.fire({
          icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
        })
        Swal.showLoading();
        this.solicitudInformacionPersonalService.set_terminarSolicitud( this.id_Ibp_Cab_Global, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
          Swal.close(); 
          if (res.ok) { 
            this.alertasService.Swal_Success('Proceso realizado correctamente..');
            this.mostrarInformacion();
            this.cerrarModal();

          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
        })
 
         
      }
    }) 




  }
  



  

}

