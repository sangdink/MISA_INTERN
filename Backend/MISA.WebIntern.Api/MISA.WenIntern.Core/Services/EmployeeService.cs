using MISA.WenIntern.Core.DTOs;
using MISA.WenIntern.Core.Entities;
using MISA.WenIntern.Core.Exceptions;
using MISA.WenIntern.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.WenIntern.Core.Services
{
    public class EmployeeService : BaseService<Employee>, IEmployeeService
    {
        IEmployeeRepository _employeeRepository;
        public EmployeeService(IEmployeeRepository employeeRepository):base(employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }
        protected override void ValidateObject(Employee entity)
        {
            // Thực hiện kiểm tra mã nhân viên:
            if (string.IsNullOrEmpty(entity.EmployeeCode)) {
                throw new MISAValidateException(MISA.WenIntern.Core.Resource.ResourceVN.ValidateMsg_Employee_EmployeeCodeNotDuplicate);
            }
            // Thực hiện kiểm tra họ và tên:
            if (string.IsNullOrEmpty(entity.FullName))
            {
                throw new MISAValidateException(MISA.WenIntern.Core.Resource.ResourceVN.ValidateMsg_Employee_FullNameNotEmpty);
            }
            // Thực hiện kiểm tra số CMTND:
            if (string.IsNullOrEmpty(entity.IdentityNumber))
            {
                throw new MISAValidateException(MISA.WenIntern.Core.Resource.ResourceVN.ValidateMsg_Employee_IdentityNumberNotEmpty);
            }
            // Thực hiện kiểm tra số điện thoại di động:
            if (string.IsNullOrEmpty(entity.PhoneNumber))
            {
                throw new MISAValidateException(MISA.WenIntern.Core.Resource.ResourceVN.ValidateMsg_Employee_MobileNumberNotEmpty);
            }
            // Thực hiện kiểm tra email:
            if (string.IsNullOrEmpty(entity.Email))
            {
                throw new MISAValidateException(MISA.WenIntern.Core.Resource.ResourceVN.ValidateMsg_Employee_EmailNotEmpty);
            }
            // ...
        }
        protected override void ValidateEmployeeCodeToAdd(Employee entity)
        {
            // Thực hiện kiểm tra mã nhân viên:
            var isDuplicate = _employeeRepository.CheckEmployeeCodeDuplicate(entity.EmployeeCode);
            if (isDuplicate)
            {
                throw new MISAValidateException(MISA.WenIntern.Core.Resource.ResourceVN.ValidateMsg_Employee_EmployeeCodeNotDuplicate);
            }
            // ...
        }
        protected override void ValidateEmployeeCodeToUpdate(Employee entity)
        {
            // Thực hiện kiểm tra mã nhân viên:
            var isDuplicate = _employeeRepository.CheckEmployeeCodeDuplicate(entity.EmployeeCode);
            if (!isDuplicate)
            {
                throw new MISAValidateException(MISA.WenIntern.Core.Resource.ResourceVN.ValidateMsg_Employee_EmployeeCodeDuplicate);
            }
            // ...
        }
        protected override void ProcessAfterSave(Employee entity)
        {
            throw new MISAValidateException("Welcome to MISA");
        }
        
        //public MISAServiceResult InsertService(Employee entity)
        //{
        //    // Thực hiện kiểm tra mã nhân viên:
        //    var isDuplicate = _employeeRepository.CheckEmployeeCodeDuplicate(entity.EmployeeCode);
        //    if (isDuplicate)
        //    {
        //        throw new MISAValidateException("Mã nhân viên đã tồn tại trong hệ thống"); 
        //    }
        //    // Xử lý nghiệp vụ trước khi thêm mới dữ liệu:
        //    //ValidateObject(entity);
        //    var res = repository.Insert(entity);
        //    return new MISAServiceResult
        //    {
        //        Success = true,
        //        StatusCode = System.Net.HttpStatusCode.BadRequest,
        //        Data = "Thêm mới thành công",
        //    };
        //}


    }
}
