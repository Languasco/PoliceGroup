 
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
export class AprobacionOTService {

  URL = environment.URL_API;
  estados :any [] = [];

  constructor(private http:HttpClient) { }



  get_estados(){
    if (this.estados.length > 0) {
      return of( this.estados )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '7');
      parametros = parametros.append('filtro', '');

      console.log(parametros)
  
      return this.http.get( this.URL + 'AprobarOT' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.estados = res.data;
                       return res.data;
                  }) );
    }
  }


  get_mostrarAprobarOTCab_general({idServicio, idTipoOT, idDistrito,idProveedor,idEstado }, idUsuario:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', idServicio + '|' +  idTipoOT + '|' +  idDistrito + '|' +  idProveedor + '|' +  idEstado + '|' +  idUsuario  );
    return this.http.get( this.URL + 'AprobarOT' , {params: parametros});
  }

  set_aprobarOT( idOT:number , idEstado: number,  idUsuario :number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro', idOT + '|' + idEstado + '|' + idUsuario);
    return this.http.get( this.URL + 'AprobarOT' , {params: parametros})
  }

  
  get_medidasOT( idOT:number, idTipoOT:number, idUsuario :number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', idOT + '|' + idTipoOT + '|' + idUsuario);
    return this.http.get( this.URL + 'AprobarOT' , {params: parametros})
  }

  get_fotosOT( id_OTDet:number, idTipoOT:number, idUsuario :number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', id_OTDet + '|' + idTipoOT + '|' + idUsuario);

    console.log(parametros);
    return this.http.get( this.URL + 'AprobarOT' , {params: parametros})
  }

  set_anular_Fotos(id_OTDet_Foto:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro',  String(id_OTDet_Foto) );

    return this.http.get( this.URL + 'AprobarOT' , { params: parametros });
  }


  get_mesmonteOT( idOT:number, idTipoOT:number, idUsuario :number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '6');
    parametros = parametros.append('filtro', idOT + '|' + idTipoOT + '|' + idUsuario);
    return this.http.get( this.URL + 'AprobarOT' , {params: parametros})
  }

  get_descargarAprobarOTCab_general({idServicio, idTipoOT, idDistrito,idProveedor,idEstado }, idUsuario:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '8');
    parametros = parametros.append('filtro', idServicio + '|' +  idTipoOT + '|' +  idDistrito + '|' +  idProveedor + '|' +  idEstado + '|' +  idUsuario  );
    return this.http.get( this.URL + 'AprobarOT' , {params: parametros});
  }

  get_descargarFotosOT_todos( idOT:number, idTipoOT:number, idUsuario :number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '9');
    parametros = parametros.append('filtro', idOT + '|' + idTipoOT + '|' + idUsuario);
    return this.http.get( this.URL + 'AprobarOT' , {params: parametros})
  }

  get_descargarFotosOT_visor( idOT_foto:number, idTipoOT:number, idUsuario :number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '10');
    parametros = parametros.append('filtro', idOT_foto + '|' + idTipoOT + '|' + idUsuario);
    return this.http.get( this.URL + 'AprobarOT' , {params: parametros})
  }

  



}
