namespace CSW306.Application.DTO.Upload
{
    public class SePayWebhookDto
    {
        public decimal transferAmount { get; set; }
        public string transferContent { get; set; }
        public string referenceCode { get; set; }
        public string gateway {  get; set; }
    }
}
