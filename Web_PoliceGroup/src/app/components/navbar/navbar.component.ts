import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import { AlertasService } from '../../services/alertas/alertas.service';
import { LoginService } from '../../services/login/login.service';
import { Router } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  showMenu:boolean=false;
  formParams : FormGroup;
  menuPrincipal= [];
  nameUser = "";

  constructor( private loginService : LoginService, private router:Router) {     
    this.loginService.isLogginUser$.subscribe(obj => {
      this.showMenu = obj.status;
      this.nameUser = this.loginService.getSessionNombre();
      this.menuPrincipal = obj.menu;

      
    }); 
  }

  ngOnInit(): void {
    this.showMenu = this.loginService.getSession();
    this.nameUser = this.loginService.getSessionNombre();
    this.menuPrincipal =  this.loginService.getSessionMenu();
  }
 
  cerrarSesion(){
    this.loginService.logOut();
    this.showMenu=false;
    this.menuPrincipal = [];
    this.loginService.updateLoginNameStatus(false,null);
    this.router.navigateByUrl('/');    
  }  

  downloadApk(){
    window.open('./assets/apk/applus.apk');    
  }

}
