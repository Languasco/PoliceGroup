using Negocio.Conexion;
using Negocio.Procesos;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Threading;
using System.Web;
using ThoughtWorks.QRCode.Codec;

namespace Negocio.Mantenimientos
{
    public class Proveedor_BL
    {
        public DataTable get_DatosGenerales_Iconos(int idIcon)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_MANT_EMPRESAS_ICONOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idIcono", SqlDbType.Int).Value = idIcon;

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

        public string set_grabar_ImportacionPersonal(int id_usuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_MANT_PERSONAL_TEMPORAL_PERSONAL_GRABAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.VarChar).Value = id_usuario;

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


        public string set_grabar_areasMasivas(int idUsuarioBD, string areasMasivo, int idusuarioLoggin)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_MANT_USUARIO_AREAS_MASIVO_GRABAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idUsuarioBD", SqlDbType.Int).Value = idUsuarioBD;
                        cmd.Parameters.Add("@areasMasivo", SqlDbType.VarChar).Value = areasMasivo;
                        cmd.Parameters.Add("@idusuarioLogin", SqlDbType.Int).Value = idusuarioLoggin;

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
        

        public string get_generarDescargar_CodigoQR(int idUsuarioBD)
        {
            string resultado = "";
            try
            {
                DataTable dt_usuarios = new DataTable();
                string rutaQR = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/QR/" + idUsuarioBD + ".gif");
                string FileExcel = ConfigurationManager.AppSettings["Archivos"] + "QR/" + idUsuarioBD + ".gif";

                if (File.Exists(rutaQR)) /// verificando si existe el archivo zip
                {
                    System.IO.File.Delete(rutaQR);
                }

                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_MANT_USUARIO_CODIGO_QR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idUsuarioBD", SqlDbType.Int).Value = idUsuarioBD;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_usuarios);
                        }
                    }
                                                         
                    if (dt_usuarios.Rows.Count > 0)
                    {
                        ///------GENERANDO EL CODIGO QR------
                            var Codigo_Has = "";
                                Codigo_Has = dt_usuarios.Rows[0]["codigoQR"].ToString();
 
                            byte[] obj_codQR = GeneraCodigoQR(Codigo_Has);

                            using (FileStream Writer = new System.IO.FileStream(rutaQR, FileMode.Create, FileAccess.Write))
                            {
                                Writer.Write(obj_codQR, 0, obj_codQR.Length);
                            }

                        if (File.Exists(rutaQR)) /// verificando si existe el archivo zip
                        {
                            resultado = FileExcel;
                        }
                        else {
                            throw new System.ArgumentException("No se pudo almacenar el archivo en el servidor");
                        }

              

                        //---- FIN DE GENERACION CODIGO QR---------
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return resultado;
        }

        public byte[] GeneraCodigoQR(string TextoCodificar)
        {
            //Instancia del objeto encargado de codificar el codigo QR
            QRCodeEncoder CodigoQR = new QRCodeEncoder();

            CodigoQR.QRCodeEncodeMode = QRCodeEncoder.ENCODE_MODE.BYTE;
            CodigoQR.QRCodeScale = 4;
            CodigoQR.QRCodeErrorCorrect = ThoughtWorks.QRCode.Codec.QRCodeEncoder.ERROR_CORRECTION.M;
            CodigoQR.QRCodeVersion = 0;
            CodigoQR.QRCodeBackgroundColor = System.Drawing.Color.White;
            CodigoQR.QRCodeForegroundColor = System.Drawing.Color.Black;

            //Se retorna el Codigo QR codificado en formato de arreglo de bytes.
            return imageToByteArray(CodigoQR.Encode(TextoCodificar, System.Text.Encoding.UTF8));
        }

        public byte[] imageToByteArray(System.Drawing.Image imageIn)
        {
            System.IO.MemoryStream ms = new System.IO.MemoryStream();
            imageIn.Save(ms, System.Drawing.Imaging.ImageFormat.Gif);
            return ms.ToArray();
        }

