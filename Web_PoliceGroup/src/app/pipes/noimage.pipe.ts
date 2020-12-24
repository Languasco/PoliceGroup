import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noimage'
})
export class NoimagePipe implements PipeTransform {
  transform(imagenes: any): any {   
   if(imagenes == 'sin-foto'){ 
      return './assets/img/noimage.jpg';
    }else{       
      return imagenes;
    } 
  }
}
