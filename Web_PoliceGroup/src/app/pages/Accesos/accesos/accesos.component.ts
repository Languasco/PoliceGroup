
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'; 
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service'; 
import Swal from 'sweetalert2';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { UsuariosService } from '../../../services/Mantenimientos/usuarios.service';

declare var $:any;
@Component({
  selector: 'app-accesos',
  templateUrl: './accesos.component.html',
  styleUrls: ['./accesos.component.css']
})
 


export class AccesosComponent implements OnInit {
 
  formParams : FormGroup; 
  usuarios:any [] =  []; 
  idUserGlobal : number = 0;
  showDetalle = false;
  flagModo_Edicion = false;
  filtrarUsuario :string = "";
  filtrarPerfiles :string = "";

  estados :any [] =  []; 
  perfiles :any [] =  []; 
  flag_modoEdicion=false;
 
  accesosMenu: TreeviewItem[]; 
  config = TreeviewConfig.create({
     hasAllCheckBox: false,
     hasFilter: true,
     hasCollapseExpand: false,
     decoupleChildFromParent: false 
  }); 

  idCheckMenu :any[] = []; 
  idCheckUsuario :any[] = []; 
  eventosGenerales :any[] = []; 
  idusuarioElegido =0;
  idPerfilElegido =0;

  checkusuarioElegido =false;
  checkPerfilElegido =false;

  datosusuarioElegido ='';
  acumuladorAccesos = 600;
  acumuladorPerfiles = 1000;

