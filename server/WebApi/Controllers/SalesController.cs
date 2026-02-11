using Microsoft.AspNetCore.Mvc;
using Application.Services;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore; 

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class SalesController : ControllerBase
    {
        private readonly SaleService _service;

        public SalesController(SaleService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSaleDto dto)
        {
           var sale = new Sale
            {
                Date = DateTime.UtcNow,
                ClientId = dto.ClientId,
                SaleStatusId = 1,
                Items = dto.Items.Select(i => new SaleDetail
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity
                }).ToList()
            };


            var created = await _service.AddSaleAsync(sale);
            var response = new SaleResponseDto
            {
                Id = created.Id,
                Date = created.Date,
                Total = created.Total,
                Items = created.Items.Select(i => new SaleItemResponseDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Quantity = i.Quantity,
                    UnitPrice = i.Product.Price 
                }).ToList()
            };

            return CreatedAtAction(nameof(GetSalesByDateRange), 
                new { from = created.Date, to = created.Date }, response);
        }

        [HttpGet("report")]
        public async Task<IActionResult> GetSalesByDateRange([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            var sales = await _service.GetSalesByDateRangeAsync(from, to);

            var response = sales.Select(s => new SaleResponseDto
            {
                Id = s.Id,
                Date = s.Date,
                Total = s.Total,
                Items = s.Items.Select(i => new SaleItemResponseDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Quantity = i.Quantity,
                    UnitPrice = i.Product.Price
                }).ToList()
            });

            return Ok(response);
        }
    }
}
