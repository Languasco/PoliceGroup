 
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const HttpUploadOptions = {
  headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
}

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionZonasService {

  URL = environment.URL_API;
  constructor(private http:HttpClient) { }

  get_areaEmpresa(idEmpresa:number, idUser:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', idEmpresa  +'|'+ idUser);

    return this.http.get( this.URL + 'ConfiguracionZonas' , {params: parametros});
  }

  get_distritosEmpresaArea(idEmpresa:number, areasMarcadas :string, idUser:number, idZona:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro', idEmpresa  +'|'+ areasMarcadas +'|'+ idUser +'|'+ idZona);

    return this.http.get( this.URL + 'ConfiguracionZonas' , {params: parametros});
  }

  save_configuracionZonas(idEmpresa:number, areasMarcadas :string, distritosMarcadas:string, idUser:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', idEmpresa  +'|'+ areasMarcadas +'|'+ distritosMarcadas +'|'+ idUser );

    return this.http.get( this.URL + 'ConfiguracionZonas' , {params: parametros});
  }


}
