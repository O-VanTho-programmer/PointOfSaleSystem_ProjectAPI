using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using CSW306.Application.Interfaces.IExternal;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSW306.Infrastructure.Services
{
    public class CloudinaryPhotoService : IPhotoService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryPhotoService(IConfiguration config)
        {
            var acc = new Account(
                config["CloudinarySettings:CloudName"],
                config["CloudinarySettings:ApiKey"],
                config["CloudinarySettings:ApiSecret"]
            );

            _cloudinary = new Cloudinary(acc);
        }

        public async Task<(string Url, string PublicId)> AddPhotoAsync(Stream fileStream, string fileName)
        {
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(fileName, fileStream),
                Transformation = new Transformation().Height(500).Width(500).Crop("fill")
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            return (uploadResult.SecureUrl.ToString(), uploadResult.PublicId.ToString());
        }

        public async Task<bool> DeletePhotoAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var res = await _cloudinary.DestroyAsync(deleteParams);
            return res.Result == "ok";
        }
    }
}
