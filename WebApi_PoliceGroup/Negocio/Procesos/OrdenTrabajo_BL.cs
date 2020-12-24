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
using System.Threading;
using System.Web;
using Excel = OfficeOpenXml;
using Style = OfficeOpenXml.Style;

namespace Negocio.Procesos
{
    public class OrdenTrabajo_BL
    {
        public object get_ordenTrabajoCab(int idServicio, int idTipoOT, int idDistrito, int idProveedor, int idEstado, int idUsuario)
        {
            Resultado res = new Resultado();
            List<OrdenTrabajo_E> obj_List = new List<OrdenTrabajo_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENES_TRABAJO_LISTAR_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                        cmd.Parameters.Add("@idTipoOT", SqlDbType.Int).Value = idTipoOT;
                        cmd.Parameters.Add("@idDistrito", SqlDbType.Int).Value = idDistrito;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = idProveedor;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                OrdenTrabajo_E Entidad = new OrdenTrabajo_E();

                                Entidad.checkeado = false;
                                Entidad.id_OT = Convert.ToInt32(dr["id_OT"]);

                                Entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                                Entidad.tipoOT = dr["tipoOT"].ToString();
                                Entidad.nroObra = dr["nroObra"].ToString();
                                Entidad.direccion = dr["direccion"].ToString();

                                Entidad.distrito = dr["distrito"].ToString();
                                Entidad.volumen = dr["volumen"].ToString();
                                Entidad.jefeCuadrilla = dr["jefeCuadrilla"].ToString();
                                Entidad.empresaContratista = dr["empresaContratista"].ToString();

                                Entidad.fechaHora = dr["fechaHora"].ToString();
                                Entidad.Informe = dr["Informe"].ToString();
                                Entidad.diasVencimiento = dr["diasVencimiento"].ToString();

                                Entidad.idJefeCuadrilla = dr["idJefeCuadrilla"].ToString();
                                Entidad.idEmpresa = dr["idEmpresa"].ToString();

                                Entidad.id_tipoTrabajo = Convert.ToInt32(dr["id_tipoTrabajo"]);
                                Entidad.id_Distrito = dr["id_Distrito"].ToString();
                                Entidad.referencia = dr["referencia"].ToString();
                                Entidad.descripcion_OT = dr["descripcion_OT"].ToString();
                                Entidad.id_estado = Convert.ToInt32(dr["id_estado"]);
 


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


        public object get_resumen_OrdenTrabajoCab(int idServicio, int idTipoOT, int idDistrito, int idProveedor, int idEstado, int idUsuario)
        {
            Resultado res = new Resultado();
            List<Resumen_OrdenTrabajo_E> obj_List = new List<Resumen_OrdenTrabajo_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENES_TRABAJO_REPORTE_RESUMEN", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                        cmd.Parameters.Add("@idTipoOT", SqlDbType.Int).Value = idTipoOT;
                        cmd.Parameters.Add("@idDistrito", SqlDbType.Int).Value = idDistrito;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = idProveedor;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;


                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                Resumen_OrdenTrabajo_E Entidad = new Resumen_OrdenTrabajo_E();

                                Entidad.color = dr["color"].ToString();
                                Entidad.proveedor = dr["proveedor"].ToString();
                                Entidad.jefeCuadrilla = dr["jefeCuadrilla"].ToString();

                                Entidad.m3Asignados = dr["m3Asignados"].ToString();
                                Entidad.cantidaOTAsignada = dr["cantidaOTAsignada"].ToString();
                                Entidad.cantOTFueraPlazo = dr["cantOTFueraPlazo"].ToString();
                                Entidad.cantOTAtendida = dr["cantOTAtendida"].ToString();

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

