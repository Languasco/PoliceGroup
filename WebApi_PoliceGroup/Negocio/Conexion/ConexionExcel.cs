using System;
using System.Collections.Generic;
using System.Data.OleDb;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Conexion
{
    public class ConexionExcel
    {

        public static OleDbConnection conectar(string rutaExcel)
        {
            OleDbConnection cn;
            cn = new OleDbConnection();
            try
            {
                //cn.ConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + rutaExcel + ";Extended Properties='Excel 12.0 Xml;HDR=Yes'";
                cn.ConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + rutaExcel + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";
                cn.Open();
                return cn;
            }
            catch (Exception)
            {
                cn.Close();
                throw;
            }
        }
    }
}
