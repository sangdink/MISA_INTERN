window.onload = function () {
  new EmployeePage();
};

class EmployeePage {
  pageTitle = "Quản lý nhân viên";
  inputInvalids = [];
  arr = [];
  
  constructor() {
    this.initEvents();
    this.loadData();
  }
  /**
   * Khởi tạo các sự kiện trong page3
   * Author: DTSANG (06/07/2024)
   */
  initEvents() {
    var me = this;

    try {
      // Click button add hiển thị form thêm mới:
      document
        .querySelector("#btnAdd")
        .addEventListener("click", this.btnAddOnClick);
      // Rfresh dữ liệu:
      document
        .querySelector("#btnRefresh")
        .addEventListener("click", this.btnRefreshOnClick);
      // Xuất khẩu:
      document
        .querySelector("#btnExport")
        .addEventListener("click", this.btnExportOnClick.bind(this));

      // Ẩn form chi tiết và dialog:
      const buttons = document.querySelectorAll(
        "[mdialog] button.btnCloseDialog"
      );
      for (const button of buttons) {
        button.addEventListener("click", function () {
          console.log(this);
          this.parentElement.parentElement.parentElement.style.visibility =
            "hidden";
        });
      }

      // Xác nhận và ẩn dialog:
      document
        .querySelector("[mdialog] .button-confirm")
        .addEventListener("click", function () {
          this.parentElement.parentElement.parentElement.parentElement.style.visibility =
            "hidden";
          me.inputInvalids[0].focus();
        });

      // Hủy và ẩn form chi tiết:
      document
        .querySelector("[mdialog] .button-cancel")
        .addEventListener("click", () => {
          document.querySelector("#dlgDetail").style.visibility = "hidden";
        });

      // Lưu dữ liệu:
      document
        .querySelector("#btnSave")
        .addEventListener("click", this.btnSaveOnClick.bind(this));

      // Xóa dữ liệu sử dụng ủy quyền sự kiện:
      document
        .querySelector("#tblEmployee tbody")
        .addEventListener("click", function (event) {
          if (event.target && event.target.matches("button.btnDelete")) {
            const employeeId = event.target.getAttribute("data-id");
            me.deleteEmployee(employeeId);
          }
        });
    } catch (error) {
      console.error(error);
    }
  }
  loadData() {
    try
    {
      // const search = document.querySelector(".search-input");
      // Gọi api lấy dữ liệu:
      fetch("https://cukcuk.manhnv.net/api/v1/Employees")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          // Lấy ra table:
          const table = document.querySelector("#tblEmployee");
          const tbody = table.querySelector("tbody");

          // Xóa tất cả các hàng hiện tại trong tbody
          tbody.innerHTML = "";

          // Duyệt từng phần tử trong data:
          let number = 0;
          for (const item of data) {
            number++;
            let tr = document.createElement("tr");
            // Tạo nội dung cho các ô
            tr.innerHTML = `<td>${number}</td>
                                        <td>${item.EmployeeCode}</td>
                                        <td>${item.FullName}</td>
                                        <td>${item.GenderName}</td>
                                        <td>${new Date(item.DateOfBirth).toLocaleDateString()}</td>
                                        <td>${item.Email}</td>
                                        <td class="horizontal-alignment">${item.Address}
                                        <div class="button-container horizontal-alignment">
                                        <button class="icon-button btnEdit"></button>
                                        <button class="icon-button btnDelete" data-id="${item.EmployeeId}"></button>
                                        </div>
                                        </td>`;
            // Tìm kiếm:
            document.querySelector(".search-input").addEventListener("input", this.searchTable);

            tbody.append(tr);
          }
        });
    } catch (error) {
      console.error(error);
    }
  }

  searchTable() {
    const table_rows = document.querySelectorAll("tbody tr");
    const search = document.querySelector(".search-input");
    const search_data = search.value.toLowerCase();

  table_rows.forEach((row) => {
    let table_data = row.textContent.toLowerCase();
    if (table_data.indexOf(search_data) < 0) {
      // Ẩn hoàn toàn hàng không khớp
      row.style.display = "none";
    } else {
      // Hiển thị lại các hàng khớp
      row.style.display = "";
    }
  });
  }
  /**
   * Click button add
   * Author: DTSANG (06/07/2024)
   */
  btnAddOnClick() {
    try {
      // Hiển thị form thêm mới
      // 1. Lấy ra element của form thêm mới:
      const dialog = document.getElementById("dlgDetail");
      // 2. Set hiển thị form:
      dialog.style.visibility = "visible";
      // 3. Focus vào ô input đầu tiên
      document.getElementById("txtEmployeeCode").focus();
    } catch (error) {
      console.error(error);
    }
  }
  /**
   * Click button refresh
   * Author: DTSANG (06/07/2024)
   */
  btnRefreshOnClick() {
    try {
      // Làm mới dữ liệu
      this.loadData();
    } catch (error) {
      console.error(error);
    }
  }
  /**
   * Click button export
   * Author: DTSANG (18/07/2024)
   */
  btnExportOnClick() {
    try {
      // Kiểm tra xem bảng có dữ liệu hay không
      const table = document.querySelector("#tblEmployee");
      const tbody = table.querySelector("tbody");
      if (tbody.rows.length === 0) {
        alert("Không có dữ liệu để xuất");
        return;
      }

      // Sử dụng SheetJS để chuyển đổi bảng thành file Excel và tải xuống
      const wb = XLSX.utils.table_to_book(table);
      XLSX.writeFile(wb, "Employees.xlsx");
    } catch (error) {
      console.error(error);
    }
  }
  deleteEmployee(EmployeeId) {
    debugger;
    if (confirm("Are you sure you want to delete this employee?")) {
      console.log(`Deleting employee with code: ${EmployeeId}`);
      fetch(`https://cukcuk.manhnv.net/api/v1/Employees/${EmployeeId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(`Failed to delete employee: ${text}`);
            });
          }
          console.log("Employee deleted successfully");
          this.loadData(); // Tải lại dữ liệu sau khi xóa thành công
        })
        .catch((error) => {
          console.error("Error deleting employee:", error);
        });
    }
  }

  // btnDeleteOnClick() {
  //   try {
  //     debugger;
  //     // Hiển thị thông báo xóa nhiều:
  //     // document.querySelector(".m-dialog.dialog-notice").style.visibility = "visible";
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  /**
   * Click button add
   * Author: DTSANG (06/07/2024)
   */
  btnSaveOnClick() {
    try {
      debugger;
      // Thực hiện validate dữ liệu:
      const validateRequired = this.validateData();
      if (
        validateRequired &&
        validateRequired.errors &&
        validateRequired.errors.length > 0
      ) {
        let dialogNotice = document.querySelector(".m-dialog.dialog-notice");
        // Hiển thị thông báo lên:
        dialogNotice.style.visibility = "visible";

        // Thay đổi tiêu đề thông báo:
        dialogNotice.querySelector(".dialog-heading h2").innerHTML =
          "Dữ liệu không hợp lệ";
        let errorElement = dialogNotice.querySelector(".dialog-text");

        // Xóa toàn bộ nội dung cũ trước khi thay mới:
        errorElement.innerHTML = "";

        // Duyệt từng nội dung thông báo và append:
        for (const Msg of validateRequired.errors) {
          // <li> ... </li>
          let li = document.createElement("li");
          li.textContent = Msg;
          errorElement.append(li);
        }

        // Focus vào ô lỗi đầu tiên:
        this.inputInvalids = validateRequired.inputInvalid;
      } else {
        // ...
        // -> nếu dữ liệu đã hợp lệ hết thì gọi api thục hiện thêm mới:
        // Nếu dữ liệu hợp lệ, thực hiện gửi dữ liệu đến API

        const genderElement = document.querySelector("input[name=\"gender\"]:checked");

        let genderValue = null;
        if (genderElement) {
          if (genderElement.value === "male") {
            genderValue = 0;
          } else if (genderElement.value === "female") {
            genderValue = 1;
          } else {
            genderValue = 2;
          }
        }
        let employeeData = {
          EmployeeCode: document.getElementById("txtEmployeeCode").value,
          FullName: document.getElementById("txtFullName").value,
          Position: document.getElementById("txtPosition").value,
          Department: document.getElementById("txtDepartment").value,
          DateOfBirth: document.getElementById("dtDateOfBirth").value,
          Gender: genderValue,
          IdentityNumber: document.getElementById("txtIdCardNumber").value,
          IdentityDate: document.getElementById("dtIssuedDate").value,
          IdentityPlace: document.getElementById("txtIssuedLocation").value,
          MobilephoneNumber: document.getElementById("txtMobilephoneNumber").value,
          LandlineNumber: document.getElementById("txtLandlineNumber").value,
          Email: document.getElementById("txtEmail").value,
          BankAccount: document.getElementById("txtBankAccount").value,
          BankName: document.getElementById("txtBankName").value,
          BankBranch: document.getElementById("txtBankBranch").value,
        };

        // var data = [];
        // var employeeCode = document.querySelector("#txtEmployeeCode").value,
        //   fullName = document.querySelector("#txtFullName").value,
        //   position = document.querySelector("#txtPosition").value,
        //   dateOfBirth = document.querySelector("#dtDateOfBirth").value;

        // var employeeData = {
        //   EmployeeCode: employeeCode,
        //   FullName: fullName,
        //   Position: position,
        //   DateOfBirth: dateOfBirth,
        // };

        // data.push(employeeData);
        // console.log(data);
        console.log("Data to be sent:", employeeData);

        fetch("https://cukcuk.manhnv.net/api/v1/Employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employeeData),
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((error) => {
                throw new Error(error.message || "Lỗi không xác định");
              });
            }
            return response.json();
          })
          .then((data) => {
            console.log("Thành công:", data);
            let dialogNotice = document.querySelector(
              ".m-dialog.dialog-notice"
            );
            // Hiển thị thông báo lên:
            dialogNotice.style.visibility = "visible";

            // Thay đổi tiêu đề thông báo:
            dialogNotice.querySelector(".dialog-heading h2").innerHTML =
              "Dữ liệu hợp lệ";
            dialogNotice.querySelector(".dialog-text").innerHTML =
              "Dữ liệu đã được lưu thành công!";

            // Reset các input fields sau khi lưu thành công
            document.getElementById("txtEmployeeCode").value = "";
            document.getElementById("txtFullName").value = "";
            document.getElementById("txtPosition").value = "";
            document.getElementById("txtDepartment").value = "";
            document.getElementById("dtDateOfBirth").value = "";
            if (genderElement) {
              genderElement.checked = false;
            }
            document.getElementById("txtIdCardNumber").value = "";
            document.getElementById("dtIssuedDate").value = "";
            document.getElementById("txtIssuedLocation").value = "";
            document.getElementById("txtMobilephoneNumber").value = "";
            document.getElementById("txtLandlineNumber").value = "";
            document.getElementById("txtEmail").value = "";
            document.getElementById("txtBankAccount").value = "";
            document.getElementById("txtBankName").value = "";
            document.getElementById("txtBankBranch").value = "";
            // Ẩn form chi tiết
            document.querySelector("#dlgDetail").style.visibility = "hidden";

            // Làm mới dữ liệu bảng
            this.loadData();
          });
        // .then((data) => {
        //   console.log("Dữ liệu đã được thêm mới:", data);

        //   // Ẩn form chi tiết
        //   document.querySelector("#dlgDetail").style.visibility = "hidden";

        //   // Làm mới dữ liệu bảng
        //   this.loadData();
        // });
      }

      // const error = this.validateData();

      // Hiển thị thông báo nếu có dữ liệu không hợp lệ
      // if (error.IsValid === false) {
      // } else {
      // }
    } catch (error) {
      console.error(error);
    }
  }
  

  /**
   * Validate data
   * Author: DTSANG (06/07/2024)
   */
  validateData() {
    let error = {
      inputInvalid: [],
      errors: [],
    };

    // check input required:
    error = this.checkRequiredInput();
    // // Kiểm tra có mã nhân viên chưa?
    // const employeeCode = document.querySelector("#txtEmployeeCode").value;
    // const fullName = document.querySelector("#txtFullName").value;
    // if(employeeCode == "" || employeeCode == null || employeeCode == undefined) {
    //     // Lưu thông tin lỗi:
    //     error.Msg.push("Mã khách hàng không được phép để trống");
    //     const input = document.querySelector("#txtEmployeeCode");
    //     this.addErrorElemrntToInputNotValid(input);
    // } else {
    //     const input = document.querySelector("#txtFullName");
    //     // Xóa element thông tin lỗi phía sau:
    //     // input.classList.remove("red");
    //     input.classList.remove("red");
    //     input.nextElementSibling.remove();
    // }

    // // Kiểm tra có họ và tên chưa?
    // if(fullName === "" || fullName === null || fullName === undefined) {
    //     // Lưu thông tin lỗi:
    //     error.Msg.push("Họ và tên không được phép để trống");
    //     const input = document.querySelector("#txtFullName");
    //     this.addErrorElementToInputNotValid(input);
    // } else {
    //     const input = document.querySelector("#txtFullName");
    //     // Xóa element thông tin lỗi phía sau:
    //     input.style.remove("red");
    //     input.nextElementSibling.remove();
    // }
    //.....

    return error;
  }
  // btnSaveOnClick() {
  //   try {
  //     debugger;
  //     // Thực hiện validate dữ liệu
  //     const validation = this.validateData();
  //     if (validation.errors.length > 0) {
  //       // Nếu có lỗi, hiển thị thông báo lỗi
  //       const dialogNotice = document.querySelector(".m-dialog.dialog-notice");
  //       dialogNotice.style.visibility = "visible";
  //       dialogNotice.querySelector(".dialog-heading h2").innerHTML =
  //         "Dữ liệu không hợp lệ";
  //       const errorElement = dialogNotice.querySelector(".dialog-text");
  //       errorElement.innerHTML = "";

  //       validation.errors.forEach((msg) => {
  //         const li = document.createElement("li");
  //         li.textContent = msg;
  //         errorElement.append(li);
  //       });

  //       this.inputInvalids[0].focus();
  //     } else {
  //       // Nếu dữ liệu hợp lệ, thực hiện gửi dữ liệu đến API
  //       const employeeData = {
  //         EmployeeCode: document.querySelector("#txtEmployeeCode").value,
  //         FullName: document.querySelector("#txtFullName").value,
  //         GenderName: document.querySelector("#txtGenderName").value,
  //         DateOfBirth: document.querySelector("#txtDateOfBirth").value,
  //         Email: document.querySelector("#txtEmail").value,
  //         Address: document.querySelector("#txtAddress").value,
  //       };

  //       fetch("https://cukcuk.manhnv.net/api/v1/Employees", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(employeeData),
  //       })
  //         .then((response) => response.json())
  //         .then((data) => {
  //           console.log("Dữ liệu đã được thêm mới:", data);

  //           // Ẩn form chi tiết
  //           document.querySelector("#dlgDetail").style.visibility = "hidden";

  //           // Làm mới dữ liệu bảng
  //           this.loadData();
  //         })
  //         .catch((error) => {
  //           console.error("Có lỗi xảy ra khi thêm dữ liệu:", error);
  //         });
  //     }
  //   } catch (error) {
  //     console.error("Có lỗi xảy ra:", error);
  //   }
  // }
  /**
   * Check input required
   * Author: DTSANG (06/07/2024)
   */
  checkRequiredInput() {
    try {
      let result = {
        inputInvalid: [],
        errors: [],
      };
      // Lấy tất cả các input bắt buộc nhập:
      let inputs = document.querySelectorAll("#dlgDetail input[required]");
      for (const input of inputs) {
        const value = input.value;
        if (value === "" || value === null || value === undefined) {
          const label = input.previousElementSibling;
          input.classList.add("input-invalid");
          this.addErrorElementToInputNotValid(input);
          result.inputInvalid.push(input);
          result.errors.push(`${label.textContent} không được phép để trống`);
        } else {
          input.classList.remove("input-invalid");
          input.nextElementSibling.remove();
        }
      }
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * Add error message to input not valid
   * Author: DTSANG (06/07/2024)
   */
  addErrorElementToInputNotValid(input) {
    try {
      // Đổi style cho input không hợp lệ:
      input.style.borderColor = "red";
      // Bổ sung thông tin lỗi dưới input không hợp lệ:
      let elError = document.createElement("div");
      elError.classList.add("input-invalid");
      elError.textContent = "Thông tin này không được phép để trống";
      input.after(elError);
    } catch (error) {
      console.error(error);
    }
  }
  //.....
}
