
 
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
export class TareoService {


  URL = environment.URL_API;
  estados :any [] = [];

  constructor(private http:HttpClient) { }

  get_mostrarTareoCab(idServicio:number , fecha_ini:string , fecha_fin:string,  idEmpresa : Number,  idEfectivo : Number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '8');
    parametros = parametros.append('filtro', idServicio + '|' +  fecha_ini + '|' +  fecha_fin + '|' +  idEmpresa   + '|' +  idEfectivo   );
    return this.http.get( this.URL + 'Reportes' , {params: parametros});
  }

  //----- BBBB
  get_descargarTareoCab(idServicio:number , fecha_ini:string , fecha_fin:string, idUser:number, idEmpresa : Number, idEfectivo : Number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '9');
    parametros = parametros.append('filtro', idServicio + '|' +  fecha_ini + '|' +  fecha_fin + '|' +  idUser + '|' +  idEmpresa  + '|' +  idEfectivo   );
  
    return this.http.get( this.URL + 'Reportes' , {params: parametros});
  }
 
  get_generarImpresionTareoCab(id_ParteDiario:number ){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '8');
    parametros = parametros.append('filtro', String(id_ParteDiario)   );
    return this.http.get( this.URL + 'Reportes' , {params: parametros});
  }


  ///-- APROBACION DE TAREOS ---- 

  get_mostrarTareoCab_aprobacion(idServicio:number , fecha_ini:string , fecha_fin:string, idEmpresa : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '10');
    parametros = parametros.append('filtro', idServicio + '|' +  fecha_ini + '|' +  fecha_fin + '|' +  idEmpresa );
    return this.http.get( this.URL + 'Reportes' , {params: parametros});
  }

  set_aprobarRechazarTareo(id_ParteDiario:number , opcion:string , idUser:number, observacion : string ){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '11');
    parametros = parametros.append('filtro', id_ParteDiario + '|' +  opcion + '|' +  idUser + '|' +  observacion );
    return this.http.get( this.URL + 'Reportes' , {params: parametros});
  }

  set_aprobarRechazarTareo_masivo(id_ParteDiario: string , opcion:string , idUser:number, observacion : string ){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '12');
    parametros = parametros.append('filtro', id_ParteDiario + '|' +  opcion + '|' +  idUser  + '|' +  observacion  );
    return this.http.get( this.URL + 'Reportes' , {params: parametros});
  }

  get_fotosParteDiario( id_ParteDiario:number,  idUsuario :number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '13');
    parametros = parametros.append('filtro',  id_ParteDiario + '|' + idUsuario);
    return this.http.get( this.URL + 'Reportes' , {params: parametros})
  }

  set_eliminar_Fotos( id_parteDiario_foto:number,  idUsuario :number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '14');
    parametros = parametros.append('filtro',  id_parteDiario_foto + '|' + idUsuario);
    return this.http.get( this.URL + 'Reportes' , {params: parametros})
  }

  get_descargarFotos_parteDiario( idParteDiario :number,   idUsuario :number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '15');
    parametros = parametros.append('filtro', idParteDiario + '|' + idUsuario);
    return this.http.get( this.URL + 'Reportes' , {params: parametros})
  }



}
