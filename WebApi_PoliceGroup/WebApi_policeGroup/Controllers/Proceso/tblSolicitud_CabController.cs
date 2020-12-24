using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using Datos;
using Negocio.Procesos;
using Negocio.Resultados;

namespace WebApi_policeGroup.Controllers.Proceso
{

    [EnableCors("*", "*", "*")]

    public class tblSolicitud_CabController : ApiController
    {
        private policegroupEntities db = new policegroupEntities();

        // GET: api/tblSolicitud_Cab
        public IQueryable<tbl_Solicitud_Cab> Gettbl_Solicitud_Cab()
        {
            return db.tbl_Solicitud_Cab;
        }
                
        public object GetSolicitudes(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            Solicitudes_BL obj_negocio = new Solicitudes_BL();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    int idServicio = Convert.ToInt32(parametros[0].ToString());
                    int idSolicitante = Convert.ToInt32(parametros[1].ToString());
                    string fechaIni = parametros[2].ToString();
                    string fechaFin = parametros[3].ToString();
                    int idEstado = Convert.ToInt32(parametros[4].ToString());
                    int idUsuario = Convert.ToInt32(parametros[5].ToString());
                    int idEmpresa = Convert.ToInt32(parametros[6].ToString());

                    resul = obj_negocio.get_solicitudesCab(idServicio, idSolicitante, fechaIni, fechaFin , idEstado, idUsuario, idEmpresa);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_servicio(idUsuario);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 3)
                {
                    res.ok = true;
                    res.data = obj_negocio.get_solicitante();
                    res.totalpage = 0;

                    resul = res;

                }
                else if (opcion == 4)
                {
                    res.ok = true;
                    res.data = (from a in db.tbl_Estados                           
                                select new
                                {
                                    a.id_Estado,
                                    a.descripcion_estado
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;

                }
                else if (opcion == 5)
                {
                    res.ok = true;
                    res.data = obj_negocio.get_jefeCuadrillas();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');
                    int idsolCab = Convert.ToInt32(parametros[0].ToString());

                    tbl_Solicitud_Cab objReemplazar;
                    objReemplazar = db.tbl_Solicitud_Cab.Where(u => u.id_Solicitud_Cab == idsolCab).FirstOrDefault<tbl_Solicitud_Cab>();
                    objReemplazar.estado = 11;

                    db.Entry(objReemplazar).State = EntityState.Modified;
                    try
                    {
                        db.SaveChanges();
                        res.ok = true;
                        res.data = "OK";
                        res.totalpage = 0;
                    }
                    catch (DbUpdateConcurrencyException ex)
                    {
                        res.ok = false;
                        res.data = ex.InnerException.Message;
                        res.totalpage = 0;
                    }
                    resul = res;

                }
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|'); 
                    int idSolCab = Convert.ToInt32(parametros[0].ToString()); 
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    resul = obj_negocio.set_enviarAsignar_SolicitudCab(idSolCab,  idUsuario);
                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');
                    int idSolCab = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());
 
                    res.ok = true;
                    res.data = obj_negocio.get_efectivosPoliciales(idSolCab, idUsuario);
                    res.totalpage = 0;

                    resul = res;

                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');
                    int idServicio = Convert.ToInt32(parametros[0].ToString());
                    int idSolicitante = Convert.ToInt32(parametros[1].ToString());
                    string fechaIni = parametros[2].ToString();
                    string fechaFin = parametros[3].ToString();
                    int idEstado = Convert.ToInt32(parametros[4].ToString());
                    int idUsuario = Convert.ToInt32(parametros[5].ToString());
                    int idEmpresa = Convert.ToInt32(parametros[6].ToString());

                    resul = obj_negocio.get_descargar_SolicitudesCab(idServicio, idSolicitante, fechaIni, fechaFin, idEstado, idUsuario, idEmpresa);
                }
                //---- bandeja asignacion
               else if (opcion == 10)
                {
                    string[] parametros = filtro.Split('|');
                    int idServicio = Convert.ToInt32(parametros[0].ToString());
                    string fechaIni = parametros[1].ToString();
                    string fechaFin = parametros[2].ToString();
                    int idEstado = Convert.ToInt32(parametros[3].ToString());
                    int idUsuario = Convert.ToInt32(parametros[4].ToString());
                    int idEmpresa = Convert.ToInt32(parametros[5].ToString());

                    resul = obj_negocio.get_solicitudesCab_bandeja(idServicio, fechaIni, fechaFin, idEstado, idUsuario, idEmpresa);
                }
                else if (opcion == 11)
                {
                    string[] parametros = filtro.Split('|');
                    string fechaAtencion = parametros[0].ToString();
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_resguardoEventos(fechaAtencion, idUsuario);
                    res.totalpage = 0;

                    resul = res;
                }