        public DataTable get_empresasPorUsuario(int idser)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_COMBO_EMPRESA_USUARIO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idser;

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


        public DataTable get_listadoPersonales(int idEmpresa, int idEstado)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_MANT_PERSONAL_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idEmpresa", SqlDbType.Int).Value = idEmpresa;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;

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
                       

        public string set_grabar_empresasMasivas(int idPersonal, string empresasMasivo, int idusuarioLoggin)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_MANT_POLICIAS_EMPRESA_MASIVO_GRABAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idPersonal", SqlDbType.Int).Value = idPersonal;
                        cmd.Parameters.Add("@empresasMasivo", SqlDbType.VarChar).Value = empresasMasivo;
                        cmd.Parameters.Add("@idusuarioLogin", SqlDbType.Int).Value = idusuarioLoggin;

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

        public string set_grabar_empresasMasivas_usuario(int idUsuario, string empresasMasivo, int idusuarioLoggin)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_MANT_USUARIO_EMPRESA_MASIVO_GRABAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@empresasMasivo", SqlDbType.VarChar).Value = empresasMasivo;
                        cmd.Parameters.Add("@idusuarioLogin", SqlDbType.Int).Value = idusuarioLoggin;

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
               
        public DataTable get_archivosAdicionales(int idPolicia)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_MANT_POLICIA_DOCUMENTOS_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idPolicia", SqlDbType.Int).Value = idPolicia;

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
        
        public object set_eliminarArchivoAdicional(int id_PersonalDocumento)
        {
            Resultado res = new Resultado();
            string sPath = HttpContext.Current.Server.MapPath("~/Archivos/Documentos/" + id_PersonalDocumento);
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_MANT_POLICIA_DOCUMENTOS_ELIMINAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_PersonalDocumento", SqlDbType.Int).Value = id_PersonalDocumento;
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




