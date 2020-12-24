 
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
export class FueraPlazoService {


  URL = environment.URL_API;
  estados :any [] = [];

  constructor(private http:HttpClient) { }

  get_mostrarFueraPlazoOT({idServicio, idTipoOT, idProveedor } , idUsuario:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro', idServicio + '|' +  idTipoOT + '|' +  idProveedor + '|' +  idUsuario  );
    return this.http.get( this.URL + 'Reportes' , {params: parametros});
  }

  get_descargarFueraPlazoOT({idServicio, idTipoOT, idProveedor } , idUsuario:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '6');
    parametros = parametros.append('filtro', idServicio + '|' +  idTipoOT + '|' +  idProveedor + '|' +  idUsuario  );
    return this.http.get( this.URL + 'Reportes' , {params: parametros});
  }

}
