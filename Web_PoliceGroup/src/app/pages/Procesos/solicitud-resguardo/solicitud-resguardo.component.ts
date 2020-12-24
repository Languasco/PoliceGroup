
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import { from, combineLatest } from 'rxjs';
import Swal from 'sweetalert2';
 
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SolicitudResguardoService } from '../../../services/Procesos/solicitud-resguardo.service';
import { PersonalService } from '../../../services/Mantenimientos/personal.service';
 

declare var $:any;

@Component({
  selector: 'app-solicitud-resguardo',
  templateUrl: './solicitud-resguardo.component.html',
  styleUrls: ['./solicitud-resguardo.component.css']
})
 
export class SolicitudResguardoComponent implements OnInit  {

  formParamsFiltro : FormGroup;
  formParams : FormGroup;
  
  idUserGlobal :number = 0;
  servicios :any[]=[]; 
  solicitantes :any[]=[];    
  estados :any[]=[];  
  estadosBD :any[]=[];  
  
  jefeCuadrillas :any[]=[];  
   
  solicitudesCab :any[]=[];  
  efectivoPoliciales :any[]=[];  
  empresas :any[]=[];

  flag_modoEdicion = false;

  idSolicitudCab_global :number = 0;
  idEstado_global :number = 9;

  filtrarMantenimiento = "";
  datepiekerConfig:Partial<BsDatepickerConfig>;

