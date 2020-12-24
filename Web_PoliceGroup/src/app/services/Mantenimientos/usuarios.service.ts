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
export class UsuariosService {
 

  URL = environment.URL_API;
  estados:any[] = [];
  empresas :any[] = [];

  areas :any[] = [];
  perfiles :any[] = [];
  empresasMasivas :any[] = [];
  documentosSolMasivas :any[] = [];

  constructor(private http:HttpClient) { }

  get_estados(){
    if (this.estados.length > 0) {
      return of( this.estados )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '1');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.estados = res.data;
                       return res.data;
                  }) );
    }
  }

  get_empresas(){
    if (this.empresas.length > 0) {
      return of( this.empresas )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '2');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.empresas = res.data;
                       return res.data;
                  }) );
    }
  }

  get_area(){
    if (this.areas.length > 0) {
      return of( this.areas )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '3');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.areas = res.data;
                       return res.data;
                  }) );
    }
  }

  get_perfil(){
    if (this.perfiles.length > 0) {
      return of( this.perfiles )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '7');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.perfiles = res.data;
                       return res.data;
                  }) );
    }
  }

  get_empresasMasivas(){
    if (this.empresasMasivas.length > 0) {
      return of( this.empresasMasivas )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '20');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.empresasMasivas = res.data;
                       return res.data;
                  }) );
    }
  }

  get_documentosSolicitarMasivas(){
    if (this.documentosSolMasivas.length > 0) {
      return of( this.documentosSolMasivas )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '6');
      parametros = parametros.append('filtro', '2');
  
      return this.http.get( this.URL + 'tblPersonal' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.documentosSolMasivas = res.data;
                       return res.data;
                  }) );
    }
  }

 



  get_mostrarUsuario_general(idEmpresa:number,idArea:number, idEstado:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', idEmpresa + '|' +  idArea  + '|' +  idEstado);

    return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
  }

  get_verificar_DniPersonal(nroDoc:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro', nroDoc);

    return this.http.get( this.URL + 'tblPersonal' , {params: parametros}).toPromise();
  }
  
  get_verificar_DniUsuario(nroDoc:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '6');
    parametros = parametros.append('filtro', nroDoc);

    return this.http.get( this.URL + 'tblUsuarios' , {params: parametros}).toPromise();
  }

  get_obtenerDatos_documento(nroDoc:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '8');
    parametros = parametros.append('filtro', nroDoc);

    return this.http.get( this.URL + 'tblUsuarios' , {params: parametros}).toPromise();
  }

  get_verificar_logginUsuario(loggin:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '9');
    parametros = parametros.append('filtro', loggin);

    return this.http.get( this.URL + 'tblUsuarios' , {params: parametros}).toPromise();
  } 

  
  set_saveUsuarios(objUsuarios:any){
    return this.http.post(this.URL + 'tblUsuarios', JSON.stringify(objUsuarios), httpOptions);
  }

  set_editUsuario(objUsuarios:any, idUsuario :number){
    return this.http.put(this.URL + 'tblUsuarios/' + idUsuario , JSON.stringify(objUsuarios), httpOptions);
  }

  set_anularUsuario(idUsuario : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro',  String(idUsuario));

    return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
  }  

  set_grabarAreasMasivo(idUsuarioBD : number, areas:string, idUser:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '10');
    parametros = parametros.append('filtro', idUsuarioBD + '|' +  areas  + '|' +  idUser  );
 
    return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
  }  

  get_AreasMasivo(idUsuarioBD : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '11');
    parametros = parametros.append('filtro', String(idUsuarioBD) );
    return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
  }  

  generararDescargar_codigoQr(idUsuario : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '12');
    parametros = parametros.append('filtro',  String(idUsuario));

    console.log(idUsuario)

    return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
  } 



    //-----accesos  menu

    get_accesosMenu(){
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '2');
      parametros = parametros.append('filtro',  '' );
  
      return this.http.get( this.URL + 'Login' , {params: parametros});
    }
  
    get_mostrarUsuarios_generalAccesos(){
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '13');
      parametros = parametros.append('filtro',  '' );
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
    }

    get_mostrarPerfiles_generalAccesos(){
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '17');
      parametros = parametros.append('filtro',  '' );
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
    }
  
    get_permisosUsuarioAcceso(idOpciones:string ){
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '14');
      parametros = parametros.append('filtro',  idOpciones );
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
    }

    get_permisosPerfilAcceso(idOpciones:string ){
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '18');
      parametros = parametros.append('filtro',  idOpciones );
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
    }
    
    get_eventosUsuarioMarcados(idOpciones:string,id_usuario:number ){
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '15');
      parametros = parametros.append('filtro',  idOpciones +'|'+ id_usuario );
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
    }
    
    get_eventosPerfilMarcados(idOpciones:string, idPerfil:number ){
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '19');
      parametros = parametros.append('filtro',  idOpciones +'|'+ idPerfil );
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
    }

    set_grabarEventos(idOpciones:string,idEventos :string , id_usuario:number, modalElegido:string ){
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '16');
      parametros = parametros.append('filtro',  idOpciones +'|'+ idEventos +'|'+ id_usuario +'|'+ modalElegido );
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
    }


    set_grabarEmpresasMasivo(id_Personal : number, empresasMarcadas:string, idUser:number){ 
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '21');
      parametros = parametros.append('filtro', id_Personal + '|' +  empresasMarcadas  + '|' +  idUser  );
   
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
    }

    get_empresasCheckeadoMasivo(id_Personal : number){ 
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '22');
      parametros = parametros.append('filtro', String(id_Personal) );
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
    }  


    

    set_grabarEmpresasMasivo_usuario(id_Usuario : number, empresasMarcadas:string, idUser:number){ 
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '23');
      parametros = parametros.append('filtro', id_Usuario + '|' +  empresasMarcadas  + '|' +  idUser  );
   
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
    }
  
    get_empresasCheckeadoMasivo_usuario(id_Usuario : number){ 
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '24');
      parametros = parametros.append('filtro', String(id_Usuario) );
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
    }  

    

    set_grabarSolicitudInformacionDetMasivo(id_Ibp_Cab : number, docMarcadas:string, idUser:number){ 
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '25');
      parametros = parametros.append('filtro', id_Ibp_Cab + '|' +  docMarcadas  + '|' +  idUser  );
   
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
    }

    set_grabarSolicitudInformacionDet_checkeado_Masivo(id_Ibp_Cab : number){ 
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '26');
      parametros = parametros.append('filtro', String(id_Ibp_Cab) );
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
    }  

    get_SolicitudInformacionDet_checkeado_Masivo(id_Ibp_Cab : number){ 
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '6');
      parametros = parametros.append('filtro', String(id_Ibp_Cab) );
      return this.http.get( this.URL + 'tblIbp_Cab' , {params: parametros});
    }  


 
}