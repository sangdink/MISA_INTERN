using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace MISA.WenIntern.Core.DTOs
{
    public class MISAServiceResult
    {
        public bool Success { get; set; }
        public string StatusCode { get; set; }
        public List<string> Errors { get; set; } = new List<string>();

    }
}
