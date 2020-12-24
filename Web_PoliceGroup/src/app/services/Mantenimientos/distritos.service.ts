 
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const HttpUploadOptions = {
  headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
}

@Injectable({
  providedIn: 'root'
})
export class DistritosService {

  URL = environment.URL_API;
  zonas:any[] =[];
  constructor(private http:HttpClient) { }

  get_zonas(){
    if (this.zonas.length > 0) {
      return of( this.zonas )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '4');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblDistritos' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.zonas = res.data;
                       return res.data;
                  }) );
    }
  }



  get_mostrarDistrito_general(){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro',  '' );

    return this.http.get( this.URL + 'tblDistritos' , {params: parametros});
  }
  
  set_saveDistrito(objDistrito:any){
    return this.http.post(this.URL + 'tblDistritos', JSON.stringify(objDistrito), httpOptions);
  }

  set_editDistrito(objDistrito:any, idDistrito :number){
    return this.http.put(this.URL + 'tblDistritos/' + idDistrito , JSON.stringify(objDistrito), httpOptions);
  }

  set_anularDistrito(idDistrito : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  String(idDistrito));

    return this.http.get( this.URL + 'tblDistritos' , {params: parametros});
  }
  
}
