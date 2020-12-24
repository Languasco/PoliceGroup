
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import { from, combineLatest } from 'rxjs';
import Swal from 'sweetalert2';
 
import { ListaPreciosService } from '../../../services/Mantenimientos/lista-precios.service';
import { OrdenTrabajoService } from '../../../services/Procesos/orden-trabajo.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AprobacionOTService } from '../../../services/Procesos/aprobacion-ot.service';
import { DetalleOTService } from '../../../services/reportes/detalle-ot.service';

declare var $:any;
@Component({
  selector: 'app-detalle-ot',
  templateUrl: './detalle-ot.component.html',
  styleUrls: ['./detalle-ot.component.css']
})
 


export class DetalleOTComponent implements OnInit,AfterViewInit {

  formParamsFiltro : FormGroup;
  formParamsDatosG : FormGroup;  

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false

  servicios :any[]=[];   
  distritos :any[]=[];
  proveedor :any[]=[];   
  estados :any[]=[];   
  tipoOrdenTrabajo :any[]=[];  
  ordenTrabajoCab :any[]=[]; 

  medidasDetalle :any[]=[]; 
  desmonteDetalle :any[]=[]; 
  fotosDetalle :any[]=[]; 
  
  filtrarMantenimiento = "";
  opcionModal = "";
  tituloModal = "";

  checkeadoAll=false; 
  datepiekerConfig:Partial<BsDatepickerConfig>;

  detalleOT:any;
   /// configuracion google maps
    @ViewChild('mapa', {static: false}) mapaElement: ElementRef;
    map : google.maps.Map;
    marker :google.maps.Marker;


  //-TAB control
  tabControlDetalle: string[] = ['DATOS GENERALES','MEDIDAS','DESMONTE',]; 
  selectedTabControlDetalle :any;

  flagMedidas =  true;
  id_OTGlobal = 0;
  id_tipoOTGlobal = 0;
  id_estadoOTGlobal = 0;
  id_FotoOTGlobal = 0;

  nroObraParteDiario_Global = '';
  fechaHora_Global = '';

