using Datos;
using Negocio.Procesos;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Linq;
 
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApi_policeGroup.Controllers.Proceso
{
    [EnableCors("*", "*", "*")]
    public class AprobarOTController : ApiController
    {
        private policegroupEntities db = new policegroupEntities();
        public object GetAprobarOrdenTrabajo(int opcion, string filtro)
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

                    resul = obj_negocio.get_aprobacionOTCab(idServicio, idTipoOT, idDistrito, idProveedor, idEstado, idUsuario);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int idOT = Convert.ToInt32(parametros[0].ToString());
                    int idEstado = Convert.ToInt32(parametros[1].ToString());
                    int idUsuario = Convert.ToInt32(parametros[2].ToString());

                    res.ok = true;
                    res.data = obj_negocio.set_grabar_aprobarOT(idOT, idEstado, idUsuario);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    int idOt = Convert.ToInt32(parametros[0].ToString());
                    int idTipoOT = Convert.ToInt32(parametros[1].ToString());
                    int idUsuario = Convert.ToInt32(parametros[2].ToString());

                    resul = obj_negocio.get_medidasOt(idOt, idTipoOT,  idUsuario);
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    int id_OTDet = Convert.ToInt32(parametros[0].ToString());
                    int idTipoOT = Convert.ToInt32(parametros[1].ToString());
                    int idUsuario = Convert.ToInt32(parametros[2].ToString());

                    resul = obj_negocio.get_fotosOt(id_OTDet, idTipoOT, idUsuario);
                }

                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');
                    int idfoto = Convert.ToInt32(parametros[0].ToString());
                    resul = obj_negocio.set_AnulandoFotos(idfoto);
                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');
                    int idOt = Convert.ToInt32(parametros[0].ToString());
                    int idTipoOT = Convert.ToInt32(parametros[1].ToString());
                    int idUsuario = Convert.ToInt32(parametros[2].ToString());

                    resul = obj_negocio.get_desmonteOt(idOt, idTipoOT, idUsuario);
                }
                else if (opcion == 7)
                { 
                    res.ok = true;
                    res.data = (from a in db.tbl_Estados
                                where a.tipoproceso_estado  == "OTW_A"
                                select new
                                {
                                    a.id_Estado,
                                    a.descripcion_estado
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
               else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');
                    int idServicio = Convert.ToInt32(parametros[0].ToString());
                    int idTipoOT = Convert.ToInt32(parametros[1].ToString());
                    int idDistrito = Convert.ToInt32(parametros[2].ToString());

                    int idProveedor = Convert.ToInt32(parametros[3].ToString());
                    int idEstado = Convert.ToInt32(parametros[4].ToString());
                    int idUsuario = Convert.ToInt32(parametros[5].ToString());

                    resul = obj_negocio.get_descargar_aprobacionOTCab(idServicio, idTipoOT, idDistrito, idProveedor, idEstado, idUsuario);
                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');
                    int idOt = Convert.ToInt32(parametros[0].ToString());
                    int idTipoOT = Convert.ToInt32(parametros[1].ToString());
                    int idUsuario = Convert.ToInt32(parametros[2].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_descargar_Todos_fotosOT(idOt, idTipoOT, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 10)
                {
                    string[] parametros = filtro.Split('|');
                    int idOt_foto = Convert.ToInt32(parametros[0].ToString());
                    int idTipoOT = Convert.ToInt32(parametros[1].ToString());
                    int idUsuario = Convert.ToInt32(parametros[2].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_descargar_fotosOT_visor(idOt_foto, idTipoOT, idUsuario);
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

    }
}
