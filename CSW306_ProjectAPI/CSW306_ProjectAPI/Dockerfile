# Sử dụng Linux image siêu nhẹ cho ASP.NET Core 8
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080

# Sử dụng SDK để build code
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy file .csproj và restore các thư viện (Nuget)
COPY ["CSW306_ProjectAPI/CSW306_ProjectAPI.csproj", "CSW306_ProjectAPI/"]
RUN dotnet restore "./CSW306_ProjectAPI/CSW306_ProjectAPI.csproj"

# Copy toàn bộ source code còn lại và build
COPY . .
WORKDIR "/src/CSW306_ProjectAPI"
# Lưu ý: Đã đổi %BUILD_CONFIGURATION% thành $BUILD_CONFIGURATION cho chuẩn Linux
RUN dotnet build "./CSW306_ProjectAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish ra file chạy (.dll)
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./CSW306_ProjectAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Chạy app ở môi trường production
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CSW306_ProjectAPI.dll"]