
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
  selector: 'app-bandeja-asignacion',
  templateUrl: './bandeja-asignacion.component.html',
  styleUrls: ['./bandeja-asignacion.component.css']
})

export class BandejaAsignacionComponent implements OnInit  {

  formParamsFiltro : FormGroup;
  formParams : FormGroup;
  formParamsDet : FormGroup;
  
  idUserGlobal :number = 0;
  servicios :any[]=[]; 
 
  estados :any[]=[];  
  estadosBD :any[]=[];  
  
  jefeCuadrillas :any[]=[];  
   
  solicitudesCab :any[]=[];  
  solicitudesDet :any[]=[];  
  efectivoPoliciales :any[]=[];  
  listResguardoEventos :any[]=[];  
  empresas :any[]=[];

  flag_modoEdicion = false;
  flagModo_EdicionDet = false;
  flagCerrar = false;

  idSolicitudCab_global :number = 0;
  idEstado_global :number = 9;

  filtrarMantenimiento = "";
  datepiekerConfig:Partial<BsDatepickerConfig>;

   /// configuracion google maps
    @ViewChild('mapa', {static: false}) mapaElement: ElementRef;
    map : google.maps.Map;
    markers :google.maps.Marker[] = [];
    infowindows :google.maps.InfoWindow[] = [];
   
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,  private funcionGlobalServices : FuncionesglobalesService, private  solicitudResguardoService : SolicitudResguardoService , private personalService :PersonalService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
  this.inicializarFormularioFiltro();
  this.inicializarFormulario();
  this.inicializarFormularioDet()
  this.getCargarCombos();

 }

 
 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({       
      idEmpresa : new FormControl('0'),
      servicio : new FormControl('0'),
      fecha_ini : new FormControl(new Date()),
      fecha_fin : new FormControl(new Date()),
      idEstado : new FormControl('10')
     }) 
 }

 inicializarFormulario(){ 
   this.formParams= new FormGroup({ 
    id_Solicitud_Cab : new FormControl('0'),
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

inicializarFormularioDet(){ 
  // id_Solicitud_Det, id_Solicitud_Cab, id_UsuarioEfectivoPolicial, estado, usuario_creacion 

  this.formParamsDet= new FormGroup({ 
      id_Solicitud_Det : new FormControl('0'),
      id_Solicitud_Cab : new FormControl('0'),
      id_UsuarioEfectivoPolicial : new FormControl('0'),      
      estado : new FormControl('1'),
      usuario_creacion : new FormControl('0'),
  }) 
}

 
 getCargarCombos(){ 
  this.spinner.show();
  combineLatest([this.solicitudResguardoService.get_servicio(this.idUserGlobal),  this.solicitudResguardoService.get_estados(), this.solicitudResguardoService.get_jefeCuadrillas() ,  this.personalService.get_empresas(this.idUserGlobal)  ])
  .subscribe( ([ _servicios,_estados , _jefeCuadrillas, _empresas ])=>{
      this.servicios = _servicios;
 
      this.estados = _estados.filter(est=> est.id_Estado == 3 ||   est.id_Estado == 10   );
      this.estadosBD = _estados.filter(est=> est.id_Estado == 3 ||   est.id_Estado == 10   );

      this.jefeCuadrillas = _jefeCuadrillas; 
      this.empresas = _empresas;

      if (  this.servicios.length> 0  ) { 
        this.formParamsFiltro.patchValue({"servicio": String(_servicios[0].id_Servicios) });
      }

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
      this.solicitudResguardoService.get_mostrar_solicitudesCab_bandeja(this.formParamsFiltro.value ,fechaIni,  fechaFin,  this.idUserGlobal, this.formParamsFiltro.value.idEmpresa  )
          .subscribe((res:RespuestaServer)=>{            
              this.spinner.hide();   
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
  this.flag_modoEdicion = false;
  this.idEstado_global = 9;
  this.idSolicitudCab_global = 0;

  setTimeout(()=>{ // 
    $('#modal_mantenimiento').modal('show');
    $('#cboJefeCuadrilla').addClass('disabledForm');
  },0);
  this.inicializarFormulario();    

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

    this.resguardoEventos( new Date(fechaAtencion) );
    this.getLiquidacionDet();

    setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('show');
     },0); 

  } 

   
  cerrarAsignacion(){

    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de cerrar la asignacion ?')
    .then((result)=>{
      if(result.value){
 
        Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
        Swal.showLoading();
        this.solicitudResguardoService.set_cerrarAsignacion( this.idSolicitudCab_global, this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
          Swal.close();        
          if (res.ok ==true) {             
           
            for (const sol of this.solicitudesCab) {
              if (sol.id_Solicitud_Cab == this.idSolicitudCab_global ) {               
                sol.idEstado = 3;
                sol.descripcion_estado =  "ASIGNADO" ;
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
    this.solicitudResguardoService.get_descargar_solicitudesCab(this.formParamsFiltro.value ,fechaIni,  fechaFin,  this.idUserGlobal, this.formParamsFiltro.value.idEmpresa )
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

  resguardoEventos(fechaAtencion :any){
    
    const fecha_Atencion = this.funcionGlobalServices.formatoFecha(fechaAtencion); 

    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();
    this.solicitudResguardoService.get_resguardoEventos(fecha_Atencion, this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
      Swal.close();            
 
      if (res.ok ==true) {         
        this.listResguardoEventos = res.data;
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }


  verificarEfectivoCargado(idUsuarioEfectivoPolicial: number){  
    var flagRepetida=false;
    for (const obj of this.solicitudesDet) {
      if (  obj.id_UsuarioEfectivoPolicial == idUsuarioEfectivoPolicial ) {
           flagRepetida = true;
           break;
      }
    }
    return flagRepetida;
  }

  blank_Detalle(){
    this.flagModo_EdicionDet= false;    
    this.inicializarFormularioDet();
   }


  getLiquidacionDet(){
    this.solicitudResguardoService.get_solicitudDet(this.idSolicitudCab_global).subscribe((res:RespuestaServer)=>{
     if (res.ok) {       

       this.solicitudesDet = res.data; 
       this.cerrarAsignacionBoton();
       this.blank_Detalle();

     }else{
       this.alertasService.Swal_alert('error', JSON.stringify(res.data));
       alert(JSON.stringify(res.data));
       this.blank_Detalle();
     }    
    })        
  }

  cerrarAsignacionBoton(){

    if (this.solicitudesDet.length == this.formParams.value.cantidadEfectivos  ) {
        this.flagCerrar = true;
     }else{
       this.flagCerrar = false;
     }

  }



  guardarDet(){ 
    if (this.formParamsDet.value.id_UsuarioEfectivoPolicial == '' || this.formParamsDet.value.id_UsuarioEfectivoPolicial == 0 || this.formParamsDet.value.id_UsuarioEfectivoPolicial == null)  {
      this.alertasService.Swal_alert('error', 'Seleccione un usuario por favor.');
      return 
    } 

    Swal.fire({
      icon: 'info',allowOutsideClick: false, allowEscapeKey: false,  text: 'Espere por favor'
    })
    Swal.showLoading();

    this.formParamsDet.patchValue({ "id_Solicitud_Cab" : this.idSolicitudCab_global  ,"usuario_creacion" :this.idUserGlobal });

    if (this.flagModo_EdicionDet ==false) { /// nuevo

        if (this.verificarEfectivoCargado( this.formParamsDet.value.id_UsuarioEfectivoPolicial ) ==true) {
          this.alertasService.Swal_alert('error', 'El Efectivo ya se cargo, verifique ..');
          return;
        }

        this.solicitudResguardoService.saveSolicitudDetalle(this.formParamsDet.value).subscribe((res:RespuestaServer)=>{  
          Swal.close();
          if (res.ok) {   
 
             this.formParams.patchValue({"id_Solicitud_Det": res.data});

             this.resguardoEventos( this.formParams.value.fechaAtencion );
             this.getLiquidacionDet();   

          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }    
        })

    }else{/// editar

        // this.solicitudResguardoService.updateLiquidacionDet(this.formParamsDet.value,this.formParamsDet.value.id_LiquidacionOT_Det).subscribe((res:RespuestaServer)=>{  
        //   Swal.close();
        //   if (res.ok) {   
        //     // this.getLiquidacionDet();          
        //    const  idLiquidacionOT_Det = this.formParamsDet.value.id_LiquidacionOT_Det;
        //    const cantLiquidacionOT_Det = this.formParamsDet.value.cantidad_LiquidacionOT_Det

        //    for (const objdetalle of this.LiquidacionDetalle) {
        //      if (objdetalle.id_LiquidacionOT_Det == idLiquidacionOT_Det ) {
        //         objdetalle.cantidad_LiquidacionOT_Det = cantLiquidacionOT_Det;
        //         break;
        //      }
        //    }
        //    this.blank_Detalle();

        //   }else{
        //     this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        //     alert(JSON.stringify(res.data));
        //   }    
        // })      
    }
  }

  eliminarSolicitudDetalle(item:any){    

    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.solicitudResguardoService.set_eliminarSolicitudDetalle(item.id_Solicitud_Det).subscribe((res:RespuestaServer)=>{
      Swal.close();
      if (res.ok) { 
          var index = this.solicitudesDet.indexOf( item );
          this.solicitudesDet.splice( index, 1 );
          this.cerrarAsignacionBoton();
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }
  
 

}
