
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
import { UbicacionPersonalService } from '../../../services/reportes/ubicacion-personal.service';

declare var $:any;

@Component({
  selector: 'app-ubicacion-ot',
  templateUrl: './ubicacion-ot.component.html',
  styleUrls: ['./ubicacion-ot.component.css']
})
 
export class UbicacionOtComponent implements OnInit,AfterViewInit {

  formParamsFiltro : FormGroup;
  idUserGlobal :number = 0;
  servicios :any[]=[]; 
  proveedor :any[]=[];    
  tipoOrdenTrabajo :any[]=[];  
  estados :any[]=[];   
 
  filtrarMantenimiento = "";
  datepiekerConfig:Partial<BsDatepickerConfig>;

   /// configuracion google maps
    @ViewChild('mapa', {static: false}) mapaElement: ElementRef;
    map : google.maps.Map;
    markers :google.maps.Marker[] = [];
    infowindows :google.maps.InfoWindow[] = [];
   
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private listaPreciosService : ListaPreciosService, private ordenTrabajoService : OrdenTrabajoService, private ubicacionPersonalService : UbicacionPersonalService , private funcionGlobalServices : FuncionesglobalesService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
  this.getCargarCombos();
  this.inicializarFormularioFiltro();
 }

 ngAfterViewInit() {
  this.InicializarMapas()
} 

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      fechaGps : new FormControl(new Date()),
      idServicio : new FormControl('0'),
      idTipoOT : new FormControl('0'), 
      idProveedor : new FormControl('0') ,
      idEstado : new FormControl('0')       
     }) 
 }

 getCargarCombos(){ 
    this.spinner.show();
    combineLatest([this.ordenTrabajoService.get_servicio(this.idUserGlobal), this.listaPreciosService.get_tipoOrdenTrabajo(), this.ordenTrabajoService.get_Proveedor(), this.listaPreciosService.get_estados()  ]).subscribe( ([ _servicios, _tipoOrdenTrabajo, _proveedor, _estados ])=>{
        this.servicios = _servicios;
        this.tipoOrdenTrabajo = _tipoOrdenTrabajo;  
        this.proveedor = _proveedor;  
        this.estados = _estados
        this.spinner.hide(); 
    },(error)=>{
      this.spinner.hide(); 
      alert(error);
    })

 }

 InicializarMapas() {

  const latLng = new google.maps.LatLng(-12.046374, -77.0427934 );
  const  mapaOption : google.maps.MapOptions = {
    center : latLng,
    zoom : 13,
    mapTypeControl: true,
  }
  this.map = new google.maps.Map(this.mapaElement.nativeElement, mapaOption);

  if (!document.getElementById("legend")) {
    document.getElementById("content_leyenda").innerHTML = "<div id='legend'></div>";
    const icons = {
        Pendiente: {
            name: 'Pendiente',
            icon: './assets/img/mapa/sum_pendiente.png'
        },
        Asignado: {
            name: 'Asignado',
            icon: './assets/img/mapa/sum_asignado.png'
        },
        Terminado: {
            name: 'Terminado',
            icon: './assets/img/mapa/sum_realizados.png'
        }
    };

    const  legend = document.getElementById('legend');

    for (var key in icons) {
        var type = icons[key];
        var name = type.name;
        var icon = type.icon;
        var div = document.createElement('div');
        div.setAttribute("style", "color:red;text-decoration: line-through;"); 

        if (name == 'Pendiente') {
            div.innerHTML = '<img src="' + icon + '" style="margin-top: -16px;padding: 10px;"> ' + name;
        }
        else if (name == 'Asignado') {
            div.innerHTML = '<img src="' + icon + '" style="margin-top: -16px;padding: 10px;"> ' + name;
        }
        else if (name == 'Terminado') {
            div.innerHTML = '<img src="' + icon + '" style="margin-top: -12px;padding: 10px;"> ' + name;
        }
         legend.appendChild(div);
    }

    this.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(legend);

 };
 
}

 mostrarInformacionMapa(){
      // if (this.formParamsFiltro.value.idServicio == '' || this.formParamsFiltro.value.idServicio == 0) {
      //   this.alertasService.Swal_alert('error','Por favor seleccione el servicio');
      //   return 
      // }
      // if (this.formParamsFiltro.value.fechaGps == '' || this.formParamsFiltro.value.fechaGps == null) {
      //   this.alertasService.Swal_alert('error','Por favor seleccione la fecha Gps');
      //   return 
      // }       
      // if (this.formParamsFiltro.value.idTipoOT == '' || this.formParamsFiltro.value.idTipoOT == 0) {
      //   this.alertasService.Swal_alert('error','Por favor seleccione el Tipo de Orden Trabajo');
      //   return 
      // } 
      // if (this.formParamsFiltro.value.idProveedor == '' || this.formParamsFiltro.value.idProveedor == 0) {
      //   this.alertasService.Swal_alert('error','Por favor seleccione un Proveedor');
      //   return 
      // }
 

      const fechaFormato = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fechaGps); 
      this.spinner.show();
      this.ubicacionPersonalService.get_mostrar_ubicacionesOT(this.formParamsFiltro.value,fechaFormato,  this.idUserGlobal)
          .subscribe((res:RespuestaServer)=>{            
              this.spinner.hide();
   
              if (res.ok==true) {     
                  if(res.data.length > 0){
                    this.MostrarUbicacionesMap( res.data);
                  }else{
                    this.alertasService.Swal_alert('info','No hay información para disponible para mostrar');
                    this.RemoveMarker(null);
                    this.markers = [];
                  }               
                }else{
                this.alertasService.Swal_alert('error', JSON.stringify(res.data));
                alert(JSON.stringify(res.data));
              }
      })
 }   

 MostrarUbicacionesMap(obj_Lista:any) {

  const lat = Number(obj_Lista[0].latitud);
  const lng = Number(obj_Lista[0].longitud);
  const latLng = new google.maps.LatLng(lat, lng);
  // Enfocando el mapa
  this.map.setCenter(latLng);

   this.markers.forEach((marker)=>marker.setMap(null));
   this.markers = [];
 
  for (const ubicaciones of obj_Lista) {
    this.createMarker(ubicaciones);
  }
 }

 createMarker({empresa, personal, nroOrden, direccion, fechaRegistro, diasVencimiento, latitud, longitud, idEstado}) {

  let icono = '';
  let titulo= '';
  let ContenidoMarker = '';
  ContenidoMarker += '<div style="width:550px;position:relative;">';
  ContenidoMarker += '<table><tr><td class="text-info">Empresa</td><td><b>  '+ empresa +'</b></td></tr>';
  ContenidoMarker += '<tr><td class="text-info"><strong>Personal</strong></td><td> ' + personal + '</td></tr>';
  ContenidoMarker += '<tr><td class="text-info"><strong>Nro Orden</strong></td><td>  ' + nroOrden + '</td></tr>';
  ContenidoMarker += '<tr><td class="text-info"><strong>Direccion</strong></td><td> ' + direccion + '</td></tr>';
  ContenidoMarker += '<tr><td class="text-info"><strong> Fecha Registro</strong></td><td> ' + fechaRegistro + '</td></tr>';
  ContenidoMarker += '<tr><td class="text-info"><strong>Dias Vencimiento</strong></td><td> ' + diasVencimiento + ' </td></tr> </table>'; 

  if (idEstado =='P') {
    icono = './assets/img/mapa/sum_pendiente.png';
    titulo = 'OT pendientes';
  }
  if (idEstado =='A') {
    icono = './assets/img/mapa/sum_asignado.png';
    titulo = 'OT Asignados';
  }
  if (idEstado =='T') {
    icono = './assets/img/mapa/sum_realizados.png';
    titulo = 'OT Terminados';
  }

  const marker = new google.maps.Marker({
        map: this.map,
        position: new google.maps.LatLng( Number(latitud), Number(longitud)),
        title: titulo,
        icon: icono
  }); 

  this.markers.push(marker); 

  const infowindow = new google.maps.InfoWindow({
    content: ContenidoMarker
  });

  this.infowindows.push(infowindow); 

  google.maps.event.addDomListener(marker,'click',()=>{
    //-----borrando los infowindows
    this.infowindows.forEach(infoW=>infoW.close());
    infowindow.setContent('<center><h4><b> UBICACIÓN OT </b></h4></center>' + ContenidoMarker);
    infowindow.open(this.map, marker);
  }) 
 
}
  
  RemoveMarker(map:any) {
    for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(map);
    }
  }

 
  
 
  
 

}