# 🏫 Multi-SchoolHub

**A multi-tenant school management system** where each school runs as its own tenant, with separate dashboards for super admins, school admins, teachers and students.

### 🌐 [View it live → multi-schoolhub.laravel.cloud](https://multi-schoolhub.laravel.cloud/)

![Laravel](https://img.shields.io/badge/Laravel_12-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Inertia](https://img.shields.io/badge/Inertia.js-9553E9?style=flat-square&logo=inertia&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)

---

## ✨ Features by role

| Role | What they can do |
|---|---|
| **Super Admin** | Oversee every school (tenant) from a central dashboard |
| **School Admin** | Manage teachers, students, courses and enrolments for their school |
| **Teacher** | Build timetables, create assessments, download and grade student submissions |
| **Student** | View their dashboard, download assessments, submit work and see grades |

- 🏢 Multi-tenancy — data is scoped per school
- 🔐 Role-based access control with Spatie Laravel Permission
- 📁 File uploads for assessments and submissions (local or AWS S3)
- 🔑 Authentication via Laravel Fortify

---

## 🛠️ Tech stack

- **Backend:** Laravel 12, Fortify, Spatie Permission, Wayfinder
- **Frontend:** React 19, TypeScript, Inertia.js, Vite, Tailwind CSS, Radix UI / shadcn
- **Database:** MySQL
- **CI:** GitHub Actions (lint + tests)

---

## 🚀 Getting started

### Prerequisites
PHP 8.2+, Composer, Node.js 18+, MySQL

### Setup
```bash
git clone https://github.com/Jack-Mithu/Final-Multi-schl.git
cd Final-Multi-schl

composer install
npm install

```

Create a `.env` file in the project root with your app and database settings:
```env
APP_NAME="Multi-School"
APP_ENV=local
APP_KEY=
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=multi_school
DB_USERNAME=root
DB_PASSWORD=
```

Generate the app key, create the database, then migrate and seed (this also creates the roles):
```bash
php artisan key:generate
php artisan migrate --seed
```

### Run
```bash
npm run dev
php artisan serve
```
Open **http://localhost:8000**.

---

## 📂 Project structure

```
app/Models          Tenant, User, Teacher, Student, Course, Enrollment, Timetable, Assessment…
routes/web.php      Role-grouped routes (superadmin / admin / teacher / student)
resources/js/pages  Inertia React pages per role
database/seeders    Role + demo data seeders
```

---

## 👤 Author

**Mithusanth Sukumar** — [GitHub](https://github.com/Jack-Mithu) · [LinkedIn](https://linkedin.com/in/sukumar-mithushanth)
