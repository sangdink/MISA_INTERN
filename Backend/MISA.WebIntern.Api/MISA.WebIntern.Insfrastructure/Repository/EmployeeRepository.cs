using MISA.WenIntern.Core.Entities;
using MISA.WenIntern.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using MySqlConnector;
using System.Data;
using MISA.WebIntern.Insfrastructure.Interfaces;

namespace MISA.WebIntern.Insfrastructure.Repository
{
    public class EmployeeRepository : BaseRepository<Employee>, IEmployeeRepository
    {
        public EmployeeRepository(IMISADbContext dbContext) : base(dbContext) 
        { 
            
        }
        public bool CheckEmployeeCodeDuplicate(string employeeCode)
        {
            var sqlCheck = "SELECT EmployeeCode FROM Employee e WHERE e.EmployeeCode = @EmployeeCode";
            var parameters = new DynamicParameters();
            parameters.Add("@EmployeeCode", employeeCode);
            var res = _dbContext.Connection.QueryFirstOrDefault<string>(sqlCheck, parameters); 
            return res != null;
        }
        
    }
}
