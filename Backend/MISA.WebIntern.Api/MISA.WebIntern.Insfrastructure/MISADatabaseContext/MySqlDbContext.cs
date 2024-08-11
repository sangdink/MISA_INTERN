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
    public class MySqlDbContext:IMISADbContext
    {
        public IDbConnection Connection { get; }
        public IDbTransaction Transaction { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }

        public MySqlDbContext(IConfiguration config)
        {
            Connection = new MySqlConnection(config.GetConnectionString("Database3"));
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
            var paramesters = new DynamicParameters();
            // Duyệt từng prop:
            foreach (var prop in props)
            {
                // Lấy ra tên của prop:
                var propName = prop.Name;
                // Lấy ra value của prop:
                var propValue = prop.GetValue(entity);

                propListName += $"{propName},";
                propListValue += $"@{propName},";
                paramesters.Add($"@{propName}", propValue);
            }
            propListName = propListName.Substring(0, propListName.Length - 1);
            propListValue = propListValue.Substring(0, propListName.Length - 1);

            // Build câu lệnh insert:
            var sqlInsert = $"INSERT {className}({propListName}) VALUES ({propListValue})";

            // Thực thi:
            var res = Connection.Execute(sqlInsert, param: paramesters);
            return res;

            //var sql = $"INSERT INTO * FROM {_className} ({}) VALUES ({})";
            //var parameters = new DynamicParameters();
            //parameters.Add("@id", id);
            //var res = Connection.QueryFirstOrDefault<T>(sql, parameters);
            //return res;
        }

        public int Update<T>(T entity)
        {
            var className = typeof(T).Name;
            throw new NotImplementedException();
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

        public int Update<T>(Guid id, T entity)
        {
            throw new NotImplementedException();
        }
    }
}
