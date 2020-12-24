using Negocio.Conexion;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Acceso
{
   public class Login_BL
    {
        //public object generarLogin(int id_local)
        //{
        //    Resultado res = new Resultado();
        //    try
        //    {
        //        using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
        //        {
        //            cn.Open();
        //            using (SqlCommand cmd = new SqlCommand("PROC_S_REPORTE_COBERTURA_DETALLADO", cn))
        //            {
        //                cmd.CommandTimeout = 0;
        //                cmd.CommandType = CommandType.StoredProcedure;
        //                cmd.Parameters.Add("@id_local", SqlDbType.Int).Value = id_local;
        //                DataTable dt_detalle = new DataTable();
        //                using (SqlDataAdapter da = new SqlDataAdapter(cmd))
        //                {
        //                    da.Fill(dt_detalle);
        //                    res.ok = false;
        //                    res.data = dt_detalle;
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        res.ok = false;
        //        res.data = ex.Message;
        //    }
        //    return res;
        //}
    }
}
