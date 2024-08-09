using MISA.WenIntern.Core.Const;
using MISA.WenIntern.Core.EmployeeValidation;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static MISA.WenIntern.Core.MISAEnum.MISAEnum;

namespace MISA.WenIntern.Core.Entities
{
    public class Employee
    {
        [Required(ErrorMessage = "Id không được phép để trống")]
        public Guid EmployeeId { get; set; }
        // [MaxLength(1, ErrorMessage = "Độ dài không được quá 1")]
        [Required(ErrorMessage = MISAConst.ERROR_EMPLOYEECODE_EMPTY)]
        public string EmployeeCode { get; set; }
        [Required(ErrorMessage = "Họ và tên không được phép để trống")]
        public string FullName { get; set; }
        [DateGreaterThanToday(ErrorMessage ="Ngày sinh phải lớn hơn ngày hiện tại")]
        public DateTime? DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string IdentifyNumber { get; set; }
        public DateTime? IdentifyDate { get; set; }
        public string? IdentifyPlace { get; set; }

        [EmailAddress(ErrorMessage = "Email không đúng đính dạng")]
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string? LandlineNumber { get; set; }
        public string? BankAccount { get; set; }
        public string? BankName { get; set; }
        public string? BankBranch { get; set; }
        public string? Address { get; set; }
        public Guid? PositionId { get; set; }
        public Guid? DepartmentId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? createdBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? ModifiedBy { get; set; }
        //public string GenderName
        //{
        //    get
        //    {
        //        switch (Gender)
        //        {
        //            case Gender.MALE:
        //                return "Name";
        //                break;
        //            case Gender.FEMALE:
        //                return "Nữ";
        //                break;
        //            case Gender.OTHER:
        //                return "Khác";
        //                break;
        //            default:
        //                return "Chưa xác định";
        //                break;
        //        }
        //    }
        //}
    }
}
