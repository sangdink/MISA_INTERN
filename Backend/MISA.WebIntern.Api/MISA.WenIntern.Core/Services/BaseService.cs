using MISA.WenIntern.Core.DTOs;
using MISA.WenIntern.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace MISA.WenIntern.Core.Services
{
    public class BaseService<T> : IBaseService<T> where T : class
    {
        protected IBaseRepository<T> repository;
        public BaseService(IBaseRepository<T> repository)
        {
            this.repository = repository;
        }
        public MISAServiceResult InsertService(T entity)
        {
            // Tự sinh id mới cho đối tượng:
            SetNewId(entity);
            // Xử lý nghiệp vụ trước khi thêm mới dữ liệu:
            ValidateObject(entity);
            ValidateEmployeeCodeToAdd(entity);
            var res = repository.Insert(entity);
            //ProcessAfterSave(entity);
            return new MISAServiceResult()
            {
                Success = true,
                StatusCode = "201",
                Errors = null
            };
            // ...
        }
        public MISAServiceResult UpdateService(Guid id, T entity)
        {
            // Xử lý nghiệp vụ trước khi thêm mới dữ liệu:
            ValidateObject(entity);
            ValidateEmployeeCodeToUpdate(entity);
            var res = repository.Update(id, entity);
            //ProcessAfterSave(entity);
            return new MISAServiceResult()
            {
                Success = true,
                StatusCode = "201",
                Errors = null
            };
            // ...
        }
        private void SetNewId(T entity)
        {
            var className = typeof(T).Name;
            var prop = typeof(T).GetProperty($"{className}Id");
            if (prop != null && (prop.PropertyType == typeof(Guid) || prop.PropertyType == typeof(Guid?)))
            {
                prop.SetValue(entity, Guid.NewGuid());
            }
        }
        protected virtual void ValidateObject(T entity)
        {

        }
        protected virtual void ValidateEmployeeCodeToAdd(T entity)
        {

        }
        protected virtual void ValidateEmployeeCodeToUpdate(T entity)
        {

        }
        protected virtual void ProcessAfterSave(T entity) 
        { 
            
        }
        
    }
}
