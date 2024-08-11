using MISA.WenIntern.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.WenIntern.Core.Interfaces
{
    public interface IBaseService<T> where T : class
    {
        MISAServiceResult InsertService(T entity);
        MISAServiceResult UpdateService(Guid id, T entity);
    }
}
