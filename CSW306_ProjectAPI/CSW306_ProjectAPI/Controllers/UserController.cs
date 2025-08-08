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
        public IEnumerable<Users> GetUsers()
        {
            var users = _context.Users.ToList();
            return (users);
        }

        [HttpPost]
        public ActionResult<Users> CreateUser(Users user) { 
            _context.Users.Add(user);
            _context.SaveChanges();
            return Ok(user);
        }
    }
}
