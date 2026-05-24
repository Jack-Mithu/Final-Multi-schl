# Laravel + React Project Setup Guide

This document explains how to set up and run the Laravel + React project on a local development environment.

---

## Technology Stack
- Laravel (Backend)
- React (Frontend)
- Inertia.js & Vite
- MySQL Database

---

## System Requirements
Ensure the following are installed on your system:

- PHP >= 8.1
- Composer
- Node.js >= 18
- npm
- MySQL (XAMPP / WAMP recommended)
- Git
- VS Code (recommended)

---

## Project Setup Instructions

### 1. Clone or Extract the Project
If using Git:
```bash
git clone <repository-url>
cd project-folder

#### Update database configuration in the .env file:
.env file.

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=final_multitenancyproject_school
DB_USERNAME=root
DB_PASSWORD=

CREATE DATABASE project_database_name;

php artisan migrate --seed

npm install

npm run dev

php artisan serve

Open a web browser and navigate to:

http://localhost:8000


