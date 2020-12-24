using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Resultados
{
    public class Resultado
    {
        public bool ok { get; set; }
        public object data { get; set; }
        public int totalpage { get; set; }
    }
}
