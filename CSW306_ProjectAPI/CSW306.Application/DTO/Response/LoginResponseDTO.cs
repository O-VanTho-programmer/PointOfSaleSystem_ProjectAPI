namespace CSW306.Application.DTO.Response
{
    public class LoginResponseDTO
    {
        public string Token { get; set; }   
        public UserSessionDTO User { get; set; }
    }

    public class UserSessionDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }   
        public string Email { get; set; }   
        public string Role { get; set; }
    }
}