   /// configuracion google maps
    @ViewChild('mapa', {static: false}) mapaElement: ElementRef;
    map : google.maps.Map;
    markers :google.maps.Marker[] = [];
    infowindows :google.maps.InfoWindow[] = [];
   
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,  private funcionGlobalServices : FuncionesglobalesService, private  solicitudResguardoService : SolicitudResguardoService, private personalService :PersonalService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
  this.inicializarFormularioFiltro();
  this.inicializarFormulario();
  this.getCargarCombos();

 }

 
 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({ 
      idEmpresa : new FormControl('0'),
      idSolicitante : new FormControl('0'),
      servicio : new FormControl('0'),
      fecha_ini : new FormControl(new Date()),
      fecha_fin : new FormControl(new Date()),
      idEstado : new FormControl('9')
     }) 
 }

 inicializarFormulario(){ 
   this.formParams= new FormGroup({ 
    id_Solicitud_Cab : new FormControl('0'),
    id_Empresa: new FormControl('0'),
    fechaAtencion : new FormControl(new Date()),
    id_Servicios : new FormControl('0'),
    id_PersonalCoordinar : new FormControl('0'),
    asigna_JC : new FormControl(false),
    id_PersonalJefeCuadrilla : new FormControl('0'),
    cantidadEfectivos : new FormControl(''),
    cantidadHoras : new FormControl(''),
    estado : new FormControl('9'),
    usuario_creacion : new FormControl('0'),
   }) 
}

 
 getCargarCombos(){ 
  this.spinner.show();
  combineLatest([this.solicitudResguardoService.get_servicio(this.idUserGlobal), this.solicitudResguardoService.get_solicitantes(), this.solicitudResguardoService.get_estados(), this.solicitudResguardoService.get_jefeCuadrillas() , this.personalService.get_empresas(this.idUserGlobal)  ])
  .subscribe( ([ _servicios, _solicitantes,_estados , _jefeCuadrillas, _empresas ])=>{
      this.servicios = _servicios;
      this.solicitantes = _solicitantes; 
      this.estados = _estados.filter(est=> est.id_Estado == 3 || est.id_Estado == 9 || est.id_Estado == 10 || est.id_Estado == 11  );
      this.estadosBD = _estados.filter(est=> est.id_Estado == 3 || est.id_Estado == 9   || est.id_Estado == 11  );

      this.jefeCuadrillas = _jefeCuadrillas; 
      this.empresas = _empresas;

      setTimeout(() => {
        if (  this.servicios.length> 0  ) { 
          this.formParamsFiltro.patchValue({"servicio": String(_servicios[0].id_Servicios) });
        }
        if ( this.empresas.length > 0 ) {
          this.formParamsFiltro.patchValue({ "idEmpresa" : _empresas[0].id_Empresa });  
        }
       }, 100);

    this.spinner.hide(); 
  },(error)=>{
    this.spinner.hide(); 
    alert(error);
  })
 }

 

 mostrarInformacion(){
      if (this.formParamsFiltro.value.fecha_ini == '' || this.formParamsFiltro.value.fecha_ini == null) {
        this.alertasService.Swal_alert('error','Por favor seleccione la fecha inicial');
        return 
      }     
      if (this.formParamsFiltro.value.fecha_fin == '' || this.formParamsFiltro.value.fecha_fin == null) {
        this.alertasService.Swal_alert('error','Por favor seleccione la fecha final');
        return 
      }   

      const fechaIni = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_ini); 
      const fechaFin = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_fin); 

      this.spinner.show();
      this.solicitudesCab = [];
      this.solicitudResguardoService.get_mostrar_solicitudesCab(this.formParamsFiltro.value ,fechaIni,  fechaFin,  this.idUserGlobal, this.formParamsFiltro.value.idEmpresa)
          .subscribe((res:RespuestaServer)=>{            
              this.spinner.hide();   

              console.log(res.data);
              if (res.ok==true) {     
                  if(res.data.length > 0){ 
                    this.solicitudesCab = res.data;
                  }               
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
    this.idEstado_global = 9;
    this.idSolicitudCab_global = 0;
  
    this.inicializarFormulario();  

    let fechAumentada = new Date();
    fechAumentada.setDate(fechAumentada.getDate() +1);

    setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('show');
      $('#cboJefeCuadrilla').addClass('disabledForm');
      this.formParams.patchValue({ "id_Servicios" : this.formParamsFiltro.value.servicio , "fechaAtencion"  : fechAumentada , "id_Empresa" : this.formParamsFiltro.value.idEmpresa  });  
    },100);  

  }

  onChange_jefeCuadrilla(event:any){
    if (this.formParams.value.asigna_JC === true || this.formParams.value.asigna_JC === 1) {
      setTimeout(()=>{ // 
        $('#cboJefeCuadrilla').removeClass('disabledForm');
      },0);   
    }else{ 
     this.formParams.patchValue({ "id_PersonalJefeCuadrilla" : 0}); 
     setTimeout(()=>{ // 
       $('#cboJefeCuadrilla').addClass('disabledForm');      
     },0);  
    }
  }

  async saveUpdate(){ 
 
    if (this.formParams.value.id_Servicios == '0' || this.formParams.value.id_Servicios == 0 ) {
      this.alertasService.Swal_alert('error','Por favor seleccione el Area');
      return 
    }        

    if (this.formParams.value.fechaAtencion == '' || this.formParams.value.fechaAtencion == null ) {
      this.alertasService.Swal_alert('error','Por favor ingrese la fecha de atencion');
      return 
    }    

    if (this.formParams.value.cantidadEfectivos == '' || this.formParams.value.cantidadEfectivos == 0  || this.formParams.value.cantidadEfectivos == '0') {
      this.alertasService.Swal_alert('error','Por favor ingrese la cantidad de efectivos, tiene que ser mayor a cero ');
      return 
    }   

    // if (this.formParams.value.cantidadHoras == '' || this.formParams.value.cantidadHoras == 0  || this.formParams.value.cantidadHoras == '0') {
    //   this.alertasService.Swal_alert('error','Por favor ingrese la cantidad de Horas, tiene que ser mayor a cero ');
    //   return 
    // }   

    if (this.formParams.value.asigna_JC ==  true || this.formParams.value.asigna_JC == 1 ) {      
      if (this.formParams.value.id_PersonalJefeCuadrilla == '0' || this.formParams.value.id_PersonalJefeCuadrilla == 0 ) {
        this.alertasService.Swal_alert('error','Por favor seleccione el Jefe de Cuadrilla');
        return 
      }   
    }   

    if (this.formParams.value.estado == '0' || this.formParams.value.estado == 0 ) {
      this.alertasService.Swal_alert('error','Por favor seleccione el Estado');
      return 
    }      
   
     const checkJefe = (this.formParams.value.asigna_JC == true) ? 1 : 0;
     this.formParams.patchValue({ "asigna_JC" : checkJefe });
     this.formParams.patchValue({ "id_PersonalCoordinar" : this.idUserGlobal , "usuario_creacion" : this.idUserGlobal });
  
     if ( this.flag_modoEdicion==false) { //// nuevo  
  
       Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
       Swal.showLoading();
    
       this.solicitudResguardoService.set_save_solicitudes(this.formParams.value).subscribe((res:RespuestaServer)=>{
         Swal.close();    
         if (res.ok ==true) {     

           this.flag_modoEdicion = true;
           this.idSolicitudCab_global =  Number(res.data);
           this.formParams.patchValue({ "id_Solicitud_Cab" : Number(res.data) });
              
           const checkJefe = (this.formParams.value.asigna_JC == 1) ? true : false;
           this.formParams.patchValue({ "asigna_JC" : checkJefe });

           this.mostrarInformacion();
 
           this.alertasService.Swal_Success('Se agrego correctamente..');
         }else{

          const checkJefe = (this.formParams.value.asigna_JC == 1) ? true : false;
          this.formParams.patchValue({ "asigna_JC" : checkJefe });

           this.alertasService.Swal_alert('error', JSON.stringify(res.data));
           alert(JSON.stringify(res.data));
         }
       })
       
     }else{ /// editar
  
       Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
       Swal.showLoading();
       this.solicitudResguardoService.set_edit_solicitudes(this.formParams.value , this.formParams.value.id_Solicitud_Cab ).subscribe((res:RespuestaServer)=>{
         Swal.close(); 
         if (res.ok ==true) {              
           this.mostrarInformacion();
           const checkJefe = (this.formParams.value.asigna_JC == 1) ? true : false;
           this.formParams.patchValue({ "asigna_JC" : checkJefe });

           this.alertasService.Swal_Success('Se actualizó correctamente..');  
         }else{
          const checkJefe = (this.formParams.value.asigna_JC == 1) ? true : false;
          this.formParams.patchValue({ "asigna_JC" : checkJefe });

           this.alertasService.Swal_alert('error', JSON.stringify(res.data));
           alert(JSON.stringify(res.data));
         }
       })

     }
  
   } 
    
   editar({ id_Solicitud_Cab,  idArea, idSolicitante,  idJefeCuadrilla,   fechaAtencion, cantidadEfectivos,cantidadHoras, asigna_JC, idEstado}){

    this.flag_modoEdicion=true;
    this.idSolicitudCab_global = id_Solicitud_Cab; 
    this.idEstado_global = idEstado;
   
    setTimeout(()=>{ // 
     $('#modal_mantenimiento').modal('show');
    },0);


    if (asigna_JC == '1' || asigna_JC ==true ) {
      setTimeout(()=>{ // 
        $('#cboJefeCuadrilla ').removeClass('disabledForm');      
      },0); 
     }else{
      setTimeout(()=>{ // 
        $('#cboJefeCuadrilla').addClass('disabledForm');      
      },0); 
     }
  
    this.formParams.patchValue({ 
      "id_Solicitud_Cab"  : id_Solicitud_Cab,
      "fechaAtencion" :   new Date(fechaAtencion) ,
      "id_Servicios" : idArea, 
      "id_PersonalCoordinar" :idSolicitante,
      "asigna_JC" : (asigna_JC == 1 || asigna_JC == '1' ) ? true : false,
      "id_PersonalJefeCuadrilla" : idJefeCuadrilla,
      "cantidadEfectivos" : cantidadEfectivos,
      "cantidadHoras" : cantidadHoras,
      "estado" : idEstado,
      "usuario_creacion" : this.idUserGlobal 
    });  
  } 

   
   enviarAsignar(){

    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de enviar a Asignar ?')
    .then((result)=>{
      if(result.value){
 
        Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
        Swal.showLoading();
        this.solicitudResguardoService.set_enviarAsignar( this.idSolicitudCab_global, this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
          Swal.close();        
          if (res.ok ==true) {             
           
            for (const sol of this.solicitudesCab) {
              if (sol.id_Solicitud_Cab == this.idSolicitudCab_global ) {               
                sol.idEstado = 10;
                sol.descripcion_estado =  "POR ASIGNAR" ;
                break;
              }
            }
            this.alertasService.Swal_Success('Proceso realizado correctamente..')  
            this.cerrarModal();
 
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
        })
         
      }
    }) 

   }


   anular(objBD:any){ 
    if (objBD.idEstado === 10 || objBD.idEstado =='10' || objBD.idEstado ===11 || objBD.idEstado =='11') {      
      return;      
    }
 
    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de anular ?')
    .then((result)=>{
      if(result.value){
 
        Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
        Swal.showLoading();
        this.solicitudResguardoService.set_anular(objBD.id_Solicitud_Cab ).subscribe((res:RespuestaServer)=>{
          Swal.close();        
          if (res.ok ==true) { 
            
            for (const sol of this.solicitudesCab) {
              if (sol.id_Solicitud_Cab == objBD.id_Solicitud_Cab ) {               
                sol.idEstado = 11;
                sol.descripcion_estado =  "ANULADO" ;
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

  efectivosPoliciales(objBD :any){

    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();
    this.solicitudResguardoService.get_efectivosPoliciales( objBD.id_Solicitud_Cab, this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
      Swal.close();   
      
      console.log(res.data);

      if (res.ok ==true) {         
        this.efectivoPoliciales = res.data;
        setTimeout(()=>{ // 
          $('#modal_efectivos').modal('show');
        },0); 
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }
 
  cerrarModalEfectivos(){
    setTimeout(()=>{ // 
      $('#modal_efectivos').modal('hide');  
    },0); 
  }

  
  descargarGrilla(){

    if (this.formParamsFiltro.value.fecha_ini == '' || this.formParamsFiltro.value.fecha_ini == null) {
      this.alertasService.Swal_alert('error','Por favor seleccione la fecha inicial');
      return 
    }     
    if (this.formParamsFiltro.value.fecha_fin == '' || this.formParamsFiltro.value.fecha_fin == null) {
      this.alertasService.Swal_alert('error','Por favor seleccione la fecha final');
      return 
    }   

    const fechaIni = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_ini); 
    const fechaFin = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_fin); 
  
    this.spinner.show();
    this.solicitudResguardoService.get_descargar_solicitudesCab(this.formParamsFiltro.value ,fechaIni,  fechaFin,  this.idUserGlobal,  this.formParamsFiltro.value.idEmpresa)
        .subscribe((res:RespuestaServer)=>{            
            this.spinner.hide();
            console.log(res.data);
            if (res.ok==true) {        
              window.open(String(res.data),'_blank');
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
  }  
  
 

}
