 
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
export class OrdenTrabajoService {

  URL = environment.URL_API;
  estados :any[] = [];
  servicios :any[] = [];
  distritos :any[] = [];
  proveedor :any[] = [];
  jefeCuadrilla :any[] = [];
  jefeCuadrillaEmpresa :any[] = [];

  
  constructor(private http:HttpClient) { }

  get_servicio(usuario:number){
 
    if (this.servicios.length > 0) {
      return of( this.servicios )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '2');
      parametros = parametros.append('filtro', String(usuario));  
      return this.http.get( this.URL + 'OrdenTrabajo' , {params: parametros})
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

  get_Distritos(){
    if (this.distritos.length > 0) {
      return of( this.distritos )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '3');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblDistritos' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.distritos = res.data;
                       return res.data;
                  }) );
    }
  }

  get_Proveedor(){
    if (this.proveedor.length > 0) {
      return of( this.proveedor )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '7');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblEmpresas' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.proveedor = res.data;
                       return res.data;
                  }) );
    }
  }
  get_estados(){
    if (this.estados.length > 0) {
      return of( this.estados )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '3');
      parametros = parametros.append('filtro', '');
 
      
      return this.http.get( this.URL + 'OrdenTrabajo' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.estados = res.data;
                       return res.data;
                  }) );
    }
  }
 
  get_jefeCuadrilla(){
    if (this.jefeCuadrilla.length > 0) {
      return of( this.jefeCuadrilla )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '5');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'OrdenTrabajo' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.jefeCuadrilla = res.data;
                       return res.data;
                  }) );
    }
  }

  get_jefeCuadrilla_empresa(idEmpresa:number, idUsuario:number){
 
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '10');
      parametros = parametros.append('filtro', idEmpresa + '|' +  idUsuario);
  
      return this.http.get( this.URL + 'OrdenTrabajo' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.jefeCuadrillaEmpresa = res.data;
                       return res.data;
                  }) );
  }


  get_mostrarOrdenTrabajoCab_general({idServicio, idTipoOT, idDistrito,idProveedor,idEstado }, idUsuario:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', idServicio + '|' +  idTipoOT + '|' +  idDistrito + '|' +  idProveedor + '|' +  idEstado + '|' +  idUsuario  );
    return this.http.get( this.URL + 'OrdenTrabajo' , {params: parametros});
  }


  save_asignacionReasignacion_Ot( codigoOT,opcionModal,  {empresa1, jefeCuadrilla1, empresa2,jefeCuadrilla2,observaciones }, fechaAsigna, idUsuario:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', codigoOT + '|' +  opcionModal + '|' +  empresa1 + '|' +  jefeCuadrilla1 + '|' +  empresa2 + '|' +  jefeCuadrilla2  + '|' +  observaciones+ '|' +  fechaAsigna + '|' +  idUsuario );

 
    return this.http.get( this.URL + 'OrdenTrabajo' , {params: parametros});
  }

  
  get_calculos_asignarReasignar_Ot( idEmpresa:number, idJefeCuadrilla:number, opcionModal:string ,  idUsuario:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '6');
    parametros = parametros.append('filtro', idEmpresa + '|' +  idJefeCuadrilla + '|' +  opcionModal + '|' +  idUsuario  );
    return this.http.get( this.URL + 'OrdenTrabajo' , {params: parametros});
  }

  get_resumenOT_proveedor({idServicio, idTipoOT, idDistrito,idProveedor,idEstado }, idUsuario:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '7');
    parametros = parametros.append('filtro', idServicio + '|' +  idTipoOT + '|' +  idDistrito + '|' +  idProveedor + '|' +  idEstado + '|' +  idUsuario  );
    return this.http.get( this.URL + 'OrdenTrabajo' , {params: parametros});
  }
 
 
 set_enviarOT_jefeCuadrilla (otMasivo, idUsuario:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '8');
    parametros = parametros.append('filtro', otMasivo + '|' +   idUsuario  );
    return this.http.get( this.URL + 'OrdenTrabajo' , {params: parametros});
 }


 get_MapaOrdenTrabajoCab_general({idServicio, idTipoOT, idDistrito,idProveedor,idEstado }, idUsuario:number){ 
  let parametros = new HttpParams();
  parametros = parametros.append('opcion', '11');
  parametros = parametros.append('filtro', idServicio + '|' +  idTipoOT + '|' +  idDistrito + '|' +  idProveedor + '|' +  idEstado + '|' +  idUsuario  );
  return this.http.get( this.URL + 'OrdenTrabajo' , {params: parametros});
 }

  save_MapaOrdenTrabajoCab_general( idOTs:string, {idEmpresa,idCuadrilla,idEstado }, idUsuario:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '12');
    parametros = parametros.append('filtro', idOTs + '|' + idEmpresa + '|' +  idCuadrilla  + '|' +  idEstado + '|' +  idUsuario  );
  
    console.log(parametros)
    return this.http.get( this.URL + 'OrdenTrabajo' , {params: parametros});
  }
  
  get_detalleMapaOrdenTrabajoCab({idServicio, idTipoOT, idDistrito,idProveedor,idEstado }, idUsuario:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '13');
    parametros = parametros.append('filtro', idServicio + '|' +  idTipoOT + '|' +  idDistrito + '|' +  idProveedor + '|' +  idEstado + '|' +  idUsuario  );
    return this.http.get( this.URL + 'OrdenTrabajo' , {params: parametros});
  }
  
  set_asignacionAutomatica({idServicio, idTipoOT, idDistrito,idProveedor,idEstado }, idUsuario:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '14');
    parametros = parametros.append('filtro', idServicio + '|' +  idTipoOT + '|' +  idDistrito + '|' +  idProveedor + '|' +  idEstado + '|' +  idUsuario  );
    return this.http.get( this.URL + 'OrdenTrabajo' , {params: parametros});
  }
  
  get_descargarOT_general({idServicio, idTipoOT, idDistrito,idProveedor,idEstado }, idUsuario:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '15');
    parametros = parametros.append('filtro', idServicio + '|' +  idTipoOT + '|' +  idDistrito + '|' +  idProveedor + '|' +  idEstado + '|' +  idUsuario  );
    return this.http.get( this.URL + 'OrdenTrabajo' , {params: parametros});
  }


}
