window.onload = function () {
  new EmployeePage();
};

class EmployeePage {
  pageTitle = "Quản lý nhân viên";
  inputInvalids = [];
  arr = [];

  constructor()
  {
    // Pagination
    this.page = 1;
    this.pageSize = 10; 
    this.totalPages = 0;
    this.data = [];

    this.initEvents();
    this.loadData();
  }
  
  /**
   * Khởi tạo các sự kiện trong page3
   * Author: DTSANG (06/07/2024)
   */
  initEvents() {
    var me = this;
    try
    { 
      // Phân trang cho bảng:
      this.paginationTable();

      // Tìm kiếm:
      document.querySelector(".search-input").addEventListener("input", this.searchTable);

      // Click button add hiển thị form thêm mới:
      document
        .querySelector("#btnAdd")
        .addEventListener("click", () => this.btnAddOnClick(me));
      
      // Lưu dữ liệu:
      document.getElementById("btnSave").addEventListener("click", this.btnSaveOnClick.bind(this));

      // Refresh dữ liệu:
      document
        .querySelector("#btnRefresh")
        .addEventListener("click", this.btnRefreshOnClick);
      
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
          console.log(this);
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
          // 
          // me.inputInvalids[0].focus();
        });
      
      // Hủy và ẩn form chi tiết:
      document
        .querySelector("[mdialog] .button-cancel")
        .addEventListener("click", () => {
          document.querySelector("#dlgDetail").style.visibility = "hidden";
          me.resetForm();
        });
      
