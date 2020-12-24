using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Conexion
{
    public class bdConexion
    {
        public static string cadenaBDcx()
        {            
            string cadenaCnx = System.Configuration.ConfigurationManager.AppSettings["CnxDominion"].ToString();
            return cadenaCnx;
        }
    }
}
