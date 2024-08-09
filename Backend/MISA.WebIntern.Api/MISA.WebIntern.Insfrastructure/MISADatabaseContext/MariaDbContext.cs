using Dapper;
using Microsoft.Extensions.Configuration;
using MISA.WebIntern.Insfrastructure.Interfaces;
using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.WebIntern.Insfrastructure.MISADatabaseContext
{
    public class MariaDbContext:IMISADbContext
    {
        public IDbConnection Connection { get; }
        public IDbTransaction Transaction { get; set; }
        public MariaDbContext(IConfiguration config)
        {
            Connection = new MySqlConnection(config.GetConnectionString("Database2"));
        }

        public IEnumerable<T> Get<T>()
        {
            var className = typeof(T).Name;
            var sql = $"SELECT * FROM {className}";
            var res = Connection.Query<T>(sql);
            return res;
        }

        public T? Get<T>(Guid id)
        {
            var className = typeof(T).Name;
            var sql = $"SELECT * FROM {className} WHERE {className}ID = @id";
            var parameters = new DynamicParameters();
            parameters.Add("@id", id);
            var res = Connection.QueryFirstOrDefault<T>(sql, parameters);
            return res;
        }

        public int Insert<T>(T entity)
        {
            var className = typeof(T).Name;
            var propListName = "";
            var propListValue = "";

            // Lấy ra các props của entity:
            var props = entity.GetType().GetProperties();
            var parameters = new DynamicParameters();
            // Duyệt từng prop:
            foreach (var prop in props)
            {
                // Lấy ra tên của prop:
                var propName = prop.Name;
                // Lấy ra value của prop:
                var propValue = prop.GetValue(entity);

                propListName += $"{propName},";
                propListValue += $"@{propName},";
                parameters.Add($"@{propName}", propValue);
            }
            propListName = propListName.Substring(0, propListName.Length - 1);
            propListValue = propListValue.Substring(0, propListValue.Length - 1);

            // Build câu lệnh insert:
            var sqlInsert = $"INSERT {className}({propListName}) VALUES ({propListValue})";

            // Thực thi:
            var res = Connection.Execute(sqlInsert, param: parameters, transaction: Transaction);
            return res;
        }

        public int Update<T>(Guid id, T entity)
        {
            var className = typeof(T).Name;
            var propList = "";

            // Lấy ra các props của entity:
            var props = entity.GetType().GetProperties();
            var parameters = new DynamicParameters();
            // Duyệt từng prop:
            foreach (var prop in props)
            {
                // Lấy ra tên của prop:
                var propName = prop.Name;

                if(propName != $"{className}Id" && propName != $"{className}Code")
                {
                    // Lấy ra value của prop:
                    var propValue = prop.GetValue(entity);

                    propList += $"{propName}" + "=" + $"@{propName}" + ",";
                    parameters.Add($"@{propName}", propValue);
                }
            }
            propList = propList.Substring(0, propList.Length - 1);

            // Build câu lệnh update:
            var sqlUpdate = $"UPDATE {className} SET {propList} WHERE {className}ID = @id";
            parameters.Add("@id", id);

            // Thực thi:
            var res = Connection.Execute(sqlUpdate, param: parameters, transaction: Transaction);
            return res;
        }

        public int Delete<T>(Guid id)
        {
            var className = typeof(T).Name;
            var sql = $"DELETE FROM {className} WHERE {className}ID = @id";
            var parameters = new DynamicParameters();
            parameters.Add("@id", id);
            var res = Connection.Execute(sql, parameters);
            return res;
        }

        public int DeleteAny<T>(Guid[] ids)
        {
            var className = typeof(T).Name;
            var res = 0;
            // Cách 1:
            //foreach (var item in ids)
            //{
            //    var sql = $"DELETE FROM {_className} WHERE {_className}Id = @id";
            //    var parameters = new DynamicParameters();
            //    parameters.Add("@id", item);
            //    res += Connection.Execute(sql, parameters);
            //}
            // Cách 2:
            var sql = $"DELETE FROM {className} WHERE {className}ID IN @ids";
            var parameters = new DynamicParameters();
            var idsArray = "";
            foreach (var item in ids)
            {
                idsArray += $"{item},";
            }
            idsArray = idsArray.Substring(0, idsArray.Length - 1);
            parameters.Add("@ids", idsArray);
            res = Connection.Execute(sql, parameters);
            return res;
        }
    }
}
