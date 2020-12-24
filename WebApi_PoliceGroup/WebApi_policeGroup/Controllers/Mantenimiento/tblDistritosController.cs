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
    public class tblDistritosController : ApiController
    {
        private policegroupEntities db = new policegroupEntities();

        // GET: api/tblDistritos
        public IQueryable<tbl_Distritos> Gettbl_Distritos()
        {
            return db.tbl_Distritos;
        }

        public object Gettbl_Distrito(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    res.ok = true;
                    res.data = (from a in db.tbl_Distritos
                                select new
                                {
                                    a.id_Distrito,
                                    a.nombreDistrito,
                                    a.estado,
                                    descripcion_estado = a.estado == 0 ? "INACTIVO" : "ACTIVO",
                                    a.usuario_creacion
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int idDistrito = Convert.ToInt32(parametros[0].ToString());

                    tbl_Distritos objReemplazar;
                    objReemplazar = db.tbl_Distritos.Where(u => u.id_Distrito == idDistrito).FirstOrDefault<tbl_Distritos>();
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
                    res.ok = true;
                    res.data = (from a in db.tbl_Distritos
                                where a.estado == 1
                                select new
                                {
                                    a.id_Distrito,
                                    a.nombreDistrito 
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 4)
                {
                    //res.ok = true;
                    //res.data = (from a in db.tbl_Zonas 
                    //            where a.estado == 1
                    //            select new
                    //            {
                    //                a.id_Zona,
                    //                a.nombre_Zona
                    //            }).ToList();
                    //res.totalpage = 0;
                    //resul = res;
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

        public object Posttbl_Distrito(tbl_Distritos tbl_Distritos)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Distritos.fecha_creacion = DateTime.Now;
                db.tbl_Distritos.Add(tbl_Distritos);
                db.SaveChanges();

                res.ok = true;
                //res.data = tbl_Distritos.id_Distrito;
                res.data = (from a in db.tbl_Distritos
                            where a.id_Distrito == tbl_Distritos.id_Distrito
                            select new
                            {
                                a.id_Distrito,
                                a.nombreDistrito,
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

        public object Puttbl_Distrito(int id, tbl_Distritos tbl_Distritos)
        {
            Resultado res = new Resultado();

            tbl_Distritos objReemplazar;
            objReemplazar = db.tbl_Distritos.Where(u => u.id_Distrito == id).FirstOrDefault<tbl_Distritos>();


            //objReemplazar.id_Zona = tbl_Distritos.id_Zona;
            objReemplazar.nombreDistrito = tbl_Distritos.nombreDistrito;
            objReemplazar.estado = tbl_Distritos.estado;

            objReemplazar.usuario_edicion = tbl_Distritos.usuario_creacion;
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


        // DELETE: api/tblDistritos/5
        [ResponseType(typeof(tbl_Distritos))]
        public IHttpActionResult Deletetbl_Distritos(int id)
        {
            tbl_Distritos tbl_Distritos = db.tbl_Distritos.Find(id);
            if (tbl_Distritos == null)
            {
                return NotFound();
            }

            db.tbl_Distritos.Remove(tbl_Distritos);
            db.SaveChanges();

            return Ok(tbl_Distritos);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_DistritosExists(int id)
        {
            return db.tbl_Distritos.Count(e => e.id_Distrito == id) > 0;
        }
    }
}