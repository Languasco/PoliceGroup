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
export class PersonalService {
 

  URL = environment.URL_API;
  estados:any[] = [];
  empresas :any[] = [];
  efectivoPoliciales :any[] = [];

  tipoDocumentos :any[] = [];
  cargos :any[] = [];
  distritos :any[] = [];
  tipoDocArchivos :any[] = [];

  constructor(private http:HttpClient) { }


  get_distritos(){
    if (this.distritos.length > 0) {
      return of( this.distritos )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '9');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblPersonal' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.distritos = res.data;
                       return res.data;
                  }) );
    }
  }

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

  get_empresas(idUsuario : number){
    if (this.empresas.length > 0) {
      return of( this.empresas )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '2');
      parametros = parametros.append('filtro', String(idUsuario));
  
      return this.http.get( this.URL + 'tblPersonal' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.empresas = res.data;
                       return res.data;
                  }) );
    }
  }

  get_efectivosPoliciales(idUsuario : number){
    if (this.efectivoPoliciales.length > 0) {
      return of( this.efectivoPoliciales )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '18');
      parametros = parametros.append('filtro', String(idUsuario));
  
      return this.http.get( this.URL + 'tblPersonal' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.efectivoPoliciales = res.data;
                       return res.data;
                  }) );
    }
  }

  get_tipoDoc(){
    if (this.tipoDocumentos.length > 0) {
      return of( this.tipoDocumentos )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '6');
      parametros = parametros.append('filtro', '1');
  
      return this.http.get( this.URL + 'tblPersonal' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.tipoDocumentos = res.data;
                       return res.data;
                  }) );
    }
  }

  get_cargo(){
    if (this.cargos.length > 0) {
      return of( this.cargos )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '7');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblPersonal' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.cargos = res.data;
                       return res.data;
                  }) );
    }
  }


  get_tipoDocArchivos(){
    if (this.tipoDocArchivos.length > 0) {
      return of( this.tipoDocArchivos )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '14');
      parametros = parametros.append('filtro', '1');
  
      return this.http.get( this.URL + 'tblPersonal' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.tipoDocArchivos = res.data;
                       return res.data;
                  }) );
    }
  }



  get_mostrarPersonal_general(idEmpresa:number, idEstado:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', idEmpresa + '|' +  idEstado );

    return this.http.get( this.URL + 'tblPersonal' , {params: parametros});
  }

  
  get_mostrarPolicia_general(idEmpresa:number, idEstado:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '10');
    parametros = parametros.append('filtro', idEmpresa + '|' +  idEstado );

    return this.http.get( this.URL + 'tblPersonal' , {params: parametros});
  }


  get_verificarDni(nroDoc:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro', nroDoc);

    return this.http.get( this.URL + 'tblPersonal' , {params: parametros}).toPromise();
  }
  
  set_savePersonal(objEmpresa:any){
    return this.http.post(this.URL + 'tblPersonal', JSON.stringify(objEmpresa), httpOptions);
  }

  set_editPersonal(objEmpresa:any, idPersonal :number){

    console.log(objEmpresa )

    return this.http.put(this.URL + 'tblPersonal/' + idPersonal , JSON.stringify(objEmpresa), httpOptions);
  }

  set_anularPersonal(idPersonal : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro',  String(idPersonal));

    return this.http.get( this.URL + 'tblPersonal' , {params: parametros});
  } 
  
  get_archivosAdicionales(idPolicia : number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '11');
    parametros = parametros.append('filtro',  String(idPolicia) );

    return this.http.get( this.URL + 'tblPersonal' , {params: parametros});
  }

  get_eliminarArchivosAdicionales(id_PersonalDocumento : number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '12');
    parametros = parametros.append('filtro',  String(id_PersonalDocumento) );

 

    return this.http.get( this.URL + 'tblPersonal' , {params: parametros});
  }

  get_descargarFileAdicionales(idDocumentoArchivo:number , idusuario:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '13');
    parametros = parametros.append('filtro',  String(idDocumentoArchivo)  + '|' +  String(idusuario)  );

    return this.http.get( this.URL + 'tblPersonal' , {params: parametros});
  }

  //----reporte Personal policial

  get_mostrarPersonalPolicia_general(idEmpresa:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '15');
    parametros = parametros.append('filtro', String(idEmpresa) );

    return this.http.get( this.URL + 'tblPersonal' , {params: parametros});
  }

  
  get_serviciosEmpresa(idEmpresa:number, idUsuario:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '16');
    parametros = parametros.append('filtro', idEmpresa + '|' +  idUsuario );

    return this.http.get( this.URL + 'tblPersonal' , {params: parametros});
  }



 
}
