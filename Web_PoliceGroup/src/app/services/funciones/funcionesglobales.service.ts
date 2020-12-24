import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FuncionesglobalesService {

  constructor() { }


  anioActualSistema(){
    const today = new Date();
    const year = today.getFullYear();
    return year;
  }

  restarMesesFechaActual(nroMeses){
    var newdate = new Date();
    newdate.setMonth(newdate.getMonth() - nroMeses);
    return new Date(newdate);
  }

  formatoFecha(fecha : any) {

    var date = new Date(fecha); 
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();

    const fechaFormat =  (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y   ;

    return fechaFormat;
  }

  formatoFechaIngles(string) {
    var info = string.split('/').reverse().join('-');
    return info;
  }

  formatoSoloHoras(fecha:Date) {
    var time = new Date(fecha); 
    return time.toLocaleString('en-GB', { hour: 'numeric', minute: 'numeric' });
   }
  

  BorrarTodoArray( arreglo:any[] ):void{
    if(  arreglo.length > 0){
      arreglo.splice(0,arreglo.length + 1);
    }
  }

  obtenerTodos_IdPrincipal(listDatos:any, campoID:any){
    var listIDs = [];    
    for (let obj of listDatos) {
      listIDs.push(obj[""+campoID+""]);
    }
    return listIDs;
  }

  obtenerCheck_IdPrincipal(listDatos:any, campoID:any){
    var listIDs = [];    
    for (let obj of listDatos) {
      if (obj.checkeado) {
       listIDs.push(obj[""+campoID+""]);
      }
    }
    return listIDs;
  }

  obtenerCheck_IdPrincipal_new(listDatos:any, campoID:any){
    var listIDs = [];    
    for (let obj of listDatos) {
      if (obj.marcado) {
       listIDs.push(obj[""+campoID+""]);
      }
    }
    return listIDs;
  }

  verificarCheck_marcado(listDatos:any):boolean{
   let flag_marco =false;
    for (let obj of listDatos) {
      if (obj.checkeado) {
        flag_marco = true;
        break;
      }
    }
    return flag_marco;
  }

  generarJsonDescargarlo(exportObj:string, exportName:string){
    ///https://es.stackoverflow.com/questions/197432/crear-un-bot%C3%B3n-para-descargar-informaci%C3%B3n?rq=1

    // this.generarJsonDescargarlo(myJSONObject,'LuisIncio');

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove(); 
  }

  


}
