//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Datos
{
    using System;
    using System.Collections.Generic;
    
    public partial class tbl_Empresas
    {
        public int id_Empresa { get; set; }
        public Nullable<int> id_Cliente { get; set; }
        public string ruc_Empresa { get; set; }
        public string razonSocial_Empresa { get; set; }
        public string direccion_Empresa { get; set; }
        public Nullable<int> id_Icono { get; set; }
        public Nullable<int> esProveedor { get; set; }
        public Nullable<int> estado { get; set; }
        public Nullable<int> usuario_creacion { get; set; }
        public Nullable<System.DateTime> fecha_creacion { get; set; }
        public Nullable<int> usuario_edicion { get; set; }
        public Nullable<System.DateTime> fecha_edicion { get; set; }
    }
}
