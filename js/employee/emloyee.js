window.onload = function(){
    new EmployeePage();
}


class EmployeePage {
    pageTitle = "Quản lý nhân viên";
    constructor(){
        
        this.initEvents();
    }
    /**
     * Khởi tạo các sự kiện trong page3
     * Author: DTSANG (06/07/2024)
     */
    initEvents(){
        try {
           // Click button add hiển thị form thêm mới:
            document.querySelector("#btnAdd").addEventListener('click', this.btnAddOnClick);
            // Rfresh dữ liệu:
            document.querySelector("#btnRefresh").addEventListener('click', this.btnRefreshOnClick);
            // Xuất khẩu:

            // Xóa nhiều bản ghi:

            // Ẩn form chi tiết:
            document.querySelector("#btnCloseDialog").addEventListener('click', ()=>{
                document.querySelector("#dlgDetail").style.visibility = "hidden";
            })

        } catch (error) {
            console.error(error);
        }
    }
        loadData(){
            
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
            } catch (error) {
                console.error(error);
            }
        }
        btnRefreshOnClick(){

        }
        //.....
}