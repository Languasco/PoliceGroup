using Datos;
using Negocio.Mantenimientos;
using Negocio.Resultados;
using Negocio.upload;
using System;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

 
namespace WebApi_policeGroup.Controllers.upload
{
    [EnableCors("*", "*", "*")]
    public class UploadsController : ApiController
    {
        private policegroupEntities db = new policegroupEntities();

        [HttpPost]
        [Route("api/Uploads/post_archivoExcel")]
        public object post_archivoExcel(string filtros)
        {
            Resultado res = new Resultado();
            var nombreFile = "";
            string sPath = "";

            try
            {
                //--- obteniendo los parametros que vienen por el FormData

                var file = HttpContext.Current.Request.Files["file"];
                //--- obteniendo los parametros que vienen por el FormData
                string extension = Path.GetExtension(file.FileName);

                string[] parametros = filtros.Split('|');
                string fechaImportacion = parametros[0].ToString();
                string idUsuario = parametros[1].ToString();

                //nombreFile = "Impotacion_Excels" + "_" + idUsuario + extension;

                //-----generando clave unica---
                var guid = Guid.NewGuid();
                var guidB = guid.ToString("B");
                nombreFile = idUsuario + "_Importacion_Excel_" + Guid.Parse(guidB) + extension;

                //-------almacenando la archivo---
                sPath = HttpContext.Current.Server.MapPath("~/Archivos/Excel/" + nombreFile);
                //if (System.IO.File.Exists(sPath))
                //{
                //    System.IO.File.Delete(sPath);
                //}
                file.SaveAs(sPath);

                //-------almacenando la archivo---
                if (File.Exists(sPath))
                {
                    Upload_BL obj_negocio = new Upload_BL();
                    string valor = obj_negocio.setAlmacenandoFile_Excel(sPath, file.FileName, fechaImportacion, idUsuario);
                    if (valor == "OK")
                    {
                        res.ok = true;
                        res.data = obj_negocio.get_datosCargados(idUsuario, fechaImportacion);
                        res.totalpage = 0;
                    }
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo almacenar el archivo en el servidor";
                    res.totalpage = 0;
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
        
        [HttpPost]
        [Route("api/Uploads/post_archivosAcronimos")]
        public object post_archivosAcronimos(string filtros)
        {
            Resultado res = new Resultado();
            int nombreFileBD;
            string sPath = "";

            try
            {
                //--- obteniendo los parametros que vienen por el FormData

                var file = HttpContext.Current.Request.Files["file"];
                //--- obteniendo los parametros que vienen por el FormData
                string extension = Path.GetExtension(file.FileName);

                string[] parametros = filtros.Split('|');
                int idOt = Convert.ToInt32(parametros[0].ToString());
                int idFormato = Convert.ToInt32(parametros[1].ToString());
                int idUsuario = Convert.ToInt32(parametros[2].ToString());
                int opcionModal = Convert.ToInt32(parametros[3].ToString());
                string codCad =  parametros[4].ToString();
 


                Upload_BL obj_negocios = new Upload_BL();
                nombreFileBD = obj_negocios.crear_archivoAcronimo(idOt, idFormato, idUsuario, file.FileName, opcionModal, codCad);
                
                //-------almacenando la archivo---
                sPath = HttpContext.Current.Server.MapPath("~/Archivos/Acronimos/" + nombreFileBD);
                file.SaveAs(sPath);

                //-------almacenando la archivo---
                if (File.Exists(sPath))
                {
                    res.ok = true;
                    res.data = "OK";
                    res.totalpage = 0;
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo almacenar el archivo en el servidor";
                    res.totalpage = 0;
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
        
        [HttpPost]
        [Route("api/Uploads/post_archivoExcel_personal")]
        public object post_archivoExcel_personal(string filtros)
        {
            Resultado res = new Resultado();
            var nombreFile = "";
            string sPath = "";

            try
            {
                //--- obteniendo los parametros que vienen por el FormData

                var file = HttpContext.Current.Request.Files["file"];
                //--- obteniendo los parametros que vienen por el FormData
                string extension = Path.GetExtension(file.FileName);

                string[] parametros = filtros.Split('|');
                int idEmpresa = Convert.ToInt32(parametros[0].ToString());
                int idUsuario = Convert.ToInt32(parametros[1].ToString());

                //nombreFile = "Impotacion_Excels" + "_" + idUsuario + extension;

                //-----generando clave unica---
                var guid = Guid.NewGuid();
                var guidB = guid.ToString("B");
                nombreFile = idUsuario + "_Importacion_Excel_personal" + Guid.Parse(guidB) + extension;

                //-------almacenando la archivo---
                sPath = HttpContext.Current.Server.MapPath("~/Archivos/Excel/" + nombreFile);
                //if (System.IO.File.Exists(sPath))
                //{
                //    System.IO.File.Delete(sPath);
                //}
                file.SaveAs(sPath);

                //-------almacenando la archivo---
                if (File.Exists(sPath))
                {
                    Upload_BL obj_negocio = new Upload_BL();
                    string valor = obj_negocio.setAlmacenandoFile_Excel_personal(sPath, file.FileName, idEmpresa, idUsuario);
                    if (valor == "OK")
                    {
                        res.ok = true;
                        res.data = obj_negocio.get_datosCargados_personal(idUsuario);     
                        res.totalpage = 0;
                    }
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo almacenar el archivo en el servidor";
                    res.totalpage = 0;
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
               
        [HttpPost]
        [Route("api/Uploads/post_imagenPersonal")]
        public object post_imagenPersonal(string filtros)
        {
            Resultado res = new Resultado();
            string nombreFile = "";
            string nombreFileServer = "";
            string path = "";
            string url = ConfigurationManager.AppSettings["imagen"];

            try
            {
                var file = HttpContext.Current.Request.Files["file"];
                string extension = System.IO.Path.GetExtension(file.FileName);

                string[] parametros = filtros.Split('|');
                int idPersonal = Convert.ToInt32(parametros[0].ToString());
                int idusuarioLogin = Convert.ToInt32(parametros[1].ToString());


                nombreFile = file.FileName;

                //-----generando clave unica---
                var guid = Guid.NewGuid();
                var guidB = guid.ToString("B");
                nombreFileServer = idPersonal + "_image_person_" + Guid.Parse(guidB) + extension;

                //---almacenando la imagen--
                path = System.Web.Hosting.HostingEnvironment.MapPath("~/Imagen/" + nombreFileServer);
                file.SaveAs(path);


                //------suspendemos el hilo, y esperamos ..
                System.Threading.Thread.Sleep(1000);

                if (File.Exists(path))
                {
                    ///----validando que en servidor solo halla una sola foto---
                    tbl_Personal object_usuario;
                    object_usuario = db.tbl_Personal.Where(p => p.id_Personal == idPersonal).FirstOrDefault<tbl_Personal>();
                    string urlFotoAntes = (string.IsNullOrEmpty(object_usuario.foto_personal)) ? "" : object_usuario.foto_personal;

                    Usuarios_BL obj_negocio = new Usuarios_BL();
                    obj_negocio.Set_Actualizar_imagenPersonal(idPersonal, nombreFileServer);

                    res.ok = true;
                    res.data = url + nombreFileServer;

                    //---si previamente habia una foto, al reemplazarla borramos la anterior
                    if (urlFotoAntes.Length > 0)
                    {
                        path = System.Web.Hosting.HostingEnvironment.MapPath("~/Imagen/" + urlFotoAntes);

                        if (File.Exists(path))
                        {
                            File.Delete(path);
                        }
                    }
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo guardar el archivo en el servidor..";
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }

            return res;
        }


        [HttpPost]
        [Route("api/Uploads/post_archivosAdicionalesCabPolicia")]
        public object post_archivosAdicionalesCabPolicia(string filtros)
        {
            Resultado res = new Resultado();
            int nombreFileBD;
            string sPath = "";

            try
            {
                //--- obteniendo los parametros que vienen por el FormData

                var file = HttpContext.Current.Request.Files["file"];
                //--- obteniendo los parametros que vienen por el FormData
                string extension = Path.GetExtension(file.FileName);
                string[] parametros = filtros.Split('|');

                int idPolicia = Convert.ToInt32(parametros[0].ToString());
                int id_Documento_Policial = Convert.ToInt32(parametros[1].ToString());
                string fechaI = parametros[2].ToString();
                string fechaF = parametros[3].ToString();
                string idUsuario = parametros[4].ToString();
 
                Upload_BL obj_negocios = new Upload_BL();
                nombreFileBD = obj_negocios.crear_archivosAdicionalesDocumentosCab(idPolicia, id_Documento_Policial, fechaI, fechaF, file.FileName, idUsuario);

                //-------almacenando la archivo---
                sPath = HttpContext.Current.Server.MapPath("~/Archivos/Documentos/" + nombreFileBD);
                file.SaveAs(sPath);

                //-------almacenando la archivo---
                if (File.Exists(sPath))
                {
                    res.ok = true;
                    res.data = "OK";
                    res.totalpage = 0;
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo almacenar el archivo en el servidor";
                    res.totalpage = 0;
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


        [HttpPost]
        [Route("api/Uploads/post_documentos_solicitudInformacionDet")]
        public object post_documentos_solicitudInformacionDet(string filtros)
        {
            Resultado res = new Resultado();
            int nombreFileBD;
            string sPath = "";

            try
            {
                //--- obteniendo los parametros que vienen por el FormData

                var file = HttpContext.Current.Request.Files["file"];
                //--- obteniendo los parametros que vienen por el FormData
                string extension = Path.GetExtension(file.FileName);
                string[] parametros = filtros.Split('|');

                int id_Ibp_Det = Convert.ToInt32(parametros[0].ToString());
                string idUsuario = parametros[1].ToString();

                Upload_BL obj_negocios = new Upload_BL();
                nombreFileBD = obj_negocios.crear_documentosSolicitudInformacion_det(id_Ibp_Det, file.FileName, idUsuario);

                //-------almacenando la archivo---
                sPath = HttpContext.Current.Server.MapPath("~/Archivos/Documentos_Ibp/" + nombreFileBD);
                file.SaveAs(sPath);

                //-------almacenando la archivo---
                if (File.Exists(sPath))
                {
                    res.ok = true;
                    res.data = "OK";
                    res.totalpage = 0;
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo almacenar el archivo en el servidor";
                    res.totalpage = 0;
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





    }
}
