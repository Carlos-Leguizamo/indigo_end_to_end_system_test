using Microsoft.AspNetCore.Mvc;
using Application.Services;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ClientsController : ControllerBase
    {
        private readonly ClientService _service;

        public ClientsController(ClientService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var clients = await _service.GetAllAsync();

            var response = clients.Select(c => new ClientResponseDto
            {
                Id = c.Id,
                Name = c.Name,
                Email = c.Email,
                Phone = c.Phone
            });

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var client = await _service.GetByIdAsync(id);
            if (client == null)
                return NotFound();

            var response = new ClientResponseDto
            {
                Id = client.Id,
                Name = client.Name,
                Email = client.Email,
                Phone = client.Phone
            };

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateClientDto dto)
        {
            var client = new Client
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone
            };

            var created = await _service.AddAsync(client);

            var response = new ClientResponseDto
            {
                Id = created.Id,
                Name = created.Name,
                Email = created.Email,
                Phone = created.Phone
            };

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateClientDto dto)
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            existing.Name = dto.Name;
            existing.Email = dto.Email;
            existing.Phone = dto.Phone;

            var updated = await _service.UpdateAsync(existing);

            var response = new ClientResponseDto
            {
                Id = updated.Id,
                Name = updated.Name,
                Email = updated.Email,
                Phone = updated.Phone
            };

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
