using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.WebIntern.Insfrastructure.Interfaces
{
    public interface IMISADbContext
    {
        IDbConnection Connection { get; }
        IDbTransaction Transaction { get; set; }
        IEnumerable<T> Get<T>();
        T? Get<T>(Guid id);
        int Insert<T>(T entity);
        int Update<T>(Guid id, T entity);
        int Delete<T>(Guid id);
        int DeleteAny<T>(Guid[] ids);
    }
}
