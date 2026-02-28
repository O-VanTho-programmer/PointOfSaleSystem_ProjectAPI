namespace CSW306.Application.Utils;

public class Pagination
{
    /// <summary>
    /// this function to handle pagination when client gets value from database
    /// </summary>
    /// <param name="pageNumber"></param>
    /// <param name="pageSize"></param>
    /// <param name="lstObject">this param is a list data that getting from the table in the database</param>
    /// <param name="countRecord">this param is a number of the record that getting from the table in the database</param>
    /// <typeparam name="T"></typeparam>
    /// <returns></returns>
    public TemplateApi<T> HandleGetAllRespond<T>(int pageNumber, int pageSize, IEnumerable<T> lstObject,
        int countRecord)
    {
        var enumerable = lstObject as T[] ?? lstObject.ToArray();
        if (!enumerable.Any())
        {
            return new TemplateApi<T>(
                default,
                Array.Empty<T>(),
                "Không tìm thấy dữ liệu !",
                false,
                0,
                0,
                0,
                0);
        }
        
        if (pageNumber != 0 && pageSize != 0)
        {
            if (pageNumber < 0)
            {
                pageNumber = 1;
            }

            lstObject = enumerable.Skip((pageNumber - 1) * pageSize).Take(pageSize);
        }

        var numPageSize = pageSize == 0 ? 1 : pageSize;

        return new TemplateApi<T>(
            default,
            lstObject?.ToArray(),
            "Lấy danh sách thành công !!!",
            true,
            pageNumber,
            pageSize,
            countRecord,
            countRecord / numPageSize);
    }

    /// <summary>
    /// this service to handle when getting data by id
    /// </summary>
    /// <param name="lstObject"></param>
    /// <typeparam name="T"></typeparam>
    /// <returns></returns>
    public TemplateApi<T> HandleGetByIdRespond<T>(T lstObject)
    {
        if (lstObject is null)
        {
            return new TemplateApi<T>(
                lstObject,
                null,
                "Không tìm thấy dữ liệu !",
                false,
                0,
                0,
                0,
                0);
        }

        return new TemplateApi<T>(
            lstObject,
            null,
            "Lấy thông tin thành công !",
            true,
            0,
            0,
            1,
            0);
    }

    /// <summary>
    /// this function to handle pagination when the data is already paginated at the database level
    /// </summary>
    public TemplateApi<T> HandlePagedRespond<T>(int pageNumber, int pageSize, IEnumerable<T> lstObject, int countRecord)
    {
        var enumerable = lstObject as T[] ?? lstObject.ToArray();
        
        if (!enumerable.Any())
        {
            return new TemplateApi<T>(
                default,
                Array.Empty<T>(),
                "Không tìm thấy dữ liệu !",
                false,
                0,
                0,
                0,
                0);
        }

        var numPageSize = pageSize == 0 ? 1 : pageSize;
        var totalPages = (int)Math.Ceiling(countRecord / (double)numPageSize);

        return new TemplateApi<T>(
            default,
            enumerable.ToArray(),
            "Lấy danh sách thành công !!!",
            true,
            pageNumber,
            pageSize,
            countRecord,
            totalPages);
    }
}