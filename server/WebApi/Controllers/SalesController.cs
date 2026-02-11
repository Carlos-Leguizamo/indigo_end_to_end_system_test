using Microsoft.AspNetCore.Mvc;
using Application.Services;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SalesController : ControllerBase
    {
        private readonly SaleService _service;
        public SalesController(SaleService service) => _service = service;

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Sale sale)
        {
            var created = await _service.AddSaleAsync(sale);
            return CreatedAtAction(nameof(GetSalesByDateRange), new { from = created.Date, to = created.Date }, created);
        }

        [HttpGet("report")]
        public async Task<IActionResult> GetSalesByDateRange([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            var sales = await _service.GetSalesByDateRangeAsync(from, to);
            return Ok(sales);
        }
    }
}
