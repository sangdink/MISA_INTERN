window.onload = function () {
  new EmployeePage();
};

class EmployeePage {
  pageTitle = "Quản lý nhân viên";
  inputInvalids = [];

  constructor() {
    // Pagination
    this.page = 1;
    this.pageSize = 15;
    this.totalPages = 0;
    this.dataArray = [];

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
      // Phân trang cho bảng:
      // Thay đổi số lượng bảng ghi/trang:
      document
        .querySelector("#cbbRowNumber")
        .addEventListener("change", (e) => {
          this.pageSize = parseInt(e.target.value);
          this.page = 1; // Reset to first page
          this.updateTable(this.dataArray);
        });
      // Quay về trang trước đó:
      document.querySelector("#prevPage").addEventListener("click", () => {
        if (this.page > 1) {
          this.page--;
          this.updateTable(this.dataArray);
        }
      });
      // Chuyển sang trang tiếp theo:
      document.querySelector("#nextPage").addEventListener("click", () => {
        if (this.page < this.totalPages) {
          this.page++;
          this.updateTable(this.dataArray);
        }
      });

      // Tìm kiếm:
      document
        .querySelector(".search-input")
        .addEventListener("input", () => this.searchTable(this.dataArray));

      // Click button add hiển thị form thêm mới:
      document
        .querySelector("#btnAdd")
        .addEventListener("click", () => this.btnAddOnClick(me));

      // Lưu dữ liệu:
      document
        .getElementById("btnSave")
        .addEventListener("click", this.btnSaveOnClick.bind(this));

      // Refresh dữ liệu:
      document.querySelector("#btnRefresh").addEventListener("click", () => {
        this.loadData();
      });

      // Xuất dữ liệu trong bảng ra file excel:
      document
        .querySelector("#btnExport")
        .addEventListener("click", this.btnExportOnClick.bind(this));

      // Ẩn form chi tiết và dialog:
      const buttons = document.querySelectorAll(
        "[mdialog] button.btnCloseDialog"
      );
      for (const button of buttons) {
        button.addEventListener("click", function () {
          this.parentElement.parentElement.parentElement.style.visibility =
            "hidden";
          me.resetForm();
        });
      }

      // Xác nhận và ẩn dialog:
      document
        .querySelector("[mdialog] .button-confirm")
        .addEventListener("click", function () {
          this.parentElement.parentElement.parentElement.parentElement.style.visibility =
            "hidden";
          if (me.inputInvalids.length !== 0)
          {
            me.inputInvalids[0].focus();
          }
        });

      // Click Hủy và ẩn dialog:
      document
        .querySelector("#btnCancelAdd")
        .addEventListener("click", function () {
          document.querySelector("#dlgDetail").style.visibility = "hidden";
          me.resetForm();
        });

      document
        .querySelector("#btnCancelUpdate")
        .addEventListener("click", function () {
          document.querySelector("#dlgDetailUpdate").style.visibility =
            "hidden";
          me.resetForm();
        });

      // Click button edit hiển thị form sửa thông tin nhân viên:
      document
        .querySelector("#tblEmployee tbody")
        .addEventListener("click", function (event) {
          if (event.target && event.target.matches("button.btnEdit")) {
            const employeeId = event.target.getAttribute("data-id");
            me.btnEditOnClick(employeeId);
            document
              .getElementById("btnUpdate")
              .addEventListener("click", () => {
                me.btnUpdateOnClick(employeeId);
              });
          }
        });

      // Xóa dữ liệu sử dụng ủy quyền sự kiện:
      document
        .querySelector("#tblEmployee tbody")
        .addEventListener("click", function (event) {
          if (event.target && event.target.matches("button.btnDelete")) {
            const employeeId = event.target.getAttribute("data-id");
            me.btnDeleteOnClick(employeeId);
          }
        });
      // Thêm * vào các label required
      document.addEventListener("DOMContentLoaded", function () {
        const labels = document.querySelectorAll("label[for]");

        labels.forEach((label) => {
          const input = document.getElementById(label.getAttribute("for"));
          if (input && input.hasAttribute("required")) {
            label.classList.add("label-required");
          }
        });
      });
      // ...
    } catch (error) {
      console.error(error);
    }
  }
  /**
   * Load data on the table
   * Author: DTSANG (06/07/2024)
   */
  async loadData() {
    try {
      debugger;
      // Gọi api lấy dữ liệu:
      const res = await fetch("https://cukcuk.manhnv.net/api/v1/Employees");
      const data = await res.json();
      this.dataArray = data;

      this.updateTable(this.dataArray);
    } catch (error) {
      console.error(error);
    }
  }
  /**
   * Update the data on the table
   * Author: DTSANG(23/07/2024)
   */
  updateTable(data) {
    debugger;
    // Cập nhật số trang:
    this.totalPages = Math.ceil(data.length / this.pageSize);
    // Cập nhật số lượng bản ghi
    document.querySelector("#total").textContent = `${data.length}`;
    // Lấy ra table:
    const table = document.querySelector("#tblEmployee");
    const tbody = table.querySelector("tbody");
    // Xóa tất cả các hàng hiện tại
    tbody.innerHTML = "";

    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    const paginatedData = data.slice(start, end);

    let number = start;
    // Duyệt từng phần tử trong data:
    paginatedData.forEach((item) => {
      number++;
      let tr = document.createElement("tr");
      let genderId = item.Gender;
      let gender = "";
      switch (genderId) {
        case 0:
          gender = "Nam";
          break;
        case 1:
          gender = "Nữ";
          break;
        default:
          gender = "[Chưa xác định]";
          break;
      }
      // Tạo nội dung cho các ô
      tr.innerHTML = `<td>${number}</td>
                      <td>${item.EmployeeCode}</td>
                      <td>${item.FullName}</td>
                      <td>${gender}</td>
                      <td>${new Date(
                        item.DateOfBirth
                      ).toLocaleDateString()}</td>
                      <td>${item.Email}</td>
                      <td><div class="horizontal-alignment-center">
                        <div>${item.Address}</div>
                        <div class="button-container horizontal-alignment-center">
                          <button class="btnEdit" data-id="${
                            item.EmployeeId
                          }"></button>
                          <button class="btnDelete" data-id="${
                            item.EmployeeId
                          }"></button>
                        </div>
                      </div></td>`;
      tbody.append(tr);
    });
  }

  /**
   * Search data on the table
   * Author: DTSANG (19/07/2024)
   */
  searchTable(dataTable) {
    try {
      debugger;
      const searchData = document
        .querySelector(".search-input")
        .value.toLowerCase();
      // Lọc dữ liệu dựa trên EmployeeCode và FullName
      const filteredData = dataTable.filter((row) => {
        // Kiểm tra EmployeeCode và FullName
        const employeeCode = row.EmployeeCode
          ? row.EmployeeCode.toLowerCase()
          : "";
        const fullName = row.FullName ? row.FullName.toLowerCase() : "";
        return (
          employeeCode.includes(searchData) || fullName.includes(searchData)
        );
      });

      // Cập nhật bảng với dữ liệu đã lọc
      this.updateTable(filteredData);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Click button Thêm mới
   * Author: DTSANG (06/07/2024)
   */
  async btnAddOnClick() {
    try {
      // Hiển thị form thêm mới
      // 1. Lấy ra element của form thêm mới:
      const dialog = document.getElementById("dlgDetail");
      // 2. Set hiển thị form:
      dialog.style.visibility = "visible";
      // Lấy dữ liệu nhân viên từ API
      const res = await fetch(
        `https://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode`
      );
      const newEmployeeCode = await res.text();
      // Gán giá trị vào ô input "Mã nhân viên":
      document.querySelector(".txtEmployeeCode").value = newEmployeeCode;
      // 3. Focus vào ô input đầu tiên:
      document.querySelector(".txtFullName").focus();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Click button Edit
   * Author: DTSANG (23/07/2024)
   */
  async btnEditOnClick(EmployeeId) {
    try {
      debugger;
      // Hiển thị form sửa thông tin nhân viên
      const dialog = document.getElementById("dlgDetailUpdate");
      dialog.style.visibility = "visible";

      // Lấy dữ liệu nhân viên từ API
      const res = await fetch(
        `https://cukcuk.manhnv.net/api/v1/Employees/${EmployeeId}`
      );
      const employee = await res.json();

      // Cập nhật các trường trong dialog với thông tin từ nhân viên
      document.querySelector("#dlgDetailUpdate .txtEmployeeCode").value =
        employee.EmployeeCode || "";
      document.querySelector("#dlgDetailUpdate .txtFullName").value =
        employee.FullName || "";
      document.querySelector("#dlgDetailUpdate .cbbPosition").value =
        employee.PositionName || "";
      document.querySelector("#dlgDetailUpdate .cbbDepartment").value =
        employee.DepartmentName || "";
      document.querySelector("#dlgDetailUpdate .dtDateOfBirth").value =
        employee.DateOfBirth
          ? new Date(employee.DateOfBirth).toISOString().split("T")[0]
          : "";
      let gender = employee.Gender;
      switch (gender) {
        case 0:
          document.querySelector("#dlgDetailUpdate .rdoMale").checked = true;
          break;
        case 1:
          document.querySelector("#dlgDetailUpdate .rdoFemale").checked = true;
          break;
        default:
          document.querySelector("#dlgDetailUpdate .rdoOther").checked = true;
          break;
      }
      document.querySelector("#dlgDetailUpdate .txtIdCardNumber").value =
        employee.IdentityNumber || "";
      document.querySelector("#dlgDetailUpdate .dtIssuedDate").value =
        employee.IdentityDate
          ? new Date(employee.IdentityDate).toISOString().split("T")[0]
          : "";
      document.querySelector("#dlgDetailUpdate .txtIssuedLocation").value =
        employee.IdentityPlace || "";
      document.querySelector("#dlgDetailUpdate .txtAddress").value =
        employee.Address || "";
      document.querySelector("#dlgDetailUpdate .txtMobileNumber").value =
        employee.PhoneNumber || "";
      document.querySelector("#dlgDetailUpdate .txtLandlineNumber").value =
        employee.LandlineNumber || "";
      document.querySelector("#dlgDetailUpdate .txtEmail").value =
        employee.Email || "";
      document.querySelector("#dlgDetailUpdate .txtBankAccount").value =
        employee.BankAccount || "";
      document.querySelector("#dlgDetailUpdate .txtBankName").value =
        employee.BankName || "";
      document.querySelector("#dlgDetailUpdate .txtBankBranch").value =
        employee.BankBranch || "";

      // Focus vào ô input đầu tiên
      document.querySelector("#dlgDetailUpdate .txtEmployeeCode").focus();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Click button delete
   * Author: DTSANG (18/07/2024)
   */
  btnDeleteOnClick(EmployeeId) {
    try {
      debugger;
      if (confirm("Bạn có chắc chắn muốn xóa nhân viên này không?")) {
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
      debugger;
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

  /**
   * Click button Cất
   * Author: DTSANG (06/07/2024)
   */
  btnSaveOnClick() {
    try {
      // Thực hiện validate dữ liệu:
      const validateData = this.validateData("dlgDetail");
      // check input required:
      if (
        !validateData.requiredValid ||
        !validateData.dateValid ||
        !validateData.emailValid
      ) {
        debugger;
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
        for (const Msg of validateData.Msgs) {
          // <li> ... </li>
          let li = document.createElement("li");
          li.textContent = Msg;
          errorElement.append(li);
        }
        // Focus vào ô lỗi đầu tiên:
        this.inputInvalids = validateData.inputInvalid;
      } else {
        // ...
        // -> nếu dữ liệu đã hợp lệ hết thì gọi api thục hiện thêm mới:
        // Nếu dữ liệu hợp lệ, thực hiện gửi dữ liệu đến API
        debugger;
        const genderElement = document.querySelector(
          'input[name="gender"]:checked'
        );

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
          EmployeeCode: document.querySelector("#dlgDetail .txtEmployeeCode")
            .value,
          FullName: document.querySelector("#dlgDetail .txtFullName").value,
          PositionName: document.querySelector("#dlgDetail .cbbPosition").value,
          DepartmentName: document.querySelector("#dlgDetail .cbbDepartment")
            .value,
          DateOfBirth: document.querySelector("#dlgDetail .dtDateOfBirth")
            .value,
          Gender: genderValue,
          Address: document.querySelector("#dlgDetail .txtAddress").value,
          IdentityNumber: document.querySelector("#dlgDetail .txtIdCardNumber")
            .value,
          IdentityDate: document.querySelector("#dlgDetail .dtIssuedDate")
            .value,
          IdentityPlace: document.querySelector("#dlgDetail .txtIssuedLocation")
            .value,
          PhoneNumber: document.querySelector("#dlgDetail .txtMobileNumber")
            .value,
          LandlineNumber: document.querySelector(
            "#dlgDetail .txtLandlineNumber"
          ).value,
          Email: document.querySelector("#dlgDetail .txtEmail").value,
          BankAccount: document.querySelector("#dlgDetail .txtBankAccount")
            .value,
          BankName: document.querySelector("#dlgDetail .txtBankName").value,
          BankBranch: document.querySelector("#dlgDetail .txtBankBranch").value,
        };

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
            this.resetForm();

            // Ẩn form chi tiết
            document.querySelector("#dlgDetail").style.visibility = "hidden";

            // Làm mới dữ liệu bảng
            this.loadData();
          });
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Update employee data
   * Author: DTSANG (06/07/2024)
   */
  btnUpdateOnClick(EmployeeId) {
    try {
      // Thực hiện validate dữ liệu:
      const validateData = this.validateData("dlgDetailUpdate");
      // check input required:
      if (
        !validateData.requiredValid ||
        !validateData.dateValid ||
        !validateData.emailValid
      ) {
        debugger;
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
        for (const Msg of validateData.Msgs) {
          // <li> ... </li>
          let li = document.createElement("li");
          li.textContent = Msg;
          errorElement.append(li);
        }
        // Focus vào ô lỗi đầu tiên:
        this.inputInvalids = validateData.inputInvalid;
      } else {
        // ...
        // Nếu dữ liệu hợp lệ, thực hiện cập nhật dữ liệu lên API:
        debugger;
        const genderElement = document.querySelector(
          "input[name=\"gender\"]:checked"
        );

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
          EmployeeCode: document.querySelector(
            "#dlgDetailUpdate .txtEmployeeCode"
          ).value,
          FullName: document.querySelector("#dlgDetailUpdate .txtFullName")
            .value,
          PositionName: document.querySelector("#dlgDetailUpdate .cbbPosition")
            .value,
          DepartmentName: document.querySelector(
            "#dlgDetailUpdate .cbbDepartment"
          ).value,
          DateOfBirth: document.querySelector("#dlgDetailUpdate .dtDateOfBirth")
            .value,
          Gender: genderValue,
          Address: document.querySelector("#dlgDetailUpdate .txtAddress").value,
          IdentityNumber: document.querySelector(
            "#dlgDetailUpdate .txtIdCardNumber"
          ).value,
          IdentityDate: document.querySelector("#dlgDetailUpdate .dtIssuedDate")
            .value,
          IdentityPlace: document.querySelector(
            "#dlgDetailUpdate .txtIssuedLocation"
          ).value,
          PhoneNumber: document.querySelector(
            "#dlgDetailUpdate .txtMobileNumber"
          ).value,
          LandlineNumber: document.querySelector(
            "#dlgDetailUpdate .txtLandlineNumber"
          ).value,
          Email: document.querySelector("#dlgDetailUpdate .txtEmail").value,
          BankAccount: document.querySelector(
            "#dlgDetailUpdate .txtBankAccount"
          ).value,
          BankName: document.querySelector("#dlgDetailUpdate .txtBankName")
            .value,
          BankBranch: document.querySelector("#dlgDetailUpdate .txtBankBranch")
            .value,
        };

        console.log("Data to be sent:", employeeData);

        fetch(`https://cukcuk.manhnv.net/api/v1/Employees/${EmployeeId}`, {
          method: "PUT",
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
            this.resetForm();

            // Ẩn form chi tiết
            document.querySelector("#dlgDetailUpdate").style.visibility =
              "hidden";

            // Làm mới dữ liệu bảng
            this.loadData();
          });
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Validate data
   * Author: DTSANG (06/07/2024)
   */
  validateData(formId) {
    let error = {
      requiredValid: false,
      dateValid: false,
      emailValid: false,
      inputInvalid: [],
      Msgs: [],
    };
    // check required input
    let requiredError = this.checkRequiredInput(formId);
    error.requiredValid = requiredError.requiredValid;
    error.inputInvalid.push(...requiredError.inputInvalid);
    error.Msgs.push(...requiredError.Msgs);
    // check date input:
    let dateError = this.checkDateValidity();
    error.dateValid = dateError.dateValid;
    error.inputInvalid.push(...dateError.inputInvalid);
    error.Msgs.push(...dateError.Msgs);
    // check email input:
    let emailError = this.checkEmailFormat();
    error.emailValid = emailError.emailValid;
    error.inputInvalid.push(...emailError.inputInvalid);
    error.Msgs.push(...emailError.Msgs);
    return error;
  }

  /**
   * Check input required
   * Author: DTSANG (06/07/2024)
   */
  checkRequiredInput(formId) {
    let result = {
      requiredValid: false,
      inputInvalid: [],
      Msgs: [],
    };
    debugger;
    // Lấy tất cả các input bắt buộc nhập:
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll("input[required]");
    for (const input of inputs) {
      const value = input.value;
      if (value === "" || value === null || value === undefined) {
        const label = input.previousElementSibling;
        if (!input.classList.contains("input-invalid")) {
          input.classList.add("input-invalid");
          this.addErrorElementToInputNotValid(
            input,
            "Thông tin này không được phép để trống"
          );
        }
        result.inputInvalid.push(input);
        result.Msgs.push(`${label.textContent} không được phép để trống`);
      } else {
        if (input.classList.contains("input-invalid")) {
          input.classList.remove("input-invalid");
          input.nextElementSibling.remove();
          this.removeErrorElementFromInput(input);
        }
      }
    }
    if (result.inputInvalid.length === 0) {
      result.requiredValid = true;
    } else {
      result.requiredValid = false;
    }
    return result;
  }

  /**
   * Check email
   * Author: DTSANG (06/07/2024)
   */
  checkEmailFormat() {
    let result = {
      emailValid: false,
      inputInvalid: [],
      Msgs: [],
    };
    let inputs = document.querySelectorAll("#dlgDetail input[type='email']");
    for (const input of inputs) {
      const value = input.value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value !== "") {
        if (!emailRegex.test(value)) {
          const label = input.previousElementSibling;
          if (!input.classList.contains("input-invalid")) {
            input.classList.add("input-invalid");
            this.addErrorElementToInputNotValid(
              input,
              `${label.textContent} không đúng định dạng`
            );
          }
          result.inputInvalid.push(input);
          result.Msgs.push(`${label.textContent} không đúng định dạng`);
        } else {
          if (input.classList.contains("input-invalid")) {
            input.classList.remove("input-invalid");
            input.nextElementSibling.remove();
            this.removeErrorElementFromInput(input);
          }
        }
      }
    }

    if (result.inputInvalid.length === 0) {
      result.emailValid = true;
    } else {
      result.emailValid = false;
    }
    return result;
  }

  /**
   * Check date
   * Author: DTSANG (06/07/2024)
   */
  checkDateValidity() {
    let result = {
      dateValid: false,
      inputInvalid: [],
      Msgs: [],
    };
    let inputs = document.querySelectorAll("#dlgDetail input[type='date']");
    for (const input of inputs) {
      const value = input.value;
      const currentDate = new Date().toISOString().split("T")[0]; // Ngày hiện tại ở định dạng YYYY-MM-DD
      if (value > currentDate) {
        const label = input.previousElementSibling;
        if (!input.classList.contains("input-invalid")) {
          input.classList.add("input-invalid");
          this.addErrorElementToInputNotValid(
            input,
            `${label.textContent} không được lớn hơn ngày hiện tại`
          );
        }
        result.inputInvalid.push(input);
        result.Msgs.push(
          `${label.textContent} không được lớn hơn ngày hiện tại`
        );
      } else {
        if (input.classList.contains("input-invalid")) {
          input.classList.remove("input-invalid");
          input.nextElementSibling.remove();
          this.removeErrorElementFromInput(input);
        }
      }
    }
    if (result.inputInvalid.length === 0) {
      result.dateValid = true;
    } else {
      result.dateValid = false;
    }
    return result;
  }

  /**
   * Add error message to input not valid
   * Author: DTSANG (06/07/2024)
   */
  addErrorElementToInputNotValid(input, message) {
    // Đổi style cho input không hợp lệ:
    input.style.borderColor = "red";
    // Bổ sung thông tin lỗi dưới input không hợp lệ:
    let elError = document.createElement("div");
    elError.classList.add("input-invalid");
    elError.textContent = message;
    input.after(elError);
  }

  /**
   * Delete error message after input
   * Author: DTSANG (23/07/2024)
   */
  removeErrorElementFromInput(input) {
    //Xóa thông báo lỗi khỏi phần tử input
    input.style.borderColor = "";
    let errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains("input-invalid")) {
      errorElement.remove();
    }
  }
  /**
   * Reset các input fields và thông báo lỗi
   * Author: DTSANG (23/07/2024)
   */
  resetForm() {
    let inputs = document.querySelectorAll(".m-dialog input");
    inputs.forEach((input) => {
      input.value = "";
      // Xóa bỏ thông báo lỗi:
      if (input.classList.contains("input-invalid")) {
        input.classList.remove("input-invalid");
        this.removeErrorElementFromInput(input);
      }
    });
    document.querySelector(".rdoMale").checked = true;
  }
}
