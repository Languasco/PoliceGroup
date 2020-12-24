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

export class AreaService {

  URL = environment.URL_API;
  estados:any[] = [];
  tipoOrdenTrabajo :any[] = []; 

  constructor(private http:HttpClient) { }

  get_mostrar_area(idEstado:number , idEmpresa : number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(idEstado)   + '|'  + String(idEmpresa)  )   ;

    return this.http.get( this.URL + 'tblServicios' , {params: parametros});
  }

  get_verificar_area( id_Empresa: number, nombreArea:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', String(id_Empresa)   + '|'  + nombreArea);

    return this.http.get( this.URL + 'tblServicios' , {params: parametros}).toPromise();
  }

  set_save_area(objMantenimiento:any){

    console.log(JSON.stringify(objMantenimiento))
    return this.http.post(this.URL + 'tblServicios', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_area(objMantenimiento:any, id_area :number){
    return this.http.put(this.URL + 'tblServicios/' + id_area , JSON.stringify(objMantenimiento), httpOptions);
  }

  set_anular_area(id_area : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  String(id_area));

    return this.http.get( this.URL + 'tblServicios' , {params: parametros});
  }


}