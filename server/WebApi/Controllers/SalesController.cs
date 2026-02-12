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

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var sales = await _service.GetAllSalesAsync();

            var response = sales.Select(s => new SaleResponseDto
            {
                Id = s.Id,
                Date = s.Date,
                Total = s.Total,
                Client = new ClientResponseDto
                {
                    Id = s.Client.Id,
                    Name = s.Client.Name,
                    Email = s.Client.Email,
                    Phone = s.Client.Phone
                },
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
                Client = new ClientResponseDto
                {
                    Id = created.Client.Id,
                    Name = created.Client.Name,
                    Email = created.Client.Email,
                    Phone = created.Client.Phone
                },
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
                Client = new ClientResponseDto
                {
                    Id = s.Client.Id,
                    Name = s.Client.Name,
                    Email = s.Client.Email,
                    Phone = s.Client.Phone
                },
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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var sale = await _service.GetSaleByIdAsync(id);
            if (sale == null)
                return NotFound();

            var response = new SaleResponseDto
            {
                Id = sale.Id,
                Date = sale.Date,
                Total = sale.Total,
                Client = new ClientResponseDto
                {
                    Id = sale.Client.Id,
                    Name = sale.Client.Name,
                    Email = sale.Client.Email,
                    Phone = sale.Client.Phone
                },
                Items = sale.Items.Select(i => new SaleItemResponseDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Quantity = i.Quantity,
                    UnitPrice = i.Product.Price
                }).ToList()
            };

            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateSaleDto dto)
        {
            var sale = await _service.GetSaleByIdAsync(id);
            if (sale == null)
                return NotFound();

            sale.ClientId = dto.ClientId;
            sale.SaleStatusId = dto.SaleStatusId;
            sale.Items = dto.Items.Select(i => new SaleDetail
            {
                ProductId = i.ProductId,
                Quantity = i.Quantity
            }).ToList();

            var updated = await _service.UpdateSaleAsync(sale);
            var response = new SaleResponseDto
            {
                Id = updated.Id,
                Date = updated.Date,
                Total = updated.Total,
                Client = new ClientResponseDto
                {
                    Id = updated.Client.Id,
                    Name = updated.Client.Name,
                    Email = updated.Client.Email,
                    Phone = updated.Client.Phone
                },
                Items = updated.Items.Select(i => new SaleItemResponseDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Quantity = i.Quantity,
                    UnitPrice = i.Product.Price
                }).ToList()
            };

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteSaleAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}