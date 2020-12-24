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
    public class tblIbp_CabController : ApiController
    {
        private policegroupEntities db = new policegroupEntities();

        // GET: api/tblIbp_Cab
        public IQueryable<tbl_Ibp_Cab> Gettbl_Ibp_Cab()
        {
            return db.tbl_Ibp_Cab;
        }


        public object Gettbl_Ibp_Cab(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            SolicitudInformacionPersonal_BL obj_negocio = new SolicitudInformacionPersonal_BL();

            object resul = null;
            try
            {
                if (opcion == 1)
                {

                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_empresaUsuario(idUsuario);
                    res.totalpage = 0;
                    resul = res;                
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int idEmpresa = Convert.ToInt32(parametros[0].ToString());
                    int idEstado = Convert.ToInt32(parametros[1].ToString());
                    int idUsuario = Convert.ToInt32(parametros[2].ToString());

                    resul = obj_negocio.get_solicitudesInformacionPersonal(idEmpresa, idEstado, idUsuario);

                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Ibp_Cab = Convert.ToInt32(parametros[0].ToString());

                    tbl_Ibp_Cab objReemplazar;
                    objReemplazar = db.tbl_Ibp_Cab.Where(u => u.id_Ibp_Cab == id_Ibp_Cab).FirstOrDefault<tbl_Ibp_Cab>();
                    objReemplazar.estado = 16;

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
                else if (opcion == 4)
                {

                    string[] parametros = filtro.Split('|');
                    int idEmpresa = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());
                    string tipoProceso = parametros[2].ToString();

                    res.ok = true;
                    res.data = obj_negocio.get_cantidadSolicitud_empresa(idEmpresa, idUsuario, tipoProceso);
                    res.totalpage = 0;
                    resul = res;
                }  
                ///-----BANDEJA DE ATENCION
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');
                    int idEmpresa = Convert.ToInt32(parametros[0].ToString());
                    int idEstado = Convert.ToInt32(parametros[1].ToString());
                    int idUsuario = Convert.ToInt32(parametros[2].ToString());

                    resul = obj_negocio.get_bandejeaSolicitudesInformacionPersonal(idEmpresa, idEstado, idUsuario);

                }
                else if (opcion == 6)
                {

                    string[] parametros = filtro.Split('|');
                    int id_Ibp_Cab = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_solicitudesInformacionDet(id_Ibp_Cab);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 7)
                {

                    string[] parametros = filtro.Split('|');
                    int id_Ibp_Cab = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_solicitudesInformacionDet_archivoAdjuntado(id_Ibp_Cab);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Ibp_det = Convert.ToInt32(parametros[0].ToString());

                    resul = obj_negocio.set_eliminar_documentosSolicitudInformacionDet(id_Ibp_det);
                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Ibp_Cab = Convert.ToInt32(parametros[0].ToString());
                    int idusuario = Convert.ToInt32(parametros[1].ToString());

                    resul = obj_negocio.set_terminar_solicitudInformacion_cab(id_Ibp_Cab, idusuario);
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
        
        public object Posttbl_Ibp_Cab(tbl_Ibp_Cab tbl_Ibp_Cab)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Ibp_Cab.fechaSolicitud = DateTime.Now;
                tbl_Ibp_Cab.fecha_creacion = DateTime.Now;
                db.tbl_Ibp_Cab.Add(tbl_Ibp_Cab);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_Ibp_Cab.id_Ibp_Cab;
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

        public object Puttbl_Ibp_Cab(int id, tbl_Ibp_Cab tbl_Ibp_Cab)
        {
            Resultado res = new Resultado();

            tbl_Ibp_Cab objReemplazar;
            objReemplazar = db.tbl_Ibp_Cab.Where(u => u.id_Ibp_Cab == id).FirstOrDefault<tbl_Ibp_Cab>();
 
            objReemplazar.nro_Documento = tbl_Ibp_Cab.nro_Documento;
            objReemplazar.apellidos_Peronal = tbl_Ibp_Cab.apellidos_Peronal;
            objReemplazar.nombre_personal = tbl_Ibp_Cab.nombre_personal; 

            objReemplazar.estado = tbl_Ibp_Cab.estado;
            objReemplazar.usuario_edicion = tbl_Ibp_Cab.usuario_creacion;
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



        // DELETE: api/tblIbp_Cab/5
        [ResponseType(typeof(tbl_Ibp_Cab))]
        public IHttpActionResult Deletetbl_Ibp_Cab(int id)
        {
            tbl_Ibp_Cab tbl_Ibp_Cab = db.tbl_Ibp_Cab.Find(id);
            if (tbl_Ibp_Cab == null)
            {
                return NotFound();
            }

            db.tbl_Ibp_Cab.Remove(tbl_Ibp_Cab);
            db.SaveChanges();

            return Ok(tbl_Ibp_Cab);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Ibp_CabExists(int id)
        {
            return db.tbl_Ibp_Cab.Count(e => e.id_Ibp_Cab == id) > 0;
        }
    }
}