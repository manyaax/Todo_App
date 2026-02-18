# 📝 Todo App — Next.js + MongoDB + NextAuth

A full-stack Todo application built using **Next.js App Router**, **MongoDB**, and **NextAuth Authentication**.
Users can securely sign in and manage their personal tasks.

---

## 🚀 Features

* 🔐 Authentication (Login / Signup)
* 👤 User-specific todos
* ➕ Add new tasks
* ✏️ Update tasks
* ❌ Delete tasks
* 🌙 Modern responsive UI
* ⚡ Fast API routes using Next.js server actions

---

## 🛠 Tech Stack

**Frontend**

* Next.js 14 (App Router)
* React
* Tailwind CSS

**Backend**

* Next.js API Routes
* MongoDB + Mongoose
* NextAuth.js Authentication

---

## 📂 Project Structure

app/ → Pages & Routes
lib/ → Database connection & helpers
models/ → Mongoose schemas
public/ → Static assets

---

## ⚙️ Environment Variables

Create a `.env.local` file in root:

```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

---

## ▶️ Run Locally

Clone the project

```
git clone https://github.com/manyaax/Todo_App.git
```

Install dependencies

```
npm install
```

Run development server

```
npm run dev
```

Open in browser

```
http://localhost:3000
```

---

## 🔒 Security Note

Environment variables are ignored using `.gitignore` and are not stored in the repository.

---

## 📸 Future Improvements

* Task categories
* Due dates & reminders
* Drag & drop tasks
* Dark mode toggle
* Deployment (Vercel)

---

## 👨‍💻 Author

Manya

---

⭐ If you like this project, consider giving it a star!
