using Microsoft.AspNetCore.Mvc;
using Application.Services;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _service;

        public ProductsController(ProductService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _service.GetAllAsync();

            var response = products.Select(p => new ProductResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Stock = p.Stock,
                Category = p.Category,
                ImageUrl = p.ImageUrl
            });

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _service.GetByIdAsync(id);
            if (product == null) return NotFound();

            var response = new ProductResponseDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Stock = product.Stock,
                Category = product.Category,
                ImageUrl = product.ImageUrl
            };

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Price = dto.Price,
                Stock = dto.Stock,
                Category = dto.Category,
                ImageUrl = dto.ImageUrl
            };

            var created = await _service.AddAsync(product);

            var response = new ProductResponseDto
            {
                Id = created.Id,
                Name = created.Name,
                Price = created.Price,
                Stock = created.Stock,
                Category = created.Category,
                ImageUrl = created.ImageUrl
            };

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto)
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing == null) return NotFound();

            existing.Name = dto.Name;
            existing.Price = dto.Price;
            existing.Stock = dto.Stock;
            existing.Category = dto.Category;
            existing.ImageUrl = dto.ImageUrl;

            var updated = await _service.UpdateAsync(existing);

            var response = new ProductResponseDto
            {
                Id = updated.Id,
                Name = updated.Name,
                Price = updated.Price,
                Stock = updated.Stock,
                Category = updated.Category,
                ImageUrl = updated.ImageUrl
            };

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing == null) return NotFound();

            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
