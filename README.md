# Point Of Sale System (Project .NET API)
### Description
The Restaurant Management API offers features for ordering food, booking tables, and making payments. With structured endpoints, users can view the menu, order meals, confirm orders, reserve tables, and pay securely.

## Tech Stack
- ASP.NET CORE Web API 8
- Entity Framework Core
- SQL Server
- JWT Authentication
- Swagger (OpenAPI)

## Project Architecture

The project follows a layered architecture to ensure separation of concerns:
- Controllers: Handle HTTP requests and responses
- DTOs: Define data contracts between client and server
- Models (Entities): Represent database tables
- Data Access: Entity Framework Core with SQL Server
    
## System Design

### Use Case Diagram
The following use case diagram illustrates the main interactions between users and the system, including authentication, product management, and order processing.

![Use Case Diagram](doc/usecase_diagram.jpg)

### Class Diagram
The class diagram describes the system structure, including entities, relationships, and core business logic.

![Class Diagram](doc/class_diagram.jpg)

## Features
- User authentication with JWT
- Role-based access control (Admin, Chef, Cashier, Customer)
- Table Reservation
- Product Management
- Order Management

## API Endpoints
### Auth
| Method | Endpoint        | Description |
|------|-----------------|-------------|
| POST | /api/Auths/customer/register | Register as customer |
| POST | /api/Auths/employee/register | Register staff |
| POST | /api/Auths/login | User login |

### User
| Method | Endpoint        | Description |
|------|-----------------|-------------|
| GET | /api/User | Get all users |
| POST | /api/User | Create user |

### Items
| Method | Endpoint        | Description |
|------|-----------------|-------------|
| GET | /api/Items | Get all items |
| POST | /api/Items | Create item |

### Categories
| Method | Endpoint        | Description |
|------|-----------------|-------------|
| GET | /api/Categories | Get all categories |
| GET | /api/Categories/{id} | Get a category by id |
| POST | /api/Categories | Create category |
| POST | /api/Categories/assign-item | Assign an item to a category |

### Orders
| Method | Endpoint        | Description |
|------|-----------------|-------------|
| GET | /api/Orders | Get all items |
| GET | /api/Orders/{id} | Get an order by id |
| GET | /api/Orders/filter_by_date_range | Get a orders filtered from date range |
| POST | /api/Orders | Create order |
| PATCH | /api/Orders/{id} | Adjust order status |

### Table
| Method | Endpoint        | Description |
|------|-----------------|-------------|
| GET | /api/Table | Get all tables |
| GET | /api/Table/{id} | Get a table by id |
| POST | /api/Table | Create table |
| PUT | /api/Table/{id} | Update table status by id |
| DELETE | /api/Table/{id} | Delete table by id |

### Reservation
| Method | Endpoint        | Description |
|------|-----------------|-------------|
| GET | /api/Reservation | Get all made reservations |
| GET | /api/Reservation/{id} | Get a reservation by id |
| POST | /api/Reservation | Create reservation |
| PUT | /api/Reservation/{id} | Update reservation status by id |
| DELETE | /api/Reservation/{id} | Delete reservation by id |

### Discounts
| Method | Endpoint        | Description |
|------|-----------------|-------------|
| GET | /api/Discounts | Get all discounts |
| GET | /api/Discounts/{id} | Get a discounts by id |
| POST | /api/Discounts/add | Create discount |
| POST | /api/Discounts/apply/{id} | Apply a discount to an order |
| PUT | /api/Discounts/edit/{id} | Update discount by id |
| DELETE | /api/Discounts/delete/{id} | Delete discount by id |

### Payments
| Method | Endpoint        | Description |
|------|-----------------|-------------|
| GET | /api/Payments | Get all payments |
| GET | /api/Payments/{id} | Get a discounts by id |
| POST | /api/Payments/add | Create payment |
| POST | /api/Payments/pay/{id} | Process a payment |
| PUT | /api/Payments/edit/{id} | Update payment by id |
| DELETE | /api/Payments/delete/{id} | Delete payment by id |

## Use Case to API Mapping

| Use Case | Endpoint |
|--------|----------|
| Customer Registration | POST /api/Auths/customer/register |
| Create Order | POST /api/Orders |
| Reserve Table | POST /api/Reservation |
| Process Payment | POST /api/Payments/pay/{id} |

## How to Run Locally

### Prerequisites
- .NET SDK 8.0
- SQL Server
- SQL Server Management Studio (SSMS)
- Visual Studio or VS Code

### Installation
```bash
git clone https://github.com/O-VanTho-programmer/PointOfSaleSystem_ProjectAPI.git
cd CSW306_ProjectAPI/CSW306_ProjectAPI
dotnet restore
dotnet run
```

### Restore Database from Backup
1. Open **SQL Server Management Studio (SSMS)**
2. Right-click **Databases** → **Restore Database**
3. Select **Device** → **Browse**
4. Choose the file:  
   `CSW306_ProjectAPI.bak`
5. Set the database name (e.g. `CSW306_ProjectAPI`)
6. Click **OK**

After restoring, update the connection string in `appsettings.json`.

```json
{
  "ConnectionStrings": {
    "DBConnection": "Server=.;Database=CSW306_ProjectAPI;Trusted_Connection=True;TrustServerCertificate=True;"
  },
}
```

### Security Configuration (JWT)

Update `appsettings.json` with your own secret key:

```json
"JwtSettings": {
  "SecretKey": "your-strong-secret-key",
  "Issuer": "PointOfSale.AuthServer",
  "Audience": "PointOfSale.Client",
  "ExpiryMinutes": 60
}
```

## Author
- Contributors: Ong Van Tho, Pham Tran Gia Hung, Ly Dat
- Course: CSW306 – Backend
- Major: Software Engineering