  totalGlobal =0;
  totalGlobal14 =0;
  totalGlobal15 =0;

  
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private listaPreciosService : ListaPreciosService, private ordenTrabajoService : OrdenTrabajoService, private aprobacionOTService : AprobacionOTService , private funcionGlobalServices : FuncionesglobalesService, private detalleOTService:DetalleOTService ) {         
   this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
  this.selectedTabControlDetalle = this.tabControlDetalle[0]; 
  this.getCargarCombos();
  this.inicializarFormularioFiltro();
  this.inicializarFormularioDatosG();
 }

 ngAfterViewInit() {
  this.InicializarMapa()
} 

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idServicio : new FormControl('0'),
      idTipoOT : new FormControl('0'),
      idProveedor : new FormControl('0'),
      fecha_ini : new FormControl(new Date()),
      fecha_fin : new FormControl(new Date()), 
      idEstado : new FormControl('0')
     }) 
 }

 inicializarFormularioDatosG(){ 
  this.formParamsDatosG= new FormGroup({ 
    direccion : new FormControl(''),
    idDistrito : new FormControl('0'),
    referencia : new FormControl(''),
    descripcionTrabajo : new FormControl(''),
    idEstado : new FormControl('0'), 
   }) 
} 


 getCargarCombos(){ 
    this.spinner.show();
    combineLatest([this.ordenTrabajoService.get_servicio(this.idUserGlobal), this.listaPreciosService.get_tipoOrdenTrabajo(), this.ordenTrabajoService.get_Distritos(), this.ordenTrabajoService.get_Proveedor(), this.aprobacionOTService.get_estados() ]).subscribe( ([ _servicios, _tipoOrdenTrabajo, _distritos, _proveedor,_estados ])=>{
        this.servicios = _servicios;
        this.tipoOrdenTrabajo = _tipoOrdenTrabajo; 
        this.distritos = _distritos; 
        this.proveedor = _proveedor; 
        this.estados = _estados;
      this.spinner.hide(); 
    },(error)=>{
      this.spinner.hide(); 
      alert(error);
    })

 }

 InicializarMapa() {
  const latLng = new google.maps.LatLng(-12.046374, -77.0427934 );
  const  mapaOption : google.maps.MapOptions = {
    center : latLng,
    zoom : 13,
    mapTypeControl: true,
  }
  this.map = new google.maps.Map(this.mapaElement.nativeElement, mapaOption);
  this.marker = new google.maps.Marker({
    position: latLng
  });
  this.marker.setMap(this.map);
 };

 mostrarInformacion(){
      // if (this.formParamsFiltro.value.idServicio == '' || this.formParamsFiltro.value.idServicio == 0) {
      //   this.alertasService.Swal_alert('error','Por favor seleccione el servicio');
      //   return 
      // }
      
      if (this.formParamsFiltro.value.idTipoOT == '' || this.formParamsFiltro.value.idTipoOT == 0) {
        this.alertasService.Swal_alert('error','Por favor seleccione el Tipo de Orden Trabajo');
        return 
      }  
 
      // if (this.formParamsFiltro.value.idProveedor == '' || this.formParamsFiltro.value.idProveedor == 0) {
      //   this.alertasService.Swal_alert('error','Por favor seleccione un Proveedor');
      //   return 
      // }

      if (this.formParamsFiltro.value.fecha_ini == '' || this.formParamsFiltro.value.fecha_ini == null) {
        this.alertasService.Swal_alert('error','Por favor seleccione la fecha inicial');
        return 
      }
      if (this.formParamsFiltro.value.fecha_fin == '' || this.formParamsFiltro.value.fecha_fin == null) {
        this.alertasService.Swal_alert('error','Por favor seleccione la fecha final');
        return 
      }

      // if (this.formParamsFiltro.value.idEstado == '' || this.formParamsFiltro.value.idEstado == 0) {
      //   this.alertasService.Swal_alert('error','Por favor seleccione un Estado');
      //   return 
      // }

      const fechaIni = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_ini);
      const fechaFin = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_fin);
  
      this.spinner.show();
      this.detalleOTService.get_mostrarDetalleOt(this.formParamsFiltro.value,fechaIni, fechaFin, this.idUserGlobal)
          .subscribe((res:RespuestaServer)=>{            
              this.spinner.hide();
              if (res.ok==true) {        
                  this.ordenTrabajoCab = res.data;  
               }else{
                this.alertasService.Swal_alert('error', JSON.stringify(res.data));
                alert(JSON.stringify(res.data));
              }
      })
 }   
  
 marcarTodos(){
  if (this.ordenTrabajoCab.length<=0) {
    return;
  }
  for (const obj of this.ordenTrabajoCab) {
    if (this.checkeadoAll) {
      obj.checkeado = false;
    }else{
      obj.checkeado = true;
    }
  }
 }

 validacionCheckMarcado(){    
  let CheckMarcado = false;
  // CheckMarcado = this.verificarCheckMarcado();
  CheckMarcado = this.funcionGlobalServices.verificarCheck_marcado(this.ordenTrabajoCab);

  if (CheckMarcado ==false) {
    this.alertasService.Swal_alert('error','Por favor debe marcar un elemento de la Tabla');
    return false;
  }else{
    return true;
  }
}

abrirModalMapa(latitud:string, longitud :string){
  if (latitud.length ==0) {
    return;
  }

  const lat = Number(latitud);
  const lng = Number(longitud);
  const latLng = new google.maps.LatLng(lat, lng );

  $('#modalMapa').modal('show');
  
  //// limpiando el anterior marker
  this.marker.setMap(null);

  /// asignando el nuevo markeral mapa
  this.marker = new google.maps.Marker({
    position: latLng
  });
  this.marker.setMap(this.map);

  $("#location-map").css("width", "100%");
  $("#id_mapa").css("width", "100%");

  google.maps.event.trigger(this.map, "resize");
  this.map.setCenter(latLng);
}

cerrarModal_OT(){
  setTimeout(()=>{ // 
    $('#modal_OT').modal('hide');  
  },0); 
}

