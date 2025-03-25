### **1 Project (Environment) Setup Guide**

**Prerequisites**  
Backend (Laravel):

- PHP
- Composer
- MySQL

Frontend (React.js):

- Node.js
- npm

1. **Backend (Laravel):**

```bash (these are terminal commands)
   cd backend
   composer install
   php artisan migrate
   php artisan serve  # Runs backend at http://localhost:8000
```

note: before migrating
Configure .env textfile on your laravel proj folder:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=

2. **Frontend (React):**

```bash (these are terminal commands)
    cd frontend
    npm install       # Install dependencies
    npm start
```
