import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { ProveedorComponent } from './pages/Mantenimientos/proveedor/proveedor.component';
import { PersonalComponent } from './pages/Mantenimientos/personal/personal.component';
import { UsuariosComponent } from './pages/Accesos/usuarios/usuarios.component';
import { DistritosComponent } from './pages/Mantenimientos/distritos/distritos.component';
import { ListaPreciosComponent } from './pages/Mantenimientos/lista-precios/lista-precios.component';
import { OrdenTrabajoComponent } from './pages/Procesos/orden-trabajo/orden-trabajo.component';
import { AprobacionOTComponent } from './pages/Procesos/aprobacion-ot/aprobacion-ot.component';
import { UbicacionPersonalComponent } from './pages/Reportes/ubicacion-personal/ubicacion-personal.component';
import { DetalleOTComponent } from './pages/Reportes/detalle-ot/detalle-ot.component';
import { FueraPlazoComponent } from './pages/Reportes/fuera-plazo/fuera-plazo.component';
import { ConfiguracionZonasComponent } from './pages/Mantenimientos/configuracion-zonas/configuracion-zonas.component';
import { UbicacionOtComponent } from './pages/Reportes/ubicacion-ot/ubicacion-ot.component';
import { AccesosComponent } from './pages/Accesos/accesos/accesos.component';
import { CargoPersonalComponent } from './pages/Mantenimientos/cargo-personal/cargo-personal.component';
import { AreasComponent } from './pages/Mantenimientos/areas/areas.component';
import { TareoComponent } from './pages/Reportes/tareo/tareo.component';
import { SolicitudResguardoComponent } from './pages/Procesos/solicitud-resguardo/solicitud-resguardo.component';
import { BandejaAsignacionComponent } from './pages/Procesos/bandeja-asignacion/bandeja-asignacion.component';
import { AprobarTareoComponent } from './pages/Procesos/aprobar-tareo/aprobar-tareo.component';
import { PoliciaComponent } from './pages/Mantenimientos/policia/policia.component';
import { PersonalPolicialComponent } from './pages/Reportes/personal-policial/personal-policial.component';
import { SolicitudInformacionPersonalComponent } from './pages/Procesos/solicitud-informacion-personal/solicitud-informacion-personal.component';
import { BandejaSolicitudInformacionPersonalComponent } from './pages/Procesos/bandeja-solicitud-informacion-personal/bandeja-solicitud-informacion-personal.component';
 
 
const APP_ROUTERS: Routes = [
    //{ path: 'home', component: HomeComponent  ,  canActivate: [AuthGuard]},  
    { path: '', component: HomeComponent},  
    { path: 'mantenimiento-proveedor', component: ProveedorComponent},  
    { path: 'mantenimiento-personal', component: PersonalComponent},  
    { path: 'mantenimiento-usuarios', component: UsuariosComponent},  
    { path: 'mantenimiento-distritos', component: DistritosComponent},  
    { path: 'mantenimiento-lista-precios', component: ListaPreciosComponent},  


    { path: 'proceso-orden-trabajo', component: OrdenTrabajoComponent},  
    { path: 'proceso-aprobacion-orden-trabajo', component: AprobacionOTComponent},  

    { path: 'reporte-ubicacion-personal', component: UbicacionPersonalComponent},  
    { path: 'reporte-detalle-ot', component: DetalleOTComponent},  
    { path: 'reporte-fuerza-plazo', component: FueraPlazoComponent},  

    { path: 'mantenimiento-config-zonas', component: ConfiguracionZonasComponent},  
    { path: 'reporte-ubicacion-ot', component: UbicacionOtComponent},  

    { path: 'seguridad-accesos', component: AccesosComponent , canActivate: [ AuthGuard]}, 
    { path: 'mantenimiento-cargo-personal', component: CargoPersonalComponent},  
    { path: 'mantenimiento-servicio', component: AreasComponent},  

    { path: 'reporte-tareo', component: TareoComponent},  
    { path: 'procesos-solicitud-resguardo', component: SolicitudResguardoComponent  },  
    { path: 'procesos-bandeja-asignacion', component: BandejaAsignacionComponent  },  
    { path: 'proceso-aprobacion-tareo', component: AprobarTareoComponent},      
    { path: 'mantenimiento-policia', component: PoliciaComponent},  

    { path: 'reporte-personal-policial', component: PersonalPolicialComponent},  
    { path: 'proceso-solicitud-informacion-persona', component: SolicitudInformacionPersonalComponent},  
    { path: 'proceso-bandeja-atencion-informacion-persona', component: BandejaSolicitudInformacionPersonalComponent},  

    { path: '', pathMatch:'full', redirectTo:'inicio' },
    { path: '**', pathMatch:'full', redirectTo:'inicio' },
  ];
  
  export const APP_ROUTING = RouterModule.forRoot(APP_ROUTERS,{useHash:true});  


 