
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import { combineLatest } from 'rxjs';
import Swal from 'sweetalert2';
import { InputFileI } from '../../../models/inputFile.models';
import { UploadService } from '../../../services/Upload/upload.service';
import { UsuariosService } from '../../../services/Mantenimientos/usuarios.service';

declare var $:any;
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})

export class UsuariosComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsFile: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false
  estados :any[]=[];
  empresas :any[]=[];
  
  areas :any[]=[];
  perfiles :any[]=[];
  usuarios :any[]=[];
  filesExcel:InputFileI[] = [];
 
  filtrarMantenimiento = "";
  areasSeleccionadas :any[]=[];
  empresasMasivas :any[]=[];
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService, private funcionesglobalesService : FuncionesglobalesService, private usuariosService : UsuariosService, private uploadService : UploadService) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.getCargarCombos();
   this.inicializarFormularioFiltro();
   this.inicializarFormulario();
 
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idEmpresa : new FormControl('0'),
      idArea : new FormControl('0'),
      idEstado : new FormControl('1')
     }) 
 }

 inicializarFormulario(){ 
    this.formParams= new FormGroup({

      id_Usuario: new FormControl('0'), 
      nrodoc_usuario: new FormControl(''),
      apellidos_usuario: new FormControl(''),
      nombres_usuario: new FormControl(''),    
      id_personal: new FormControl('0'),   

      id_area: new FormControl(false), 
      id_EmpresaUsuario: new FormControl('0'), 
      empresa_usuario: new FormControl(''),

      email_usuario: new FormControl(''),
      id_TipoUsuario: new FormControl('1'),
      id_Perfil: new FormControl('0'), 

      //fotourl: new FormControl(''), 
      login_usuario: new FormControl(''), 
      contrasenia_usuario: new FormControl(''), 

      estado : new FormControl('1'),   
      usuario_creacion : new FormControl('')
    }) 
 }

 getCargarCombos(){ 
    this.spinner.show();
    combineLatest([ this.usuariosService.get_estados(), this.usuariosService.get_empresas(), this.usuariosService.get_area(), this.usuariosService.get_perfil(), this.usuariosService.get_empresasMasivas() ]).subscribe( ([_estados, _empresas, _areas , _perfiles, _empresasMasivas ])=>{
      this.estados = _estados;
      this.empresas = _empresas;
      this.areas = _areas;
      this.perfiles = _perfiles;
      this.empresasMasivas = _empresasMasivas;
      this.spinner.hide(); 
    })

 }

 mostrarInformacion(){
       if (this.formParamsFiltro.value.idEmpresa == '' || this.formParamsFiltro.value.idEmpresa == 0) {
        this.alertasService.Swal_alert('error','Por favor seleccione la empresa');
        return 
      }  
      // if (this.formParamsFiltro.value.idArea == '' || this.formParamsFiltro.value.idArea == 0) {
      //   this.alertasService.Swal_alert('error','Por favor seleccione una Area');
      //   return 
      // }
      if (this.formParamsFiltro.value.idEstado == '' || this.formParamsFiltro.value.idEstado == 0) {
        this.alertasService.Swal_alert('error','Por favor seleccione un estado');
        return 
      }
  
      this.spinner.show();
      this.usuariosService.get_mostrarUsuario_general(this.formParamsFiltro.value.idEmpresa,this.formParamsFiltro.value.idArea, this.formParamsFiltro.value.idEstado)
          .subscribe((res:RespuestaServer)=>{            
              this.spinner.hide();
              if (res.ok==true) {        
                  this.usuarios = res.data; 
              }else{
                this.alertasService.Swal_alert('error', JSON.stringify(res.data));
                alert(JSON.stringify(res.data));
              }
      })
 }   
  
 cerrarModal(){
    setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('hide');  
    },0); 
 }

 nuevo(){
    this.flag_modoEdicion = false;

    setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('show');
      $('#txtBuscarDoc').removeClass('disabledForm');
      $('#btnBuscarDoc').removeClass('disabledForm');
    },0);
    this.inicializarFormulario();    
    this.desmarcarChek();
 }

 desmarcarChek(){
  for (const empresa of this.empresasMasivas) {
    empresa.checkeado = false;
  } 
 }

 

 async get_consultarDocumento(){ 
      
  if (this.formParams.value.nrodoc_usuario == '' || this.formParams.value.nrodoc_usuario == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el numero de documento');
    return 
  }

  const  dniPersonal  = await this.usuariosService.get_verificar_DniPersonal(this.formParams.value.nrodoc_usuario);
  if (dniPersonal==false) {
   Swal.close();
   this.alertasService.Swal_alert('error','El nro de documento no esta Registrado en Mant-Personal, verifique..');
   this.formParams.patchValue({ "id_EmpresaUsuario" : '' , "empresa_usuario" : ''  ,  "nombres_usuario" : '' , "apellidos_usuario" : '' });
   return;
  } 

  const  dniUsuario  = await this.usuariosService.get_verificar_DniUsuario(this.formParams.value.nrodoc_usuario);
  if (dniUsuario) {
   Swal.close();
   this.alertasService.Swal_alert('error','El nro de documento ya se encuentra registrada, verifique..');
   this.formParams.patchValue({ "id_EmpresaUsuario" : '' , "empresa_usuario" : ''  , "nombres_usuario" : '' , "apellidos_usuario" : '' });
   return;
  }  

  let  datausuario:any = await this.usuariosService.get_obtenerDatos_documento(this.formParams.value.nrodoc_usuario);

  this.formParams.patchValue({ "id_personal" : datausuario.data[0].id_Personal , 
                               "id_EmpresaUsuario" : datausuario.data[0].id_Empresa , 
                               "empresa_usuario" : datausuario.data[0].razonSocial_Empresa,
                               "nombres_usuario" : datausuario.data[0].nombres_Personal,
                               "apellidos_usuario" : datausuario.data[0].apellidos_Personal
                            }); 
 }

 async saveUpdate(){
  if ( this.flag_modoEdicion==true) { //// nuevo
     if (this.formParams.value.id_Usuario == '' || this.formParams.value.id_Usuario == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id usuario, por favor actulize su página');
       return 
     }   
  }

  if (this.formParams.value.nrodoc_usuario == '' || this.formParams.value.nrodoc_usuario == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el numero de documento');
    return 
  }

  if (this.formParams.value.id_EmpresaUsuario == '' || this.formParams.value.id_EmpresaUsuario == 0) {
     this.alertasService.Swal_alert('error','Ingrese el nro documento y luego presione el boton Buscar ');
     return 
  }  

  if (this.formParams.value.login_usuario == '' || this.formParams.value.login_usuario == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese Login');
    return 
  }

  if (this.formParams.value.contrasenia_usuario == '' || this.formParams.value.contrasenia_usuario == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese la constraseña');
    return 
  }

  if (this.formParams.value.id_Perfil == '' || this.formParams.value.id_Perfil == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione un perfil');
    return 
  } 
 
  this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });

  
  const grabarActualizar_empresasMasivas= ()=>{
    const empresasMarcadas =  this.funcionesglobalesService.obtenerCheck_IdPrincipal(this.empresasMasivas, 'id_Empresa');
    this.usuariosService.set_grabarEmpresasMasivo_usuario(this.formParams.value.id_Usuario , empresasMarcadas.join() , this.idUserGlobal  ).subscribe((res:RespuestaServer)=>{
     if (res.ok ==true) {     
        console.log('grabado la empresa correctamente')
     }else{
      this.alertasService.Swal_alert('error', JSON.stringify(res.data));
      alert(JSON.stringify(res.data));
     }
   })
  }


  if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();

     const  dniUsuario  = await this.usuariosService.get_verificar_DniUsuario(this.formParams.value.nrodoc_usuario);
     if (dniUsuario) {
      Swal.close();
      this.alertasService.Swal_alert('error','El nro de documento ya se encuentra registrada, verifique..');
      this.formParams.patchValue({ "id_EmpresaUsuario" : '' , "empresa_usuario" : ''  , "nombres_usuario" : '' , "apellidos_usuario" : '' });
      return;
     } 
     
     const  loginUsuario  = await this.usuariosService.get_verificar_logginUsuario(this.formParams.value.login_usuario);
     if (loginUsuario) {
      Swal.close();
      this.alertasService.Swal_alert('error','El login ingresado esta registrada, cambialo por favor..');
      return;
     }

     this.usuariosService.set_saveUsuarios(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_Usuario" : Number(res.data) });
         grabarActualizar_empresasMasivas();
         this.mostrarInformacion();
         this.alertasService.Swal_Success('Se agrego correctamente..');
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.usuariosService.set_editUsuario(this.formParams.value , this.formParams.value.id_Usuario).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) {   

        $('#txtBuscarDoc').addClass('disabledForm');
        $('#btnBuscarDoc').addClass('disabledForm');
         
         const perfilSeleccionada  = $('#cbo_cargo option:selected').text();

         grabarActualizar_empresasMasivas();

         for (const obj of this.usuarios) {
           if (obj.id_Usuario == this.formParams.value.id_Usuario ) {
              obj.nrodoc_usuario= this.formParams.value.nrodoc_usuario ;
              obj.apellidos_usuario = this.formParams.value.apellidos_usuario ; ;
              obj.nombres_usuario= this.formParams.value.nombres_usuario ;            
              obj.id_empresa= this.formParams.value.id_EmpresaUsuario ;
              obj.empresa_usuario= this.formParams.value.empresa_usuario ;
              obj.email_usuario= this.formParams.value.email_usuario ;            
              obj.id_Perfil= this.formParams.value.id_Perfil ;
              obj.descripcion_perfil = perfilSeleccionada ;              
              obj.login_usuario= this.formParams.value.login_usuario ;
              obj.contrasenia_usuario= this.formParams.value.contrasenia_usuario ;        
              obj.estado= this.formParams.value.estado ;
              obj.descripcion_estado = this.formParams.value.estado == 0 ? "INACTIVO" : "ACTIVO";  
              break;
           }
         }

         this.alertasService.Swal_Success('Se actualizó correctamente..');  
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
   }

 } 

 editar({ id_Usuario, nrodoc_usuario,id_empresa, empresa_usuario, apellidos_usuario, nombres_usuario, email_usuario, id_Perfil,  login_usuario, contrasenia_usuario, estado }){
   this.flag_modoEdicion=true;
   setTimeout(()=>{ // 
    $('#modal_mantenimiento').modal('show');    
    $('#txtBuscarDoc').addClass('disabledForm');
    $('#btnBuscarDoc').addClass('disabledForm');
  },0);

   this.formParams.patchValue({ "id_Usuario" : id_Usuario, "id_EmpresaUsuario" :  id_empresa ,"empresa_usuario" :  empresa_usuario  , "nrodoc_usuario" : nrodoc_usuario ,"apellidos_usuario" : apellidos_usuario,"nombres_usuario" : nombres_usuario,"email_usuario" : email_usuario, "id_Perfil" : id_Perfil , "login_usuario" : login_usuario, "contrasenia_usuario" : contrasenia_usuario, "estado" : estado, "usuario_creacion" : this.idUserGlobal }
   );
     
  this.desmarcarChek();

  this.usuariosService.get_empresasCheckeadoMasivo_usuario(this.formParams.value.id_Usuario).subscribe((res:RespuestaServer)=>{
   if (res.ok ==true) {     

      for (let index = 0; index < res.data.length; index++) { 
        for (const empresa of this.empresasMasivas) {
         if (empresa.id_Empresa == res.data[index].id_Empresa  ) {
            empresa.checkeado = true;
            break;
         }
        }        
      }
   }else{
    this.alertasService.Swal_alert('error', JSON.stringify(res.data));
    alert(JSON.stringify(res.data));
   }
  })



 } 

 anular(objBD:any){

   if (objBD.estado ===0 || objBD.estado =='0') {      
     return;      
   }

   this.alertasService.Swal_Question('Sistemas', 'Esta seguro de anular ?')
   .then((result)=>{
     if(result.value){

       Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
       Swal.showLoading();
       this.usuariosService.set_anularUsuario(objBD.id_Usuario).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.usuarios) {
             if (user.id_Usuario == objBD.id_Usuario ) {
                 user.estado = 0;
                 user.descripcion_estado =  "INACTIVO" ;
                 break;
             }
           }
           this.alertasService.Swal_Success('Se anulo correctamente..')  

         }else{
           this.alertasService.Swal_alert('error', JSON.stringify(res.data));
           alert(JSON.stringify(res.data));
         }
       })
        
     }
   }) 

 }

 generarCodigoQR(){ 

  if(this.formParams.value.id_Usuario == 0 || this.formParams.value.id_Usuario == '' ){
    this.alertasService.Swal_alert('error','Primero guarde el usuario');
    return;
  }

  this.alertasService.Swal_Question('Sistemas', 'Esta seguro de Generar Codigo QR ?')
  .then((result)=>{
    if(result.value){

      Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
      Swal.showLoading();
      this.usuariosService.generararDescargar_codigoQr(this.formParams.value.id_Usuario).subscribe((res:RespuestaServer)=>{
        Swal.close();      
 
        if (res.ok ==true) {          
          window.open(String(res.data), '_blank')
         }else{
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }
      })
       
    }
  }) 

 }


}