      // Click button edit hiển thị form sửa thông tin nhân viên:
      document.querySelector("#tblEmployee tbody")
        .addEventListener("click", function (event)
        {
        if (event.target && event.target.matches("button.btnEdit")) {
          const employeeId = event.target.getAttribute("data-id");
          me.btnEditOnClick(employeeId); 
          document.getElementById("btnUpdate").addEventListener("click", ()=> {me.btnUpdateOnClick(employeeId)});
        }
        });
      // Cập nhật dữ liệu:
      // document.getElementById("btnUpdate").addEventListener("click", this.btnUpdateOnClick.bind(this));

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
      document.addEventListener("DOMContentLoaded", function ()
      {
        debugger
                const labels = document.querySelectorAll('label[for]');
            
                labels.forEach(label => {
                    const input = document.getElementById(label.getAttribute('for'));
                    if (input && input.hasAttribute('required')) {
                        label.classList.add('label-required');
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
    try
    {
      // Gọi api lấy dữ liệu:
      const res = await fetch("https://cukcuk.manhnv.net/api/v1/Employees");
      const data = await res.json();
      this.data = data;
      this.totalPages = Math.ceil(this.data.length / this.pageSize);
      
      // Cập nhật số lượng bản ghi
      document.querySelector("#total").textContent = `${this.data.length}`;
      
      this.updateTable();

    } catch (error) {
      console.error(error);
    }
  }
  /**
   * Update the data on the table
   * Author: DTSANG(23/07/2024)
   */
  updateTable()
  {
    try {
    // Lấy ra table:
    const table = document.querySelector("#tblEmployee");
    const tbody = table.querySelector("tbody");
    // Xóa tất cả các hàng hiện tại 
    tbody.innerHTML = "";

    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    const paginatedData = this.data.slice(start, end);

    let number = start;
    // Duyệt từng phần tử trong data:
    paginatedData.forEach((item) => {
      number++;
      let tr = document.createElement("tr");
      let gender = item.GenderName;
      switch (gender)
      {
        case "Nam":
          gender = "Nam";
          break;
        case "Nữ":
          gender = "Nữ";
          break;
        default:
          gender = "Chưa xác định";
          break;
      }
      // Tạo nội dung cho các ô
      tr.innerHTML = `<td>${number}</td>
                      <td>${item.EmployeeCode}</td>
                      <td>${item.FullName}</td>
                      <td>${gender}</td>
                      <td>${new Date(item.DateOfBirth).toLocaleDateString()}</td>
                      <td>${item.Email}</td>
                      <td><div class="horizontal-alignment">${item.Address}
                        <div class="button-container horizontal-alignment">
                          <button class="btnEdit" data-id="${item.EmployeeId}"></button>
                          <button class="btnDelete" data-id1="${item.EmployeeId}"></button>
                        </div>
                      </div></td>`;
      tbody.append(tr);
    });
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Pagination for the table
   * Author: DTSANG (23/07/2024)
   */
  paginationTable()
  {
    try {
    // Thay đổi số lượng bảng ghi/trang:
      document.querySelector("#cbbRowNumber").addEventListener("change", (e) => {
      this.pageSize = parseInt(e.target.value);
      this.page = 1; // Reset to first page
      this.updateTable();
      });
      // Quay về trang trước đó:
      document.querySelector("#prevPage").addEventListener("click", () => {
        if (this.page > 1) {
          this.page--;
          this.updateTable();
        }
      });
      // Chuyển sang trang tiếp theo:
      document.querySelector("#nextPage").addEventListener("click", () => {
        if (this.page < this.totalPages) {
          this.page++;
          this.updateTable();
        }
      });
        
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Search data on the table
   * Author: DTSANG (19/07/2024)
   */
  searchTable()
  {
    try {
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
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Click button Thêm mới
   * Author: DTSANG (06/07/2024)
   */
  btnAddOnClick() {
    try
    {
      debugger
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
   * Click button add
   * Author: DTSANG (23/07/2024)
   */
  async btnEditOnClick(EmployeeId) {
    try
    {
    debugger
    // Hiển thị form sửa thông tin nhân viên
    const dialog = document.getElementById("dlgDetail");
    dialog.style.visibility = "visible";

    // Lấy dữ liệu nhân viên từ API
    const res = await fetch(`https://cukcuk.manhnv.net/api/v1/Employees/${EmployeeId}`);
    const employee = await res.json();

    // Cập nhật các trường trong dialog với thông tin từ nhân viên
    document.getElementById("txtEmployeeCode").value = employee.EmployeeCode || "";
    document.getElementById("txtFullName").value = employee.FullName || "";
    document.getElementById("txtPosition").value = employee.PositionName || "";
    document.getElementById("txtDepartment").value = employee.DepartmentName || "";
    document.getElementById("dtDateOfBirth").value = employee.DateOfBirth ? new Date(employee.DateOfBirth).toISOString().split('T')[0] : "";
    let gender = employee.GenderName;
    switch (gender)
    {
      case "Nam":
        document.getElementById("rdoMale").checked = true;
        break;
      case "Nữ":
        document.getElementById("rdoFemale").checked = true;
        break;
      default:
        document.getElementById("rdoOther").checked = true;
        break;
    }
    document.getElementById("txtIdCardNumber").value = employee.IdentityNumber || "";
    document.getElementById("dtIssuedDate").value = employee.IdentityDate ? new Date(employee.IdentityDate).toISOString().split('T')[0] : "";
    document.getElementById("txtIssuedLocation").value = employee.IdentityPlace || "";
    document.getElementById("txtAddress").value = employee.Address || "";
    document.getElementById("txtMobilephoneNumber").value = employee.PhoneNumber || "";
    document.getElementById("txtLandlineNumber").value = employee.LandlineNumber || "";
    document.getElementById("txtEmail").value = employee.Email || "";
    document.getElementById("txtBankAccount").value = employee.BankAccount || "";
    document.getElementById("txtBankName").value = employee.BankName || "";
    document.getElementById("txtBankBranch").value = employee.BankBranch || "";

    // Focus vào ô input đầu tiên
    document.getElementById("txtEmployeeCode").focus();
  } catch (error) {
    console.error(error);
  }
}

  /**
   * Click button delete
   * Author: DTSANG (18/07/2024)
   */
  btnDeleteOnClick(EmployeeId)
  {
    try {
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
  btnSaveOnClick1() {
    try {
      // Thực hiện validate dữ liệu:
      const validateData = this.validateData();
      // check input required:
      if (!validateData.requiredValid || !validateData.dateValid || !validateData.emailValid)
      {
        debugger
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
        for (const Msg of validateData.Msgs)
        {
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
        debugger
        let genderName = null;
          if (document.getElementById("rdoMale").checked === true) {
            genderName = "Nam";
          } else if (document.getElementById("rdoFemale").checked = true) {
            genderName = "Nữ";
          } else {
            genderName = "Chưa xác định";
          }
        
        let employeeData = {
          EmployeeCode: document.getElementById("txtEmployeeCode").value,
          FullName: document.getElementById("txtFullName").value,
          Position: document.getElementById("txtPosition").value,
          Department: document.getElementById("txtDepartment").value,
          DateOfBirth: document.getElementById("dtDateOfBirth").value,
          Gender: genderName,
          Address: document.getElementById("txtAddress").value,
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

        console.log("Data to be sent:", employeeData);

        fetch("https://cukcuk.manhnv.net/api/v1/Employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employeeData),
        })
          .then(response => {
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
  btnSaveOnClick() {
    try {
      // Thực hiện validate dữ liệu:
      const validateData = this.validateData();
      // check input required:
      if (!validateData.requiredValid || !validateData.dateValid || !validateData.emailValid)
      {
        debugger
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
        for (const Msg of validateData.Msgs)
        {
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
        // let genderName = null;
        //   if (document.getElementById("rdoMale").checked === true) {
        //     genderName = "Nam";
        //   } else if (document.getElementById("rdoFemale").checked = true) {
        //     genderName = "Nữ";
        //   } else {
        //     genderName = "Chưa xác định";
        //   }
        let employeeData = {
          EmployeeCode: document.getElementById("txtEmployeeCode").value,
          FullName: document.getElementById("txtFullName").value,
          Position: document.getElementById("txtPosition").value,
          Department: document.getElementById("txtDepartment").value,
          DateOfBirth: document.getElementById("dtDateOfBirth").value,
          Gender: genderValue,
          Address: document.getElementById("txtAddress").value,
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

        console.log("Data to be sent:", employeeData);

        fetch("https://cukcuk.manhnv.net/api/v1/Employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employeeData),
        })
          .then(response => {
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
      const validateData = this.validateData();
      // check input required:
      if (!validateData.requiredValid || !validateData.dateValid || !validateData.emailValid)
      {
        debugger
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
        for (const Msg of validateData.Msgs)
        {
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
        debugger
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
          Address: document.getElementById("txtAddress").value,
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

        console.log("Data to be sent:", employeeData);

        fetch(`https://cukcuk.manhnv.net/api/v1/Employees/${EmployeeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employeeData),
        })
          .then(response => {
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
   * Validate data
   * Author: DTSANG (06/07/2024)
   */
  validateData()
  {
    try {
    let error = {
      requiredValid: false,
      dateValid: false,
      emailValid: false,
      inputInvalid: [],
      Msgs: [],
    };
    // check required input
    let requiredError = this.checkRequiredInput();
    error.requiredValid = requiredError.requiredValid;
    error.Msgs.push(...requiredError.Msgs);
    // check date input:
    let dateError = this.checkDateValidity();
    error.dateValid = dateError.dateValid;
    error.Msgs.push(...dateError.Msgs);
    // check email input:
    let emailError = this.checkEmailFormat();
    error.emailValid = emailError.emailValid;
    error.Msgs.push(...emailError.Msgs);
      return error;
    } catch (error) {
      console.error(error);
    }
  }
  
  /**
   * Check input required
   * Author: DTSANG (06/07/2024)
   */
  checkRequiredInput() {
    try
    {
      let result = {
        requiredValid: false,
        inputInvalid: [],
        Msgs: [],
      };
      // Lấy tất cả các input bắt buộc nhập:
      let inputs = document.querySelectorAll("#dlgDetail input[required]");
      for (const input of inputs) {
        const value = input.value;
        if (value === "" || value === null || value === undefined) {
          const label = input.previousElementSibling;
          if (!input.classList.contains('input-invalid')) {
            input.classList.add("input-invalid");
            this.addErrorElementToInputNotValid(input, "Thông tin này không được phép để trống");
          } 
          result.inputInvalid.push(input);
          result.Msgs.push(`${label.textContent} không được phép để trống`);
        } else
        {
          if (input.classList.contains('input-invalid'))
          {
            input.classList.remove("input-invalid");
            input.nextElementSibling.remove();
            this.removeErrorElementFromInput(input);
          }  
        }
      }
      if (result.inputInvalid.length === 0) {
            result.requiredValid = true;
      } else
      {
        result.requiredValid = false;
      }
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Check email
   * Author: DTSANG (06/07/2024)
   */
  checkEmailFormat()
  {
      try {
      let result = {
        emailValid: false,
        inputInvalid: [],
        Msgs: [],
      };
    let inputs = document.querySelectorAll("#dlgDetail input[type='email']");
      for (const input of inputs) {
    const value = input.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value) && value !=="")
        {
          const label = input.previousElementSibling;
          if (!input.classList.contains("input-invalid")) {
            input.classList.add("input-invalid");
            this.addErrorElementToInputNotValid(input, `${label.textContent} không đúng định dạng`);
          } 
          result.inputInvalid.push(input);
          result.Msgs.push(`${label.textContent} không đúng định dạng`);
        } else
        {
          if (input.classList.contains('input-invalid'))
          {
            input.classList.remove("input-invalid");
            input.nextElementSibling.remove();
            this.removeErrorElementFromInput(input);
          }
    }
    }
    if (result.inputInvalid.length === 0) {
            result.emailValid = true;
      } else
      {
        result.emailValid = false;
    }
        return result;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Check date
   * Author: DTSANG (06/07/2024)
   */
  checkDateValidity()
  {
    try{
    let result = {
        dateValid: false,
        inputInvalid: [],
        Msgs: [],
      };
    let inputs = document.querySelectorAll("#dlgDetail input[type='date']");
      for (const input of inputs) {
    const value = input.value;
    const currentDate = new Date().toISOString().split("T")[0]; // Ngày hiện tại ở định dạng YYYY-MM-DD
        if (value > currentDate)
        {
          const label = input.previousElementSibling;
          if (!input.classList.contains("input-invalid")) {
            input.classList.add("input-invalid");
            this.addErrorElementToInputNotValid(input, `${label.textContent} không được lớn hơn ngày hiện tại`);
          } 
          result.inputInvalid.push(input);
          result.Msgs.push(`${label.textContent} không được lớn hơn ngày hiện tại`);
        } else
        {
          if (input.classList.contains('input-invalid'))
          {
            input.classList.remove("input-invalid");
            input.nextElementSibling.remove();
            this.removeErrorElementFromInput(input);
          }
    }
    }
    if (result.inputInvalid.length === 0) {
            result.dateValid = true;
      } else
      {
        result.dateValid = false;
    }
      return result;
    } catch (error) {
      console.error(error);
    }
    }

  /**
   * Add error message to input not valid
   * Author: DTSANG (06/07/2024)
   */
  addErrorElementToInputNotValid(input, message) {
    try {
      // Đổi style cho input không hợp lệ:
      input.style.borderColor = "red";
      // Bổ sung thông tin lỗi dưới input không hợp lệ:
      let elError = document.createElement("div");
      elError.classList.add("input-invalid");
      elError.textContent = message;
      input.after(elError);
    } catch (error) {
      console.error(error);
    }
  }
  /**
   * Delete error message after input
   * Author: DTSANG (23/07/2024)
   */

  removeErrorElementFromInput(input)
  {
    try
    {
      //Xóa thông báo lỗi khỏi phần tử input
      input.style.borderColor = "";
      let errorElement = input.nextElementSibling;
      if (errorElement && errorElement.classList.contains("error-message"))
      {
        errorElement.remove();
      }
    } catch (error)
    {
      console.error(error);
    }
  }
    /**
     * Reset các input fields và thông báo lỗi
     * Author: DTSANG (23/07/2024)
     */
  resetForm()
  {
    try
    {
      document.getElementById("txtEmployeeCode").value = "";
      document.getElementById("txtFullName").value = "";
      document.getElementById("txtPosition").value = "";
      document.getElementById("txtDepartment").value = "";
      document.getElementById("dtDateOfBirth").value = "";
      document.getElementById("rdoMale").checked = true;
      document.getElementById("txtIdCardNumber").value = "";
      document.getElementById("dtIssuedDate").value = "";
      document.getElementById("txtIssuedLocation").value = "";
      document.getElementById("txtAddress").value = "";
      document.getElementById("txtMobilephoneNumber").value = "";
      document.getElementById("txtLandlineNumber").value = "";
      document.getElementById("txtEmail").value = "";
      document.getElementById("txtBankAccount").value = "";
      document.getElementById("txtBankName").value = "";
      document.getElementById("txtBankBranch").value = "";
      // Xóa bỏ thông báo lỗi
      let inputs = document.querySelectorAll("#dlgDetail input");
      for (const input of inputs)
      {
        if (input.classList.contains('input-invalid'))
        {
          input.classList.remove("input-invalid");
          input.nextElementSibling.remove();
          this.removeErrorElementFromInput(input);
        }
      }
      //.....
    } catch (error)
    {
      console.error(error);
    }
  }
}