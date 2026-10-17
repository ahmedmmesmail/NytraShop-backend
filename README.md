# 🛒 E-Commerce REST API

A modern **Node.js** RESTful E-Commerce API built with **Express.js** and **MongoDB**.  
The project includes authentication, product management, shopping cart functionality, order management, and secure JWT-based authorization.

---

## ✨ Features

- 🔐 User Authentication (JWT)
- 🔒 Password Hashing with bcrypt
- 👤 User Registration & Login
- 📦 Product Management
- 🛒 Shopping Cart
- 📄 Order Management
- ✅ Request Validation using Joi
- 🌱 Environment Variables with dotenv
- 🗄️ MongoDB Database using Mongoose
- ⚡ ES Modules Support

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | Backend Framework |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Joi | Request Validation |
| dotenv | Environment Variables |

---

## 📦 Installation

Clone the repository:

```bash
git clone <repository-url>
cd <project-folder>
```

Install dependencies:

```bash
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
```

> [!IMPORTANT]
> The `.env` file is listed in `.gitignore` and **must never be committed** because it contains sensitive information such as your database connection string and JWT secret.

---

## ▶️ Running the Project

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

---

## 📂 Project Structure

```text
project/
│
├── controllers/
├── database/
├── models/
├── routers/
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md
```

---

## 📚 Dependencies

| Package | Description |
|---------|-------------|
| express | Web framework |
| mongoose | MongoDB ODM |
| bcrypt | Password hashing |
| jsonwebtoken | JWT authentication |
| joi | Input validation |
| dotenv | Environment variable management |
| nodemon | Development server |

---

## 🔒 Security

- Passwords are hashed using **bcrypt**.
- Authentication is handled using **JSON Web Tokens (JWT)**.
- Sensitive data is stored in environment variables.
- Request data is validated using **Joi**.

---

## 📄 License

This project is proprietary software. All rights are reserved by Ahmed Esmail.

The source code is publicly available for portfolio viewing and evaluation only. Copying, modifying, redistributing, or using the code in other projects is prohibited without prior written permission.

See the [LICENSE](LICENSE) file for details.


---

## 👨‍💻 Author

Developed by **Ahmed Esmail**