        public string get_download_archivosAdicionalesImportados(int id_PersonalDocumento, string iduser)
        {
            DataTable dt_detalle = new DataTable();
            List<download> list_files = new List<download>();
            string pathfile = "";
            string rutaOrig = "";
            string rutaDest = "";
            string nombreArchivoReal = "";
            string ruta_descarga = "";

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_MANT_POLICIA_DOCUMENTOS_DESCARGAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_PersonalDocumento", SqlDbType.Int).Value = id_PersonalDocumento;
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            pathfile = HttpContext.Current.Server.MapPath("~/Archivos/Documentos/");

                            foreach (DataRow Fila in dt_detalle.Rows)
                            {
                                download obj_entidad = new download();
                                obj_entidad.nombreFile = Fila["nombreArchivo"].ToString();
                                obj_entidad.nombreBd = Fila["nombreArchivo_bd"].ToString();
                                obj_entidad.ubicacion = pathfile;

                                list_files.Add(obj_entidad);
                            }

                            ////restaurando el archivo...
                            foreach (download item in list_files)
                            {
                                nombreArchivoReal = "";
                                nombreArchivoReal = item.nombreBd.Replace(item.nombreBd, item.nombreFile);

                                rutaOrig = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/Documentos/" + item.nombreBd);
                                rutaDest = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/Documentos/Descargas/" + nombreArchivoReal);

                                if (System.IO.File.Exists(rutaDest)) //--- borrando restaurarlo
                                {
                                    System.IO.File.Delete(rutaDest);
                                    System.IO.File.Copy(rutaOrig, rutaDest);
                                }
                                else //--- restaurandolo
                                {
                                    System.IO.File.Copy(rutaOrig, rutaDest);
                                }
                                Thread.Sleep(1000);
                            }


                            if (list_files.Count > 0)
                            {
                                if (list_files.Count == 1)
                                {
                                    ruta_descarga = ConfigurationManager.AppSettings["Archivos"] + "Documentos/Descargas/" + list_files[0].nombreFile;
                                }
                                //else
                                //{
                                //    ruta_descarga = comprimir_Files(list_files, id_usuario, tipo);
                                //}
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
        
        public DataTable get_listadoPolicias(int idEmpresa, int idEstado)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_MANT_POLICIA_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        //cmd.Parameters.Add("@idEmpresa", SqlDbType.Int).Value = idEmpresa;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;

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
               
        public DataTable get_mostrar_personalPolicial(int idEmpresa)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REPORTE_PERSONAL_POLICIA_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idEmpresa", SqlDbType.Int).Value = idEmpresa;

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
        
        public string set_grabar_solicitudInformacionDetMasivas(int id_Ibp_Cab, string docMasivo, int idusuarioLoggin)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_SOLICITUD_INFORMACION_PERSONAL_DET_MASIVO_GRABAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Ibp_Cab", SqlDbType.Int).Value = id_Ibp_Cab;
                        cmd.Parameters.Add("@docMasivo", SqlDbType.VarChar).Value = docMasivo;
                        cmd.Parameters.Add("@idusuarioLogin", SqlDbType.Int).Value = idusuarioLoggin;

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

        public DataTable get_servicioEmpresa(int idEmpresa, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_MANT_PERSONAL_COMBO_SERVICIO_EMPRESA", cn))
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
        
        public string get_download_archivos_solicitudInformacionDet(int id_Ibp_det, string iduser)
        {
            DataTable dt_detalle = new DataTable();
            List<download> list_files = new List<download>();
            string pathfile = "";
            string rutaOrig = "";
            string rutaDest = "";
            string nombreArchivoReal = "";
            string ruta_descarga = "";

            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_BANDEJA_SOLICITUD_INFO_PERS_DET_DOCUMENTOS_DESCARGA", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Ibp_det", SqlDbType.Int).Value = id_Ibp_det;
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                            pathfile = HttpContext.Current.Server.MapPath("~/Archivos/Documentos_Ibp/");

                            foreach (DataRow Fila in dt_detalle.Rows)
                            {
                                download obj_entidad = new download();
                                obj_entidad.nombreFile = Fila["nombreArchivo"].ToString();
                                obj_entidad.nombreBd = Fila["nombreArchivo_bd"].ToString();
                                obj_entidad.ubicacion = pathfile;

                                list_files.Add(obj_entidad);
                            }

                            ////restaurando el archivo...
                            foreach (download item in list_files)
                            {
                                nombreArchivoReal = "";
                                nombreArchivoReal = item.nombreBd.Replace(item.nombreBd, item.nombreFile);

                                rutaOrig = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/Documentos_Ibp/" + item.nombreBd);
                                rutaDest = System.Web.Hosting.HostingEnvironment.MapPath("~/Archivos/Documentos_Ibp/Descargas/" + nombreArchivoReal);

                                if (System.IO.File.Exists(rutaDest)) //--- borrando restaurarlo
                                {
                                    System.IO.File.Delete(rutaDest);
                                    System.IO.File.Copy(rutaOrig, rutaDest);
                                }
                                else //--- restaurandolo
                                {
                                    System.IO.File.Copy(rutaOrig, rutaDest);
                                }
                                Thread.Sleep(1000);
                            }


                            if (list_files.Count > 0)
                            {
                                if (list_files.Count == 1)
                                {
                                    ruta_descarga = ConfigurationManager.AppSettings["Archivos"] + "Documentos_Ibp/Descargas/" + list_files[0].nombreFile;
                                }
                                //else
                                //{
                                //    ruta_descarga = comprimir_Files(list_files, id_usuario, tipo);
                                //}
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
        
        public DataTable get_listadoEfectivosPoliciales(int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("DSIGE_PROY_W_REPORTE_TAREO_COMBO_EFECTIVO", cn))
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




    }
}
