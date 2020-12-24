
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import { from, combineLatest } from 'rxjs';
import Swal from 'sweetalert2';

import { UsuariosService } from '../../../services/Mantenimientos/usuarios.service';
import { TareoService } from '../../../services/reportes/tareo.service';

import { jsPDF } from "jspdf";
import { PersonalService } from '../../../services/Mantenimientos/personal.service';


declare const $: any;
@Component({
  selector: 'app-tareo',
  templateUrl: './tareo.component.html',
  styleUrls: ['./tareo.component.css']
})
export class TareoComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParamsDatosG : FormGroup;  

  idUserGlobal :number = 0;
  tareoCab :any[]=[];  
  servicios :any[]=[];   
  filtrarMantenimiento = "";
  idParteDiario_Global  :number = 0;
  fotosDetalle :any[]=[]; 
  empresas :any[]=[];
  efectivoPoliciales :any[]=[];


  @ViewChild('htmlData', {static: false}) htmlData: ElementRef;
  
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService , private funcionGlobalServices : FuncionesglobalesService, private usuariosService : UsuariosService, private tareoService :TareoService , private personalService :PersonalService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
   }

  ngOnInit(): void {
    this.inicializarFormularioFiltro()
    this.getCargarCombos();
  }

  inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idEmpresa : new FormControl('0'),
      Codservicio : new FormControl('0'),
      fecha_ini : new FormControl(new Date()),
      fecha_fin : new FormControl(new Date()), 
      idEfectivo : new FormControl('0')      
     }) 
 }
  
 getCargarCombos(){ 
  this.spinner.show();
  combineLatest([ this.usuariosService.get_area() , this.personalService.get_empresas(this.idUserGlobal)  , this.personalService.get_efectivosPoliciales(this.idUserGlobal)   ]).subscribe( ([ _servicios , _empresas, _efectivoPoliciales ])=>{
    this.servicios = _servicios;
    this.empresas = _empresas;
    this.efectivoPoliciales = _efectivoPoliciales
    this.spinner.hide(); 
  },(error)=>{
    this.spinner.hide(); 
    alert(error);
  })
 }

 mostrarInformacion(){

    if (this.formParamsFiltro.value.idEmpresa == '' || this.formParamsFiltro.value.idEmpresa == 0) {
      this.alertasService.Swal_alert('error','Por favor la empresa');
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
  
    const fechaIni = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_ini);
    const fechaFin = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_fin);
  
    this.spinner.show();
    this.tareoService.get_mostrarTareoCab( this.formParamsFiltro.value.Codservicio ,fechaIni, fechaFin, this.formParamsFiltro.value.idEmpresa , this.formParamsFiltro.value.idEfectivo)
        .subscribe((res:RespuestaServer)=>{            
            this.spinner.hide();
            if (res.ok==true) {        
                this.tareoCab = res.data;  
             }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
 } 

 descargarGrilla(){

  if (this.formParamsFiltro.value.Codservicio == '' || this.formParamsFiltro.value.Codservicio == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione el servicio');
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

  const fechaIni = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_ini);
  const fechaFin = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_fin);

  this.spinner.show();
  this.tareoService.get_descargarTareoCab(this.formParamsFiltro.value.Codservicio ,fechaIni, fechaFin, this.idUserGlobal, this.formParamsFiltro.value.idEmpresa, this.formParamsFiltro.value.idEfectivo)
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

 mostrarReportePDF( objParteDiario:any ){

  console.log(objParteDiario);

  try {
    const doc = new jsPDF(); 
    let altura = 30;
    
    const codigoAle = Math.floor(Math.random() * 1000000);  
  
    doc.setFontSize(15);
    doc.setFont("courier");
    doc.setTextColor("#17202A");
  
    doc.text('PARTE DIARIO EFECTIVO POLICIAL',60, 20, );
    doc.setTextColor("#808080");
    doc.setFontSize(10);
    altura = altura + 6;
    doc.text('AREA :' + String(objParteDiario.areaReporte) ,10, altura, );
  
    altura = altura + 6;
    doc.text('FECHA :' + String(objParteDiario.fechaReporte) ,10, altura, );     doc.text(' TOTAL DE HORAS :' + String(objParteDiario.totalHoras) , 100, altura, );
  
    altura = altura + 6;
    doc.text('HORA DE INICIO :' + String(objParteDiario.horaInicio)  ,10, altura, );     doc.text(' HORA FIN :' + String(objParteDiario.horaTermino)  , 100, altura, );
  
    altura = altura + 6;
    doc.setTextColor("#000000"); //// ---negrita
    doc.text('NOMBRE DEL COORDINADOR :'  ,10, altura, );    
    doc.setTextColor("#212F3D");
    altura = altura + 4;
    doc.text( String(objParteDiario.coordinadorReporte) , 15, altura, ); 
    doc.line(10, altura + 1.5, 200, altura + 1.5) // horizontal line
  
    altura = altura + 8;
    doc.setTextColor("#000000"); //// ---negrita
    doc.text('NOMBRE Y APELLIDO DEL EFECTIVO POLICIAL :',10, altura, );   
    doc.setTextColor("#212F3D");
    altura = altura + 4;
    doc.text( String(objParteDiario.efectivoPolicialReporte) ,15, altura, ); 
    doc.line(10, altura + 1.5, 200, altura + 1.5) // horizontal line
  
    altura = altura + 8;
    doc.setTextColor("#000000"); //// ---negrita
    doc.text('JEFE DE CUADRILLA :',10, altura);  
    doc.setTextColor("#212F3D");
    altura = altura + 4;
    doc.text( String(objParteDiario.jefeCuadrilla)  ,15, altura, ); 
    doc.line(10, altura + 1.5, 200, altura + 1.5) // horizontal line
  
  
    altura = altura + 8;
    doc.setTextColor("#000000"); //// ---negrita
    doc.text('LUGAR DE TRABAJO :',10, altura );  
  
    altura = altura + 5;
    doc.setTextColor("#212F3D");
    let splitTitle = doc.splitTextToSize(String( objParteDiario.lugarTrabajoReporte  ), 190);
  
    doc.text(splitTitle,10, altura); 
    let _val = 0;
  
    if (splitTitle.length == 0) {
      _val = 10;
    } else {
      if (splitTitle.length == 1) {
          _val = 10;
      } else {
          _val = (6 * splitTitle.length);
      }
    }
    altura = (altura + _val);
   
    doc.setTextColor("#000000"); //// ---negrita
    doc.text('OBSERVACION :',10, altura );  
  
    altura = altura + 5;
    doc.setTextColor("#212F3D");
    splitTitle = doc.splitTextToSize(String(objParteDiario.observacionReporte), 190);
    doc.text(splitTitle,10, altura); 
  
    const generarImagen_2 = ()=> {
      const imgData2 = String(objParteDiario.urlFirmaEfectivoReporte)
 
      const img2 = new Image;
      img2.onload = function () {
          doc.addImage(img2, 'JPEG', 45, 226, 40, 30);
          doc.text('Firma Efectivo Policial.',40, 260 ); 
          // generarPDF();
          // doc.output('dataurlnewwindow');
          doc.save( 'pdf_'+ String(objParteDiario.id_ParteDiario) + '_tareo_' + codigoAle +'.pdf');
      };
      img2.crossOrigin = "";  
      img2.src = imgData2;   
   }  
  
    const imgData = String(objParteDiario.urlFirmaJefeCuadrillaReporte)
    const img = new Image;

    img.onload = ()=> {
        doc.addImage(img, 'JPEG', 125, 226, 40, 30);
        generarImagen_2();
    };
    img.crossOrigin = "";
    img.src = imgData;  // some random imgur image
  
    altura = altura + 32;
    doc.text('Firma Jefe Cuadrilla', 125, 260);

  } catch (error) {
    console.error(error);
  }


 }


 cerrarModal_visor(){
  $('#modal_visorFotos').modal('hide');    
}

abrirModal_visorFotos(objData:any){ 

  this.idParteDiario_Global = objData.id_ParteDiario;

  console.log(objData)

  Swal.fire({
    icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Obteniendo Fotos, Espere por favor'
  })
  Swal.showLoading();
  this.tareoService.get_fotosParteDiario(objData.id_ParteDiario, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
    Swal.close();

    console.log(res)

    if (res.ok) {           

      setTimeout(()=>{ // 
        $('#modal_visorFotos').modal('show');
      },0);
      
      this.fotosDetalle = res.data;         
    }else{
      this.alertasService.Swal_alert('error', JSON.stringify(res.data));
      alert(JSON.stringify(res.data));
    }      
   })

}


eliminarFotoTareo(objFoto:any){
    
  this.alertasService.Swal_Question('Sistemas', 'Esta seguro de eliminar ?')
  .then((result)=>{
    if(result.value){

      Swal.fire({
       icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Eliminando la Foto, Espere por favor'
      })
      Swal.showLoading();
      this.tareoService.set_eliminar_Fotos(objFoto.id_parteDiario_foto, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
        Swal.close();

        if (res.ok) {   
          var index = this.fotosDetalle.indexOf( objFoto );
           this.fotosDetalle.splice( index, 1 );  
        }else{
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }
      })
      
    }
  }) 
} 

 
descargarFotosTareo( ){

  if (this.fotosDetalle.length ==0) {
    return;
  }    
  Swal.fire({
    icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Obteniendo Fotos, Espere por favor'
  })
  Swal.showLoading();  
  this.tareoService.get_descargarFotos_parteDiario( this.idParteDiario_Global , this.idUserGlobal ).subscribe( (res:any)=>{           
    Swal.close();

    if (res.ok ==true) {   
     window.open(String(res.data),'_blank');
    }else{
      this.alertasService.Swal_alert('error', JSON.stringify(res.data));
      alert(JSON.stringify(res.data));
    }
    
  })

}



 

 

  

}
