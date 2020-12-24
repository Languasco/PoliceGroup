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

export class CargoPersonalService {

  URL = environment.URL_API;
  estados:any[] = [];
  tipoOrdenTrabajo :any[] = [];
 

  constructor(private http:HttpClient) { }

  get_mostrar_cargo(idEstado:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(idEstado));

    return this.http.get( this.URL + 'tblCargo_Personal' , {params: parametros});
  }

  get_verificar_cargo(nombreCargo:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', nombreCargo);

    return this.http.get( this.URL + 'tblCargo_Personal' , {params: parametros}).toPromise();
  }

  set_save_cargo(objMantenimiento:any){
    return this.http.post(this.URL + 'tblCargo_Personal', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_cargo(objMantenimiento:any, id_Cargo :number){
    return this.http.put(this.URL + 'tblCargo_Personal/' + id_Cargo , JSON.stringify(objMantenimiento), httpOptions);
  }

  set_anular_cargo(id_Cargo : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  String(id_Cargo));

    return this.http.get( this.URL + 'tblCargo_Personal' , {params: parametros});
  }


}