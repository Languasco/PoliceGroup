
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
import { WebsocketService } from '../../../services/sockets/websocket.service';
import { AprobacionOTService } from '../../../services/Procesos/aprobacion-ot.service';

declare var $:any;
@Component({
  selector: 'app-orden-trabajo',
  templateUrl: './orden-trabajo.component.html',
  styleUrls: ['./orden-trabajo.component.css']
})
 
export class OrdenTrabajoComponent implements OnInit  {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsMapa: FormGroup;
  formParamsDatosG: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false

  servicios :any[]=[];   
  distritos :any[]=[];
  proveedor :any[]=[];   
  estados :any[]=[];   
  tipoOrdenTrabajo :any[]=[];
  jefeCuadrillaEmpresa :any[]=[];
 
  ordenTrabajoCab :any[]=[]; 
  ordenTrabajoAsignacion :any[]=[]; 
  filtrarMantenimiento = "";
  opcionModal = "";
  tituloModal = "";

  tabControlDetalle: string[] = ['LISTA DE ORDENES','PUNTOS EN EL MAPA' ]; 
  selectedTabControlDetalle :any;

  checkeadoAll=false; 
  datepiekerConfig:Partial<BsDatepickerConfig>;
  totalGlobal =0;

  totalM3_empresa =0;
  totalM3_asignado =0;
  totalM3_pendiente =0;

  reporteResumen:any[]=[]; 
  flagMapa=false;

   /// configuracion google maps
   @ViewChild('mapa', {static: false}) mapaElement: ElementRef;
   map : google.maps.Map;
   marker :google.maps.Marker;

   markers :google.maps.Marker[] = [];
   infowindows :google.maps.InfoWindow[] = [];

   showRectangle = false;
   colorRectangle = "#34495e";
   showPolyLine = false;
   colorPolyLine = 'rgb(255, 0, 0)';

   rectangle : google.maps.Rectangle;
   poly : google.maps.Polyline;
   polys :google.maps.Polyline[] = [];

   area1 = 0;
   area2 = 0;
   stopFunction = false;

   iconPorAsignar = './assets/img/mapa/sum_asignado.png';
   iconPendiente = './assets/img/mapa/sum_pendiente.png';

   registrosMapaOT :any[]=[];
   detalleRegistrosMapaOT :any[]=[];


   flagMedidas =  true;
   id_OTGlobal = 0;
   id_tipoOTGlobal = 0;
   id_estadoOTGlobal = 0;
   id_FotoOTGlobal = 0;
 
   nroObraParteDiario_Global = '';
   fechaHora_Global = '';
 
   totalGlobal14 =0;
   totalGlobal15 =0;

   medidasDetalle :any[]=[]; 
   desmonteDetalle :any[]=[]; 
   fotosDetalle :any[]=[]; 
   detalleOT:any = {};

     //-TAB control
  tabControlDetalle2: string[] = ['DATOS GENERALES','MEDIDAS','DESMONTE',]; 
  selectedTabControlDetalle2 :any;
   
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private listaPreciosService : ListaPreciosService, private ordenTrabajoService : OrdenTrabajoService, private funcionGlobalServices : FuncionesglobalesService, private websocketService : WebsocketService, private aprobacionOTService : AprobacionOTService   ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
  this.selectedTabControlDetalle = this.tabControlDetalle[0];
  this.selectedTabControlDetalle2 = this.tabControlDetalle2[0];
   this.getCargarCombos();
   this.inicializarFormularioFiltro();
   this.inicializarFormulario_Asignacion();
   this.inicializarFormularioMapa();  
   this.inicializarFormularioDatosG() 
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




 InicializarMapa() {
    this.map = new google.maps.Map(this.mapaElement.nativeElement, {
        zoom: 12,
        center: { lat: -11.991943, lng: -77.005195 },
        mapTypeControl: true,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER 
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER 
        }
    });
 

    this.markers = [];
    this.polys = [];
    this.limpiarDibujo();
 