abrirModal_OT( {id_OT,nroObra,FechaAsignacion,direccion, id_Distrito, referencia, descripcion_OT, id_tipoTrabajo,id_estado  }){ 

  // //----- Datos Generales  -----  
  this.id_OTGlobal = id_OT;
  this.id_tipoOTGlobal = id_tipoTrabajo;
  this.nroObraParteDiario_Global = nroObra;
  this.fechaHora_Global = FechaAsignacion;
  this.id_estadoOTGlobal = id_estado;

  this.totalGlobal =0;
  this.totalGlobal14 =0;
  this.totalGlobal15 =0;

  this.tituloModal = 'Tipo Trabajo No-Definido'

  if (id_tipoTrabajo == 3 ||  id_tipoTrabajo == 4 ) {  // rotura
    
    this.tituloModal = 'REGISTRO DE ROTURA O REPARACION'
    this.flagMedidas =true;
    this.get_medidasOT();
    this.get_desmonteOT();

  }
  else if (id_tipoTrabajo == 5 ) {  // desmonte
    
    this.tituloModal = 'REGISTRO DE DESMONTE'
    this.flagMedidas =false;
    this.medidasDetalle = [];
    this.get_desmonteOT();

  }else{
    this.flagMedidas =false;
    this.medidasDetalle = [];
    this.desmonteDetalle = [];
  }
  
  
  this.formParamsDatosG.patchValue({"direccion": direccion , "idDistrito": id_Distrito, "referencia": referencia, "descripcionTrabajo": descripcion_OT , "idEstado": id_estado });
  this.selectedTabControlDetalle = this.tabControlDetalle[0];

  setTimeout(()=>{ // 
    $('#modal_OT').modal('show');
  },0);
}

  Aprobar_OT(){
   
    if ( this.id_OTGlobal == 0 || this.id_OTGlobal == null)  {
      this.alertasService.Swal_alert('error', 'No se cargo la informacion del ID de la Orden Trabajo, actualize su pagina.');
      return 
    }
  
    if ( this.formParamsDatosG.value.idEstado == 0 || this.formParamsDatosG.value.idEstado == null)  {
      this.alertasService.Swal_alert('error', 'Por favor seleccine un Estado, actualize su pagina.');
      return 
    }
   
  
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.aprobacionOTService.set_aprobarOT( this.id_OTGlobal, this.formParamsDatosG.value.idEstado  , this.idUserGlobal).subscribe((res:RespuestaServer)=>{  
      Swal.close();
      if (res.ok) {   
          this.alertasService.Swal_Success('OT aprobada correctamente');
          this.mostrarInformacion();
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }    
    })
  
  }
    
  get_medidasOT(){
    this.aprobacionOTService.get_medidasOT(this.id_OTGlobal, this.id_tipoOTGlobal, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
     if (res.ok) {            
       this.medidasDetalle = res.data; 
       
       let importeTotal =0;
       for (const iterator of  this.medidasDetalle) {
        importeTotal += iterator.total;
       }
       
       this.totalGlobal = importeTotal;
  
     }else{
       this.alertasService.Swal_alert('error', JSON.stringify(res.data));
       alert(JSON.stringify(res.data));
     }      
    })        
  }

  get_desmonteOT(){
    this.aprobacionOTService.get_mesmonteOT(this.id_OTGlobal, this.id_tipoOTGlobal, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
     if (res.ok) {            
       this.desmonteDetalle = res.data; 
       
       let importeTotal14 =0;
       let importeTotal15 =0;

       for (const iterator of  this.desmonteDetalle) {
         
          if (iterator.id_TipoMaterial == 14 ) {
            importeTotal14 += iterator.total;
          }
          if (iterator.id_TipoMaterial == 15 ) {
            importeTotal15 += iterator.total;
          }

       }
       
       this.totalGlobal14 = importeTotal14;
       this.totalGlobal15 = importeTotal15;

  
     }else{
       this.alertasService.Swal_alert('error', JSON.stringify(res.data));
       alert(JSON.stringify(res.data));
     }      
    })        
  }

  cerrarModal_visor(){
    $('#modal_visorFotos').modal('hide');    
  }
 
  abrirModal_visorFotos(objData:any){ 

    this.detalleOT = objData;
    this.id_FotoOTGlobal = objData.id_OTDet;

    setTimeout(()=>{ // 
      $('#modal_visorFotos').modal('show');
    },0);

    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Obteniendo Fotos, Espere por favor'
    })
    Swal.showLoading();
    this.aprobacionOTService.get_fotosOT(objData.id_OTDet, this.id_tipoOTGlobal, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
      Swal.close();
      if (res.ok) {           
        this.fotosDetalle = res.data;         
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }      
     })

  }
  
  anulandoFoto(objFoto:any){
    
  this.alertasService.Swal_Question('Sistemas', 'Esta seguro de anular ?')
  .then((result)=>{
    if(result.value){

      Swal.fire({
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        text: 'Anulando la foto, espere por favor'
      })
      Swal.showLoading();
      this.aprobacionOTService.set_anular_Fotos(objFoto.id_OTDet_Foto).subscribe((res:RespuestaServer)=>{
        Swal.close();

        if (res.ok) {   
          var index = this.fotosDetalle.indexOf( objFoto );
           this.fotosDetalle.splice( index, 1 );  

           if (this.fotosDetalle.length ==0) {
             this.cerrarModal_visor();
           }

        }else{
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }
      })
      
    }
  }) 
} 

 
descargarGrilla(){
  if (this.formParamsFiltro.value.idServicio == '' || this.formParamsFiltro.value.idServicio == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione el servicio');
    return 
  }
  
  if (this.formParamsFiltro.value.idTipoOT == '' || this.formParamsFiltro.value.idTipoOT == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione el Tipo de Orden Trabajo');
    return 
  }  

  if (this.formParamsFiltro.value.idProveedor == '' || this.formParamsFiltro.value.idProveedor == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione un Proveedor');
    return 
  }

  if (this.formParamsFiltro.value.fecha_ini == '' || this.formParamsFiltro.value.fecha_ini == null) {
    this.alertasService.Swal_alert('error','Por favor seleccione la fecha inicial');
    return 
  }
  if (this.formParamsFiltro.value.fecha_fin == '' || this.formParamsFiltro.value.fecha_fin == null) {
    this.alertasService.Swal_alert('error','Por favor seleccione la fecha final');
    return 
  }

  if (this.formParamsFiltro.value.idEstado == '' || this.formParamsFiltro.value.idEstado == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione un Estado');
    return 
  }

  const fechaIni = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_ini);
  const fechaFin = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_fin);

  this.spinner.show();
  this.detalleOTService.get_descargarDetalleOt(this.formParamsFiltro.value,fechaIni, fechaFin, this.idUserGlobal)
      .subscribe((res:RespuestaServer)=>{            
        this.spinner.hide();
 
        if (res.ok==true) {        
          window.open(String(res.data),'_blank');
        }else{
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }
  })



}  

