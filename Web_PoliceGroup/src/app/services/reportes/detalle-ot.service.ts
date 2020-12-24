 
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
export class DetalleOTService {


  URL = environment.URL_API;
  estados :any [] = [];

  constructor(private http:HttpClient) { }

  get_mostrarDetalleOt({idServicio, idTipoOT, idProveedor, idEstado },fecha_ini, fecha_fin, idUsuario:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', idServicio + '|' +  idTipoOT + '|' +  idProveedor + '|' +  fecha_ini + '|' +  fecha_fin + '|' +  idEstado + '|' +  idUsuario  );
    return this.http.get( this.URL + 'Reportes' , {params: parametros});
  }

  get_descargarDetalleOt({idServicio, idTipoOT, idProveedor, idEstado },fecha_ini, fecha_fin, idUsuario:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', idServicio + '|' +  idTipoOT + '|' +  idProveedor + '|' +  fecha_ini + '|' +  fecha_fin + '|' +  idEstado + '|' +  idUsuario  );
    return this.http.get( this.URL + 'Reportes' , {params: parametros});
  }

}
