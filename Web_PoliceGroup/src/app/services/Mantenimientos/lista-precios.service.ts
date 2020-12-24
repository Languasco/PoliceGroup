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
export class ListaPreciosService {

  URL = environment.URL_API;
  estados:any[] = [];
  tipoOrdenTrabajo :any[] = [];
 

  constructor(private http:HttpClient) { }

  get_estados(){
    if (this.estados.length > 0) {
      return of( this.estados )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '1');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblPersonal' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.estados = res.data;
                       return res.data;
                  }) );
    }
  }

 

  get_tipoOrdenTrabajo(){
    if (this.tipoOrdenTrabajo.length > 0) {
      return of( this.tipoOrdenTrabajo )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '6');
      parametros = parametros.append('filtro', '2');
  
      return this.http.get( this.URL + 'tblPersonal' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.tipoOrdenTrabajo = res.data;
                       return res.data;
                  }) );
    }
  } 

  get_mostrarPrecio_general(idtipoOrdenT:number, idEstado:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', idtipoOrdenT + '|' +  idEstado );

    return this.http.get( this.URL + 'tblPrecios' , {params: parametros});
  }

  get_verificarDni(nroDoc:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro', nroDoc);

    return this.http.get( this.URL + 'tblPrecios' , {params: parametros}).toPromise();
  }
  
  set_savePrecio(objPrecio:any){
    return this.http.post(this.URL + 'tblPrecios', JSON.stringify(objPrecio), httpOptions);
  }

  set_editPrecio(objPrecio:any, id_Precio :number){
    return this.http.put(this.URL + 'tblPrecios/' + id_Precio , JSON.stringify(objPrecio), httpOptions);
  }

  set_anularPrecio(id_Precio : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  String(id_Precio));

    return this.http.get( this.URL + 'tblPrecios' , {params: parametros});
  } 
}
