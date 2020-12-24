using Entidades.Procesos;
using Negocio.Conexion;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.UI.WebControls;

using Excel = OfficeOpenXml;
using Style = OfficeOpenXml.Style;

namespace Negocio.Procesos
{
    public class Solicitudes_BL
    {
        public object get_solicitudesCab(int idServicio, int idSolicitante, string fechaIni, string fechaFin, int idEstado, int idUsuario, int idEmpresa )
        {
            Resultado res = new Resultado();
            List<Solicitud_E> obj_List = new List<Solicitud_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_SOLICITUDES_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                        cmd.Parameters.Add("@idSolicitante", SqlDbType.Int).Value = idSolicitante;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@idEmpresa", SqlDbType.Int).Value = idEmpresa;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                Solicitud_E Entidad = new Solicitud_E();

                                Entidad.id_Solicitud_Cab = Convert.ToInt32(dr["id_Solicitud_Cab"].ToString());
                                Entidad.nroSolicitud = dr["nroSolicitud"].ToString();
                                Entidad.idArea = dr["idArea"].ToString();
                                Entidad.descripcionArea = dr["descripcionArea"].ToString();
                                Entidad.idSolicitante = dr["idSolicitante"].ToString();
                                Entidad.descripcionSolicitante = dr["descripcionSolicitante"].ToString();

                                Entidad.idJefeCuadrilla = dr["idJefeCuadrilla"].ToString();
                                Entidad.descripcionJefeCuadrilla = dr["descripcionJefeCuadrilla"].ToString();
                                Entidad.fechaAtencion = Convert.ToDateTime( dr["fechaAtencion"].ToString());
                                Entidad.cantidadEfectivos = dr["cantidadEfectivos"].ToString();
                                Entidad.asigna_JC = dr["asigna_JC"].ToString();
                                Entidad.idEstado = dr["idEstado"].ToString();
                                Entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                                Entidad.cantidadHoras = dr["cantidadHoras"].ToString();

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

        public DataTable get_servicio(int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_SOLICITUDES_COMBO_SERVICIOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
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

        public DataTable get_solicitante()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_SOLICITUDES_COMBO_SOLICITANTE", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

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

        public DataTable get_jefeCuadrillas()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_SOLICITUDES_COMBO_JEFE_CUADRILLAS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

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

        public object set_enviarAsignar_SolicitudCab(int idSolCab, int id_usuario)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_SOLICITUDES_ENVIAR_ASIGNAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idSolCab", SqlDbType.Int).Value = idSolCab;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
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

        public DataTable get_efectivosPoliciales(int idSolCab, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_SOLICITUDES_EFECTIVOS_POLICIALES", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idSolCab", SqlDbType.Int).Value = idSolCab;
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

        public object get_descargar_SolicitudesCab(int idServicio, int idSolicitante, string fechaIni, string fechaFin, int idEstado, int idUsuario, int idEmpresa)
        {
            Resultado res = new Resultado();
            List<Solicitud_E> obj_List = new List<Solicitud_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_SOLICITUDES_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                        cmd.Parameters.Add("@idSolicitante", SqlDbType.Int).Value = idSolicitante;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@idEmpresa", SqlDbType.Int).Value = idEmpresa;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                Solicitud_E Entidad = new Solicitud_E();

                                Entidad.id_Solicitud_Cab = Convert.ToInt32(dr["id_Solicitud_Cab"].ToString());
                                Entidad.nroSolicitud = dr["nroSolicitud"].ToString();
                                Entidad.idArea = dr["idArea"].ToString();
                                Entidad.descripcionArea = dr["descripcionArea"].ToString();
                                Entidad.idSolicitante = dr["idSolicitante"].ToString();
                                Entidad.descripcionSolicitante = dr["descripcionSolicitante"].ToString();

                                Entidad.idJefeCuadrilla = dr["idJefeCuadrilla"].ToString();
                                Entidad.descripcionJefeCuadrilla = dr["descripcionJefeCuadrilla"].ToString();
                                Entidad.fechaAtencion = Convert.ToDateTime(dr["fechaAtencion"].ToString());
                                Entidad.cantidadEfectivos = dr["cantidadEfectivos"].ToString();
                                Entidad.asigna_JC = dr["asigna_JC"].ToString();
                                Entidad.idEstado = dr["idEstado"].ToString();
                                Entidad.descripcionEstado = dr["descripcionEstado"].ToString();

                                obj_List.Add(Entidad);
                            }

                            if (obj_List.Count == 0)
                            {
                                res.ok = false;
                                res.data = "No hay informacion disponible";
                                res.totalpage = 0;
                            }
                            else
                            {
                                res.ok = true;
                                res.data = GenerarArchivoExcel_solicitud_cab(obj_List, idUsuario);
                                res.totalpage = 0;
                            }
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

        public string GenerarArchivoExcel_solicitud_cab(List<Solicitud_E> listDetalle, int id_usuario)
        {
            string Res = "";
            int _fila = 4;
            string FileRuta = "";
            string FileExcel = "";

            try
            {
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/Excel/" + id_usuario + "_SolicitudResguardo.xlsx");
                string rutaServer = ConfigurationManager.AppSettings["Archivos"];

                FileExcel = rutaServer + "Excel/" + id_usuario + "_SolicitudResguardo.xlsx";

                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                Thread.Sleep(1);

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("solicitudResguardo");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));


                    oWs.Cells[1, 1].Style.Font.Size = 24; //letra tamaño  2
                    oWs.Cells[1, 1].Value = "SOLICITUDES DE RESGUARDO";
                    oWs.Cells[1, 1, 1, 7].Merge = true;  // combinar celdaS
                    
                    oWs.Cells[3, 1].Value = "NRO SOLICITUD";
                    oWs.Cells[3, 2].Value = "AREA ";
                    oWs.Cells[3, 3].Value = "SOLICITANTE";
                    oWs.Cells[3, 4].Value = "JEFE CUADRILLA";

                    oWs.Cells[3, 5].Value = "FECHA ASIGNACION";
                    oWs.Cells[3, 6].Value = "CANT. EFECTIVOS";
                    oWs.Cells[3, 7].Value = "ESTADOS";
 
                    foreach (var item in listDetalle)
                    {
                        oWs.Cells[_fila, 1].Value = item.nroSolicitud.ToString();
                        oWs.Cells[_fila, 2].Value = item.descripcionArea.ToString();
                        oWs.Cells[_fila, 3].Value = item.descripcionSolicitante.ToString();
                        oWs.Cells[_fila, 4].Value = item.descripcionJefeCuadrilla.ToString();

                        oWs.Cells[_fila, 5].Value = item.fechaAtencion.ToString();
                        oWs.Cells[_fila, 6].Value = item.cantidadEfectivos.ToString();
                        oWs.Cells[_fila, 7].Value = item.descripcionEstado.ToString(); 

                        _fila++;
                    }


                    oWs.Row(1).Style.Font.Bold = true;
                    oWs.Row(1).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(1).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Row(3).Style.Font.Bold = true;
                    oWs.Row(3).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(3).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int k = 1; k <= 7; k++)
                    {
                        oWs.Column(k).AutoFit();
                    }
                    oEx.Save();
                }

