using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Procesos
{
    public class Solicitud_E
    {
        public int id_Solicitud_Cab { get; set; }
        public string nroSolicitud { get; set; }
        public string idArea { get; set; }
        public string descripcionArea { get; set; }
        public string idSolicitante { get; set; }
        public string descripcionSolicitante { get; set; }
        public string idJefeCuadrilla { get; set; }
        public string descripcionJefeCuadrilla { get; set; }
        public DateTime fechaAtencion { get; set; }
        public string cantidadEfectivos { get; set; }
        public string asigna_JC { get; set; }
        public string idEstado { get; set; }
        public string descripcionEstado { get; set; }
        public string cantidadHoras { get; set; }

    }
}
