using Negocio.Conexion;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Mantenimientos
{
    public class ConfiguracionZonas_BL
    {
        public DataTable get_areasEmpresa(int idEmpresa, int idUsuario )
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_MANT_CONF_ZONAS_AREAS_EMPRESA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idEmpresa", SqlDbType.Int).Value = idEmpresa;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;


                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }

        public DataTable get_distritoEmpresaArea(int idEmpresa, string areasMasivo, int idUsuario, int idZona)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_MANT_CONF_ZONAS_DISTRITO_EMPRESA_AREA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idEmpresa", SqlDbType.Int).Value = idEmpresa;
                        cmd.Parameters.Add("@areasMasivo", SqlDbType.VarChar).Value = areasMasivo;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@idZona", SqlDbType.Int).Value = idZona;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return dt_detalle;
        }

        public string save_configuracionZonas(int idEmpresa, string areasMasivo, string distritoMasivo, int idUsuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_MANT_CONF_ZONAS_GRABAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idEmpresa", SqlDbType.Int).Value = idEmpresa;
                        cmd.Parameters.Add("@areasMasivo", SqlDbType.VarChar).Value = areasMasivo;
                        cmd.Parameters.Add("@distritoMasivo", SqlDbType.VarChar).Value = distritoMasivo;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        cmd.ExecuteNonQuery();
                        resultado = "OK";
                    }
                }
            }
            catch (Exception e)
            {
                resultado = e.Message;
            }
            return resultado;
        }

    }
}
