import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// para poder utilizar en ng-model
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// loading
import { NgxSpinnerModule } from "ngx-spinner";

// importar rutas
///---- RUTAS
import { APP_ROUTING } from './app.routes';
////------ peticiones http
import { HttpClientModule } from '@angular/common/http' ;

// infinito Scroll
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// pipe
import { NoimagePipe } from './pipes/noimage.pipe';


//filtar cualquier tabla
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import * as locales from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';

// socket
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io'; 

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SpinnerloadingComponent } from './components/spinnerloading/spinnerloading.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule, BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
 
import { LightboxModule } from 'ngx-lightbox';
import { ProveedorComponent } from './pages/Mantenimientos/proveedor/proveedor.component';
import { PersonalComponent } from './pages/Mantenimientos/personal/personal.component';
import { DistritosComponent } from './pages/Mantenimientos/distritos/distritos.component';
import { UsuariosComponent } from './pages/Accesos/usuarios/usuarios.component';
import { AccesosComponent } from './pages/Accesos/accesos/accesos.component';
import { ListaPreciosComponent } from './pages/Mantenimientos/lista-precios/lista-precios.component';
import { AreasComponent } from './pages/Mantenimientos/areas/areas.component';
import { OrdenTrabajoComponent } from './pages/Procesos/orden-trabajo/orden-trabajo.component';
import { AprobacionOTComponent } from './pages/Procesos/aprobacion-ot/aprobacion-ot.component';
import { UbicacionPersonalComponent } from './pages/Reportes/ubicacion-personal/ubicacion-personal.component';
import { DetalleOTComponent } from './pages/Reportes/detalle-ot/detalle-ot.component';
import { FueraPlazoComponent } from './pages/Reportes/fuera-plazo/fuera-plazo.component';
import { ConfiguracionZonasComponent } from './pages/Mantenimientos/configuracion-zonas/configuracion-zonas.component';
import { UbicacionOtComponent } from './pages/Reportes/ubicacion-ot/ubicacion-ot.component';
import { TreeviewModule } from 'ngx-treeview';
import { CargoPersonalComponent } from './pages/Mantenimientos/cargo-personal/cargo-personal.component';
import { TareoComponent } from './pages/Reportes/tareo/tareo.component';
import { SolicitudResguardoComponent } from './pages/Procesos/solicitud-resguardo/solicitud-resguardo.component';
import { BandejaAsignacionComponent } from './pages/Procesos/bandeja-asignacion/bandeja-asignacion.component';
import { AprobarTareoComponent } from './pages/Procesos/aprobar-tareo/aprobar-tareo.component';
import { PoliciaComponent } from './pages/Mantenimientos/policia/policia.component';
import { PersonalPolicialComponent } from './pages/Reportes/personal-policial/personal-policial.component';
import { SolicitudInformacionPersonalComponent } from './pages/Procesos/solicitud-informacion-personal/solicitud-informacion-personal.component';
import { BandejaSolicitudInformacionPersonalComponent } from './pages/Procesos/bandeja-solicitud-informacion-personal/bandeja-solicitud-informacion-personal.component';
 

 //const config: SocketIoConfig = { url: 'http://173.248.174.62:5000', options: {} }; 
 

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    SpinnerloadingComponent,
    NoimagePipe,
    ProveedorComponent,
    PersonalComponent,
    DistritosComponent,
    UsuariosComponent,
    AccesosComponent,
    ListaPreciosComponent,
    AreasComponent,
    OrdenTrabajoComponent,
    AprobacionOTComponent,
    UbicacionPersonalComponent,
    DetalleOTComponent,
    FueraPlazoComponent,
    ConfiguracionZonasComponent,
    UbicacionOtComponent,
    CargoPersonalComponent,
    TareoComponent,
    SolicitudResguardoComponent,
    BandejaAsignacionComponent,
    AprobarTareoComponent,
    PoliciaComponent,
    PersonalPolicialComponent,
    SolicitudInformacionPersonalComponent,
    BandejaSolicitudInformacionPersonalComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTING,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    InfiniteScrollModule,
    LightboxModule,
    Ng2SearchPipeModule,
    // SocketIoModule.forRoot(config),
    TreeviewModule.forRoot(),
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  datepiekerConfig:Partial<BsDatepickerConfig>

  ///---definiendo la fecha Español global --
 constructor(private localeService: BsLocaleService){  
  this.defineLocales();
  this.localeService.use('es'); 
 }

  defineLocales() {
    for (const locale in locales) {
        defineLocale(locales[locale].abbr, locales[locale]);
    }
  }
 
 }
