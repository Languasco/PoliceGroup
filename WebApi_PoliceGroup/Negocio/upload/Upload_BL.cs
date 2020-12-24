using Negocio.Conexion;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.OleDb;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Excel = OfficeOpenXml;
using Style = OfficeOpenXml.Style;

namespace Negocio.upload
{
    public class Upload_BL
    {
        OleDbConnection cn;

        public string setAlmacenandoFile_Excel(string fileLocation, string nombreArchivo, string fechaImportacion, string idUsuario)
        {
            string resultado = "";
            DataTable dt = new DataTable();

            try
            {

                dt = ListaExcel(fileLocation);

                using (SqlConnection con = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    con.Open();

                    //eliminando registros del usuario
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_TEMPORAL_ORDENES_DELETE", con))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.VarChar).Value = idUsuario;
                        cmd.ExecuteNonQuery();
                    }

                    //guardando al informacion de la importacion
                    using (SqlBulkCopy bulkCopy = new SqlBulkCopy(con))
                    {

                        bulkCopy.BatchSize = 500;
                        bulkCopy.NotifyAfter = 1000;
                        bulkCopy.DestinationTableName = "TEMPORAL_ORDENES";
                        bulkCopy.WriteToServer(dt);

                        //Actualizando campos 

                        string Sql = "UPDATE TEMPORAL_ORDENES SET nombreArchivo='" + nombreArchivo + "',   fecha_importacion ='" + fechaImportacion + "' , usuario_importacion='" + idUsuario + "', fechaBD=getdate()   WHERE usuario_importacion IS NULL    ";

                        using (SqlCommand cmd = new SqlCommand(Sql, con))
                        {
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.Text;
                            cmd.ExecuteNonQuery();
                        }
                    }
                    resultado = "OK";
                }
            }
            catch (Exception)
            {
                throw;
            }
            return resultado;
         }

        private OleDbConnection ConectarExcel(string rutaExcel)
        {
            cn = new OleDbConnection();
            try
            {
                //cn.ConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + nomExcel + ";Extended Properties='Excel 12.0 Xml;HDR=Yes'";
                cn.ConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + rutaExcel + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";
                ///---podria funcionar
               // cn.ConnectionString = "Microsoft.ACE.OLEDB.12.0; Data Source =" + rutaExcel + "; Extended Properties ='Excel 12.0 Xml;HDR=YES;IMEX=1'";


                cn.Open();
                return cn;
            }
            catch (Exception)
            {
                cn.Close();
                throw;
            }
        }

        public DataTable ListaExcel(string fileLocation)
        {
            DataTable dt = new DataTable();
            try
            {
                string sql = "SELECT *FROM [Importar$]";

                OleDbDataAdapter da = new OleDbDataAdapter(sql, ConectarExcel(fileLocation));
                da.SelectCommand.CommandType = CommandType.Text;
                da.Fill(dt);
                cn.Close();
            }
            catch (Exception)
            {
                cn.Close();
                throw;
            }
            return dt;
        }
               
