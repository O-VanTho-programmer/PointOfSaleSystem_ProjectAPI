namespace CSW306_ProjectAPI.DTO.Upload
{
    public class ReservationCreateDTO
    {
        public int ReservationId { get; set; }
        public int TableId { get; set; }
        public int NumberOfPeople { get; set; }
        public string Note { get; set; }
        public DateTime Time { get; set; }
        public DateTime Date { get; set; }
        public string CustomerName { get; set; }
    }
}
