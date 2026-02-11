using Microsoft.AspNetCore.Mvc;
using Application.Services;
using Core.Entities;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserService _service;
        private readonly IConfiguration _config;

        public AuthController(UserService service, IConfiguration config)
        {
            _service = service;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var existingUser = await _service
                .GetByUsernameOrEmailAsync(dto.Username, dto.Email);

            if (existingUser != null)
            {
                if (existingUser.Username == dto.Username)
                    return BadRequest("El nombre de usuario ya está en uso");

                if (existingUser.Email == dto.Email)
                    return BadRequest("El correo electrónico ya está en uso");
            }

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "User"
            };

            var created = await _service.AddAsync(user);

            return Ok(new
            {
                created.Id,
                created.Username,
                created.Email,
                created.Role
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _service.GetByUsernameAsync(dto.Username);

            if (user == null || 
                !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized("Usuario o contraseña incorrecta");
            }

            var jwtSecret = _config["JWT_KEY"];
            if (string.IsNullOrWhiteSpace(jwtSecret))
                throw new Exception("JWT Secret no configurado");

            var key = Encoding.UTF8.GetBytes(jwtSecret);
            var tokenHandler = new JwtSecurityTokenHandler();

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("UserId", user.Id.ToString())
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(8),
                Issuer = _config["JWT_ISSUER"],
                Audience = _config["JWT_AUDIENCE"],
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            var response = new AuthResponseDto
            {
                Token = tokenHandler.WriteToken(token),
                Username = user.Username,
                Role = user.Role
            };

            return Ok(response);
        }
    }
}
