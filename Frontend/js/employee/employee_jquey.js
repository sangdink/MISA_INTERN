$(document).ready(function () {
  // Thực hiện load dữ liệu:

  // ---> Gọi api lấy dữ liệu...

  // THực hiện gán các sự kiện:
  // Nhãn thêm mới:
  $("#btnAdd").click(function () {
    // Hiển thị form thêm mới:
    $("#dlgDetail").show();
    // Focus vào ô nhập liệu đầu tiên:
    $("#txtEmployeeCode").focus();
  });

  $(".btnCloseDialog").click(function () {
    // Ẩn form thêm mới:
    $("#dlgDetail").hide();
  });

  // Validate dữ liệu khi nhấn Cất:
  $("#btnSave").click(function () {
    // Validate Dữ liệu:
    // Mã nhân viên không được phép để trống:
    // Họ và tên không được phép để trống:
    // Ngày sinh không được lớn hơn ngày hiện tại:
    // Email phải đúng định dạng:
    let employeeCode = $("#txtEmployeeCode").val();
    let fullName = $("#txtFullName").val();
    let dob = $("#dtDateOfBirth").val();
    let issuedDate = $("#dtIssuedDate").val();
    let email = $("#txtEmail").val();
    // let employeeCode = $("txtEmployeeCode").val();
    // let employeeCode = $("txtEmployeeCode").val();
    // let employeeCode = $("txtEmployeeCode").val();

    // if (employeeCode === null || employeeCode === "") {
    //   alert("Mã nhân viên không được phép để trống");
    // }
    console.log(dob);
    if (dob) {
      dob = new Date(dob);
    }
    if (dob > new Date()) {
      alert("Ngày sinh không được phép lớn hơn ngày hiện tại");
    }
  });

  // Hiển thị trạng thái lỗi khi không nhập các trường bắt buộc
  $("input[required]").blur(function () {
    var me = this;
    validateInputRequired(me);
  });
});

function validateInputRequired(input) {
  let value = $(input).val();
  if (value === null || value === "") {
    // Set style cho ô nhập liệu liệu có border màu đỏ:
    $(input).addClass("input-invalid");
    // Set thông tin lỗi tương ứng khi người dùng hover vào ô nhập liệu:
    $(input).attr("title", "Thông tin này không được phép để trống!");
  } else {
    $(input).removeClass("input-invalid");
    $(input).removeAttr("title");
  }
}
