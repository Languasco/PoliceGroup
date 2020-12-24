using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Procesos
{
    public class OrdenTrabajo_E
    {
        public int id_OT { get; set; }
        public bool checkeado { get; set; }
        public string descripcionEstado { get; set; }
        public string tipoOT { get; set; }
        public string nroObra { get; set; }
        public string direccion { get; set; }
        public string distrito { get; set; }
        public string volumen { get; set; }
        public string jefeCuadrilla { get; set; }
        public string empresaContratista { get; set; }
        public string fechaHora { get; set; }
        public string Informe { get; set; }
        public string diasVencimiento { get; set; }
        public string descripcion_estado { get; set; }

        public string idJefeCuadrilla { get; set; }
        public string idEmpresa { get; set; }

        public int id_tipoTrabajo { get; set; }
        public string id_Distrito { get; set; }
        public string referencia { get; set; }
        public string descripcion_OT { get; set; }
        public int id_estado { get; set; }
        public string descripcionServicio { get; set; }

    }
    public class Resumen_OrdenTrabajo_E
    {
        public string color { get; set; }
        public string proveedor { get; set; }
        public string jefeCuadrilla { get; set; }
        public string m3Asignados { get; set; }
        public string cantidaOTAsignada { get; set; } 
        public string cantOTFueraPlazo { get; set; }
        public string cantOTAtendida { get; set; }
    }

    public class AprobarOT_E
    {
        public int id_OT { get; set; }
        public bool checkeado { get; set; } 
        public string descripcionEstado { get; set; }
        public string tipoOT { get; set; }
        public string nroObra { get; set; }
        public string prioridad { get; set; }
        public string direccion { get; set; }
        public string distrito { get; set; }
        public string latitud { get; set; }
        public string longitud { get; set; }
        public string empresaContratista { get; set; }
        public string jefeCuadrilla { get; set; }
        public string generaVolumen { get; set; }
        public string volumenDesmonte { get; set; }
        public string volumenDesmonteRecoger { get; set; }
        public string fechaHora { get; set; }
        public string Informe { get; set; }
        public string totalVolumen { get; set; }
        public string totalDesmonte { get; set; }
        public string totalDesmonteRecoger { get; set; }
        public string fechaAprobacion { get; set; }
        public string diasVencimiento { get; set; }

        public int id_tipoTrabajo { get; set; }
        public string  id_Distrito  { get; set; }
        public string  referencia  { get; set; }
        public string  descripcion_OT  { get; set; }
        public int id_estado  { get; set; }


    }

}
