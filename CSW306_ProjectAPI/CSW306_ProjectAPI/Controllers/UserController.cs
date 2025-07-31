using CSW306_ProjectAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CSW306_ProjectAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly CSW306_ProjectAPIContext _context;

        public UserController(CSW306_ProjectAPIContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<User> GetBook()
        {
            var users = _context.Users.ToList();
            return (users);
        }
    }
}
