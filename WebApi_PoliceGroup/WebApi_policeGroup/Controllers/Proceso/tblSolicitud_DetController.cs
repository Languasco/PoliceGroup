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

namespace WebApi_policeGroup.Controllers.Proceso
{
    [EnableCors("*", "*", "*")]
    public class tblSolicitud_DetController : ApiController
    {
        private policegroupEntities db = new policegroupEntities();

        // GET: api/tblSolicitud_Det
        public IQueryable<tbl_Solicitud_Det> Gettbl_Solicitud_Det()
        {
            return db.tbl_Solicitud_Det;
        }

        public object Posttbl_Solicitud_Det(tbl_Solicitud_Det tbl_Solicitud_Det)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Solicitud_Det.fecha_creacion = DateTime.Now;
                db.tbl_Solicitud_Det.Add(tbl_Solicitud_Det);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_Solicitud_Det.id_Solicitud_Cab;
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


        // PUT: api/tblSolicitud_Det/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Solicitud_Det(int id, tbl_Solicitud_Det tbl_Solicitud_Det)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tbl_Solicitud_Det.id_Solicitud_Det)
            {
                return BadRequest();
            }

            db.Entry(tbl_Solicitud_Det).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Solicitud_DetExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

 

        // DELETE: api/tblSolicitud_Det/5
        [ResponseType(typeof(tbl_Solicitud_Det))]
        public IHttpActionResult Deletetbl_Solicitud_Det(int id)
        {
            tbl_Solicitud_Det tbl_Solicitud_Det = db.tbl_Solicitud_Det.Find(id);
            if (tbl_Solicitud_Det == null)
            {
                return NotFound();
            }

            db.tbl_Solicitud_Det.Remove(tbl_Solicitud_Det);
            db.SaveChanges();

            return Ok(tbl_Solicitud_Det);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Solicitud_DetExists(int id)
        {
            return db.tbl_Solicitud_Det.Count(e => e.id_Solicitud_Det == id) > 0;
        }
    }
}