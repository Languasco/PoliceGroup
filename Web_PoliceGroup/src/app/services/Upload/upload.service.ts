import { Injectable } from '@angular/core';
 
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const HttpUploadOptions = {
  headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
}
 

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  URL = environment.URL_API;
  constructor(private http:HttpClient) { }

  //-----carga  carta Enel de excel ------ 
  upload_Excel_personal(file:any, idEmpresa:number, idusuario : any) { 
 
    const formData = new FormData();   
    formData.append('file', file);
    const filtro =  idEmpresa + '|' + idusuario;
    return this.http.post(this.URL + 'Uploads/post_archivoExcel_personal?filtros=' + filtro, formData);
    
  }

  save_archivoExcel_personal(idusuario : any){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '8');
    parametros = parametros.append('filtro', idusuario) ;
    return this.http.get( this.URL + 'tblPersonal' , {params: parametros});
  }

  upload_imagen_personal(file:any, idPersonal:number, idusuarioLogin : any) {   
    const formData = new FormData();   
    formData.append('file', file);
    const filtro =  idPersonal + '|' + idusuarioLogin;
    return this.http.post(this.URL + 'Uploads/post_imagenPersonal?filtros=' + filtro, formData);    
  } 
  
  upload_documentosAdicionalesCab(file:any, idPolicia: number ,id_Documento_Policial : number, fechaI :string, fechaF :string, idusuario : number ) { 
    const formData = new FormData();   
    formData.append('file', file);
    const filtro =  idPolicia  + '|' + id_Documento_Policial + '|' + fechaI + '|' + fechaF + '|' + idusuario ;
    return this.http.post(this.URL + 'Uploads/post_archivosAdicionalesCabPolicia?filtros=' + filtro, formData);
  }

  upload_documentos_solicitudInformacionDet(file:any, id_Ibp_Det : number , idusuario : number ) { 
    const formData = new FormData();   
    formData.append('file', file);
    const filtro =  id_Ibp_Det  + '|' + idusuario ;
    return this.http.post(this.URL + 'Uploads/post_documentos_solicitudInformacionDet?filtros=' + filtro, formData);
  }

}