        public DataTable get_datosCargados(string id_usuario, string fechaImportacion)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_IMPORTAR_EXCEL_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.VarChar).Value = id_usuario;
                        cmd.Parameters.Add("@fecha_importa", SqlDbType.VarChar).Value = fechaImportacion;

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
                     
        public string generarExcelResumenOperario(DataTable listReporteGeneral, string fechaini, string imgBase)
        {
            string Res = "";
            string _servidor;

            string FileRuta = "";
            string FileExcel = "";

            try
            {
                _servidor = String.Format("{0:ddMMyyyy_hhmmss}.xlsx", DateTime.Now);
                FileRuta = System.Web.Hosting.HostingEnvironment.MapPath("~/ArchivosExcel/" + "RESUMEN_OPERARIO" + _servidor);
                string rutaServer = ConfigurationManager.AppSettings["servidor_archivos"];

                FileExcel = rutaServer + "RESUMEN_OPERARIO" + _servidor;
                FileInfo _file = new FileInfo(FileRuta);
                if (_file.Exists)
                {
                    _file.Delete();
                    _file = new FileInfo(FileRuta);
                }


                if (listReporteGeneral.Rows.Count <= 0)
                {
                    Res = "0|No hay informacion disponible";
                    return Res;
                }



                using (Excel.ExcelPackage oEx = new Excel.ExcelPackage(_file))
                {
                    Excel.ExcelWorksheet oWs = oEx.Workbook.Worksheets.Add("reporte");


                    oWs.Cells[1, 1].Value = "RESUMEN POR OPERARIO: ";
                    oWs.Cells[1, 1].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center; // alinear texto  
                    oWs.Cells[1, 1, 1, 18].Merge = true;  // combinar celdaS 
                    oWs.Cells[1, 1].Style.Font.Size = 15; //letra tamaño   

                    int _ultimaRow = 6;
                    int count = 0;

                    foreach (DataRow item in listReporteGeneral.Rows)
                    {
                        count = 0;
                        foreach (DataColumn col in listReporteGeneral.Columns)
                        {
                            count++;
                            string field = col.ToString();
                            oWs.Cells[_ultimaRow, count].Value = item[field];
                            oWs.Cells[_ultimaRow, count].Style.Font.Size = 8; //letra tamaño   
                            oWs.Cells[_ultimaRow, count].Style.HorizontalAlignment = Style.ExcelHorizontalAlignment.Center;
                        }
                        _ultimaRow++;
                    }
 
                    oEx.Save();
                    Res = "1|" + FileExcel;
                }
            }
            catch (Exception ex)
            {
                Res = "0|" + ex.Message;
            }
            return Res;
        }
                
        public int crear_archivoAcronimo(int idOt, int idformato, int idUsuario, string nombreArchivo, int opcionModal, string codCad)
        {
            int resultado = 0;
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_SEGUIMIENTO_ORDENES_FILE_ACRONIMOS_OT", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Ot", SqlDbType.Int).Value = idOt;
                        cmd.Parameters.Add("@id_formato", SqlDbType.Int).Value = idformato;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@nombre_archivo", SqlDbType.VarChar).Value = nombreArchivo;
                        cmd.Parameters.Add("@opcion_importacion", SqlDbType.Int).Value = opcionModal;
                        cmd.Parameters.Add("@codCad", SqlDbType.VarChar).Value = codCad;
                        cmd.Parameters.Add("@name_bd", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.ExecuteNonQuery(); 
                        resultado = Convert.ToInt32(cmd.Parameters["@name_bd"].Value);
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return resultado;
        }
        
        public string setAlmacenandoFile_Excel_personal(string fileLocation, string nombreArchivo, int idEmpresa, int idUsuario)
        {
            string resultado = "";
            DataTable dt = new DataTable();

            try
            {
                dt = ListaExcel(fileLocation);

                using (SqlConnection con = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    con.Open();

                    //eliminando registros del usuario
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_MANT_PERSONAL_TEMPORAL_PERSONAL_DELETE", con))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.VarChar).Value = idUsuario;
                        cmd.ExecuteNonQuery();
                    }

                    //guardando al informacion de la importacion
                    using (SqlBulkCopy bulkCopy = new SqlBulkCopy(con))
                    {

                        bulkCopy.BatchSize = 500;
                        bulkCopy.NotifyAfter = 1000;
                        bulkCopy.DestinationTableName = "TEMPORAL_PERSONAL";
                        bulkCopy.WriteToServer(dt);

                        //Actualizando campos 

                        string Sql = "UPDATE TEMPORAL_PERSONAL SET nombreArchivo='" + nombreArchivo + "',  usuario_importacion='" + idUsuario + "', fechaBD=getdate() , empresa_importacion='" + idEmpresa + "'  WHERE usuario_importacion IS NULL    ";

                        using (SqlCommand cmd = new SqlCommand(Sql, con))
                        {
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.Text;
                            cmd.ExecuteNonQuery();
                        }
                    }
                    resultado = "OK";
                }
            }
            catch (Exception)
            {
                throw;
            }
            return resultado;
        }

        public DataTable get_datosCargados_personal(int id_usuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_MANT_PERSONAL_TEMPORAL_PERSONAL_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario; 

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

        public int crear_archivosAdicionalesDocumentosCab(int idPolicia, int id_Documento_Policial, string fechaI, string fechaF, string nombreArchivo, string idUsuario )
        {
            int resultado = 0;
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_MANT_POLICIA_DOCUMENTOS_GRABAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idPolicia", SqlDbType.Int).Value = idPolicia;
                        cmd.Parameters.Add("@id_Documento_Policial", SqlDbType.Int).Value = id_Documento_Policial;
                        cmd.Parameters.Add("@fechaInicial", SqlDbType.VarChar).Value = fechaI;
                        cmd.Parameters.Add("@fechaFinal", SqlDbType.VarChar).Value = fechaF;

                        cmd.Parameters.Add("@nombreArchivo", SqlDbType.VarChar).Value = nombreArchivo;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUsuario;
                        cmd.Parameters.Add("@name_bd", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.ExecuteNonQuery();
                        resultado = Convert.ToInt32(cmd.Parameters["@name_bd"].Value);
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return resultado;
        }
        
        public int crear_documentosSolicitudInformacion_det(int id_Ibp_Det , string nombreArchivo, string idUsuario)
        {
            int resultado = 0;
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_BANDEJA_SOLICITUD_INFO_PERS_DET_DOCUMENTOS_GRABAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Ibp_Det", SqlDbType.Int).Value = id_Ibp_Det;
                        cmd.Parameters.Add("@nombreArchivo", SqlDbType.VarChar).Value = nombreArchivo;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUsuario;
                        cmd.Parameters.Add("@name_bd", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.ExecuteNonQuery();
                        resultado = Convert.ToInt32(cmd.Parameters["@name_bd"].Value);
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return resultado;
        }


    }
}
