import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';
 

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  
  constructor(private loginService: LoginService, private router:Router){
  }

  canActivate():  boolean {
    const estado = this.loginService.estadoAutentificado();
    if (!this.loginService.estadoAutentificado()) { 
        this.router.navigate(['/']);
        return false;
    }else{
      return true;
    } 
  }
  
}
