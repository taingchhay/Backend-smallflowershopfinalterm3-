# 🌸 Flower Bliss – Flower Shop Website

A full-stack web application crafted for individuals who want to explore and purchase beautiful floral arrangements such as bouquets, potted plants, gift baskets, and seasonal flowers. Built with modern web technologies, this project offers an elegant shopping experience through a responsive and user-friendly interface.

## ⚙️ Tech Stack

**Frontend:** React.js, Tailwind CSS
**Backend:** Node.js, Express.js
**Database:** PostgreSQL (hosted on Neon)

## 💡 Features

* Browse a variety of floral products (bouquets, plants, seasonal arrangements)
* Modern, responsive UI built with Tailwind CSS
* Real-time product management with full-stack integration
* PostgreSQL-based scalable database structure
* Simple and smooth user experience for flower shopping

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/flower-bliss.git  
cd flower-bliss
```

### 2. Install Dependencies

**Frontend**

```bash
cd frontend  
npm install
```

**Backend**

```bash
cd ../backend  
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory and add your PostgreSQL connection string and other environment variables.

**Example:**

```
DATABASE_URL=your_postgres_connection_string  
PORT=5000
```

### 4. Run the App

Open **two terminals**, one for the backend and one for the frontend:

**Backend**

```bash
cd backend  
npm run dev
```

**Frontend**

```bash
cd frontend  
npm run dev
```