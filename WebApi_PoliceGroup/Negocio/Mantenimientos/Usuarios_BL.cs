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
    public class Usuarios_BL
    {
        public DataTable get_usuariosAccesos(string idOpciones)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ACCESOS_MENU_USUARIO_MENU", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idOpciones", SqlDbType.VarChar).Value = idOpciones;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public DataTable get_mantenimientoUsuarios( int idEmpresa, int idArea, int idEstado  )
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_MANT_USUARIO_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idEmpresa", SqlDbType.Int).Value = idEmpresa;
                        cmd.Parameters.Add("@idArea", SqlDbType.Int).Value = idArea;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public DataTable get_perfilAccesos(string idOpciones)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ACCESOS_MENU_PERFIL_MENU", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idOpciones", SqlDbType.VarChar).Value = idOpciones;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }
        
        public DataTable get_eventosUsuarioMarcados(string idOpciones, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ACCESOS_MENU_LIST_EVENTOS_USUARIO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idOpciones", SqlDbType.VarChar).Value = idOpciones;
                        cmd.Parameters.Add("@id_Usuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }
               
        public DataTable get_eventosPerfilMarcados(string idOpciones, int idPerfil)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ACCESOS_MENU_LIST_EVENTOS_PERFIL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idOpciones", SqlDbType.VarChar).Value = idOpciones;
                        cmd.Parameters.Add("@idPerfil", SqlDbType.Int).Value = idPerfil;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }

        
        public string set_grabandoEventos(string idOpciones, string idEventos, int idUsuario)
        {
            string res = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ACCESOS_MENU_GRABAR_ACCESOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idOpciones", SqlDbType.VarChar).Value = idOpciones;
                        cmd.Parameters.Add("@idEventos", SqlDbType.VarChar).Value = idEventos;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.ExecuteNonQuery();
                        res = "OK";
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return res;
        }

        public string set_grabandoEventosPerfiles(string idOpciones, string idEventos, int idPerfil)
        {
            string res = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ACCESOS_MENU_GRABAR_ACCESOS_PEFIL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idOpciones", SqlDbType.VarChar).Value = idOpciones;
                        cmd.Parameters.Add("@idEventos", SqlDbType.VarChar).Value = idEventos;
                        cmd.Parameters.Add("@idPerfil", SqlDbType.Int).Value = idPerfil;
                        cmd.ExecuteNonQuery();
                        res = "OK";
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return res;
        }
        
        public string set_insert_update_usuarios( int id_Usuario, string opcion)
        {
            string res = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_MANT_USUARIO_INSERT_UPDATE", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Usuario", SqlDbType.Int).Value = id_Usuario;
                        cmd.Parameters.Add("@opcion", SqlDbType.VarChar).Value = opcion;

                        cmd.ExecuteNonQuery();
                        res = "OK";
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return res;
        }

        public string Set_Actualizar_imagenPersonal(int idPersonal, string nombreFileServer)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_MANT_PERSONAL_FOTO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idPersonal", SqlDbType.Int).Value = idPersonal;
                        cmd.Parameters.Add("@nombreFoto", SqlDbType.VarChar).Value = nombreFileServer;

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
