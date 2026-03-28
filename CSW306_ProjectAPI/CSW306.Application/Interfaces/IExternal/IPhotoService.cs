using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IExternal
{
    public interface IPhotoService
    {
        Task<(string Url, string PublicId)> AddPhotoAsync(Stream fileStream, string fileName);
        Task<bool> DeletePhotoAsync(string publicId);
    }
}
