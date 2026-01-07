
## 1. MEMBER & AUTH ENDPOINTS

### 1.1 Create Member + Organisation (Registration)
```
POST /business-organisation
Content-Type: application/json

{
  "name": "Avenstek Admin",
  "password": "password123",
  "organisationName": "Avenstek",
  "companyEmail": "admin@avenstek.com",
   "phone":"xxxxxxxxxx"
}
```
### 1.2 Member Login
```
POST /business-organisation/login
Content-Type: application/json
{
  "email": "admin@avenstek.com",
  "password": "password123"
}
```