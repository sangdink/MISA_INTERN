using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MISA.WebIntern.Insfrastructure.Repository;
using MISA.WenIntern.Core.Entities;
using MISA.WenIntern.Core.Interfaces;
using System.Net;

namespace MISA.WebIntern.Api.Controllers
{
    [Route("api/v1/employees")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        IEmployeeRepository _employeeRepository;
        private IEmployeeService _employeeService;
        public EmployeesController(IEmployeeRepository repository, IEmployeeService service)
        {
            _employeeRepository = repository;
            _employeeService = service;
        }


        [HttpGet]
        public IActionResult Get()
        {
            var res = _employeeRepository.Get();
            return StatusCode(200, res);
        }

        [HttpGet("{id}")]
        public IActionResult Get(Guid id)
        {
            var res = _employeeRepository.Get(id);
            return StatusCode(200, res);
        }

        [HttpPost]
        public IActionResult Insert(Employee employee)
        {
            var res = _employeeService.InsertService(employee);
            return StatusCode(201, res);
        }
        [HttpPut("{id}")]
        public IActionResult Update(Guid id, [FromBody] Employee employee)
        {
             var res = _employeeService.UpdateService(id, employee);
            // var res = _employeeRepository.Update(id, employee);
            return StatusCode(201, res);
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            var res = _employeeRepository.Delete(id);
            return StatusCode(200, res);
            
        }
    }
}
