## Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim AS build
WORKDIR /src

# Copy solution + project files first (better layer caching)
COPY ["CSW306_ProjectAPI.sln", "./"]
COPY ["CSW306_ProjectAPI/CSW306.Presentation.csproj", "CSW306_ProjectAPI/"]
COPY ["CSW306.Application/CSW306.Application.csproj", "CSW306.Application/"]
COPY ["CSW306.Domain/CSW306.Domain.csproj", "CSW306.Domain/"]
COPY ["CSW306.Infrastructure/CSW306.Infrastructure.csproj", "CSW306.Infrastructure/"]

RUN dotnet restore "CSW306_ProjectAPI/CSW306.Presentation.csproj"

# Copy the rest of the source
COPY . .

RUN dotnet publish "CSW306_ProjectAPI/CSW306.Presentation.csproj" -c Release -o /app/publish /p:UseAppHost=false

## Runtime stage (small + non-root)
FROM mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .

# The official aspnet image includes a non-root 'app' user in .NET 8
USER app

ENTRYPOINT ["dotnet", "CSW306.Presentation.dll"]
