 

 
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
 

export class SolicitudInformacionPersonalService {

  URL = environment.URL_API;
 
  estados :any[] = [];
  empresas :any[] = [];

  
  constructor(private http:HttpClient) { }

  get_empresas(idUsuario: number){
    if (this.empresas.length > 0) {
      return of( this.empresas )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '1');
      parametros = parametros.append('filtro', String(idUsuario));
 
      
      return this.http.get( this.URL + 'tblIbp_Cab' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.empresas = res.data;
                       return res.data;
                  }) );
    }
  }
 

  get_mostrar_solicitudInformacionPersonalCab( idEmpresa : number,  idEstado:number, idUsuario : number ){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro', idEmpresa  + '|' +  idEstado + '|' +  idUsuario );
 
    return this.http.get( this.URL + 'tblIbp_Cab' , {params: parametros});
  }

  set_save_solicitudInformacionPersonal(objSolicitudes:any){
    return this.http.post(this.URL + 'tblIbp_Cab', JSON.stringify(objSolicitudes), httpOptions);
  }

  set_edit_solicitudInformacionPersonal(objSolicitudes:any, id_Ibp_Cab :number){
    return this.http.put(this.URL + 'tblIbp_Cab/' + id_Ibp_Cab , JSON.stringify(objSolicitudes), httpOptions);
  }


  set_anular_solicitudInformacionPersonal(id_Ibp_Cab : number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', String(id_Ibp_Cab) );

    return this.http.get( this.URL + 'tblIbp_Cab' , {params: parametros});
  }

  get_cantidadSolicitudesRealizadas( idEmpresa : number,  idUsuario : number, tipoProceso : string ){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', idEmpresa  + '|' + idUsuario  + '|' + tipoProceso  );
 
    return this.http.get( this.URL + 'tblIbp_Cab' , {params: parametros});
  }

  get_mostrar_bandejaSolicitudInformacionPersonalCab( idEmpresa : number,  idEstado:number, idUsuario : number ){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro', idEmpresa  + '|' +  idEstado + '|' +  idUsuario );
 
    return this.http.get( this.URL + 'tblIbp_Cab' , {params: parametros});
  }


  
  get_eliminarArchivos_bandejaSolicitudInformacion(id_Ibp_det : number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '8');
    parametros = parametros.append('filtro',  String(id_Ibp_det) ); 

    return this.http.get( this.URL + 'tblIbp_Cab' , {params: parametros});
  }

  get_descargarArchivos_bandejaSolicitudInformacion(id_Ibp_det:number , idusuario:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '17');
    parametros = parametros.append('filtro',  String(id_Ibp_det)  + '|' +  String(idusuario)  );

    return this.http.get( this.URL + 'tblPersonal' , {params: parametros});
  }

  set_terminarSolicitud(id_Ibp_Cab :number , idusuario:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '9');
    parametros = parametros.append('filtro',  String(id_Ibp_Cab)  + '|' +  String(idusuario)  );

    return this.http.get( this.URL + 'tblIbp_Cab' , {params: parametros});
  }

 

}
