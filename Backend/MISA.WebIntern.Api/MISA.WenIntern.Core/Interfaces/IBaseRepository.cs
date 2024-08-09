using MISA.WenIntern.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.WenIntern.Core.Interfaces
{
    public interface IBaseRepository<T> where T : class
    {
        IEnumerable<T> Get();
        T? Get(Guid id);
        int Insert(T entity);
        int Update(Guid id, T entity);
        int Delete(Guid id);
        int DeleteAny(Guid[] ids);
    }
}
