using Negocio.Mantenimientos;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApi_policeGroup.Controllers.Mantenimiento
{
    [EnableCors("*", "*", "*")]
    public class ConfiguracionZonasController : ApiController
    {
        public object Gettbl_zonas(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            ConfiguracionZonas_BL obj_negocio = new ConfiguracionZonas_BL();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    int idEmpresa = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_areasEmpresa(idEmpresa, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int idEmpresa = Convert.ToInt32(parametros[0].ToString());
                    string areasMasivo = parametros[1].ToString();
                    int idUsuario = Convert.ToInt32(parametros[2].ToString());
                    int idZonas = Convert.ToInt32(parametros[3].ToString());

                    res.ok = true;
                    res.data = obj_negocio.get_distritoEmpresaArea(idEmpresa, areasMasivo, idUsuario, idZonas);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    int idEmpresa = Convert.ToInt32(parametros[0].ToString());
                    string areasMasivo = parametros[1].ToString();
                    string distritoMasivo = parametros[2].ToString();
                    int idUsuario = Convert.ToInt32(parametros[3].ToString());

                    res.ok = true;
                    res.data = obj_negocio.save_configuracionZonas(idEmpresa, areasMasivo, distritoMasivo, idUsuario);
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
