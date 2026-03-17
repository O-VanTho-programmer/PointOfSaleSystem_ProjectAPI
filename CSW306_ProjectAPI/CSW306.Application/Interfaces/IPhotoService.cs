using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces
{
    public interface IPhotoService
    {
        Task<string> AddPhotoAsync(Stream fileStream, string fileName);
    }
}