                else if (opcion == 12)
                {
                    string[] parametros = filtro.Split('|');
                     int idsolCab = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_solicitudesDetalle(idsolCab);
                    res.totalpage = 0;

                    resul = res;

                }
                else if (opcion == 13)
                {
                    string[] parametros = filtro.Split('|');
                    int idSolicitud_Det = Convert.ToInt32(parametros[0].ToString()); 

                    resul = obj_negocio.set_eliminarDetalleSolicitud(idSolicitud_Det);
                }
                else if (opcion == 14)
                {
                    string[] parametros = filtro.Split('|');
                    int idSolCab = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    resul = obj_negocio.set_cerrarAsignacion_SolicitudCab(idSolCab, idUsuario);
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
        
        public object Posttbl_Solicitud_Cab(tbl_Solicitud_Cab tbl_Solicitud_Cab)
        {
            Resultado res = new Resultado();
            try
            {

                int idUsuario = Convert.ToInt32(tbl_Solicitud_Cab.usuario_creacion);

                tbl_Usuarios objUsuario = db.tbl_Usuarios.Where(p => p.id_Usuario == idUsuario).SingleOrDefault();
                                
                tbl_Solicitud_Cab.id_PersonalCoordinar = Convert.ToInt32(objUsuario.id_Personal);
                tbl_Solicitud_Cab.fechaAsignacion = DateTime.Now;
                tbl_Solicitud_Cab.fecha_creacion = DateTime.Now;
                db.tbl_Solicitud_Cab.Add(tbl_Solicitud_Cab);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_Solicitud_Cab.id_Solicitud_Cab;
                res.totalpage = 0;
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
            }
            return res;
        }

        public object Puttbl_Solicitud_Cab(int id, tbl_Solicitud_Cab tbl_Solicitud_Cab)
        {
            Resultado res = new Resultado();

            tbl_Solicitud_Cab objReemplazar;
            objReemplazar = db.tbl_Solicitud_Cab.Where(u => u.id_Solicitud_Cab == id).FirstOrDefault<tbl_Solicitud_Cab>();

            objReemplazar.fechaAtencion = tbl_Solicitud_Cab.fechaAtencion;
            objReemplazar.id_Servicios = tbl_Solicitud_Cab.id_Servicios;
            //objReemplazar.id_PersonalCoordinar = tbl_Solicitud_Cab.id_PersonalCoordinar;

            objReemplazar.asigna_JC = tbl_Solicitud_Cab.asigna_JC;
            objReemplazar.id_PersonalJefeCuadrilla = tbl_Solicitud_Cab.id_PersonalJefeCuadrilla;
            objReemplazar.cantidadEfectivos = tbl_Solicitud_Cab.cantidadEfectivos;
            objReemplazar.cantidadHoras = tbl_Solicitud_Cab.cantidadHoras;

            objReemplazar.estado = tbl_Solicitud_Cab.estado;
            objReemplazar.usuario_edicion = tbl_Solicitud_Cab.usuario_creacion;
            objReemplazar.fecha_edicion = DateTime.Now;

            db.Entry(objReemplazar).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
                res.ok = true;
                res.data = "OK";
                res.totalpage = 0;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                res.ok = false;
                res.data = ex.InnerException.Message;
                res.totalpage = 0;
            }

            return res;
        }
               

        // DELETE: api/tblSolicitud_Cab/5
        [ResponseType(typeof(tbl_Solicitud_Cab))]
        public IHttpActionResult Deletetbl_Solicitud_Cab(int id)
        {
            tbl_Solicitud_Cab tbl_Solicitud_Cab = db.tbl_Solicitud_Cab.Find(id);
            if (tbl_Solicitud_Cab == null)
            {
                return NotFound();
            }

            db.tbl_Solicitud_Cab.Remove(tbl_Solicitud_Cab);
            db.SaveChanges();

            return Ok(tbl_Solicitud_Cab);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Solicitud_CabExists(int id)
        {
            return db.tbl_Solicitud_Cab.Count(e => e.id_Solicitud_Cab == id) > 0;
        }
    }
}