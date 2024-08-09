using Dapper;
using MISA.WebIntern.Insfrastructure.Interfaces;
using MISA.WenIntern.Core.Interfaces;
using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.WebIntern.Insfrastructure.Repository
{
    public class BaseRepository<T>:IBaseRepository<T>, IDisposable where T : class
    {
        protected IMISADbContext _dbContext;
        protected string _className;
        
        public BaseRepository(IMISADbContext dbContext)
        {
            _dbContext = dbContext;
            _className = typeof(T).Name;
        }

        public int Delete(Guid id)
        {
            var res = _dbContext.Delete<T>(id);
            return res;
        }

        public int DeleteAny(Guid[] ids)
        {
            var res = _dbContext.DeleteAny<T>(ids);
            return res;
        }

        public void Dispose()
        {
            _dbContext.Connection.Close();
        }

        public IEnumerable<T> Get()
        {
            var res = _dbContext.Get<T>();
            return res;
        }

        public T? Get(Guid id)
        {
            var res = _dbContext.Get<T>(id);
            return res;
        }

        public int Insert(T entity)
        {
            _dbContext.Connection.Open();
            _dbContext.Transaction = _dbContext.Connection.BeginTransaction();
            var res = _dbContext.Insert<T>(entity);
            _dbContext.Transaction.Commit();
            return res;
        }

        public int Update(Guid id, T entity)
        {
            _dbContext.Connection.Open();
            _dbContext.Transaction = _dbContext.Connection.BeginTransaction();
            var res = _dbContext.Update<T>(id, entity);
            _dbContext.Transaction.Commit();
            return res;
        }
    }
}