  tabControlDetalle: string[] = ['USUARIOS','PERFILES' ]; 
  selectedTabControlDetalle :any;
  modalElegido ='';

  
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,
              private usuarioService : UsuariosService , private funcionesglobalesService : FuncionesglobalesService) {            
    this.idUserGlobal = this.loginService.get_idUsuario();
  }  
 
  ngOnInit(): void {
    this.selectedTabControlDetalle = this.tabControlDetalle[0];
   this.inicializarFormulario();
   //----carga basica ----
   const menu = { text: 'SISTEMA POLICE GROUP', value: -1, children: []}
   this.accesosMenu = this.getAccesos(menu);  
  //  //---- menu real
     this.mostrarAccesosMenu();
  }

  inicializarFormulario(){ 
    this.formParams= new FormGroup({
      id_Usuario : new FormControl('0'),   
      nrodoc_usuario : new FormControl(''),   
      apellidos_usuario : new FormControl(''),   
      nombres_usuario : new FormControl(''),    
      email_usuario :new FormControl('', [ Validators.required,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]) ,
      id_Perfil : new FormControl('0'),   
      fotourl : new FormControl(''),   
      login_usuario : new FormControl(''),   
      contrasenia_usuario : new FormControl(''),   
      estado : new FormControl('-1'),   
      usuario_creacion : new FormControl('')
    }) 
  } 

  mostrarUsuarios(){
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      allowEscapeKey: false,
      text: 'Cargando los usuarios..'
    })
    Swal.showLoading();

    this.usuarioService.get_mostrarUsuarios_generalAccesos()
        .subscribe((res:RespuestaServer)=>{               
          Swal.close()
          if (res.ok==true) {         
              this.usuarios = res.data;
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
    })
  } 

  mostrarPerfiles(){
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false,text: 'Cargando los perfiles..'
    })
    Swal.showLoading();

    this.usuarioService.get_mostrarPerfiles_generalAccesos()
        .subscribe((res:RespuestaServer)=>{               
          Swal.close()
          if (res.ok==true) {         
              this.perfiles = res.data;
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
    })
  } 



  onFilterChange(value: string) {
    console.log('filter:', value);
  }

  onSelectedChange(value: any) {
    this.idCheckMenu = value;
    if (this.idCheckMenu.length ==0 ||  value == -1) {
      this.desmarkarCheckUsuario();
      this.desmarkarCheckPerfil();
      return ;
    }    
    this.permisoOtorgadoMenu_usuario(this.idCheckMenu);
    this.permisoOtorgadoMenu_perfil(this.idCheckMenu);
  }
  
  mostrarAccesosMenu(){
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      allowEscapeKey: false,
      text: 'Cargando los módulos del sistema ..'
    })
    Swal.showLoading();

    this.usuarioService.get_accesosMenu()
        .subscribe((res:RespuestaServer)=>{               
          Swal.close()
          if (res.ok==true) {                 
            const accesosMenu = res.data;       
            var childsformateado =  accesosMenu['children'].map((menu) => {              
              var childrens:any= [];
              for (const iterator of menu.children) {
                const child= { checked: iterator.Checked, text: iterator.text,  value: iterator.value }        
                childrens.push(child)
              }
              const childsformateado = { text: menu.text, value: menu.value, children: childrens }

              return childsformateado
            });

            const accesos: any= {
              text: accesosMenu['text'],
              value: accesosMenu['value'],
              children : childsformateado            
            }     
            
            ///------- pintandolo en el treeView ----
            this.accesosMenu = this.getAccesos(accesos);     
            
            /// cargando la informacion de los usuarios ----
             this.mostrarUsuarios();
             this.mostrarPerfiles();
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
    })
  } 

  getAccesos(acceso:any){
    const itMenus = new TreeviewItem( acceso );
    return [itMenus];  
  }

  permisoOtorgadoMenu_usuario(idCheckMenu:any){
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      allowEscapeKey: false,
      text: 'Obteniendo permisos'
    })
    Swal.showLoading();

    this.usuarioService.get_permisosUsuarioAcceso(idCheckMenu.join())
        .subscribe((res:RespuestaServer)=>{               
          Swal.close()
          if (res.ok==true) {     
            this.desmarkarCheckUsuario(); 
            this.markarCheckUsuario(res.data);   
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
    })
  } 


  permisoOtorgadoMenu_perfil(idCheckMenu:any){
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      allowEscapeKey: false,
      text: 'Obteniendo permisos'
    })
    Swal.showLoading();

    this.usuarioService.get_permisosPerfilAcceso(idCheckMenu.join())
        .subscribe((res:RespuestaServer)=>{               
          Swal.close()
          if (res.ok==true) {     
            this.desmarkarCheckPerfil(); 
            this.markarCheckPerfil(res.data);   
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
    })
  } 

  
  desmarkarCheckUsuario(){
    for (const iterator of this.usuarios) {
      iterator.checkeado =false;
    }
  }

  desmarkarCheckPerfil(){
    for (const iterator of this.perfiles) {
      iterator.checkeando =false;
    }
  }

  markarCheckUsuario(idUsuariosPermiso:any){
    for (let index = 0; index < idUsuariosPermiso.length; index++) {
      for (const iterator of this.usuarios) {
        if (iterator.id_Usuario == idUsuariosPermiso[index].id_Usuario) { 
          iterator.checkeado =true;
          break;
        }
      }      
    } 
  }

  markarCheckPerfil(idPerfilesPermiso:any){
    for (let index = 0; index < idPerfilesPermiso.length; index++) {
      for (const iterator of this.perfiles) {
        if (iterator.id_perfil == idPerfilesPermiso[index].id_perfil) { 
          iterator.checkeando =true;
          break;
        }
      }      
    } 
  }


  abrirModal_permisos(objData, tab:string){

    if (this.idCheckMenu.length ==0) {
      this.alertasService.Swal_alert('error', 'Por favor seleccione un módulo , para poder asignarlo al usuario');
      return ;
    }

    this.modalElegido = tab;

    if ( this.modalElegido === 'usuarios') {

      this.checkusuarioElegido = objData.checkeado;
      this.idusuarioElegido = objData.id_Usuario;
      this.datosusuarioElegido =  'Usuario : '  + objData.apellidos_usuario  ;   

      this.mostrarEventosMarcadosUsuario();
    }
    if ( this.modalElegido === 'perfiles') {

      this.checkPerfilElegido = objData.checkeando;
      this.idPerfilElegido = objData.id_perfil;
      this.datosusuarioElegido =  'Perfil : '  + objData.descripcion_perfil  ;   

      this.mostrarEventosMarcadosPerfil();
    }


  }

  mostrarEventosMarcadosUsuario(){
    Swal.fire({ icon: 'info', allowOutsideClick: false, allowEscapeKey: false,text: 'Cargando eventos espere por favor'
    })
    Swal.showLoading();

    this.usuarioService.get_eventosUsuarioMarcados(this.idCheckMenu.join(), this.idusuarioElegido)
        .subscribe((res:RespuestaServer)=>{               
          Swal.close()
          if (res.ok==true) {         
              this.eventosGenerales = res.data;
              $('#modal_eventos').modal('show');
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
    })
  } 

  mostrarEventosMarcadosPerfil(){
    Swal.fire({ icon: 'info', allowOutsideClick: false, allowEscapeKey: false,text: 'Cargando eventos espere por favor'
    })
    Swal.showLoading();

    this.usuarioService.get_eventosPerfilMarcados(this.idCheckMenu.join(), this.idPerfilElegido)
        .subscribe((res:RespuestaServer)=>{               
          Swal.close()
          if (res.ok==true) {         
              this.eventosGenerales = res.data;
              $('#modal_eventos').modal('show');
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
    })
  } 


  grabarEventosUsuario(){
    if (this.idCheckMenu.length ==0) {
      return ;
    } 

    var flagMarcado =false;
    for (const obj of this.eventosGenerales) {
      if (obj.marcado) {
        flagMarcado = true;
        break
      }
    }
    if (flagMarcado ==false) {
      this.alertasService.Swal_alert('error','Por favor debe marcar al menos un Evento');
      return  ;
    } 
    const eventosElegidos = this.funcionesglobalesService.obtenerCheck_IdPrincipal_new(this.eventosGenerales, 'id_Evento');
    const idPrincipal =  ( this.modalElegido === 'usuarios') ? this.idusuarioElegido :      this.idPerfilElegido;
 
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      allowEscapeKey: false,
      text: 'Espere por favor'
    })
    Swal.showLoading();

    this.usuarioService.set_grabarEventos(this.idCheckMenu.join(),eventosElegidos.join(), idPrincipal, this.modalElegido)
        .subscribe((res:RespuestaServer)=>{               
          Swal.close()
          if (res.ok==true) {         
            this.alertasService.Swal_Success("Proceso realizado correctamente..")
            /// cargando la informacion de los usuarios ----

            if (this.checkusuarioElegido == false) {
              this.permisoOtorgadoMenu_usuario(this.idCheckMenu);
            }
            $('#modal_eventos').modal('hide');    
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
    })
  }
   
  obtnerIdEventosCheckeado(){
    var listRegistros = [];    
     for (let obj of this.eventosGenerales) {
      listRegistros.push(obj.id_OT);
     }
    return listRegistros;
  }
 




}