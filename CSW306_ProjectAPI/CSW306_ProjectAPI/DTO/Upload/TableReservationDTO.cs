namespace CSW306_ProjectAPI.DTO.Upload
{
    public class TableReservationDTO
    {
        public int TableId { get; set; }
        public int Capacity { get; set; }
        public string Status { get; set; }
        public DateTime Time { get; set; }
        public DateTime Date { get; set; }
        public int ReservationId { get; set; }
        public int TableNumber { get; set; }
        public int NumberOfPeople { get; set; }
        public string Note { get; set; }
        public string CustomerName { get; set; }
    }
}