        public DataTable get_servicioUsuario(int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_WM_Combo_Usuarios_Servicios", cn))
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

        public string set_grabar_asignarReasignar_Ot(string codigosOT, string fechaAsigna, string opcionModal, int empresa1, int jefeCuadrilla1, int empresa2, int jefeCuadrilla2, string observaciones, int idUsuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENES_TRABAJO_ASIGNAR_REASIGNAR_OT", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@codigosOT", SqlDbType.VarChar).Value = codigosOT;
                        cmd.Parameters.Add("@fechaAsigna", SqlDbType.VarChar).Value = fechaAsigna;
                        cmd.Parameters.Add("@opcion", SqlDbType.VarChar).Value = opcionModal;

                        cmd.Parameters.Add("@empresa1", SqlDbType.Int).Value = empresa1;
                        cmd.Parameters.Add("@jefeCuadrilla1", SqlDbType.Int).Value = jefeCuadrilla1;

                        cmd.Parameters.Add("@empresa2", SqlDbType.Int).Value = empresa2;
                        cmd.Parameters.Add("@jefeCuadrilla2", SqlDbType.Int).Value = jefeCuadrilla2;

                        cmd.Parameters.Add("@observaciones", SqlDbType.VarChar).Value = observaciones;
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

        public DataTable get_calculos_asignarReasignar_Ot(int idEmpresa, int idJefeCuadrilla, string opcionModal, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENES_TRABAJO_ASIGNAR_REASIGNAR_CALCULO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idEmpresa", SqlDbType.Int).Value = idJefeCuadrilla;
                        cmd.Parameters.Add("@idJefeCuadrilla", SqlDbType.Int).Value = idJefeCuadrilla;
                        cmd.Parameters.Add("@opcion", SqlDbType.VarChar).Value = opcionModal;
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

        public string set_enviarOT_jefeCuadrilla(string codigosOT, int idUsuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENES_TRABAJO_ENVIAR_OT_JEFE_CUADRILLA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@codigosOT", SqlDbType.VarChar).Value = codigosOT;
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
               
        public object get_descargar_ordenTrabajoCab(int idServicio, int idTipoOT, int idDistrito, int idProveedor, int idEstado, int idUsuario)
        {
            Resultado res = new Resultado();
            List<OrdenTrabajo_E> obj_List = new List<OrdenTrabajo_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENES_TRABAJO_LISTAR_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                        cmd.Parameters.Add("@idTipoOT", SqlDbType.Int).Value = idTipoOT;
                        cmd.Parameters.Add("@idDistrito", SqlDbType.Int).Value = idDistrito;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = idProveedor;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                OrdenTrabajo_E Entidad = new OrdenTrabajo_E();

                                Entidad.checkeado = false;
                                Entidad.id_OT = Convert.ToInt32(dr["id_OT"]);

                                Entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                                Entidad.tipoOT = dr["tipoOT"].ToString();
                                Entidad.nroObra = dr["nroObra"].ToString();
                                Entidad.direccion = dr["direccion"].ToString();

                                Entidad.distrito = dr["distrito"].ToString();
                                Entidad.volumen = dr["volumen"].ToString();
                                Entidad.jefeCuadrilla = dr["jefeCuadrilla"].ToString();
                                Entidad.empresaContratista = dr["empresaContratista"].ToString();

                                Entidad.fechaHora = dr["fechaHora"].ToString();
                                Entidad.Informe = dr["Informe"].ToString();
                                Entidad.diasVencimiento = dr["diasVencimiento"].ToString();

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
                                res.data = GenerarArchivoExcel_ordenTrabajo_cab(obj_List, idUsuario);
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

        public string GenerarArchivoExcel_ordenTrabajo_cab(List<OrdenTrabajo_E> listDetalle, int id_usuario)
        {
            string Res = "";
            int _fila = 4;
            string FileRuta = "";
            string FileExcel = "";

            try
            {

                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/Excel/" + id_usuario + "_aprobacionOT.xlsx");
                string rutaServer = ConfigurationManager.AppSettings["Archivos"];

                FileExcel = rutaServer + "Excel/" + id_usuario + "_aprobacionOT.xlsx";

                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                Thread.Sleep(1);

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("AprobacionOT");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));


                    oWs.Cells[1, 1].Style.Font.Size = 24; //letra tamaño  2
                    oWs.Cells[1, 1].Value = "ORDENES TRABAJO";
                    oWs.Cells[1, 1, 1, 17].Merge = true;  // combinar celdaS
                    
                    oWs.Cells[3, 1].Value = "ESTADO";
                    oWs.Cells[3, 2].Value = "TIPO DE ORDEN";
                    oWs.Cells[3, 3].Value = "NRO OBRA/ TD";
                    oWs.Cells[3, 4].Value = "PRIORIDAD";
                    oWs.Cells[3, 5].Value = "DIRECCION";
                    oWs.Cells[3, 6].Value = "DISTRITO";

                    oWs.Cells[3, 7].Value = "EMPRESA CONTRATISTA";
                    oWs.Cells[3, 8].Value = "JEFE CUADRILLA";
                    oWs.Cells[3, 9].Value = "GENERO UN VOLUMEN";
                    oWs.Cells[3, 10].Value = "VOLUMEN DE DESMONTE";

                    oWs.Cells[3, 11].Value = "VOLUMEN DE DESMONTE POR RECOGER";
                    oWs.Cells[3, 12].Value = "FECHA Y HORA DE REGISTRO";
                    oWs.Cells[3, 13].Value = "TOTAL EN VOLUMEN ";
                    oWs.Cells[3, 14].Value = "TOTAL EN DESMONTE ";

                    oWs.Cells[3, 15].Value = "TOTAL EN DESMONTE POR RECOGER";
                    oWs.Cells[3, 16].Value = "FECHA APROBACION";
                    oWs.Cells[3, 17].Value = "DIAS DE VENCIMIENTO";


                    foreach (var item in listDetalle)
                    {

                        //oWs.Cells[_fila, 1].Value = item.descripcionEstado.ToString();
                        //oWs.Cells[_fila, 2].Value = item.tipoOT.ToString();
                        //oWs.Cells[_fila, 3].Value = item.nroObra.ToString();
                        //oWs.Cells[_fila, 4].Value = item.prioridad.ToString();
                        //oWs.Cells[_fila, 5].Value = item.direccion.ToString();
                        //oWs.Cells[_fila, 6].Value = item.distrito.ToString();

                        //oWs.Cells[_fila, 7].Value = item.empresaContratista.ToString();
                        //oWs.Cells[_fila, 8].Value = item.jefeCuadrilla.ToString();
                        //oWs.Cells[_fila, 9].Value = item.generaVolumen.ToString();
                        //oWs.Cells[_fila, 10].Value = item.volumenDesmonte.ToString();

                        //oWs.Cells[_fila, 11].Value = item.volumenDesmonteRecoger.ToString();
                        //oWs.Cells[_fila, 12].Value = item.fechaHora.ToString();

                        //oWs.Cells[_fila, 13].Value = item.totalVolumen.ToString();
                        //oWs.Cells[_fila, 14].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        //oWs.Cells[_fila, 14].Value = item.totalDesmonte.ToString();
                        //oWs.Cells[_fila, 14].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        //oWs.Cells[_fila, 15].Value = item.totalDesmonteRecoger.ToString();
                        //oWs.Cells[_fila, 15].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        //oWs.Cells[_fila, 16].Value = item.fechaAprobacion.ToString();
                        //oWs.Cells[_fila, 17].Value = item.diasVencimiento.ToString();

                        _fila++;
                    }


                    oWs.Row(1).Style.Font.Bold = true;
                    oWs.Row(1).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(1).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Row(3).Style.Font.Bold = true;
                    oWs.Row(3).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(3).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int k = 1; k <= 17; k++)
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


        //-----------------------------------
        //----------APROBACION DE OT --------
        //-----------------------------------


        public object get_aprobacionOTCab(int idServicio, int idTipoOT, int idDistrito, int idProveedor, int idEstado, int idUsuario)
        {
            Resultado res = new Resultado();
            List<AprobarOT_E> obj_List = new List<AprobarOT_E>();
            //DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBACION_OT_LISTAR_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                        cmd.Parameters.Add("@idTipoOT", SqlDbType.Int).Value = idTipoOT;
                        cmd.Parameters.Add("@idDistrito", SqlDbType.Int).Value = idDistrito;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = idProveedor;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                AprobarOT_E Entidad = new AprobarOT_E();

                                Entidad.checkeado = false;
                                Entidad.id_OT = Convert.ToInt32(dr["id_OT"]);
                                Entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                                Entidad.tipoOT = dr["tipoOT"].ToString();
                                Entidad.nroObra = dr["nroObra"].ToString();

                                Entidad.prioridad = dr["prioridad"].ToString();
                                Entidad.direccion = dr["direccion"].ToString();
                                Entidad.distrito = dr["distrito"].ToString();
                                Entidad.latitud = dr["latitud"].ToString();
                                Entidad.longitud = dr["longitud"].ToString();

                                Entidad.empresaContratista = dr["empresaContratista"].ToString();
                                Entidad.jefeCuadrilla = dr["jefeCuadrilla"].ToString();
                                Entidad.generaVolumen = dr["generaVolumen"].ToString();
                                Entidad.volumenDesmonte = dr["volumenDesmonte"].ToString();
                                Entidad.volumenDesmonteRecoger = dr["volumenDesmonteRecoger"].ToString();

                                Entidad.fechaHora = dr["fechaHora"].ToString();
                                Entidad.Informe = dr["Informe"].ToString();
                                Entidad.totalVolumen = dr["totalVolumen"].ToString();
                                Entidad.totalDesmonte = dr["totalDesmonte"].ToString();
                                Entidad.totalDesmonteRecoger = dr["totalDesmonteRecoger"].ToString();

                                Entidad.fechaAprobacion = dr["fechaAprobacion"].ToString();
                                Entidad.diasVencimiento = dr["diasVencimiento"].ToString();

                                Entidad.id_tipoTrabajo = Convert.ToInt32(dr["id_tipoTrabajo"]);
                                Entidad.id_Distrito = dr["id_Distrito"].ToString();
                                Entidad.referencia = dr["referencia"].ToString();
                                Entidad.descripcion_OT = dr["descripcion_OT"].ToString();
                                Entidad.id_estado = Convert.ToInt32(dr["id_estado"]);

                                obj_List.Add(Entidad);
                            }

                            res.ok = true;
                            res.data = obj_List;
                            res.totalpage = 0;
                        }


                        //using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        //{
                        //    da.Fill(dt_detalle);

                        //    res.ok = true;
                        //    res.data = dt_detalle;
                        //    res.totalpage = 0;
                        //}


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

        public string set_grabar_aprobarOT(int idOT, int idEstado, int idUsuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBACION_OT_APROBAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idOT", SqlDbType.Int).Value = idOT;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;
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

        public object get_medidasOt(int idOt, int idTipoOt, int idUsuario)
        {
            Resultado res = new Resultado();
            //List<AprobarOT_E> obj_List = new List<AprobarOT_E>();
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBACION_OT_MEDIDAS_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idOT", SqlDbType.Int).Value = idOt;
                        cmd.Parameters.Add("@idTipoOT", SqlDbType.Int).Value = idTipoOt;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            res.ok = true;
                            res.data = dt_detalle;
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

        public object get_fotosOt(int id_OTDet, int idTipoOt, int idUsuario)
        {
            Resultado res = new Resultado();
            //List<AprobarOT_E> obj_List = new List<AprobarOT_E>();
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBACION_OT_FOTOS_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idOTDet", SqlDbType.Int).Value = id_OTDet;
                        cmd.Parameters.Add("@idTipoOT", SqlDbType.Int).Value = idTipoOt;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            res.ok = true;
                            res.data = dt_detalle;
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

        public object set_AnulandoFotos(int idfoto)
        {
            Resultado res = new Resultado();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBACION_OT_ANULAR_FOTO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idfoto", SqlDbType.Int).Value = idfoto;
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


        ///-----DESMONTE
        //
        public object get_desmonteOt(int idOt, int idTipoOt, int idUsuario)
        {
            Resultado res = new Resultado();
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBACION_OT_DESMONTE_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idOT", SqlDbType.Int).Value = idOt;
                        cmd.Parameters.Add("@idTipoOT", SqlDbType.Int).Value = idTipoOt;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);

                            res.ok = true;
                            res.data = dt_detalle;
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
        
        public object get_descargar_aprobacionOTCab(int idServicio, int idTipoOT, int idDistrito, int idProveedor, int idEstado, int idUsuario)
        {
            Resultado res = new Resultado();
            List<AprobarOT_E> obj_List = new List<AprobarOT_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBACION_OT_LISTAR_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                        cmd.Parameters.Add("@idTipoOT", SqlDbType.Int).Value = idTipoOT;
                        cmd.Parameters.Add("@idDistrito", SqlDbType.Int).Value = idDistrito;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = idProveedor;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                AprobarOT_E Entidad = new AprobarOT_E();

                                Entidad.checkeado = false;
                                Entidad.id_OT = Convert.ToInt32(dr["id_OT"]);
                                Entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                                Entidad.tipoOT = dr["tipoOT"].ToString();
                                Entidad.nroObra = dr["nroObra"].ToString();

                                Entidad.prioridad = dr["prioridad"].ToString();
                                Entidad.direccion = dr["direccion"].ToString();
                                Entidad.distrito = dr["distrito"].ToString();
                                Entidad.latitud = dr["latitud"].ToString();
                                Entidad.longitud = dr["longitud"].ToString();

                                Entidad.empresaContratista = dr["empresaContratista"].ToString();
                                Entidad.jefeCuadrilla = dr["jefeCuadrilla"].ToString();
                                Entidad.generaVolumen = dr["generaVolumen"].ToString();
                                Entidad.volumenDesmonte = dr["volumenDesmonte"].ToString();
                                Entidad.volumenDesmonteRecoger = dr["volumenDesmonteRecoger"].ToString();

                                Entidad.fechaHora = dr["fechaHora"].ToString();
                                Entidad.Informe = dr["Informe"].ToString();
                                Entidad.totalVolumen = dr["totalVolumen"].ToString();
                                Entidad.totalDesmonte = dr["totalDesmonte"].ToString();
                                Entidad.totalDesmonteRecoger = dr["totalDesmonteRecoger"].ToString();

                                Entidad.fechaAprobacion = dr["fechaAprobacion"].ToString();
                                Entidad.diasVencimiento = dr["diasVencimiento"].ToString();

                                Entidad.id_tipoTrabajo = Convert.ToInt32(dr["id_tipoTrabajo"]);
                                Entidad.id_Distrito = dr["id_Distrito"].ToString();
                                Entidad.referencia = dr["referencia"].ToString();
                                Entidad.descripcion_OT = dr["descripcion_OT"].ToString();
                                Entidad.id_estado = Convert.ToInt32(dr["id_estado"]);

                                obj_List.Add(Entidad);
                            }

                            if (obj_List.Count == 0)
                            {
                                res.ok = false;
                                res.data = "No hay informacion disponible";
                                res.totalpage = 0;
                            }
                            else {
                                res.ok = true;
                                res.data = GenerarArchivoExcel_aprobarOT_cab(obj_List, idUsuario);
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
        
        public string GenerarArchivoExcel_aprobarOT_cab(List<AprobarOT_E> listDetalle , int id_usuario)
        {
            string Res = "";
            int _fila = 4;
            string FileRuta = "";
            string FileExcel = "";

            try
            {

                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/Excel/" + id_usuario + "_aprobacionOT.xlsx");
                string rutaServer = ConfigurationManager.AppSettings["Archivos"];

                FileExcel = rutaServer + "Excel/" + id_usuario + "_aprobacionOT.xlsx";

                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                Thread.Sleep(1);

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("AprobacionOT");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));


                    oWs.Cells[1, 1].Style.Font.Size = 24; //letra tamaño  2
                    oWs.Cells[1, 1].Value = "APROBACION DE ORDENES TRABAJO";
                    oWs.Cells[1, 1, 1, 17].Merge = true;  // combinar celdaS


                    oWs.Cells[3, 1].Value = "ESTADO";
                    oWs.Cells[3, 2].Value = "TIPO DE ORDEN";
                    oWs.Cells[3, 3].Value = "NRO OBRA/ TD";
                    oWs.Cells[3, 4].Value = "PRIORIDAD";
                    oWs.Cells[3, 5].Value = "DIRECCION";
                    oWs.Cells[3, 6].Value = "DISTRITO"; 

                    oWs.Cells[3, 7].Value = "EMPRESA CONTRATISTA";
                    oWs.Cells[3, 8].Value = "JEFE CUADRILLA";
                    oWs.Cells[3, 9].Value = "GENERO UN VOLUMEN";
                    oWs.Cells[3, 10].Value = "VOLUMEN DE DESMONTE";

                    oWs.Cells[3, 11].Value = "VOLUMEN DE DESMONTE POR RECOGER";
                    oWs.Cells[3, 12].Value = "FECHA Y HORA DE REGISTRO";
                    oWs.Cells[3, 13].Value = "TOTAL EN VOLUMEN ";
                    oWs.Cells[3, 14].Value = "TOTAL EN DESMONTE ";

                    oWs.Cells[3, 15].Value = "TOTAL EN DESMONTE POR RECOGER";
                    oWs.Cells[3, 16].Value = "FECHA APROBACION";
                    oWs.Cells[3, 17].Value = "DIAS DE VENCIMIENTO";


                    foreach (var item in listDetalle) {

                        oWs.Cells[_fila, 1].Value = item.descripcionEstado.ToString();
                        oWs.Cells[_fila, 2].Value = item.tipoOT.ToString();
                        oWs.Cells[_fila, 3].Value = item.nroObra.ToString();
                        oWs.Cells[_fila, 4].Value = item.prioridad.ToString();
                        oWs.Cells[_fila, 5].Value = item.direccion.ToString();
                        oWs.Cells[_fila, 6].Value = item.distrito.ToString();

                        oWs.Cells[_fila, 7].Value = item.empresaContratista.ToString();
                        oWs.Cells[_fila, 8].Value = item.jefeCuadrilla.ToString();
                        oWs.Cells[_fila, 9].Value = item.generaVolumen.ToString();
                        oWs.Cells[_fila, 10].Value = item.volumenDesmonte.ToString();

                        oWs.Cells[_fila, 11].Value = item.volumenDesmonteRecoger.ToString();
                        oWs.Cells[_fila, 12].Value = item.fechaHora.ToString();

                        oWs.Cells[_fila, 13].Value = item.totalVolumen.ToString();
                        oWs.Cells[_fila, 13].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        oWs.Cells[_fila, 14].Value = item.totalDesmonte.ToString();
                        oWs.Cells[_fila, 14].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        oWs.Cells[_fila, 15].Value = item.totalDesmonteRecoger.ToString();
                        oWs.Cells[_fila, 15].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Right;

                        oWs.Cells[_fila, 16].Value = item.fechaAprobacion.ToString();
                        oWs.Cells[_fila, 17].Value = item.diasVencimiento.ToString();

                        _fila++;
                    }


                    oWs.Row(1).Style.Font.Bold = true;
                    oWs.Row(1).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(1).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Row(3).Style.Font.Bold = true;
                    oWs.Row(3).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(3).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int k = 1; k <= 17; k++)
                    {
                        oWs.Column(k).AutoFit();
                    }
                    oEx.Save();
                }

                Res = FileExcel;
            }
            catch (Exception  )
            {
                throw;
            }
            return Res;
        }

        public DataTable get_jefeCuadrilla_Empresa(int idEmpresa, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENES_TRABAJO_JEFE_CUADRILLA_EMPRESA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idEmpresa", SqlDbType.Int).Value = idEmpresa;
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
               
        public object get_ordenTrabajoCab_mapa(int idServicio, int idTipoOT, int idDistrito, int idProveedor, int idEstado, int idUsuario)
        {
            Resultado res = new Resultado();
            //List<OrdenTrabajo_E> obj_List = new List<OrdenTrabajo_E>();
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENES_TRABAJO_MAPA_LISTAR_ASIGNAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                        cmd.Parameters.Add("@idTipoOT", SqlDbType.Int).Value = idTipoOT;
                        cmd.Parameters.Add("@idDistrito", SqlDbType.Int).Value = idDistrito;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = idProveedor;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        //using (SqlDataReader dr = cmd.ExecuteReader())
                        //{
                        //    while (dr.Read())
                        //    {
                        //        OrdenTrabajo_E Entidad = new OrdenTrabajo_E();

                        //        Entidad.checkeado = false;
                        //        Entidad.id_OT = Convert.ToInt32(dr["id_OT"]);

                        //        Entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                        //        Entidad.tipoOT = dr["tipoOT"].ToString();
                        //        Entidad.nroObra = dr["nroObra"].ToString();
                        //        Entidad.direccion = dr["direccion"].ToString();

                        //        Entidad.distrito = dr["distrito"].ToString();
                        //        Entidad.volumen = dr["volumen"].ToString();
                        //        Entidad.jefeCuadrilla = dr["jefeCuadrilla"].ToString();
                        //        Entidad.empresaContratista = dr["empresaContratista"].ToString();

                        //        Entidad.fechaHora = dr["fechaHora"].ToString();
                        //        Entidad.Informe = dr["Informe"].ToString();
                        //        Entidad.diasVencimiento = dr["diasVencimiento"].ToString();

                        //        Entidad.idJefeCuadrilla = dr["idJefeCuadrilla"].ToString();
                        //        Entidad.idEmpresa = dr["idEmpresa"].ToString();


                        //        obj_List.Add(Entidad);
                        //    }

                        //    res.ok = true;
                        //    res.data = obj_List;
                        //    res.totalpage = 0;
                        //}



                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                        res.ok = true;
                        res.data = dt_detalle;
                        res.totalpage = 0;

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

        public string set_asignarReasignarOT_mapa(string codigosOT, int idEmpresa, int idCuadrilla, int idEstado,   int idUsuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENES_TRABAJO_MAPA_ASIGNAR_REASIGNAR_GRABAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@codigosOT", SqlDbType.VarChar).Value = codigosOT;
                        cmd.Parameters.Add("@idEmpresa", SqlDbType.Int).Value = idEmpresa;
                        cmd.Parameters.Add("@idCuadrilla", SqlDbType.Int).Value = idCuadrilla;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;
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


        public object get_detalleOrdenTrabajoCab_mapa(int idServicio, int idTipoOT, int idDistrito, int idProveedor, int idEstado, int idUsuario)
        {
            Resultado res = new Resultado();
            //List<OrdenTrabajo_E> obj_List = new List<OrdenTrabajo_E>();
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENES_TRABAJO_MAPA_LISTAR_DETALLE", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                        cmd.Parameters.Add("@idTipoOT", SqlDbType.Int).Value = idTipoOT;
                        cmd.Parameters.Add("@idDistrito", SqlDbType.Int).Value = idDistrito;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = idProveedor;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        //using (SqlDataReader dr = cmd.ExecuteReader())
                        //{
                        //    while (dr.Read())
                        //    {
                        //        OrdenTrabajo_E Entidad = new OrdenTrabajo_E();

                        //        Entidad.checkeado = false;
                        //        Entidad.id_OT = Convert.ToInt32(dr["id_OT"]);

                        //        Entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                        //        Entidad.tipoOT = dr["tipoOT"].ToString();
                        //        Entidad.nroObra = dr["nroObra"].ToString();
                        //        Entidad.direccion = dr["direccion"].ToString();

                        //        Entidad.distrito = dr["distrito"].ToString();
                        //        Entidad.volumen = dr["volumen"].ToString();
                        //        Entidad.jefeCuadrilla = dr["jefeCuadrilla"].ToString();
                        //        Entidad.empresaContratista = dr["empresaContratista"].ToString();

                        //        Entidad.fechaHora = dr["fechaHora"].ToString();
                        //        Entidad.Informe = dr["Informe"].ToString();
                        //        Entidad.diasVencimiento = dr["diasVencimiento"].ToString();

                        //        Entidad.idJefeCuadrilla = dr["idJefeCuadrilla"].ToString();
                        //        Entidad.idEmpresa = dr["idEmpresa"].ToString();


                        //        obj_List.Add(Entidad);
                        //    }

                        //    res.ok = true;
                        //    res.data = obj_List;
                        //    res.totalpage = 0;
                        //}



                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                        res.ok = true;
                        res.data = dt_detalle;
                        res.totalpage = 0;

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
                
        public string get_descargar_Todos_fotosOT(int idOt, int idTipoOt, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            List<download> list_files = new List<download>();
            string pathfile = "";
            string ruta_descarga = "";

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBACION_OT_DESCARGAR_FOTOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idOT", SqlDbType.Int).Value = idOt;
                        cmd.Parameters.Add("@idTipoOT", SqlDbType.Int).Value = idTipoOt;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            pathfile = HttpContext.Current.Server.MapPath("~/Archivos/Fotos/");

                            foreach (DataRow Fila in dt_detalle.Rows)
                            {
                                download obj_entidad = new download();
                                obj_entidad.nombreFile = Fila["nombreArchivo"].ToString();
                                obj_entidad.ubicacion = pathfile;
                                list_files.Add(obj_entidad);
                            }

                            if (list_files.Count > 0)
                            {
                                if (list_files.Count == 1)
                                {
                                    ruta_descarga = ConfigurationManager.AppSettings["Archivos"] + "Fotos/" + list_files[0].nombreFile;
                                }
                                else
                                {
                                    ruta_descarga = comprimir_Files(list_files, idUsuario);
                                }
                            }
                            else
                            {
                                throw new System.InvalidOperationException("No hay archivo para Descargar");
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return ruta_descarga;
        }

        public string comprimir_Files(List<download> list_download, int usuario_creacion)
        {
            string resultado = "";
            try
            {
                string ruta_destino = "";
                string ruta_descarga = "";
                string pathFoto = "";


                ruta_destino = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/Descargas/Fotos_OT" + usuario_creacion + "Descarga.zip");
                ruta_descarga = ConfigurationManager.AppSettings["Archivos"] + "Descargas/Fotos_OT" + usuario_creacion + "Descarga.zip";

                if (File.Exists(ruta_destino)) /// verificando si existe el archivo zip
                {
                    System.IO.File.Delete(ruta_destino);
                }
                using (Ionic.Zip.ZipFile zip = new Ionic.Zip.ZipFile())
                {
                    foreach (download item in list_download)
                    {
                        pathFoto = item.ubicacion + item.nombreFile;
                        if (System.IO.File.Exists(pathFoto))
                        {
                            zip.AddFile(pathFoto, "");
                        }
                    }
                    // Guardando el archivo zip 
                    zip.Save(ruta_destino);
                }
                Thread.Sleep(2000);

                if (File.Exists(ruta_destino))
                {
                    resultado = ruta_descarga;
                }
                else
                {
                    throw new System.InvalidOperationException("No se pudo generar la Descarga del Archivo");
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return resultado;
        }
               
        public string get_descargar_fotosOT_visor(int idOt_foto, int idTipoOt, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            List<download> list_files = new List<download>();
            string pathfile = "";
            string ruta_descarga = "";

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_APROBACION_OT_DESCARGAR_FOTOS_VISOR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idOt_foto", SqlDbType.Int).Value = idOt_foto;
                        //cmd.Parameters.Add("@idTipoOT", SqlDbType.Int).Value = idTipoOt;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            pathfile = HttpContext.Current.Server.MapPath("~/Archivos/Fotos/");

                            foreach (DataRow Fila in dt_detalle.Rows)
                            {
                                download obj_entidad = new download();
                                obj_entidad.nombreFile = Fila["nombreArchivo"].ToString();
                                obj_entidad.ubicacion = pathfile;
                                list_files.Add(obj_entidad);
                            }

                            if (list_files.Count > 0)
                            {
                                if (list_files.Count == 1)
                                {
                                    ruta_descarga = ConfigurationManager.AppSettings["Archivos"] + "Fotos/" + list_files[0].nombreFile;
                                }
                                else
                                {
                                    ruta_descarga = comprimir_Files(list_files, idUsuario);
                                }
                            }
                            else
                            {
                                throw new System.InvalidOperationException("No hay archivo para Descargar");
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return ruta_descarga;
        }

        public string set_asignacionAutomatica(int idServicio, int idTipoOT, int idDistrito, int idProveedor, int idEstado, int idUsuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENES_TRABAJO_ASIGNACION_AUTOMATICA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                        cmd.Parameters.Add("@idTipoOT", SqlDbType.Int).Value = idTipoOT;
                        cmd.Parameters.Add("@idDistrito", SqlDbType.Int).Value = idDistrito;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = idProveedor;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;
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
        
        public object get_descargar_OT(int idServicio, int idTipoOT, int idDistrito, int idProveedor, int idEstado, int idUsuario)
        {
            Resultado res = new Resultado();
            List<OrdenTrabajo_E> obj_List = new List<OrdenTrabajo_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_ORDENES_TRABAJO_LISTAR_CAB", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                        cmd.Parameters.Add("@idTipoOT", SqlDbType.Int).Value = idTipoOT;
                        cmd.Parameters.Add("@idDistrito", SqlDbType.Int).Value = idDistrito;
                        cmd.Parameters.Add("@idProveedor", SqlDbType.Int).Value = idProveedor;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                OrdenTrabajo_E Entidad = new OrdenTrabajo_E();

                                Entidad.id_OT = Convert.ToInt32(dr["id_OT"]);

                                Entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                                Entidad.tipoOT = dr["tipoOT"].ToString();
                                Entidad.nroObra = dr["nroObra"].ToString();
                                Entidad.direccion = dr["direccion"].ToString();

                                Entidad.distrito = dr["distrito"].ToString();
                                Entidad.volumen = dr["volumen"].ToString();
                                Entidad.jefeCuadrilla = dr["jefeCuadrilla"].ToString();
                                Entidad.empresaContratista = dr["empresaContratista"].ToString();

                                Entidad.fechaHora = dr["fechaHora"].ToString();
                                Entidad.Informe = dr["Informe"].ToString();
                                Entidad.diasVencimiento = dr["diasVencimiento"].ToString();

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
                                res.data = GenerarArchivoExcel_Ot_cab(obj_List, idUsuario);
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
        
        public string GenerarArchivoExcel_Ot_cab(List<OrdenTrabajo_E> listDetalle, int id_usuario)
        {
            string Res = "";
            int _fila = 4;
            string FileRuta = "";
            string FileExcel = "";

            try
            {
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/Excel/" + id_usuario + "_asignacionOT.xlsx");
                string rutaServer = ConfigurationManager.AppSettings["Archivos"];

                FileExcel = rutaServer + "Excel/" + id_usuario + "_asignacionOT.xlsx";

                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }

                Thread.Sleep(1);

                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("AsignacionOT");
                    oWs.Cells.Style.Font.SetFromFont(new Font("Tahoma", 8));


                    oWs.Cells[1, 1].Style.Font.Size = 24; //letra tamaño  2
                    oWs.Cells[1, 1].Value = "ASIGNACION DE ORDENES TRABAJO";
                    oWs.Cells[1, 1, 1, 10].Merge = true;  // combinar celdaS


                    oWs.Cells[3, 1].Value = "ESTADO";
                    oWs.Cells[3, 2].Value = "TIPO DE ORDEN";
                    oWs.Cells[3, 3].Value = "NRO OBRA/ TD"; 
                    oWs.Cells[3, 4].Value = "DIRECCION";
                    oWs.Cells[3, 5].Value = "DISTRITO";

                    oWs.Cells[3, 6].Value = "VOLUMEN";
                    oWs.Cells[3, 7].Value = "JEFE CUADRILLA";
                    oWs.Cells[3, 8].Value = "EMPRESA CONTRATISTA"; 
                    oWs.Cells[3, 9].Value = "FECHA Y HORA DE REGISTRO"; 
                    oWs.Cells[3, 10].Value = "DIAS DE VENCIMIENTO";


                    foreach (var item in listDetalle)
                    {
                        oWs.Cells[_fila, 1].Value = item.descripcionEstado.ToString();
                        oWs.Cells[_fila, 2].Value = item.tipoOT.ToString();
                        oWs.Cells[_fila, 3].Value = item.nroObra.ToString();
                        oWs.Cells[_fila, 4].Value = item.direccion.ToString();
                        oWs.Cells[_fila, 5].Value = item.distrito.ToString();

                        oWs.Cells[_fila, 6].Value = item.volumen.ToString();
                        oWs.Cells[_fila, 7].Value = item.jefeCuadrilla.ToString();
                        oWs.Cells[_fila, 8].Value = item.empresaContratista.ToString();          
                        oWs.Cells[_fila, 9].Value = item.fechaHora.ToString(); 
                        oWs.Cells[_fila, 10].Value = item.diasVencimiento.ToString();

                        _fila++;
                    }


                    oWs.Row(1).Style.Font.Bold = true;
                    oWs.Row(1).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(1).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    oWs.Row(3).Style.Font.Bold = true;
                    oWs.Row(3).Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                    oWs.Row(3).Style.VerticalAlignment = Style.ExcelVerticalAlignment.Center;

                    for (int k = 1; k <= 10; k++)
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


    }
}
