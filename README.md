# Saran R — Portfolio & Engineering Showcase

Full-stack portfolio for **Saran R**, Artificial Intelligence & Machine Learning engineering student at Panimalar Engineering College (2023–2027). Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and powered by **Neon Serverless Postgres**.

---

## 🌟 Key Features

- **Dynamic Data Layer**: Projects, skills, internships, and certifications are stored in and dynamically loaded from **Neon Serverless Postgres**.
- **Admin Control Panel (`/admin`)**: Fully password-protected admin portal for dynamic CRUD operations on portfolio content.
- **Neon Cloud Architecture**: Live system telemetry integrated with Neon Postgres, Managed Auth, Functions, and Realtime.
- **Visitor Guestbook**: Direct connection for visitor messages saved in PostgreSQL.
- **Modern Typography & Design**: Built with Geist typography, obsidian glass surfaces, and responsive layouts.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **Database**: Neon Serverless Postgres (`pg`, `@neondatabase/serverless`)
- **Icons**: Lucide React + Custom SVGs
- **Deployment**: Vercel

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/technosaran/saran-portfolio.git
cd saran-portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env.local` and add your Neon credentials:
```bash
cp .env.example .env.local
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

---

## 🔒 Admin Access

The admin control panel is protected and accessible via:
```
http://localhost:3000/admin
```
*(Requires authorized administrator credentials)*

---

## 📄 License
MIT © [Saran R](https://github.com/technosaran)
