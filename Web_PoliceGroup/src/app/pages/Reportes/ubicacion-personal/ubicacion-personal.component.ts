
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
import { PersonalService } from '../../../services/Mantenimientos/personal.service';

declare var $:any;
@Component({
  selector: 'app-ubicacion-personal',
  templateUrl: './ubicacion-personal.component.html',
  styleUrls: ['./ubicacion-personal.component.css']
})
 
export class UbicacionPersonalComponent implements OnInit,AfterViewInit {

  formParamsFiltro : FormGroup;
  idUserGlobal :number = 0;
  servicios :any[]=[]; 
  proveedor :any[]=[];    
  tipoOrdenTrabajo :any[]=[];  
   
  eventosCelular :any[]=[];   

  filtrarMantenimiento = "";
  datepiekerConfig:Partial<BsDatepickerConfig>;

   /// configuracion google maps
    @ViewChild('mapa', {static: false}) mapaElement: ElementRef;
    map : google.maps.Map;
    markers :google.maps.Marker[] = [];
    infowindows :google.maps.InfoWindow[] = [];
    empresas :any[]=[];
   
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private listaPreciosService : ListaPreciosService, private ordenTrabajoService : OrdenTrabajoService, private ubicacionPersonalService : UbicacionPersonalService , private funcionGlobalServices : FuncionesglobalesService, private personalService :PersonalService  ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
  this.getCargarCombos();
  this.inicializarFormularioFiltro();
 }

 ngAfterViewInit() {
  this.InicializarMapa()
} 

  getCargarCombos(){ 
    this.spinner.show();
    combineLatest([ this.personalService.get_empresas(this.idUserGlobal)  ]).subscribe( ([ _empresas])=>{
      this.empresas = _empresas;
      this.spinner.hide(); 
    })
  
  }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idEmpresa  : new FormControl('0'),
      fechaGps : new FormControl(new Date())
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
 };

 mostrarInformacionMapa(){

      if (this.formParamsFiltro.value.idEmpresa == '' || this.formParamsFiltro.value.idEmpresa == 0) {
        this.alertasService.Swal_alert('error','Por favor la empresa');
        return 
      }
          
      if (this.formParamsFiltro.value.fechaGps == '' || this.formParamsFiltro.value.fechaGps == null) {
        this.alertasService.Swal_alert('error','Por favor seleccione la fecha Gps');
        return 
      }       

      const fechaFormato = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fechaGps); 
      this.spinner.show();
      this.ubicacionPersonalService.get_mostrar_ubicacionesPersonal(fechaFormato,  this.idUserGlobal, this.formParamsFiltro.value.idEmpresa)
          .subscribe((res:RespuestaServer)=>{            
              this.spinner.hide();   
              if (res.ok==true) {     
                  if(res.data.length > 0){
                    this.MostrarUbicacionesMap( res.data );
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
   this.RemoveMarker(null);
   this.markers = [];

   //----enfocando el mapa al primer registro +-----
   const latLng = new google.maps.LatLng(Number(obj_Lista[0].latitud), Number(obj_Lista[0].longitud) );
   google.maps.event.trigger(this.map, "resize");
   this.map.setCenter(latLng);
   //----Fin de enfocando el mapa al primer registro +-----
 
  for (const ubicaciones of obj_Lista) {
    this.createMarker(ubicaciones);
  }
 }

 createMarker({ latitud, longitud, efectivoPolicial, fechaHora }) {

  let ContenidoMarker = '';
  ContenidoMarker += '<div style="width:550px;position:relative;">';
  ContenidoMarker += '<table><tr><td class="text-info" >Nombre Efectivo :</td><td><b>  '+ efectivoPolicial +'</b></td></tr>';
  ContenidoMarker += '<tr><td class="text-info"><strong>Fecha Hora :</strong></td><td> ' + fechaHora + '</td></tr>';
  ContenidoMarker += '</table>'; 

  const marker = new google.maps.Marker({
        map: this.map,
        position: new google.maps.LatLng( Number(latitud), Number(longitud)),
        title: 'UBICACIÓN DE PERSONAL',
        icon: './assets/img/mapa/policia.png'
  }); 

  this.markers.push(marker); 

  const infowindow = new google.maps.InfoWindow({
    content: ContenidoMarker
  });

  this.infowindows.push(infowindow); 

  google.maps.event.addDomListener(marker,'click',()=>{
    //-----borrando los infowindows
    this.infowindows.forEach(infoW=>infoW.close());
    infowindow.setContent('<center><h4><b> UBICACIÓN PERSONAL </b></h4></center>' + ContenidoMarker);
    infowindow.open(this.map, marker);
  }) 
 
}
  
  RemoveMarker(map:any) {
    for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(map);
    }
  }

 
   mostrarEventos(){
      if (this.formParamsFiltro.value.idServicio == '' || this.formParamsFiltro.value.idServicio == 0) {
        this.alertasService.Swal_alert('error','Por favor seleccione el servicio');
        return 
      }
      if (this.formParamsFiltro.value.fechaGps == '' || this.formParamsFiltro.value.fechaGps == null) {
        this.alertasService.Swal_alert('error','Por favor seleccione la fecha Gps');
        return 
      }       
      if (this.formParamsFiltro.value.idTipoOT == '' || this.formParamsFiltro.value.idTipoOT == 0) {
        this.alertasService.Swal_alert('error','Por favor seleccione el Tipo de Orden Trabajo');
        return 
      } 
      const fechaFormato = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fechaGps); 
    
      this.spinner.show();
      this.ubicacionPersonalService.get_eventosCelular(this.formParamsFiltro.value, fechaFormato, this.idUserGlobal)
          .subscribe((res:RespuestaServer)=>{            
              this.spinner.hide();
              if (res.ok==true) {        
                  this.eventosCelular = res.data; 
              }else{
                this.alertasService.Swal_alert('error', JSON.stringify(res.data));
                alert(JSON.stringify(res.data));
              }
      })
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
 
  
 

}
