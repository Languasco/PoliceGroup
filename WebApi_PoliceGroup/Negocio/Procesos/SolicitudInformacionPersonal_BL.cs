using Entidades.Procesos;
using Negocio.Conexion;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Negocio.Procesos
{
    public class SolicitudInformacionPersonal_BL
    {
        public DataTable get_empresaUsuario(int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_SOLICITUD_INFORMACION_PERSONAL_COMBO_EMPRESA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@Usuario", SqlDbType.Int).Value = idUsuario;
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

        public object get_solicitudesInformacionPersonal(int idEmpresa, int idEstado, int idUsuario)
        {
            Resultado res = new Resultado();
            List<SolicitudInformacionPersonal_E> obj_List = new List<SolicitudInformacionPersonal_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_SOLICITUD_INFORMACION_PERSONAL_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idEmpresa", SqlDbType.Int).Value = idEmpresa;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                SolicitudInformacionPersonal_E Entidad = new SolicitudInformacionPersonal_E();

                                Entidad.id_Ibp_Cab = Convert.ToInt32(dr["id_Ibp_Cab"]);
                                Entidad.nro_Documento = dr["nro_Documento"].ToString();
                                Entidad.apellidos_Peronal = dr["apellidos_Peronal"].ToString();
                                Entidad.nombre_personal = dr["nombre_personal"].ToString();
                                Entidad.id_estado = dr["id_estado"].ToString();
                                Entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                                obj_List.Add(Entidad);
                            }

                            res.ok = true;
                            res.data = obj_List;
                            res.totalpage = 0;
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
            }
            return res;
        }

        public DataTable get_cantidadSolicitud_empresa(int id_empresa, int idUsuario, string tipoProceso)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_SOLICITUD_INFORMACION_PERSONAL_CANTIDAD_SOLICITUDES", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_empresa", SqlDbType.Int).Value = id_empresa;
                        cmd.Parameters.Add("@Usuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@tipoProceso", SqlDbType.VarChar).Value = tipoProceso;

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

        public object get_bandejeaSolicitudesInformacionPersonal(int idEmpresa, int idEstado, int idUsuario)
        {
            Resultado res = new Resultado();
            List<SolicitudInformacionPersonal_E> obj_List = new List<SolicitudInformacionPersonal_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_BANDEJA_SOLICITUD_INFORMACION_PERSONAL_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idEmpresa", SqlDbType.Int).Value = idEmpresa;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                SolicitudInformacionPersonal_E Entidad = new SolicitudInformacionPersonal_E();

                                Entidad.id_Ibp_Cab = Convert.ToInt32(dr["id_Ibp_Cab"]);
                                Entidad.nro_Documento = dr["nro_Documento"].ToString();
                                Entidad.apellidos_Peronal = dr["apellidos_Peronal"].ToString();
                                Entidad.nombre_personal = dr["nombre_personal"].ToString();
                                Entidad.id_estado = dr["id_estado"].ToString();
                                Entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                                obj_List.Add(Entidad);
                            }

                            res.ok = true;
                            res.data = obj_List;
                            res.totalpage = 0;
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
            }
            return res;
        }

        public DataTable get_solicitudesInformacionDet(int id_Ibp_Cab)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_BANDEJA_SOLICITUD_INFORMACION_PERSONAL_DET_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Ibp_Cab", SqlDbType.Int).Value = id_Ibp_Cab;

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

        public DataTable get_solicitudesInformacionDet_archivoAdjuntado(int id_Ibp_Cab)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_BANDEJA_SOLICITUD_INFORMACION_PERS_ARCHIVO_ADJUNTADO_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Ibp_Cab", SqlDbType.Int).Value = id_Ibp_Cab;

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

        public object set_eliminar_documentosSolicitudInformacionDet (int id_Ibp_det)
        {
            Resultado res = new Resultado();
            string sPath = HttpContext.Current.Server.MapPath("~/Archivos/Documentos_Ibp/" + id_Ibp_det);
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_BANDEJA_SOLICITUD_INFO_PERS_DET_DOCUMENTOS_ELIMINAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Ibp_det", SqlDbType.Int).Value = id_Ibp_det;
                        cmd.ExecuteNonQuery();

                        if (File.Exists(sPath))
                        {
                            System.IO.File.Delete(sPath);
                        }

                        res.ok = true;
                        res.data = "OK";
                        res.totalpage = 0;
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }


        public object set_terminar_solicitudInformacion_cab(int id_Ibp_Cab, int idusuario)
        {
            Resultado res = new Resultado();
 
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_BANDEJA_SOLICITUD_TERMINAR_SOLICITUD", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Ibp_Cab", SqlDbType.Int).Value = id_Ibp_Cab;
                        cmd.Parameters.Add("@idusuario", SqlDbType.Int).Value = idusuario;
                        cmd.ExecuteNonQuery(); 

                        res.ok = true;
                        res.data = "OK";
                        res.totalpage = 0;
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }
            return res;
        }


    }
}
