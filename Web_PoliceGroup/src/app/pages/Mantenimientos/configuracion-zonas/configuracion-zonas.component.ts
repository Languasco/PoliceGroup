
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import { from, combineLatest } from 'rxjs';
import Swal from 'sweetalert2';
import { OrdenTrabajoService } from '../../../services/Procesos/orden-trabajo.service';
import { ConfiguracionZonasService } from '../../../services/Mantenimientos/configuracion-zonas.service';
import { DistritosService } from '../../../services/Mantenimientos/distritos.service';
 

declare var $:any;

@Component({
  selector: 'app-configuracion-zonas',
  templateUrl: './configuracion-zonas.component.html',
  styleUrls: ['./configuracion-zonas.component.css']
})
 

export class ConfiguracionZonasComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams : FormGroup;
  idUserGlobal :number = 0;
  
  idEmpresa_Global=0;
  proveedor :any [] =[];
  areas :any [] =[];
  distritos :any [] =[];
  zonas:any [] =[];

  acumudadorEmpresa= 300;
  acumudadorArea= 600;
  filtrar='';
  checkeadoAll=false;
  idZonas =0;
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private funcionesglobalesService : FuncionesglobalesService, private ordenTrabajoService : OrdenTrabajoService, private configuracionZonasService  : ConfiguracionZonasService, private distritosService : DistritosService ) {         
     this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
 
   this.getCargarCombos();
   this.inicializarFormularioFiltro();
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idEstado : new FormControl('0')
     }) 
 }

 inicializarFormulario(){ 
  this.formParams= new FormGroup({
    idEmpresa : new FormControl('0'),
    idArea : new FormControl('0'),
    idZona : new FormControl('0'),
    idDistrito : new FormControl('0')
   }) 
}
  
 getCargarCombos(){ 
    this.spinner.show();

    combineLatest([ this.ordenTrabajoService.get_Proveedor(), this.distritosService.get_zonas() ])
    .subscribe(([_proveedor, _zonas])=>{
      
      this.spinner.hide();  
      this.proveedor = _proveedor; 
      this.zonas = _zonas;
    })

 
 }  
  
 cerrarModal(){
    setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('hide');  
    },0); 
 }

 change_empresa(opcion:any){

  this.idEmpresa_Global= opcion.target.value;  
  this.acumudadorEmpresa= 300;
  this.acumudadorArea= 600;
  this.idZonas=0;
 
  Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Cargando Areas, Espere por favor'  })
  Swal.showLoading();
  this.configuracionZonasService.get_areaEmpresa(this.idEmpresa_Global, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
    Swal.close();      
    if (res.ok==true) {         
        this.areas = res.data;
        this.distritos = [];
        if ( this.areas.length > 0) {
          const areasMarcadas =  this.funcionesglobalesService.obtenerCheck_IdPrincipal(this.areas, 'id_Servicios');
          this.distritosEmpresaArea(areasMarcadas, this.idZonas);
        }
    }else{
      this.spinner.hide();
      this.alertasService.Swal_alert('error', JSON.stringify(res.data));
      alert(JSON.stringify(res.data));
    }   
  })

 }

 change_area(opcion:any){ 
   const areasMarcadas =  this.funcionesglobalesService.obtenerCheck_IdPrincipal(this.areas, 'id_Servicios');
   this.distritosEmpresaArea(areasMarcadas, this.idZonas);
 }


distritosEmpresaArea(areasMarcadas :any[]=[], idZona:number){
  Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Cargando los Distritos, Espere por favor'  })
  Swal.showLoading();

  this.checkeadoAll=false;
  this.configuracionZonasService.get_distritosEmpresaArea(this.idEmpresa_Global, areasMarcadas.join(), this.idUserGlobal, idZona).subscribe((res:RespuestaServer)=>{
    Swal.close();     
    
    console.log('distritosEmpresaArea')    
    console.log(res)    

    if (res.ok==true) {     

        this.distritos = res.data;
        setTimeout(()=>{ 
          this.spinner.hide();
        }, 0);
    }else{
      this.spinner.hide();
      this.alertasService.Swal_alert('error', JSON.stringify(res.data));
      alert(JSON.stringify(res.data));
    }   
  })
}

   
  marcarTodos(){
    if (this.distritos.length<=0) {
      return;
    }
    for (const obj of this.distritos) {
      if (this.checkeadoAll) {
        obj.checkeado = false;
      }else{
        obj.checkeado = true;
      }
    }
  }
  
  guardarConfiguracionZonas(){
  
    const areasMarcadas =  this.funcionesglobalesService.obtenerCheck_IdPrincipal(this.areas, 'id_Servicios');
    const distritosMarcadas =  this.funcionesglobalesService.obtenerCheck_IdPrincipal(this.distritos, 'id_Distrito');
  
    this.configuracionZonasService.save_configuracionZonas(this.idEmpresa_Global, areasMarcadas.join(),distritosMarcadas.join(), this.idUserGlobal).subscribe((res:RespuestaServer)=>{
      Swal.close();      
      if (res.ok==true) {         
        this.alertasService.Swal_Success('Se agregó la configuracion correctamente..');
      }else{
        this.spinner.hide();
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }   
    })
    
  }
  
  change_zona(opcion:any){ 
    const areasMarcadas =  this.funcionesglobalesService.obtenerCheck_IdPrincipal(this.areas, 'id_Servicios');
    this.distritosEmpresaArea(areasMarcadas, this.idZonas);
  }
  
 
 

}

