const body = document.querySelector('body'),
sidebar = body.querySelector('nav'),
res_sidebar = body.querySelector(".sidebar-bottom");

res_sidebar.addEventListener("click", () =>{
    sidebar.classList.toggle("close");
})