    //### Add a button on Google Maps ...
    let  controlMarkerUI = document.createElement('DIV');
    controlMarkerUI.style.cursor = 'pointer';
    controlMarkerUI.style.backgroundImage = "url(./assets/img/mapa/seleccionar2.png)";
    controlMarkerUI.style.height = '33px';
    controlMarkerUI.style.width = '30px';
    controlMarkerUI.style.top = '10px !important';
    controlMarkerUI.style.left = '120px';
    controlMarkerUI.title = 'Marcar en el mapa';
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlMarkerUI);

    let controlSaveUI = document.createElement('DIV');
    controlSaveUI.style.cursor = 'pointer';
    controlSaveUI.style.backgroundImage = "url(./assets/img/mapa/guardar2.png)";
    controlSaveUI.style.height = '33px';
    controlSaveUI.style.width = '30px';
    controlSaveUI.style.top = '10px !important';
    controlSaveUI.style.left = '120px';
    controlSaveUI.title = 'Asignar / Reasignar';
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlSaveUI);

    //### Add a button on Google Maps ...
    let controlTrashUI = document.createElement('DIV');
    controlTrashUI.style.cursor = 'pointer';
    controlTrashUI.style.backgroundImage = "url(./assets/img/mapa/quitar2.png";
    controlTrashUI.style.height = '33px';
    controlTrashUI.style.width = '30px';
    controlTrashUI.style.top = '20px';
    controlTrashUI.style.left = '120px';
    controlTrashUI.title = 'Quitar marcado';

    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlTrashUI);
    
    if (!document.getElementById("legend")) {
        document.getElementById("content_leyenda").innerHTML = "<div id='legend'></div>";
        const icons = {
            Marcado: {
                name: 'Seleccionado',
                icon: './assets/img/mapa/sum_asignado.png'
            },
            Pendiente: {
                name: 'Pendiente',
                icon: this.iconPendiente
            },
            // Trabajado: {
            //     name: 'Asignado',
            //     icon: './assets/img/mapa/sum_realizados.png'
            // },
            // Operarario: {
            //     name: 'Operario',
            //     icon: './assets/img/mapa/operario.png'
            // }

        };

        const  legend = document.getElementById('legend');

        for (var key in icons) {
            var type = icons[key];
            var name = type.name;
            var icon = type.icon;
            var div = document.createElement('div');
            div.setAttribute("style", "color:red;text-decoration: line-through;");

            if (name == 'Seleccionado') {
                div.innerHTML = '<img src="' + icon + '" style="margin-top: -16px;padding: 10px;"> ' + name;
            }
            else if (name == 'Pendiente') {
                div.innerHTML = '<img src="' + icon + '" style="margin-top: -16px;padding: 10px;"> ' + name;
            }
            else if (name == 'Asignado') {
                div.innerHTML = '<img src="' + icon + '" style="margin-top: -12px;padding: 10px;"> ' + name;
            }
            else if (name == 'Operario') {
                div.innerHTML = '<img src="' + icon + '" style="margin-top: -28px;padding: 10px;"> ' + name;
            }
            else {
                div.innerHTML = '<img src="' + icon + '"> ' + name;
            }
            legend.appendChild(div);
        }

        this.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(legend);
    }   
                                                                 
    controlMarkerUI.addEventListener('click', ()=> {
        this.activarDibujo(1);
    });

    controlSaveUI.addEventListener('click', ()=> {
       this.OpenModal_asignacion();
    });

    controlTrashUI.addEventListener('click', ()=> {
        this.limpiarDibujo();                
    });
 };

 activarDibujo(value:any) {

 if (this.poly != null) {
    this.poly.setMap(null);
    this.polys.forEach(poly=>poly.setMap(null));
  };
  if (value == 1) {
      this.disable();
      if (this.poly != null) {
        this.poly.setMap(null);
        // this.polys.forEach(poly=>poly.setMap(null));
      };

      google.maps.event.addDomListener(this.map.getDiv(), 'mousedown', (e)=> {
          this.drawFreeHand()
      });

      this.showRectangle = false;
      this.showPolyLine = true;
      this.colorRectangle = "#34495e";
      this.colorPolyLine = "'rgb(255, 0, 0)'";
  }
 }

 drawFreeHand() {
  //the polygon
  this.poly = new google.maps.Polyline({ map: this.map, clickable: false });
  //move-listener
  const move = google.maps.event.addListener(this.map, 'mousemove', (e)=> {
       this.poly.getPath().push(e.latLng);
  });
  //mouseup-listener
  google.maps.event.addListenerOnce( this.map, 'mouseup', (e)=> {
      google.maps.event.removeListener(move);
      let paths = this.poly.getPath();

      this.poly.setMap(null);
      // this.polys.forEach(poly=>poly.setMap(null));
      //this.limpiarDibujo();      
 
      const poly = new google.maps.Polygon({
          map: this.map,
          paths: paths,
          strokeColor: 'rgb(255, 0, 0)',
          fillColor: 'rgb(0, 255, 255)',
          strokeWeight: 4,
      });

      this.polys.push(poly);

      google.maps.event.clearListeners(this.map.getDiv(), 'mousedown');
      this.enable();

      this.changeIconColorPolyLine(poly);

  });
 }

 enable() {
  this.map.setOptions({
      draggable: true,
      zoomControl: true,
      scrollwheel: true,
      disableDoubleClickZoom: true
  });
 }

 disable(){
  this.map.setOptions({
      draggable: false,
      zoomControl: false,
      scrollwheel: false,
      disableDoubleClickZoom: false
  });
 }

 changeIconColorPolyLine(polys:google.maps.Polygon) {
 
  for (var i = 0; i < this.markers.length; i++) { 
      const cordLatLong = this.markers[i].getPosition();

      if (google.maps.geometry.poly.containsLocation(cordLatLong, polys)) {
          const estado:any = this.markers[i].getTitle().split('|')[2];
          if (estado == 8 || estado == 9) {
              this.markers[i].setIcon(this.iconPorAsignar);
          }
      }  
  }

  // var total_a = verMarcadosCount(); 
  // setTimeout(function () {
  //     document.getElementById('total_marcado').innerHTML ='Total marcado :' +  total_a;
  // }, 100);
 }

 limpiarDibujo() {
  if (this.poly != null) {    
      this.poly.setMap(null);
      this.polys.forEach(poly=>poly.setMap(null));
  };
  this.limpiarMarkers();
 }

 limpiarMarkers = function () {
  this.limpiarTodo();

  this.showRectangle = false;
  this.colorRectangle = 'rgb(255, 0, 0)';
  this.showPolyLine = false;
  this.colorPolyLine = 'rgb(255, 0, 0)';

  // setTimeout(function () {
  //     document.getElementById('total_marcado').innerHTML = 'Total marcado : 0';
  // }, 100);
 }                              

 limpiarTodo() {
  this.markers.forEach((marker, index)=> {
      const iconBD:any = marker.getTitle().split('|')[1];
      const estado:any = marker.getTitle().split('|')[2];
      if (estado == 8 ) { ///--- pre-asignado
          marker.setIcon(this.iconPendiente);
      }
      else if (estado == 9) { //---- asignado
          marker.setIcon(iconBD);
      }
  });

  // setTimeout(function () {            
  //     document.getElementById('total_registros').innerHTML = 'Total registro : 0';
  //     document.getElementById('total_marcado').innerHTML = 'Total marcado : 0';
  // }, 100);
 }

 OTMarcados_validacion(){
  var flag_marco = false;
  for (const marker of this.markers) {
    if (marker.getIcon() == this.iconPorAsignar) {
      flag_marco = true;
      break;
    }
  }
  return flag_marco;
 }

 OpenModal_asignacion () {

    if (this.formParamsFiltro.value.idEstado == '' || this.formParamsFiltro.value.idEstado == 0) {
      this.alertasService.Swal_alert('error','Por favor seleccione el Estado de la pantalla Pricipal');
      return 
    } 

    if (this.registrosMapaOT.length == 0) {
      return;
    }
    
    if (this.OTMarcados_validacion() == false) {
      this.alertasService.Swal_alert('error','Por favor seleccione una OT que desea Asignar o Reasignar');
      return;
    }
    this.formParamsMapa.patchValue({ "idEmpresa" : 0, "idCuadrilla" : 0 });
    setTimeout(() => {
        $('#modal_asignar').modal('show');
     }, 100);
 }

 oTMarcados() {
  let listOTs = [];
  for (var i = 0; i < this.markers.length; i++) {
      if ( this.markers[i].getIcon() == this.iconPorAsignar) {
          const idOT = this.markers[i].getTitle().split('|')[0];
          listOTs.push(idOT);
      }
  }
  return listOTs;
}

 actualizarOT(){
 
  if (this.formParamsMapa.value.idEmpresa == '' || this.formParamsMapa.value.idEmpresa == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione la Empresa');
    return 
  }
    
  if (this.formParamsMapa.value.idCuadrilla == '' || this.formParamsMapa.value.idCuadrilla == 0) {
      this.alertasService.Swal_alert('error','Por favor seleccione la Cuadrilla');
      return     
  }

  if (this.formParamsFiltro.value.idEstado == '' || this.formParamsFiltro.value.idEstado == 0) {
      this.alertasService.Swal_alert('error','Por favor seleccione el Estado de la pantalla Pricipal');
      return 
  } 

  const listOT = this.oTMarcados();

  if (listOT.length == 0) {
    this.alertasService.Swal_alert('error','No ha seleccionado ninguna Ot, vuelva a intentar ');
    return;
  }
  
  this.formParamsMapa.patchValue({ "idEstado" : this.formParamsFiltro.value.idEstado });

  this.spinner.show();
  this.ordenTrabajoService.save_MapaOrdenTrabajoCab_general( listOT.join(), this.formParamsMapa.value, this.idUserGlobal)
      .subscribe((res:RespuestaServer)=>{            
          this.spinner.hide();
          if (res.ok==true) {   
            this.alertasService.Swal_Success("Proceso realizado correctamente..")
            this.cerrarModal_asignacion();
            this.InicializarMapa(); 
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
  })

 }

 cerrarModal_asignacion(){
  $('#modal_asignar').modal('hide');    
 }

 selectTab(nameTab:any){   
  this.selectedTabControlDetalle = nameTab;
  if( nameTab == 'PUNTOS EN EL MAPA') { 
    setTimeout(() => {
      this.InicializarMapa(); 
    }, 0);  
  }
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idServicio : new FormControl('0'),
      idTipoOT : new FormControl('0'),
      idDistrito : new FormControl('0'),
      idProveedor : new FormControl('0'),
      idEstado : new FormControl('0')
     }) 
 }

 inicializarFormulario_Asignacion(){ 
 
    this.formParams = new FormGroup({
      fechaAsignacion: new FormControl(new Date()),
      empresa1: new FormControl('0'),
      jefeCuadrilla1: new FormControl('0'),
      empresa2: new FormControl('0'),
      jefeCuadrilla2: new FormControl('0'),
      observaciones: new FormControl(''),
    }) 
 } 

 inicializarFormularioMapa(){ 
  this.formParamsMapa= new FormGroup({
    idEmpresa : new FormControl('0'),
    idCuadrilla : new FormControl('0'),
    idEstado : new FormControl('0')
   }) 
}

 getCargarCombos(){ 
    this.spinner.show();
    combineLatest([this.ordenTrabajoService.get_servicio(this.idUserGlobal), this.listaPreciosService.get_tipoOrdenTrabajo(), this.ordenTrabajoService.get_Distritos(), this.ordenTrabajoService.get_Proveedor(), this.ordenTrabajoService.get_estados() ]).subscribe( ([ _servicios, _tipoOrdenTrabajo, _distritos, _proveedor,_estados ])=>{
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

 generarMarkets(data:any){

  let icono= '';
  let titulo = '';

  // -----Limpiando --
  this.markers.forEach(mark=>mark.setMap(null));
  this.markers = [];

  this.polys.forEach(poly=>poly.setMap(null));
  this.polys = [];   


  const lat = Number(data[0].latitud);
  const lng = Number(data[0].longitud);
  const latLng = new google.maps.LatLng(lat, lng);
  // Enfocando el mapa
  this.map.setCenter(latLng);


  data.forEach((item)=> {

      let ContenidoMarker = '';
          ContenidoMarker += '<div  id="_market" style="width:400px;height:120px;position:relative;">';
          ContenidoMarker += '<table><tr><td><strong > Nro. OT/TD </strong></td><td style="width:100%">: ' + item.nroOT + '</td></tr>';
          ContenidoMarker += '<tr><td><div style="width: 110px;">Empresa</div></td><td style="width:100%">: ' + item.empresa + ' </td></tr>';
          ContenidoMarker += '<tr><td>Jefe Cuadrilla</td><td style="width:100%">: ' + item.jefeCuadrilla + ' </td></tr>';
          ContenidoMarker += '<tr><td><strong>Fecha Asignacion</strong></td><td style="width:100%">: ' + item.fechaAsignacion + ' </td></tr>';
          ContenidoMarker += '<tr><td> </td><td style="width:100%"  > <button  id="btn' + item.id_OT + '" class="btn btn-block btn-outline-primary btn-sm ">Ver Informe</button> </td></tr></table>';
 
      if (item.estado == 8 ) {
        icono = './assets/img/mapa/sum_pendiente.png';
        titulo = String(item.id_OT) + '|' + String('./assets/img/mapa/sum_pendiente.png') + '|' + String(item.estado);
      }
      else if (item.estado == 9) {
        icono = item.rutaIcono;
        titulo = String(item.id_OT) + '|' + String(item.rutaIcono) + '|' + String(item.estado);
      }

      const marker = new google.maps.Marker({
        map: this.map,
        position: new google.maps.LatLng(Number(item.latitud), Number(item.longitud)),
        title: titulo,
        icon: icono
    });

    this.markers.push(marker);

    const infowindow = new google.maps.InfoWindow({
        content: ContenidoMarker
    });

    this.infowindows.push(infowindow);

    google.maps.event.addDomListener(marker, 'click', () => {
        //-----borrando los infowindows
        this.infowindows.forEach(infoW => infoW.close());
        infowindow.setContent('<center><h4><b> UBICACIÓN OT </b></h4></center>' + ContenidoMarker);
        infowindow.open(this.map, marker);
    })      
    
    google.maps.event.addListener(infowindow, 'domready',   ()=> { 
      if (document.getElementById('btn' + item.id_OT)) { 
          google.maps.event.addDomListener(document.getElementById('btn' + item.id_OT), 'click', ()=> {  

          this.abrirModal_OT({id_OT : item.id_OT,nroObra: item.nroOT ,fechaHora : item.fechaHora ,direccion: item.direccion , id_Distrito: item.id_Distrito , referencia : item.id_Distrito, descripcion_OT : item.descripcion_OT, id_tipoTrabajo : item.id_tipoTrabajo ,id_estado: item.estado })
       
          });
          return
      } else {
          return
      }
  })
      

  })   
 }

 mostrarInformacion(){
    if (this.formParamsFiltro.value.idServicio == '' || this.formParamsFiltro.value.idServicio == 0) {
      this.alertasService.Swal_alert('error','Por favor seleccione el servicio');
      return 
    }
    
    if (this.formParamsFiltro.value.idTipoOT == '' || this.formParamsFiltro.value.idTipoOT == 0) {
      this.alertasService.Swal_alert('error','Por favor seleccione el Tipo de Orden Trabajo');
      return 
    }  

    // if (this.formParamsFiltro.value.idDistrito == '' || this.formParamsFiltro.value.idDistrito == 0) {
    //   this.alertasService.Swal_alert('error','Por favor seleccione un Distrito');
    //   return 
    // }

    // if (this.formParamsFiltro.value.idProveedor == '' || this.formParamsFiltro.value.idProveedor == 0) {
    //   this.alertasService.Swal_alert('error','Por favor seleccione un Proveedor');
    //   return 
    // }

    if (this.formParamsFiltro.value.idEstado == '' || this.formParamsFiltro.value.idEstado == 0) {
      this.alertasService.Swal_alert('error','Por favor seleccione un Estado');
      return 
    } 

    this.checkeadoAll=false; 

    if ( this.selectedTabControlDetalle  == 'PUNTOS EN EL MAPA') {

      this.spinner.show();
      this.ordenTrabajoService.get_MapaOrdenTrabajoCab_general(this.formParamsFiltro.value, this.idUserGlobal)
          .subscribe((res:RespuestaServer)=>{            
              this.spinner.hide();
              if (res.ok==true) {        
                  this.registrosMapaOT = res.data; 

                  if ( this.registrosMapaOT.length > 0) {                
                    this.generarMarkets(this.registrosMapaOT)
                  }

              }else{
                this.alertasService.Swal_alert('error', JSON.stringify(res.data));
                alert(JSON.stringify(res.data));
              }
      })
      
    }else{
      this.spinner.show();
      this.ordenTrabajoService.get_mostrarOrdenTrabajoCab_general(this.formParamsFiltro.value, this.idUserGlobal)
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


 }  

 expandirComprimir(tipo:number){
   if (tipo == 1) {
    setTimeout(()=>{ //
      $('#formMapa').removeClass('col-md-2 col-md-6').addClass('col-md-10');
      $('#formDetalle').removeClass('col-md-6 col-md-10').addClass('col-md-2');
    },0);
   }
   if (tipo == 3) {
    $( "#formMapa" ).removeClass( "col-md-2 col-md-10" ).addClass( "col-md-6" );
    $( "#formDetalle" ).removeClass( "col-md-2 col-md-10" ).addClass( "col-md-6" );
   }
   if (tipo == 2) {

    setTimeout(()=>{ //
      $('#formMapa').removeClass('col-md-6 col-md-10').addClass('col-md-2');
      $('#formDetalle').removeClass('col-md-2 col-md-6').addClass('col-md-10');
    },0);

  }
 }
 
 mostrarDetalleMapaOT(){
      if (this.formParamsFiltro.value.idServicio == '' || this.formParamsFiltro.value.idServicio == 0) {
      this.alertasService.Swal_alert('error','Por favor seleccione el servicio');
      return 
    }
    
    if (this.formParamsFiltro.value.idTipoOT == '' || this.formParamsFiltro.value.idTipoOT == 0) {
      this.alertasService.Swal_alert('error','Por favor seleccione el Tipo de Orden Trabajo');
      return 
    }  

    // if (this.formParamsFiltro.value.idDistrito == '' || this.formParamsFiltro.value.idDistrito == 0) {
    //   this.alertasService.Swal_alert('error','Por favor seleccione un Distrito');
    //   return 
    // }

    // if (this.formParamsFiltro.value.idProveedor == '' || this.formParamsFiltro.value.idProveedor == 0) {
    //   this.alertasService.Swal_alert('error','Por favor seleccione un Proveedor');
    //   return 
    // }

    if (this.formParamsFiltro.value.idEstado == '' || this.formParamsFiltro.value.idEstado == 0) {
      this.alertasService.Swal_alert('error','Por favor seleccione un Estado');
      return 
    }
 
    this.spinner.show();
    this.ordenTrabajoService.get_detalleMapaOrdenTrabajoCab(this.formParamsFiltro.value, this.idUserGlobal)
        .subscribe((res:RespuestaServer)=>{            
            this.spinner.hide();
            if (res.ok==true) {        
               this.detalleRegistrosMapaOT = res.data;
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })

 }
  
 cerrarModal(){
    setTimeout(()=>{ // 
      $('#modal_OT').modal('hide');  
    },0); 
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

 obtnerCheckMarcado_opcion(opcionModal){
  
    let listRegistros =[]; 
    // listRegistros = this.ordenTrabajoCab.filter(ot => ot.checkeado &&  ( ot.id_Estado ==4 || ot.id_Estado == 6 || ot.id_Estado ==7 || ot.id_Estado ==23 ) ).map((obj)=>{
    listRegistros = this.ordenTrabajoCab.filter(ot => ot.checkeado).map((obj)=>{
      return {  id_OT : obj.id_OT, tipoOT : obj.tipoOT, nroObra: obj.nroObra, direccion : obj.direccion, distrito : obj.distrito  , empresaContratista : obj.empresaContratista, jefeCuadrilla : obj.jefeCuadrilla  , volumen : obj.volumen } ;
    });
  
  
    return listRegistros;
 }
   
   abrir_modalOT(opcionModal :string){
  
    if (this.validacionCheckMarcado()==false){
      return;
    } 
  
    this.opcionModal = opcionModal;
  
    if (opcionModal == 'Asignar') {    
        this.tituloModal = "ASIGNACION DE ORDENES DE TRABAJO";
    }else{    
        this.tituloModal = "REASIGNACION DE ORDENES DE TRABAJO";
    }
  
    this.ordenTrabajoAsignacion = [];
    this.ordenTrabajoAsignacion = this.obtnerCheckMarcado_opcion( this.opcionModal); 
  
    // if ( this.ordenTrabajoAsignacion.length ==0 ) {
    //   this.alertasService.Swal_alert('error','Por favor verifique o complete el proceso');
    //   return;
    // }    
      setTimeout(()=>{ // 
        $('#modal_OT').modal('show');
      },0); 
  
      this.inicializarFormulario_Asignacion();
      this.CalculototalGlobal();
   }

  verificarProveedor(idProveedor:number){
    let flagProveedor=0;
    for (const prove of this.proveedor) {
      if (prove.id_Empresa == idProveedor) {
         flagProveedor = (!prove.esProveedor) ? 0 : prove.esProveedor;
         break;
      }
    }
    return flagProveedor;
  }
  
  guardar_AsignacionReasignacion_Ot(){
    if (this.ordenTrabajoAsignacion.length <=0) {
      this.alertasService.Swal_alert('error', 'No hay datos para almacenar.');
      return;
    }
  
    if (this.formParams.value.fechaAsignacion == '' || this.formParams.value.proyectista == 0 || this.formParams.value.fechaAsignacion == null)  {
      this.alertasService.Swal_alert('error', 'Por favor seleccione la fecha de asignacion.');
      return;
    } 
  
    if (this.opcionModal == 'Asignar') { // 
      if (this.formParams.value.empresa1 == '' || this.formParams.value.empresa1 == 0 || this.formParams.value.empresa1 == null)  {
        this.alertasService.Swal_alert('error', 'Por favor seleccione la empresa.');
        return;
      }
      if( this.verificarProveedor(this.formParams.value.empresa1) ==0 ){
        if (this.formParams.value.jefeCuadrilla1 == '' || this.formParams.value.jefeCuadrilla1 == 0 || this.formParams.value.jefeCuadrilla1 == null)  {
          this.alertasService.Swal_alert('error', 'Por favor seleccione el jefe de cuadrilla.');
          return;
        } 
      }
    } 
    if (this.opcionModal == 'Reasignar') { // 
      if (this.formParams.value.empresa2 == '' || this.formParams.value.empresa2 == 0 || this.formParams.value.empresa2 == null)  {
        this.alertasService.Swal_alert('error', 'Por favor seleccione la empresa.');
        return;
      }      
      if( this.verificarProveedor(this.formParams.value.empresa2) ==0 ){
        if (this.formParams.value.jefeCuadrilla2 == '' || this.formParams.value.jefeCuadrilla2 == 0 || this.formParams.value.jefeCuadrilla2 == null)  {
          this.alertasService.Swal_alert('error', 'Por favor seleccione el jefe de cuadrilla.');
          return;
        }
      }
    } 
  
    const codigosIdOT = this.funcionGlobalServices.obtenerTodos_IdPrincipal(this.ordenTrabajoAsignacion,'id_OT'); 
    const fechaFormato = this.funcionGlobalServices.formatoFecha(this.formParams.value.fechaAsignacion); 
  
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
    this.ordenTrabajoService.save_asignacionReasignacion_Ot(codigosIdOT.join() ,this.opcionModal, this.formParams.value, fechaFormato, this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
      Swal.close();
      if (res.ok) { 
         this.alertasService.Swal_Success("Proceso realizado correctamente..")
           //-----listando la informacion  
         this.mostrarInformacion();
  
          ////-- notificaciones Socket para el movil----        
          // if (this.opcionModal == 'P') { // proyectista
          //     // const dataOt = {
          //     //   id_usuario : this.idUserGlobal,
          //     //   id_proyectista : this.formParams.value.proyectista,
          //     //   array_id_ots : codigos,
          //     //   cadena_id_ots : codigos.join(),
          //     //   cant_ots : codigos.length
          //     // }   
              
          //     const dataOt = {
          //       cant_ot : codigos.length,
          //       mensaje : `Usted tiene  ${codigos.length} ot, asignada`,
          //       id_personal : this.formParams.value.proyectista,
          //       tipo : 'Proyectista'
          //     }  
  
          //     this.websocketService.NotificacionOT_WebSocket(dataOt)
          //     .then( (res:any) =>{
          //       if (res.ok==true) {
          //         console.log(res.data);
          //       }else{
          //         this.alertasService.Swal_alert('Error Socket', JSON.stringify(res.data));
          //         alert(JSON.stringify(res.data));
          //       }
          //     }).catch((error)=>{
          //       this.alertasService.Swal_alert('Error Socket', JSON.stringify(error));
          //       alert(JSON.stringify(error));
          //     })           
          // }
        ////-- Fin de notificaciones Socket para el movil----
  
  
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }

  eliminarCheckMarcado(item:any){    
    var index = this.ordenTrabajoAsignacion.indexOf( item );
    this.ordenTrabajoAsignacion.splice( index, 1 );
    this.CalculototalGlobal();
  }

  CalculototalGlobal(){
    let totalG= 0;
    for (const valor of this.ordenTrabajoAsignacion) {
     totalG += Number(valor.volumen);
    }
  
    this.totalGlobal =  Number(totalG.toFixed(2))
  }

  changeCalculos_AsignacionReasignacion_Origen(opcion){
    this.calculo_AsignacionReasignacion_Ot(this.formParams.value.empresa1, this.formParams.value.jefeCuadrilla1 )  
  }
  
  changeCalculos_AsignacionReasignacion_Destino(opcion){
    this.calculo_AsignacionReasignacion_Ot(this.formParams.value.empresa2, this.formParams.value.jefeCuadrilla2 )  
  }
  
  calculo_AsignacionReasignacion_Ot(idEmpresa:number, idJefeCuadrilla:number){
    if (idEmpresa ==0 || idJefeCuadrilla == 0  ){
      this.totalM3_empresa =0;
      this.totalM3_asignado =0;
      this.totalM3_pendiente =0;
      return;
    }  
  
    this.spinner.show();
    this.ordenTrabajoService.get_calculos_asignarReasignar_Ot(idEmpresa, idJefeCuadrilla, this.opcionModal, this.idUserGlobal)
        .subscribe((res:RespuestaServer)=>{            
            this.spinner.hide();
 
            if (res.ok==true) {        
               if (res.data.length > 0) {
                this.totalM3_empresa =  res.data[0].totalM3_empresa;
                this.totalM3_asignado = res.data[0].totalM3_asignado;
                this.totalM3_pendiente = res.data[0].totalM3_pendiente;
               }else{
                this.totalM3_empresa =0;
                this.totalM3_asignado =0;
                this.totalM3_pendiente =0;
               }
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
  }
  
  cerrarModal_Resumen(){
    $('#modal_resumen').modal('hide');    
  }
  
  abrirModal_Resumen(){
  
        if (this.formParamsFiltro.value.idServicio == '' || this.formParamsFiltro.value.idServicio == 0) {
          this.alertasService.Swal_alert('error','Por favor seleccione el servicio');
          return 
        }
        
        if (this.formParamsFiltro.value.idTipoOT == '' || this.formParamsFiltro.value.idTipoOT == 0) {
          this.alertasService.Swal_alert('error','Por favor seleccione el Tipo de Orden Trabajo');
          return 
        }  
      
        if (this.formParamsFiltro.value.idEstado == '' || this.formParamsFiltro.value.idEstado == 0) {
          this.alertasService.Swal_alert('error','Por favor seleccione un Estado');
          return 
        }

    
        this.spinner.show();
        this.ordenTrabajoService.get_resumenOT_proveedor(this.formParamsFiltro.value, this.idUserGlobal)
            .subscribe((res:RespuestaServer)=>{            
                this.spinner.hide();
                if (res.ok==true) {        
                  this.reporteResumen = res.data;
                  setTimeout(() => {
                   $('#modal_resumen').modal('show');
                 }, 100);
                }else{
                  this.alertasService.Swal_alert('error', JSON.stringify(res.data));
                  alert(JSON.stringify(res.data));
                }
        })
  }

  cantidadAsignadaOT():any[]{
    const map = new Map();
    const listCheck = this.ordenTrabajoCab.filter((ot)=>ot.checkeado == true).map((detalleOT)=>{
      return {idJefeCuadrilla : detalleOT.idJefeCuadrilla, idEmpresa : detalleOT.idEmpresa }
    })

    let listSocket = [];
    let total =0;
 
   if (this.formParamsFiltro.value.idServicio == 1) { ///---obras se envia la cuadrilla

      const listCuadrilla = [];        
      for (const item of listCheck) {
          if(!map.has(item.idJefeCuadrilla)){
              map.set(item.idJefeCuadrilla, true);    
              listCuadrilla.push({ cuadrilla: item.idJefeCuadrilla });
          }
      } 

      total =0;
      for (const objCuadrilla of listCuadrilla) {          
        total =0;
        for (const datos of listCheck) {
          if (objCuadrilla.cuadrilla == datos.idJefeCuadrilla ) {
            total += 1; 
          }
        }
        listSocket.push({id:objCuadrilla.cuadrilla , cantidadOT :  total, tipo : 'cuadrilla', mensaje : `Usted tiene  ${total} ot, asignada`});
      }
 

   }else{ ///---  se envia la empresa contratista ---

      const listEmpresa = [];        
      for (const item of listCheck) {
          if(!map.has(item.idEmpresa)){
              map.set(item.idEmpresa, true);  
              listEmpresa.push({ empresa: item.idEmpresa });
          }
      }

      for (const objEmpresa of listEmpresa) {          
        total =0;
        for (const datos of listCheck) {
          if (objEmpresa.empresa == datos.idEmpresa ) {
            total += 1; 
          }
        }
        listSocket.push({id : objEmpresa.empresa , cantidadOT :  total , tipo : 'empresa', mensaje : `Usted tiene  ${total} ot, asignada`});        
      }
 
   }

   return listSocket;

  }

  cantidadAsignadaOT_new():any[]{
    const map = new Map();
    const listCheck = this.ordenTrabajoCab.filter((ot)=>ot.checkeado == true).map((detalleOT)=>{
      return {idJefeCuadrilla : detalleOT.idJefeCuadrilla, idEmpresa : detalleOT.idEmpresa }
    })

    let listSocket = [];
    let total =0;

    const listEmpresaCuadrilla = [];        
    for (const item of listCheck) {
        if(!map.has(item.idEmpresa +'-'+ item.idJefeCuadrilla )){
            map.set(item.idEmpresa +'-'+ item.idJefeCuadrilla, true);  
            listEmpresaCuadrilla.push({ empresaCuadrilla: item.idEmpresa +'-'+ item.idJefeCuadrilla , empresa: item.idEmpresa, cuadrilla : item.idJefeCuadrilla  });
        }
    }

    for (const objEmpresa of listEmpresaCuadrilla) {          
        total =0;
        for (const datos of listCheck) {
          if (datos.idEmpresa +'-'+ datos.idJefeCuadrilla  == objEmpresa.empresaCuadrilla ) {
            total += 1; 
          }
        }
        listSocket.push({idEmpresa : objEmpresa.empresa , 
                        idCuadrilla : objEmpresa.cuadrilla, 
                        cantidadOT :  total , 
                        idServicio : this.formParamsFiltro.value.idServicio , 
                        idTipoOT : this.formParamsFiltro.value.idTipoOT , 
                        mensaje : `Usted tiene  ${total} ot, asignada`});     
 
    }

   return listSocket;

  }

  
  enviarOT_jefeCuadrilla(){ 

    if (this.formParamsFiltro.value.idServicio == '' || this.formParamsFiltro.value.idServicio == 0) {
      this.alertasService.Swal_alert('error','Por favor seleccione el servicio');
      return 
    }

    if (this.validacionCheckMarcado()==false){
      return;
    } 
    const codigosIdOT = this.funcionGlobalServices.obtenerCheck_IdPrincipal(this.ordenTrabajoCab,'id_OT'); 

    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de enviar las OT al Jefe de Cuadrilla ?')
    .then((result)=>{
      if(result.value){

        Swal.fire({
          icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
        })
        Swal.showLoading();
        this.ordenTrabajoService.set_enviarOT_jefeCuadrilla(codigosIdOT.join() , this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
          Swal.close();
          if (res.ok) { 
             this.alertasService.Swal_Success("Proceso realizado correctamente..")
             
           ////-- notificaciones Socket para el movil----    
              const listOTSocket  = this.cantidadAsignadaOT_new();   

              console.log(listOTSocket);
  
              this.websocketService.NotificacionOT_WebSocket(listOTSocket)
              .then( (res:any) =>{
                if (res.ok==true) {
                  console.log(res.data);
                }else{
                  this.alertasService.Swal_alert('Error Socket', JSON.stringify(res.data));
                  alert(JSON.stringify(res.data));
                }
              }).catch((error)=>{
                this.alertasService.Swal_alert('Error Socket', JSON.stringify(error));
                alert(JSON.stringify(error));
              })                 
          ////-- Fin de notificaciones Socket para el movil----

               //-----listando la informacion  
             this.mostrarInformacion();  
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
        })
 
      }
    })

  }

  changeEmpresaJefeCuadrilla_origen(opcion){
      this.get_jefeCuadrillaEmpresa(this.formParams.value.empresa1)  
  }

  changeEmpresaJefeCuadrilla_destino(opcion){
    this.get_jefeCuadrillaEmpresa(this.formParams.value.empresa2) 
 }

 changeEmpresaJefeCuadrilla_mapa(opcion){
   this.get_jefeCuadrillaEmpresa(opcion.target.value)  
 }

   
 get_jefeCuadrillaEmpresa(idEmpresa:number ){
  if (idEmpresa ==0) {
    this.jefeCuadrillaEmpresa =[];
    return;
  }  
  this.spinner.show();
  this.ordenTrabajoService.get_jefeCuadrilla_empresa(idEmpresa, this.idUserGlobal)
      .subscribe((res:any)=>{   
          this.spinner.hide();     
          this.jefeCuadrillaEmpresa = res; 
  })
}

  // CONFIGURACION DE GOOGLE MAPS


  // FIN DE  CONFIGURACION DE GOOGLE MAPS
  cerrarModal_OT(){
    setTimeout(()=>{ // 
      $('#modal_VisorOT').modal('hide');  
    },0); 
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
   
  cerrarModal_visor(){
    $('#modal_visorFotos').modal('hide');    
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

  abrirModal_OT( {id_OT,nroObra,fechaHora,direccion, id_Distrito, referencia, descripcion_OT, id_tipoTrabajo,id_estado  }){ 

    // //----- Datos Generales  -----  
    this.id_OTGlobal = id_OT;
    this.id_tipoOTGlobal = id_tipoTrabajo;
    this.nroObraParteDiario_Global = nroObra;
    this.fechaHora_Global = fechaHora;
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
    this.selectedTabControlDetalle2 = this.tabControlDetalle2[0];
  
    setTimeout(()=>{ // 
      $('#modal_VisorOT').modal('show');
    },0);
  }
  
  asignacionAutomatica(){
    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de realizar la Asignacion Automatica ?')
    .then((result)=>{
      if(result.value){

        if (this.formParamsFiltro.value.idServicio == '' || this.formParamsFiltro.value.idServicio == 0) {
          this.alertasService.Swal_alert('error','Por favor seleccione el servicio');
          return 
        }
        
        if (this.formParamsFiltro.value.idTipoOT == '' || this.formParamsFiltro.value.idTipoOT == 0) {
          this.alertasService.Swal_alert('error','Por favor seleccione el Tipo de Orden Trabajo');
          return 
        }  
    
        // if (this.formParamsFiltro.value.idDistrito == '' || this.formParamsFiltro.value.idDistrito == 0) {
        //   this.alertasService.Swal_alert('error','Por favor seleccione un Distrito');
        //   return 
        // }
    
        // if (this.formParamsFiltro.value.idProveedor == '' || this.formParamsFiltro.value.idProveedor == 0) {
        //   this.alertasService.Swal_alert('error','Por favor seleccione un Proveedor');
        //   return 
        // }
    
        if (this.formParamsFiltro.value.idEstado == '' || this.formParamsFiltro.value.idEstado == 0) {
          this.alertasService.Swal_alert('error','Por favor seleccione un Estado');
          return 
        } 

        Swal.fire({
          icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
        })
        Swal.showLoading();
        this.ordenTrabajoService.set_asignacionAutomatica(this.formParamsFiltro.value, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
          Swal.close();
          console.log(res)
          if (res.ok) { 
             this.alertasService.Swal_Success("Proceso realizado correctamente..")
               //-----listando la informacion  
             this.mostrarInformacion();  
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

    // if (this.formParamsFiltro.value.idDistrito == '' || this.formParamsFiltro.value.idDistrito == 0) {
    //   this.alertasService.Swal_alert('error','Por favor seleccione un Distrito');
    //   return 
    // }

    // if (this.formParamsFiltro.value.idProveedor == '' || this.formParamsFiltro.value.idProveedor == 0) {
    //   this.alertasService.Swal_alert('error','Por favor seleccione un Proveedor');
    //   return 
    // }

    if (this.formParamsFiltro.value.idEstado == '' || this.formParamsFiltro.value.idEstado == 0) {
      this.alertasService.Swal_alert('error','Por favor seleccione un Estado');
      return 
    } 
  
    this.spinner.show();
    this.ordenTrabajoService.get_descargarOT_general(this.formParamsFiltro.value, this.idUserGlobal)
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
  

  abrirModalxx(){

  }




}

