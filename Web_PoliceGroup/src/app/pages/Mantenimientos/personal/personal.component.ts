
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import { from, combineLatest } from 'rxjs';
import Swal from 'sweetalert2';
 
import { PersonalService } from '../../../services/Mantenimientos/personal.service';
import { InputFileI } from '../../../models/inputFile.models';
import { UploadService } from '../../../services/Upload/upload.service';
import { SolicitudResguardoService } from '../../../services/Procesos/solicitud-resguardo.service';

declare var $:any;
@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})


export class PersonalComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsFile: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false
  estados :any[]=[];
  empresas :any[]=[];
  distritos :any[] = [];
  
  tipoDocumentos :any[]=[];
  cargos :any[]=[];
  personales :any[]=[];
  filesExcel:InputFileI[] = [];
  filePhoto:InputFileI[] = [];
 
  filtrarMantenimiento = "";
  importaciones :any[]=[];
  servicios :any[]=[]; 
  serviciosEmpresa :any[]=[]; 

  imgPersonal= './assets/img/sinImagen.jpg';
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private funcionesglobalesService : FuncionesglobalesService, private personalService :PersonalService, private uploadService : UploadService, private solicitudResguardoService : SolicitudResguardoService ) {         
   this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.getCargarCombos();
   this.inicializarFormularioFiltro();
   this.inicializarFormulario();
   this.inicializarFormularioFile();
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idEmpresa : new FormControl('0'),
      idEstado : new FormControl('1')
     }) 
 }

 inicializarFormulario(){ 
    this.formParams= new FormGroup({
      id_Personal: new FormControl('0'), 
      id_Servicio : new FormControl('0'), 
      id_Empresa: new FormControl('0'),
      id_TipoDoc: new FormControl('0'),
      nroDocumento_Personal: new FormControl(''),
      apellidos_Personal: new FormControl(''),
      nombres_Personal: new FormControl(''),
      id_Distrito: new FormControl('0'), 
      direccion_Personal : new FormControl(''), 
      id_Cargo: new FormControl('0'), 
      estado : new FormControl('1'),   
      // fecha_Nacimiento : new FormControl( new Date()),
      usuario_creacion : new FormControl('')
    }) 
 }

 
 inicializarFormularioFile(){ 
  this.formParamsFile = new FormGroup({
    idEmpresa : new FormControl('0'),
    file : new FormControl('')
   })
}  


 getCargarCombos(){ 
    this.spinner.show();
    combineLatest([ this.personalService.get_estados(), this.personalService.get_empresas(this.idUserGlobal), this.personalService.get_tipoDoc(), this.personalService.get_cargo(),  this.personalService.get_distritos(), this.solicitudResguardoService.get_servicio(this.idUserGlobal),  ]).subscribe( ([_estados, _empresas, _tipoDocumentos, _cargos ,_distritos, _servicios ])=>{
      this.estados = _estados;
      this.empresas = _empresas;
      this.tipoDocumentos = _tipoDocumentos;
      this.cargos = _cargos;
      this.distritos = _distritos;
      this.servicios = _servicios;   
     
      setTimeout(() => {
        if ( this.empresas.length > 0 ) {
          this.formParamsFiltro.patchValue({ "idEmpresa" : _empresas[0].id_Empresa });  
        }
       }, 100);

      this.spinner.hide(); 
    })

 }

 mostrarInformacion(){
       if (this.formParamsFiltro.value.idEmpresa == '' || this.formParamsFiltro.value.idEmpresa == 0) {
        this.alertasService.Swal_alert('error','Por favor seleccione la empresa');
        return 
      }  

      // if (this.formParamsFiltro.value.idEstado == '' || this.formParamsFiltro.value.idEstado == 0) {
      //   this.alertasService.Swal_alert('error','Por favor seleccione un estado');
      //   return 
      // }
  
      this.spinner.show();
      this.personalService.get_mostrarPersonal_general(this.formParamsFiltro.value.idEmpresa, this.formParamsFiltro.value.idEstado)
          .subscribe((res:RespuestaServer)=>{            
              this.spinner.hide();
              if (res.ok==true) {        
                  this.personales = res.data; 
                  console.log(  this.personales)
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
    this.serviciosEmpresa = [];
    setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('show');
      this.imgPersonal= './assets/img/sinImagen.jpg';
    },0);
    this.inicializarFormulario();    
 
 }

 

 get_verificarRuc(rucEmpresa:string){ 
    const listProveedor = this.personales.find(u=> u.ruc_Empresa.toUpperCase() === rucEmpresa.toUpperCase());
    return listProveedor;
 }

 async saveUpdate(){
  if ( this.flag_modoEdicion==true) { //// nuevo
     if (this.formParams.value.id_Personal == '' || this.formParams.value.id_Personal == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id personal, por favor actulize su página');
       return 
     }   
  }

  if (this.formParams.value.id_Empresa == '' || this.formParams.value.id_Empresa == 0) {
     this.alertasService.Swal_alert('error','Por favor seleccione una Empresa ');
     return 
  }  
  if (this.formParams.value.id_Empresa == '' || this.formParams.value.id_Empresa == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione una Empresa ');
    return 
 } 

  if (this.formParams.value.id_Servicio == '' || this.formParams.value.id_Servicio == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione servicio ');
    return 
  }    

   if (this.formParams.value.nroDocumento_Personal == '' || this.formParams.value.nroDocumento_Personal == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el numero de documento');
    return 
  }
  if (this.formParams.value.apellidos_Personal == '' || this.formParams.value.apellidos_Personal == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese los apellidos');
    return 
  }
  if (this.formParams.value.nombres_Personal == '' || this.formParams.value.nombres_Personal == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese los nombres');
    return 
  }
  if (this.formParams.value.id_Cargo == '' || this.formParams.value.id_Cargo == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione el cargo ');
    return 
 } 
 
   this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });

   if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();

     const  dniPersonal  = await this.personalService.get_verificarDni(this.formParams.value.nroDocumento_Personal);
     if (dniPersonal) {
      Swal.close();
      this.alertasService.Swal_alert('error','El nro de documento ya se encuentra registrada, verifique..');
      return;
     } 
 
     this.personalService.set_savePersonal(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {    

         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_Personal" : Number(res.data[0].id_Personal) }); 
         console.log(res.data[0].id_Personal)
         this.personales.push(res.data[0]);

        //  this.upload_imagePerson( Number(res.data[0].id_Personal) );

         this.alertasService.Swal_Success('Se agrego correctamente..');




       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.personalService.set_editPersonal(this.formParams.value , this.formParams.value.id_Personal).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) {   
         
        const empresaSeleccionada = $('#cbo_empresa option:selected').text();
        const cargoSeleccionada  = $('#cbo_cargo option:selected').text();
        // const distritoSeleccionada  = $('#cbo_distrito option:selected').text();

         for (const obj of this.personales) {

           if (obj.id_Personal == this.formParams.value.id_Personal ) {

             obj.id_Empresa= this.formParams.value.id_Empresa ;
             obj.razonSocial_Empresa = empresaSeleccionada ;

             obj.id_TipoDoc= this.formParams.value.id_TipoDoc ;
             obj.nroDocumento_Personal= this.formParams.value.nroDocumento_Personal ;

             obj.apellidos_Personal= this.formParams.value.apellidos_Personal ;
             obj.nombres_Personal= this.formParams.value.nombres_Personal ;
             
             obj.id_Cargo= this.formParams.value.id_Cargo ;
             obj.nombreCargo = cargoSeleccionada ;

            //  obj.id_Distrito= this.formParams.value.id_Distrito ;
            //  obj.nombreDistrito = distritoSeleccionada ;
            //  obj.direccion_Personal = this.formParams.value.direccion_Personal ;

             obj.id_Servicio = this.formParams.value.id_Servicio ;
            //  obj.fecha_Nacimiento = this.formParams.value.fecha_Nacimiento ;

             obj.estado= this.formParams.value.estado ;
             obj.descripcion_estado = this.formParams.value.estado == 0 ? "INACTIVO" : "ACTIVO";
             break;
           }
         }

         
        //  this.upload_imagePerson(this.formParams.value.id_Personal );


         this.alertasService.Swal_Success('Se actualizo correctamente..');  
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
   }

 } 

 upload_imagePerson(id_personal :number) {
  if ( this.filePhoto.length ==0){
    return;
  }
  Swal.fire({
    icon: 'info',
    allowOutsideClick: false,
    allowEscapeKey: false,
    text: 'Espere por favor'
  })
  Swal.showLoading();
  this.uploadService.upload_imagen_personal( this.filePhoto[0].file , id_personal, this.idUserGlobal ).subscribe(
    (res:RespuestaServer) =>{
    Swal.close();
      if (res.ok==true) {
        for (const obj of this.personales) {
          if (obj.id_Personal == this.formParams.value.id_Personal) {
             obj.fotourl= res.data ;       
             break;
          }
        }
      }else{
        this.alertasService.Swal_alert('error',JSON.stringify(res.data));
      }
      },(err) => {
      Swal.close();
      this.alertasService.Swal_alert('error',JSON.stringify(err)); 
      }
  )

 }

 editar({ id_Personal, id_Empresa, id_TipoDoc, nroDocumento_Personal, apellidos_Personal, nombres_Personal, id_Cargo , direccion_Personal , id_Distrito , estado, id_Servicio, fecha_Nacimiento, fotourl  }){
   this.flag_modoEdicion=true;
   setTimeout(()=>{ // 
    $('#modal_mantenimiento').modal('show');
  },0);

   this.formParams.patchValue({ "id_Personal" : id_Personal, "id_Empresa" :  id_Empresa  , "id_TipoDoc" : id_TipoDoc ,"nroDocumento_Personal" : nroDocumento_Personal,"apellidos_Personal" : apellidos_Personal,"nombres_Personal" : nombres_Personal, "id_Cargo" : id_Cargo , "direccion_Personal" : direccion_Personal, "id_Distrito" : id_Distrito, "estado" : estado, "usuario_creacion" : this.idUserGlobal , "id_Servicio" : id_Servicio  }
   );
   
  //  this.imgPersonal = (!fotourl)? './assets/img/sinImagen.jpg' : fotourl; 
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
       this.personalService.set_anularPersonal(objBD.id_Personal ).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.personales) {
             if (user.id_Personal == objBD.id_Personal ) {
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

 
 
 


 // -----------------------------
// IMPORTACION DE ARCHIVOS EXCEL
// -----------------------------

   
 cerrarModal_importacion(){
  setTimeout(()=>{ // 
    $('#modal_importar').modal('hide');  
  },0); 
 }

 abrirModal_importar(){
 
  setTimeout(()=>{ // 
    $('#modal_importar').modal('show');
  },0);
  this.blankFile();    

 }

 onFileChange(event:any) {   
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
     this.filesExcel = fileE;
 }

 blankFile(){
  this.filesExcel = [];
  this.importaciones = [];
  this.inicializarFormularioFile()
  setTimeout(() => {
   //// quitando una clase la que desabilita---
   $('#btnGrabar').addClass('disabledForm');
   $('#btnVer').removeClass('disabledForm');
  }, 100);

 }

 downloadFormat(){
    window.open('./assets/format/FORMATO_PERSONAL.xlsx');    
 }

   subirArchivo(){ 
  
    if (this.formParamsFile.value.idEmpresa == '' || this.formParamsFile.value.idEmpresa == 0) {
      this.alertasService.Swal_alert('error','Por favor seleccione una Empresa');
      return 
    } 
  
    if (!this.formParamsFile.value.file) {
      this.alertasService.Swal_alert('error', 'Por favor seleccione el archivo excel.');
      return;
    }
     
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      allowEscapeKey: false,
      text: 'Espere por favor'
    })
    Swal.showLoading();
   this.uploadService.upload_Excel_personal( this.filesExcel[0].file , this.formParamsFile.value.idEmpresa, this.idUserGlobal ).subscribe(
     (res:RespuestaServer) =>{
      Swal.close();
       if (res.ok==true) { 
           this.importaciones = res.data;
           this.filesExcel = [];
           setTimeout(() => {
            //// quitando una clase la que desabilita---
             $('#btnGrabar').removeClass('disabledForm');
             $('#btnVer').addClass('disabledForm');
           }, 100);
       }else{
           this.filesExcel[0].message = String(res.data);
           this.filesExcel[0].status = 'error';   
       }
       },(err) => {
        Swal.close();
         this.filesExcel[0].message = JSON.stringify(err);
         this.filesExcel[0].status = 'error';   
       }
   );
  } 
  
  guardar_importacionPersonal(){
    if (!this.formParamsFile.value.file) {
      this.alertasService.Swal_alert('error', 'Por favor seleccione el archivo excel.');
      return;
    }
   
    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de grabar ?')
    .then((result)=>{
      if(result.value){
  
        this.spinner.show();
        this.uploadService.save_archivoExcel_personal(this.idUserGlobal )
        .subscribe((res:RespuestaServer) =>{  
            this.spinner.hide();   
            if (res.ok==true) { 
               this.alertasService.Swal_Success('Se grabó correctamente la información..');
  
               setTimeout(() => {
                $('#btnGrabar').addClass('disabledForm');
               }, 100);
               this.mostrarInformacion();
  
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
            },(err) => {
              this.spinner.hide();
              this.filesExcel[0].message = JSON.stringify(err);
              this.filesExcel[0].status = 'error';   
            }
        );  
        
      }
    })       
  }  
  
   openFile(){
    $('#inputFileOpen').click();
   }

  onFotoChange(event:any) {   
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
     this.filePhoto = fileE;
 
     for (var i = 0; i < filesTemporal.length; i++) { //for multiple files          
         ((file)=> {
             var name = file;
             var reader = new FileReader();
             reader.onload = (e)=> {
                 let urlImage = e.target;
                 this.imgPersonal = String(urlImage['result']);      
             }
             reader.readAsDataURL(file);
         })(filesTemporal[i]);
     }
  }

  change_empresa(idEmpresa:any){  
    if (idEmpresa == 0 ) {
      this.serviciosEmpresa = [];
      return;
    }
    this.spinner.show();
    this.personalService.get_serviciosEmpresa(this.formParams.value.id_Empresa, this.idUserGlobal)
        .subscribe((res:RespuestaServer)=>{            
            this.spinner.hide();
            if (res.ok==true) {        
                this.serviciosEmpresa = res.data; 
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
  }

   

  
}
