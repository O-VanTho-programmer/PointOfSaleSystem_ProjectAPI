namespace CSW306.Application.Utils;

public class TemplateApi<T>
{
    public T? Payload { get; set; }
    public T[]? ListPayload { get; set; }
    public string Message { get; set; }
    public bool Success { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalElement { get; set; }
    public int TotalPages { get; set; }

    public TemplateApi(T? payload, T[]? listPayload, string message, bool success, int pageNumber, int pageSize, int totalElement, int totalPages)
    {
        Payload = payload;
        ListPayload = listPayload;
        Message = message;
        Success = success;
        PageNumber = pageNumber;
        PageSize = pageSize;
        TotalElement = totalElement;
        TotalPages = totalPages;
    }
}