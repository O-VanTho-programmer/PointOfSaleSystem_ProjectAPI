# Point Of Sale System (Project .NET API)
### Description
The Restaurant Management API offers features for ordering food, booking tables, and making payments. With structured endpoints, users can view the menu, order meal, confirm orders, reserve tables, and pay securely.

## Tech Stack
- ASP.NET CORE Web API 8
- Entity Framework Core
- SQL Server
- JWT Authentication
- Swagger (OpenAPI)

## Project Architecture
- Layered Architecture:
  + Models
  + Controllers
  + DTO

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
| GET | /api/Orders/{id} | Get a order by id |
| GET | /api/Orders/filter_by_date_range | Get a orders filtered from date range |
| POST | /api/Orders | Create order |
| PATCH | /api/Orders/{id} | Adjust order status |

### Table
| Method | Endpoint        | Description |
|------|-----------------|-------------|
| GET | /api/Table | Get all table |
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
| POST | /api/Payments/pay/{id} | Purchase a payment |
| PUT | /api/Payments/edit/{id} | Update payment by id |
| DELETE | /api/Payments/delete/{id} | Delete payment by id |

## How to Run Locally

### Prerequisites
- .NET SDK 8.0
- MySQL / SQL Server
- Visual Studio or VS Code

### Installation
```bash
git clone https://github.com/yourusername/project-api.git
cd project-api
dotnet restore
dotnet run
```


