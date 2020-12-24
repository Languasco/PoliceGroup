using Datos;
using Negocio.Procesos;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApi_policeGroup.Controllers.Proceso
{
    [EnableCors("*", "*", "*")]
    public class OrdenTrabajoController : ApiController
    {
        private policegroupEntities db = new policegroupEntities();
        public object GetOrdenTrabajo(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            OrdenTrabajo_BL obj_negocio = new OrdenTrabajo_BL();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    int idServicio = Convert.ToInt32(parametros[0].ToString());
                    int idTipoOT = Convert.ToInt32(parametros[1].ToString());
                    int idDistrito = Convert.ToInt32(parametros[2].ToString());

                    int idProveedor = Convert.ToInt32(parametros[3].ToString());
                    int idEstado = Convert.ToInt32(parametros[4].ToString());
                    int idUsuario = Convert.ToInt32(parametros[5].ToString());

                    resul = obj_negocio.get_ordenTrabajoCab(idServicio, idTipoOT, idDistrito, idProveedor, idEstado, idUsuario);

                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_servicioUsuario(idUsuario);
                    res.totalpage = 0;
                    resul = res; 
                }
                else if (opcion == 3)
                {
                    //var IDestados = new string[] { "5","6" };                
                    res.ok = true;
                    res.data = (from a in db.tbl_Estados
                                    //where IDestados.Contains(a.id_Estado.ToString())
                                where a.tipoproceso_estado == "OTW"
                                select new
                                {
                                    a.id_Estado,
                                    a.descripcion_estado
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    string codigosOT =  parametros[0].ToString();
                    string opcionModal = parametros[1].ToString();
                    int empresa1 = Convert.ToInt32(parametros[2].ToString());
                    int jefeCuadrilla1 = Convert.ToInt32(parametros[3].ToString());

                    int empresa2 = Convert.ToInt32(parametros[4].ToString());
                    int jefeCuadrilla2 = Convert.ToInt32(parametros[5].ToString());
                    string observaciones = parametros[6].ToString();
                    string fechaAsigna = parametros[7].ToString();
                    int idUsuario = Convert.ToInt32(parametros[8].ToString());

                    res.ok = true;
                    res.data = obj_negocio.set_grabar_asignarReasignar_Ot(codigosOT, fechaAsigna, opcionModal, empresa1, jefeCuadrilla1, empresa2, jefeCuadrilla2, observaciones, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 5)
                {
                    res.ok = true;
                    res.data = (from a in db.tbl_Usuarios
                                where a.id_Perfil == 3  && a.estado ==1
                                select new
                                {
                                    a.id_Usuario,
                                    nombreUsuario = a.apellidos_usuario + " " + a.nombres_usuario
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');
                    int idEmpresa = Convert.ToInt32(parametros[0].ToString());
                    int idJefeCuadrilla = Convert.ToInt32(parametros[1].ToString());
                    string opcionModal = parametros[2].ToString();
                    int idUsuario = Convert.ToInt32(parametros[3].ToString());
                    
                    res.ok = true;
                    res.data = obj_negocio.get_calculos_asignarReasignar_Ot(idEmpresa,idJefeCuadrilla, opcionModal, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');
                    int idServicio = Convert.ToInt32(parametros[0].ToString());
                    int idTipoOT = Convert.ToInt32(parametros[1].ToString());
                    int idDistrito = Convert.ToInt32(parametros[2].ToString());

                    int idProveedor = Convert.ToInt32(parametros[3].ToString());
                    int idEstado = Convert.ToInt32(parametros[4].ToString());
                    int idUsuario = Convert.ToInt32(parametros[5].ToString());

                    resul = obj_negocio.get_resumen_OrdenTrabajoCab(idServicio, idTipoOT, idDistrito, idProveedor, idEstado, idUsuario);

                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');
                    string codigosOT = parametros[0].ToString();
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    res.ok = true;
                    res.data = obj_negocio.set_enviarOT_jefeCuadrilla(codigosOT, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 9) ////--- generando la descarga del excel de la grilla---
                {
                    string[] parametros = filtro.Split('|');
                    int idServicio = Convert.ToInt32(parametros[0].ToString());
                    int idTipoOT = Convert.ToInt32(parametros[1].ToString());
                    int idDistrito = Convert.ToInt32(parametros[2].ToString());

                    int idProveedor = Convert.ToInt32(parametros[3].ToString());
                    int idEstado = Convert.ToInt32(parametros[4].ToString());
                    int idUsuario = Convert.ToInt32(parametros[5].ToString());

                    resul = obj_negocio.get_descargar_ordenTrabajoCab(idServicio, idTipoOT, idDistrito, idProveedor, idEstado, idUsuario);

                }
                else if (opcion == 10)
                {
                    string[] parametros = filtro.Split('|');
                    int idEmpresa = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_jefeCuadrilla_Empresa(idEmpresa, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 11)
                {
                    string[] parametros = filtro.Split('|');
                    int idServicio = Convert.ToInt32(parametros[0].ToString());
                    int idTipoOT = Convert.ToInt32(parametros[1].ToString());
                    int idDistrito = Convert.ToInt32(parametros[2].ToString());

                    int idProveedor = Convert.ToInt32(parametros[3].ToString());
                    int idEstado = Convert.ToInt32(parametros[4].ToString());
                    int idUsuario = Convert.ToInt32(parametros[5].ToString());

                    resul = obj_negocio.get_ordenTrabajoCab_mapa(idServicio, idTipoOT, idDistrito, idProveedor, idEstado, idUsuario);
                }
                else if (opcion == 12)
                {
                    string[] parametros = filtro.Split('|');
                    string codigosOT = parametros[0].ToString();
                    int idEmpresa = Convert.ToInt32(parametros[1].ToString());
                    int idCuadrilla = Convert.ToInt32(parametros[2].ToString());
                    int idEstado = Convert.ToInt32(parametros[3].ToString());
                    int idUsuario = Convert.ToInt32(parametros[4].ToString());

                    res.ok = true;
                    res.data = obj_negocio.set_asignarReasignarOT_mapa(codigosOT, idEmpresa, idCuadrilla, idEstado,  idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 13)
                {
                    string[] parametros = filtro.Split('|');
                    int idServicio = Convert.ToInt32(parametros[0].ToString());
                    int idTipoOT = Convert.ToInt32(parametros[1].ToString());
                    int idDistrito = Convert.ToInt32(parametros[2].ToString());

                    int idProveedor = Convert.ToInt32(parametros[3].ToString());
                    int idEstado = Convert.ToInt32(parametros[4].ToString());
                    int idUsuario = Convert.ToInt32(parametros[5].ToString());

                    resul = obj_negocio.get_detalleOrdenTrabajoCab_mapa(idServicio, idTipoOT, idDistrito, idProveedor, idEstado, idUsuario);
                }
                else if (opcion == 14)
                {
                    string[] parametros = filtro.Split('|');
                    int idServicio = Convert.ToInt32(parametros[0].ToString());
                    int idTipoOT = Convert.ToInt32(parametros[1].ToString());
                    int idDistrito = Convert.ToInt32(parametros[2].ToString());

                    int idProveedor = Convert.ToInt32(parametros[3].ToString());
                    int idEstado = Convert.ToInt32(parametros[4].ToString());
                    int idUsuario = Convert.ToInt32(parametros[5].ToString());


                    res.ok = true;
                    res.data = obj_negocio.set_asignacionAutomatica(idServicio, idTipoOT, idDistrito, idProveedor, idEstado, idUsuario);
                    res.totalpage = 0;
                    resul = res;

                }
                else if (opcion == 15)
                {
                    string[] parametros = filtro.Split('|');
                    int idServicio = Convert.ToInt32(parametros[0].ToString());
                    int idTipoOT = Convert.ToInt32(parametros[1].ToString());
                    int idDistrito = Convert.ToInt32(parametros[2].ToString());

                    int idProveedor = Convert.ToInt32(parametros[3].ToString());
                    int idEstado = Convert.ToInt32(parametros[4].ToString());
                    int idUsuario = Convert.ToInt32(parametros[5].ToString());

                    //resul = obj_negocio.get_ordenTrabajoCab(idServicio, idTipoOT, idDistrito, idProveedor, idEstado, idUsuario);

                    resul = obj_negocio.get_descargar_OT(idServicio, idTipoOT, idDistrito, idProveedor, idEstado, idUsuario);
                }
                else
                {
                    res.ok = false;
                    res.data = "Opcion seleccionada invalida";
                    res.totalpage = 0;

                    resul = res;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
                resul = res;
            }
            return resul;
        }

    }
}
