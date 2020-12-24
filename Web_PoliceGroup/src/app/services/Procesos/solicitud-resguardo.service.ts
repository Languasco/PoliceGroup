 

 
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const HttpUploadOptions = {
  headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
}

@Injectable({
  providedIn: 'root'
})
export class SolicitudResguardoService {

  URL = environment.URL_API;

  servicios :any[] = [];
  solicitantes :any[] = [];
  estados :any[] = [];
  jefeCuadrillas :any[] = [];

  
  constructor(private http:HttpClient) { }

  get_servicio(usuario:number){
 
    if (this.servicios.length > 0) {
      return of( this.servicios )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '2');
      parametros = parametros.append('filtro', String(usuario));  
      return this.http.get( this.URL + 'tblSolicitud_Cab' , {params: parametros})
                 .pipe(map((res:any)=>{
                     if (res.ok) {
                       this.servicios = res.data;
                       return res.data;
                     }else{
                       throw new Error(res.data)
                     }
                  }) );
    }
  }

  get_solicitantes(){
    if (this.solicitantes.length > 0) {
      return of( this.solicitantes )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '3');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblSolicitud_Cab' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.solicitantes = res.data;
                       return res.data;
                  }) );
    }
  }

 
  get_estados(){
    if (this.estados.length > 0) {
      return of( this.estados )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '4');
      parametros = parametros.append('filtro', '');
 
      
      return this.http.get( this.URL + 'tblSolicitud_Cab' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.estados = res.data;
                       return res.data;
                  }) );
    }
  }

  get_jefeCuadrillas(){
    if (this.jefeCuadrillas.length > 0) {
      return of( this.jefeCuadrillas )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '5');
      parametros = parametros.append('filtro', '');
 
      
      return this.http.get( this.URL + 'tblSolicitud_Cab' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.jefeCuadrillas = res.data;
                       return res.data;
                  }) );
    }
  }
 


  get_mostrar_solicitudesCab({servicio, idSolicitante,idEstado }, fechaIni :string , fechaFin:string ,  idUsuario:number, idEmpresa : number ){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', servicio + '|' +  idSolicitante + '|' +  fechaIni + '|' +  fechaFin + '|' +  idEstado + '|' +  idUsuario + '|' +  idEmpresa    );
    return this.http.get( this.URL + 'tblSolicitud_Cab' , {params: parametros});
  }

  set_save_solicitudes(objSolicitudes:any){
    console.log( objSolicitudes)
    return this.http.post(this.URL + 'tblSolicitud_Cab', JSON.stringify(objSolicitudes), httpOptions);
  }

  set_edit_solicitudes(objSolicitudes:any, id_Solicitud_Cab :number){
    return this.http.put(this.URL + 'tblSolicitud_Cab/' + id_Solicitud_Cab , JSON.stringify(objSolicitudes), httpOptions);
  }


  set_anular(id_Solicitud_Cab : number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '6');
    parametros = parametros.append('filtro', String(id_Solicitud_Cab) );

    return this.http.get( this.URL + 'tblSolicitud_Cab' , {params: parametros});
  }

  set_enviarAsignar(id_Solicitud_Cab : number, idusuario:number  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '7');
    parametros = parametros.append('filtro', String(id_Solicitud_Cab) + '|' +  idusuario  );

    return this.http.get( this.URL + 'tblSolicitud_Cab' , {params: parametros});
  }
  
  get_efectivosPoliciales(id_Solicitud_Cab : number , idUsuario: number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '8');
    parametros = parametros.append('filtro', String(id_Solicitud_Cab)  + '|' +  idUsuario  );

    console.log(parametros)

    return this.http.get( this.URL + 'tblSolicitud_Cab' , {params: parametros});
  }

  get_descargar_solicitudesCab({servicio, idSolicitante,idEstado }, fechaIni :string , fechaFin:string ,  idUsuario:number, idEmpresa : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '9');
    parametros = parametros.append('filtro', servicio + '|' +  idSolicitante + '|' +  fechaIni + '|' +  fechaFin + '|' +  idEstado + '|' +  idUsuario + '|' +  idEmpresa );

    console.log(parametros)

    return this.http.get( this.URL + 'tblSolicitud_Cab' , {params: parametros});
  }

//  BANDEJA DE ASIGNACION
  
  get_mostrar_solicitudesCab_bandeja({servicio,idEstado }, fechaIni :string , fechaFin:string ,  idUsuario:number, idEmpresa : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '10');
    parametros = parametros.append('filtro', servicio  + '|' +  fechaIni + '|' +  fechaFin + '|' +  idEstado + '|' +  idUsuario  + '|' +  idEmpresa  );

    return this.http.get( this.URL + 'tblSolicitud_Cab' , {params: parametros});
  }

  get_resguardoEventos(fecha_Atencion : string , idUsuario: number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '11');
    parametros = parametros.append('filtro', String(fecha_Atencion)  + '|' +  idUsuario  );

    return this.http.get( this.URL + 'tblSolicitud_Cab' , {params: parametros});
  }
  
  saveSolicitudDetalle(objSolicitudDet:any){
    return this.http.post(this.URL + 'tblSolicitud_Det', JSON.stringify(objSolicitudDet) ,  httpOptions);
  }

  get_solicitudDet(idSolCab:number){  
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '12');
    parametros = parametros.append('filtro',  String(idSolCab));
    return this.http.get( this.URL + 'tblSolicitud_Cab' , {params: parametros})
  }

  set_eliminarSolicitudDetalle(idSolicitud_Det:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '13');
    parametros = parametros.append('filtro',  String(idSolicitud_Det) );

    return this.http.get( this.URL + 'tblSolicitud_Cab' , { params: parametros });
  }

  set_cerrarAsignacion(id_Solicitud_Cab : number, idusuario:number  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '14');
    parametros = parametros.append('filtro', String(id_Solicitud_Cab) + '|' +  idusuario  );

    return this.http.get( this.URL + 'tblSolicitud_Cab' , {params: parametros});
  }

}
