using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CSW306.Application.DTO
{
    public class VietQrRequestDto
    {
        [JsonPropertyName("accountNo")]
        public string AccountNo { get; set; } = "0948508499"; 

        [JsonPropertyName("accountName")]
        public string AccountName { get; set; } = "POS Payment";

        [JsonPropertyName("acqId")]
        public int AcqId { get; set; } = 970422;

        [JsonPropertyName("amount")]
        public decimal Amount { get; set; }

        [JsonPropertyName("addInfo")]
        public string AddInfo { get; set; } = string.Empty;

        [JsonPropertyName("format")]
        public string Format { get; set; } = "text";

        [JsonPropertyName("template")]
        public string Template { get; set; } = "compact";
    }

    public class VietQrResponseDto
    {
        [JsonPropertyName("code")]
        public string Code { get; set; }

        [JsonPropertyName("desc")]
        public string Desc { get; set; }

        [JsonPropertyName("data")]
        public VietQrData Data { get; set; }
    }

    public class VietQrData
    {
        [JsonPropertyName("qrCode")]
        public string QrCode { get; set; } 

        [JsonPropertyName("qrDataURL")]
        public string QrDataURL { get; set; } // The ready-to-use Base64 image string!
    }
}
