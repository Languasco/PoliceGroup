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
using Negocio.Resultados;

namespace WebApi_policeGroup.Controllers.Mantenimiento
{
    [EnableCors("*", "*", "*")]
    public class tblServiciosController : ApiController
    {
        private policegroupEntities db = new policegroupEntities();

        // GET: api/tblServicios
        public IQueryable<tbl_Servicios> Gettbl_Servicios()
        {
            return db.tbl_Servicios;
        }

        public object Gettbl_Servicios(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    int idEstado = Convert.ToInt32(parametros[0].ToString());
                    int idEmpresa = Convert.ToInt32(parametros[1].ToString());

                    if (idEmpresa == 0)
                    {
                        res.ok = true;
                        res.data = (from a in db.tbl_Servicios
                                    where a.estado == idEstado
                                    select new
                                    {
                                        a.id_Servicios,
                                        a.nombreServicio,
                                        a.estado,
                                        descripcion_estado = a.estado == 0 ? "INACTIVO" : "ACTIVO",
                                        a.usuario_creacion
                                    }).ToList();
                        res.totalpage = 0;
                        resul = res;
                    }
                    else {
                        res.ok = true;
                        res.data = (from a in db.tbl_Servicios
                                    where a.estado == idEstado && a.id_Empresa == idEmpresa
                                    select new
                                    {
                                        a.id_Servicios,
                                        a.nombreServicio,
                                        a.estado,
                                        descripcion_estado = a.estado == 0 ? "INACTIVO" : "ACTIVO",
                                        a.usuario_creacion
                                    }).ToList();
                        res.totalpage = 0;
                        resul = res;
                    }


                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int idCargo = Convert.ToInt32(parametros[0].ToString());

                    tbl_Servicios objReemplazar;
                    objReemplazar = db.tbl_Servicios.Where(u => u.id_Servicios == idCargo).FirstOrDefault<tbl_Servicios>();
                    objReemplazar.estado = 0;

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
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Empresa = Convert.ToInt32(parametros[0].ToString());
                    string nombreServicio = parametros[1].ToString();

                    if (db.tbl_Servicios.Count(e => e.nombreServicio.ToUpper() == nombreServicio.ToUpper()  && e.id_Empresa == id_Empresa)  > 0)
                    {
                        resul = true;
                    }
                    else
                    {
                        resul = false;
                    }
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

        public object Posttbl_Servicios(tbl_Servicios tbl_Servicios)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Servicios.fecha_creacion = DateTime.Now;
                db.tbl_Servicios.Add(tbl_Servicios);
                db.SaveChanges();

                res.ok = true;
                //res.data = tbl_Servicios.id_Servicios;
                res.data = (from a in db.tbl_Servicios
                            where a.id_Servicios == tbl_Servicios.id_Servicios
                            select new
                            {
                                a.id_Servicios,
                                a.nombreServicio,
                                a.estado,
                                descripcion_estado = a.estado == 0 ? "INACTIVO" : "ACTIVO",
                                a.usuario_creacion
                            }).ToList();
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

        public object Puttbl_Servicios(int id, tbl_Servicios tbl_Servicios)
        {
            Resultado res = new Resultado();

            tbl_Servicios objReemplazar;
            objReemplazar = db.tbl_Servicios.Where(u => u.id_Servicios == id).FirstOrDefault<tbl_Servicios>();

            objReemplazar.nombreServicio = tbl_Servicios.nombreServicio;
            objReemplazar.estado = tbl_Servicios.estado;

            objReemplazar.usuario_edicion = tbl_Servicios.usuario_creacion;
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


        // DELETE: api/tblServicios/5
        [ResponseType(typeof(tbl_Servicios))]
        public IHttpActionResult Deletetbl_Servicios(int id)
        {
            tbl_Servicios tbl_Servicios = db.tbl_Servicios.Find(id);
            if (tbl_Servicios == null)
            {
                return NotFound();
            }

            db.tbl_Servicios.Remove(tbl_Servicios);
            db.SaveChanges();

            return Ok(tbl_Servicios);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_ServiciosExists(int id)
        {
            return db.tbl_Servicios.Count(e => e.id_Servicios == id) > 0;
        }
    }
}