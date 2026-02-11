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
        public async Task<IActionResult> Register([FromBody] User user)
        {

            var existingUser = await _service.GetByUsernameOrEmailAsync(user.Username, user.Email);

            if (existingUser != null)
            {
                if(existingUser.Username == user.Username)
                    return BadRequest("El nombre de usuario ya está en uso");
                if(existingUser.Email == user.Email)
                    return BadRequest("El correo electrónico ya está en uso");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
            var created = await _service.AddAsync(user);
            return Ok(new { created.Id, created.Username, created.Email, created.Role });
        }

        [HttpPost("login")]
public async Task<IActionResult> Login([FromBody] User login)
{
    var user = await _service.GetByUsernameAsync(login.Username);
    if (user == null || !BCrypt.Net.BCrypt.Verify(login.PasswordHash, user.PasswordHash))
        return Unauthorized("Usuario o contraseña incorrecta");

    var jwtSecret = _config["JwtSettings:SecretKey"];

    if (string.IsNullOrWhiteSpace(jwtSecret))
        throw new Exception("JWT Secret no configurado");

    Console.WriteLine($"JWT length: {jwtSecret.Length}");

    var key = Encoding.UTF8.GetBytes(jwtSecret);

    var tokenHandler = new JwtSecurityTokenHandler();
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[] {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        }),
        Expires = DateTime.UtcNow.AddHours(8),
        SigningCredentials = new SigningCredentials(
            new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256
        )
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);
    return Ok(new { Token = tokenHandler.WriteToken(token) });
}

    }
}