descargarFotosOT(pantalla:string){

  if (pantalla='P') {
    if (this.medidasDetalle.length ==0) {
      return;
    }    
  }

  Swal.fire({
    icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Obteniendo Fotos, Espere por favor'
  })
  Swal.showLoading();  
  this.aprobacionOTService.get_descargarFotosOT_todos( this.id_OTGlobal, this.id_tipoOTGlobal, this.idUserGlobal ).subscribe( (res:any)=>{           
    Swal.close();

    if (res.ok ==true) {   
     window.open(String(res.data),'_blank');
    }else{
      this.alertasService.Swal_alert('error', JSON.stringify(res.data));
      alert(JSON.stringify(res.data));
    }
    
  })

}

descargarFotosOT_visor(pantalla:string){
 
  if (this.fotosDetalle.length ==0) {
    return;
  }    
  Swal.fire({
    icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Obteniendo Fotos, Espere por favor'
  })
  Swal.showLoading();  
  this.aprobacionOTService.get_descargarFotosOT_visor( this.id_FotoOTGlobal , this.id_tipoOTGlobal, this.idUserGlobal ).subscribe( (res:any)=>{           
    Swal.close();

    if (res.ok ==true) {   
     window.open(String(res.data),'_blank');
    }else{
      this.alertasService.Swal_alert('error', JSON.stringify(res.data));
      alert(JSON.stringify(res.data));
    }
    
  })

}

getColorEstado(estado:number){ 
  switch (estado) {
    case 6:
      return 'white';
    case 66:
      return '#ff00009e';
    case 7:
      return '#55d272';
    case 4:
        return 'yellow';
  } 
}


  
 

}
