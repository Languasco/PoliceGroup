import { Injectable, ɵConsole } from '@angular/core';
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
export class ProveedorService {
 

  URL = environment.URL_API;
  estados:any[] = [];

  constructor(private http:HttpClient) { }

  get_estados(){
    if (this.estados.length > 0) {
      return of( this.estados )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '1');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblEmpresas' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.estados = res.data;
                       return res.data;
                  }) );
    }
  }

  get_mostrarProveedor_general(idEstado:number, idUsuario:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro', idEstado + '|' +  idUsuario );

    return this.http.get( this.URL + 'tblEmpresas' , {params: parametros});
  }

  get_verificarRuc(nroRuc:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', nroRuc);

    return this.http.get( this.URL + 'tblEmpresas' , {params: parametros}).toPromise();
  }

  get_verificarRazonSocial(nroRZ:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro', nroRZ);

    return this.http.get( this.URL + 'tblEmpresas' , {params: parametros}).toPromise();
  }
  
  set_saveProveedor(objEmpresa:any){

    const empresaBD = {
      direccion_Empresa: objEmpresa.direccion_Empresa ,
      esProveedor: (objEmpresa.esProveedor== true) ? 1:0 ,
      estado: objEmpresa.estado,
      id_Empresa: objEmpresa.id_Empresa,
      id_Icono: objEmpresa.id_Icono,
      razonSocial_Empresa: objEmpresa.razonSocial_Empresa,
      ruc_Empresa: objEmpresa.ruc_Empresa,
      usuario_creacion: objEmpresa.usuario_creacion,
    }

    console.log(JSON.stringify(empresaBD))

    return this.http.post(this.URL + 'tblEmpresas', JSON.stringify(empresaBD), httpOptions);
  }

  set_editProveedor(objEmpresa:any, idEmpresa :number){
    
    const empresaBD = {
          direccion_Empresa: objEmpresa.direccion_Empresa ,
          esProveedor: (objEmpresa.esProveedor== true) ? 1:0 ,
          estado: objEmpresa.estado,
          id_Empresa: objEmpresa.id_Empresa,
          id_Icono: objEmpresa.id_Icono,
          razonSocial_Empresa: objEmpresa.razonSocial_Empresa,
          ruc_Empresa: objEmpresa.ruc_Empresa,
          usuario_creacion: objEmpresa.usuario_creacion,
    }

    return this.http.put(this.URL + 'tblEmpresas/' + idEmpresa , JSON.stringify(empresaBD), httpOptions);
  }

  set_anularProveedor(idEmpresa : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro',  String(idEmpresa));

    return this.http.get( this.URL + 'tblEmpresas' , {params: parametros});
  }  

  get_iconosProveedor(idIcono : number, idUser : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '6');
    parametros = parametros.append('filtro',  String(idIcono) + '|' +  idUser );

    return this.http.get( this.URL + 'tblEmpresas' , {params: parametros});
  }  

  // ----- REGISTRO DE PLACA DE VEHICULO   -----

  set_saveVehiculoPlaca(objVehiculo:any){
   return this.http.post(this.URL + 'tblEmpresas_Vehiculos', JSON.stringify(objVehiculo), httpOptions);
  }

  set_updateVehiculoPlaca(objVehiculo:any, id_Empresa_Vehiculo :number){
    return this.http.put(this.URL + 'tblEmpresas_Vehiculos/' + id_Empresa_Vehiculo , JSON.stringify(objVehiculo), httpOptions);
  }

  get_detalleVehiculoPlacas( idEmpresa : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro',  String(idEmpresa)   );

    return this.http.get( this.URL + 'tblEmpresas_Vehiculos' , {params: parametros});
  }

  set_deleteVehiculoPlaca(idEmpresaVehiculo:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  String(idEmpresaVehiculo) );

    return this.http.get( this.URL + 'tblEmpresas_Vehiculos' , { params: parametros });
  }


}
