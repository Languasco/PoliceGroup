

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
using Negocio.Mantenimientos;
using Negocio.Resultados;

namespace WebApi_policeGroup.Controllers.Mantenimiento
{
    [EnableCors("*", "*", "*")]
    public class tblEmpresasController : ApiController
    {
        private policegroupEntities db = new policegroupEntities();

        // GET: api/tblEmpresas
        public IQueryable<tbl_Empresas> Gettbl_Empresas()
        {
            return db.tbl_Empresas;
        }

        public object Gettbl_Empresas(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            Proveedor_BL obj_negocio = new Proveedor_BL();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    res.ok = true;
                    res.data = (from a in db.tbl_Estados
                                select new
                                {
                                   a.id_Estado,
                                   a.descripcion_estado,
                                   a.tipoproceso_estado
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int idEstado = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    res.ok = true;
                    res.data = (from a in db.tbl_Empresas
                                select new
                                {
                                    a.id_Empresa,
                                    a.ruc_Empresa,
                                    a.razonSocial_Empresa,
                                    a.direccion_Empresa,
                                    a.id_Icono,
                                    a.esProveedor,
                                    a.estado,
                                    descripcion_estado = a.estado == 0 ? "INACTIVO" : "ACTIVO",
                                    a.usuario_creacion
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    int idEmpresa = Convert.ToInt32(parametros[0].ToString());

                    tbl_Empresas objReemplazar;
                    objReemplazar = db.tbl_Empresas.Where(u => u.id_Empresa == idEmpresa).FirstOrDefault<tbl_Empresas>();
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
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    string nroRuc =  parametros[0].ToString();

                    if (db.tbl_Empresas.Count(e => e.ruc_Empresa == nroRuc) > 0)
                    {
                        resul = true;
                    }
                    else {
                        resul = false;
                    } 
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');
                    string razonSocial = parametros[0].ToString();

                    if (db.tbl_Empresas.Count(e => e.razonSocial_Empresa == razonSocial) > 0)
                    {
                        resul = true;
                    }
                    else
                    {
                        resul = false;
                    }
                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');
                    int idIcon = Convert.ToInt32(parametros[0].ToString());
                    int idser = Convert.ToInt32(parametros[1].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_DatosGenerales_Iconos(idIcon);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 7)
                {
                    res.ok = true;
                    res.data = (from a in db.tbl_Empresas
                                where a.estado ==1
                                select new
                                {
                                    a.id_Empresa,
                                    a.razonSocial_Empresa,
                                    a.esProveedor
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
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
        
        public object Posttbl_Empresas(tbl_Empresas tbl_Empresas)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Empresas.fecha_creacion = DateTime.Now;
                db.tbl_Empresas.Add(tbl_Empresas);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_Empresas.id_Empresa;
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

        public object Puttbl_Empresas(int id, tbl_Empresas tbl_Empresas)
        {
            Resultado res = new Resultado();

            tbl_Empresas objReemplazar;
            objReemplazar = db.tbl_Empresas.Where(u => u.id_Empresa == id).FirstOrDefault<tbl_Empresas>();
            
            objReemplazar.ruc_Empresa = tbl_Empresas.ruc_Empresa;
            objReemplazar.razonSocial_Empresa = tbl_Empresas.razonSocial_Empresa;
            objReemplazar.direccion_Empresa = tbl_Empresas.direccion_Empresa;
            objReemplazar.id_Icono = tbl_Empresas.id_Icono;

            objReemplazar.esProveedor = tbl_Empresas.esProveedor;
            objReemplazar.estado = tbl_Empresas.estado;
            objReemplazar.usuario_edicion = tbl_Empresas.usuario_creacion;
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
        

        // DELETE: api/tblEmpresas/5
        [ResponseType(typeof(tbl_Empresas))]
        public IHttpActionResult Deletetbl_Empresas(int id)
        {
            tbl_Empresas tbl_Empresas = db.tbl_Empresas.Find(id);
            if (tbl_Empresas == null)
            {
                return NotFound();
            }

            db.tbl_Empresas.Remove(tbl_Empresas);
            db.SaveChanges();

            return Ok(tbl_Empresas);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_EmpresasExists(int id)
        {
            return db.tbl_Empresas.Count(e => e.id_Empresa == id) > 0;
        }
    }
}