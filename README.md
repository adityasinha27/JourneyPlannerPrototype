# 🚌 Mo Bus Journey Planner

A full-stack (MERN) application that allows users to plan bus journeys, manage bus stops and routes, and get route suggestions using graph traversal and real-world distance data (via Radar API).

---

## 📦 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Routing Engine**: Graph-based BFS
- **Distance API**: Radar.com (server-side secret key)

---

## 🚀 Features

### 🔍 Journey Planner
- Find all possible paths between source and destination
- Shows route number, stop names
- Shows real-world distance and duration (Radar API)
- Supports multi-route transfers using a graph

### 🚏 Bus Stop Management
- Add, view all bus stops
- Each stop includes name, latitude, and longitude

### 🚌 Bus Route Management
- Add routes with ordered stop sequence
- View all routes with route number, bus number, and stop sequence

---

## 📁 Folder Structure

```
mo-bus-app/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── assets/   # Screenshots related to backend
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── assets/   # Screenshots related to frontend
```

---

## 🛠️ Setup Instructions

### 📦 1. Backend Setup

```bash
cd backend
npm install
```
Create `.env` file inside `/backend` with:
```
MONGO_URI=mongodb://localhost:27017/mptest
RADAR_SECRET_KEY=your_radar_server_secret_key
```

Run server:
```bash
npm run dev
```

### 💻 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 API Endpoints

| Method | Endpoint              | Description                              |
|--------|------------------------|------------------------------------------|
| GET    | `/api/busstops`        | Get all bus stops                        |
| POST   | `/api/busstops`        | Add a new bus stop                       |
| GET    | `/api/busroutes`       | Get all bus routes                       |
| POST   | `/api/busroutes`       | Add a new bus route                      |
| GET    | `/api/journey`         | Get all paths from source to destination |

---

## 📡 Distance API (Radar)

- Make sure to use your **Radar Secret Key** in `.env`
- We use `GET /v1/route/distance` to calculate real-time distance and time

📄 API Docs: [Radar Distance API](https://radar.com/documentation/api#route-distance)

📊 Sample Data Sheet: [Google Sheet - Stops & Routes](https://docs.google.com/spreadsheets/d/1ekxihrrClufF2Uf6M6nEoHCoOnipzcx5xHISgAtxogg/edit?usp=sharing)

---

## 🖼️ Assets Folder

You can place project screenshots in the following folders:
- `frontend/assets/` — Frontend screenshots
- `backend/assets/` — Backend screenshots

---

## ✅ Coming Soon

- Sort journeys by shortest distance / time
- Map preview of routes
- User login & saved journeys

---

## 👨‍💻 Author

Developed by **Aman** 🚀