                Res = FileExcel;
            }
            catch (Exception)
            {
                throw;
            }
            return Res;
        }

        public object get_solicitudesCab_bandeja(int idServicio , string fechaIni, string fechaFin, int idEstado, int idUsuario , int idEmpresa)
        {
            Resultado res = new Resultado();
            List<Solicitud_E> obj_List = new List<Solicitud_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_BANDEJA_ASIGNACION_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@idEmpresa", SqlDbType.Int).Value = idEmpresa;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                Solicitud_E Entidad = new Solicitud_E();

                                Entidad.id_Solicitud_Cab = Convert.ToInt32(dr["id_Solicitud_Cab"].ToString());
                                Entidad.nroSolicitud = dr["nroSolicitud"].ToString();
                                Entidad.idArea = dr["idArea"].ToString();
                                Entidad.descripcionArea = dr["descripcionArea"].ToString();
                                Entidad.idSolicitante = dr["idSolicitante"].ToString();
                                Entidad.descripcionSolicitante = dr["descripcionSolicitante"].ToString();

                                Entidad.idJefeCuadrilla = dr["idJefeCuadrilla"].ToString();
                                Entidad.descripcionJefeCuadrilla = dr["descripcionJefeCuadrilla"].ToString();
                                Entidad.fechaAtencion = Convert.ToDateTime(dr["fechaAtencion"].ToString());
                                Entidad.cantidadEfectivos = dr["cantidadEfectivos"].ToString();
                                Entidad.asigna_JC = dr["asigna_JC"].ToString();
                                Entidad.idEstado = dr["idEstado"].ToString();
                                Entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                                Entidad.cantidadHoras = dr["cantidadHoras"].ToString();

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
        
        public DataTable get_resguardoEventos(string fechaAtencion, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_BANDEJA_ASIGNACION_COMBO_RESGUARDO_EVENTOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@fechaAtencion", SqlDbType.VarChar).Value = fechaAtencion;
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
        
        public DataTable get_solicitudesDetalle(int idSolCab)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_BANDEJA_ASIGNACION_DETALLE_SOL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idSolCab", SqlDbType.Int).Value = idSolCab;

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

        public object set_eliminarDetalleSolicitud(int idSolicitud_Det)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_BANDEJA_ASIGNACION_DETALLE_SOL_ELIMINAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idSolicitud_Det", SqlDbType.Int).Value = idSolicitud_Det;
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


        public object set_cerrarAsignacion_SolicitudCab(int idSolCab, int id_usuario)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_BANDEJA_CERRAR_ASIGNACION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idSolCab", SqlDbType.Int).Value = idSolCab;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
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
