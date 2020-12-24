 
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
export class UbicacionPersonalService {

  URL = environment.URL_API;
  estados :any [] = [];

  constructor(private http:HttpClient) { }

  get_mostrar_ubicacionesPersonal(fechaGps:string, idUsuario:number, idEmpresa : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro',  fechaGps + '|'  +  idUsuario + '|'  +  idEmpresa  );
 
    return this.http.get( this.URL + 'Reportes' , {params: parametros});
  }

  get_eventosCelular({ idServicio, idTipoOT, idProveedor }, fechaGps:string, idUsuario:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro', idServicio + '|' +  fechaGps + '|' +  idTipoOT + '|' +  idProveedor + '|' +  idUsuario  );

    return this.http.get( this.URL + 'Reportes' , {params: parametros});
  }


  get_mostrar_ubicacionesOT({ idServicio, idTipoOT, idProveedor, idEstado }, fechaGps:string, idUsuario:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '7');
    parametros = parametros.append('filtro', idServicio + '|' +  fechaGps + '|' +  idTipoOT + '|' +  idProveedor + '|' +  idEstado + '|' +  idUsuario);
 
    return this.http.get( this.URL + 'Reportes' , {params: parametros});
  }


}
