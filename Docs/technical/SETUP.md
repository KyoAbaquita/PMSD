# **1 Project (Environment) Setup Guide**

**Last Updated:** [04/01/2025]

---

## 1. Prerequisites

### Backend (Laravel):

- PHP ≥8.1
- Composer
- MySQL ≥8.0

Frontend (React.js):

- Node.js ≥18
- npm npm ≥9

##

---

## 2. Backend (Laravel)

### Installation

```bash (these are terminal commands)
   cd backend       # project file name
   composer install # Install PHP dependencies
```

**Database Configuration**

1. Edit .env (create from .env.example if missing):

```bash
copy .env.example .env #Create a copy of .env.example name .env
```

```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel # Create this DB in MySQL
DB_USERNAME=root    # Default, change if needed
DB_PASSWORD=        # Add password if set
```

2. Run migrations:

```bash
php artisan migrate:fresh  # Wipes existing data; use `php artisan migrate` for incremental updates
php artisan key:generate  # Generate app encryption key
```

3. Start the Server

```bash
php artisan serve # Runs backend at http://localhost:8000

```

##

## 3. Frontend Setup

```bash (these are terminal commands)
    cd frontend
    npm install       # Install dependencies
    npm start         # Runs at http://localhost:3000
```

## 4. Troubleshooting

**Common Issues**

- "Database connection failed"
  - Verify MySQL is running.
  - Check .env credentials match your MySQL setup.
  - Run: php artisan config:clear
- "npm install errors"
  - Delete node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```
