# 🚖 CabNest - Your Ultimate Cab Booking Solution

Welcome to **CabNest**, a full-stack cab booking application designed to provide seamless ride booking experiences for riders and efficient management tools for drivers and admins. 🚗✨

---

## 🌟 Features
- **User Roles**: Rider, Driver, and Admin with role-based access.
- **Ride Management**: Book rides, track status, and manage payments.
- **Driver Dashboard**: View earnings, ratings, and ride statistics.
- **Admin Panel**: Manage users, drivers, and system analytics.
- **Real-Time Updates**: Powered by WebSockets for live ride updates.
- **Secure Payments**: Integrated with Razorpay for hassle-free transactions.

---

## 🛠️ Tech Stack
### Frontend:
- ⚛️ **React** with Vite for blazing-fast development.
- 🎨 **Tailwind CSS** for modern and responsive UI.

### Backend:
- 🟢 **Node.js** with Express for RESTful APIs.
- 🗄️ **MongoDB** for database management.
- 🔒 **JWT** for secure authentication.
- 📡 **Socket.IO** for real-time communication.

---

## 📂 Folder Structure
### Backend:
```plaintext
backend/
├── models/         # Mongoose schemas (Driver, Rider, User, Ride)
├── routes/         # API routes (user, driver, rider, admin, ride, notifications)
├── controllers/    # Business logic for routes
├── database/       # MongoDB connection setup
├── .env.sample     # Environment variable configuration
└── index.js        # Entry point for the backend server
```
### Frontend:
```plaintext
frontend/
├── src/
│   ├── context/    # React Context for state management (User, DriverDashboard)
│   ├── pages/      # Application pages (Login, Register, Dashboard, etc.)
│   ├── App.jsx     # Main application component
│   └── main.jsx   # Entry point for the React app
├── tailwind.config.js  # Tailwind CSS configuration
└── [vite.config.js](http://_vscodecontentref_/1)      # Vite configuration
```
---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)  
- MongoDB (local or cloud instance)  

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/CabNest.git
    cd CabNest
    ```
2. Install dependencies for both backend and frontend:
    ```bash
    # Install backend dependencies
    cd backend
    npm install
    # Install frontend dependencies
    cd ../frontend
    npm install
    ```
3. Configure environment variables:
    ```bash
    cd ../backend
    cp .env.sample .env
    # Then update the .env file with your values
    ```

---

### 🏃‍♂️ Running the Application

#### Backend:
```bash
cd backend
npm run dev
```
The backend will run on http://localhost:<PORT>.

#### Frontend:
```bash
cd frontend
npm run dev
```
The frontend will run on http://localhost:5173.

---

## 🔑 Environment Variables  
Here are the required environment variables for the backend:

```plaintext
PORT=5000
conn=<Your MongoDB Connection String>
Activation_Secret=<Your Activation Secret>
Gmail=<Your Gmail Address>
Password=<Your Gmail Password>
Jwt_Secret=<Your JWT Secret>
KEY_ID=<Your Razorpay Key ID>
KEY_SECRET=<Your Razorpay Key Secret>  
```
---

## 📡 API Routes

### User Routes:  
- **POST /api/user/register** - Register a new user.  
- **POST /api/user/login** - Login a user.  
- **GET  /api/user/me** - Get the logged-in user's profile.  

### Driver Routes:  
- **GET    /api/driver/available**    - Get all available drivers.  
- **POST   /api/driver**              - Create a new driver profile.  
- **PUT    /api/driver/:id**          - Update driver details.  

### Rider Routes:  
- **POST   /api/rider**               - Create a new rider profile.  
- **GET    /api/rider/:id**           - Get rider details.  

### Ride Routes:  
- **POST   /api/ride/request**        - Create a new ride request.  
- **GET    /api/ride/:rideId**        - Get ride status.  
- **PUT    /api/ride/:rideId/status** - Update ride status.
  
---
## ✨ Frontend Highlights  

### Context API:  
- **UserContext**: Manages user authentication and role-based navigation.  
- **DriverDashboardContext**: Manages driver-specific data like earnings, rides, and availability.  
- **Tailwind CSS**: Provides a modern and responsive design.  
- **Vite**: Ensures fast builds and hot module replacement.  

### 🛡️ Security  
- **JWT Authentication**: Secure user sessions.  
- **Environment Variables**: Sensitive data is stored securely in `.env`.  

### 📈 Future Enhancements  
- Add support for ride-sharing.  
- Implement advanced analytics for admins.  
- Enhance real-time tracking with maps integration.  
---

## 🤝 Contributing  

Contributions are welcome! Please follow these steps:

1. Fork the repository.  
2. Create a new branch:
    ```bash
    git checkout -b feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m "Add feature-name"
    ```
4. Push to the branch:
    ```bash
    git push origin feature-name
    ```
5. Submit a pull request.  
---

## 📄 License  
This project is licensed under the MIT License.  

---

## 💬 Contact  
For any inquiries or feedback, feel free to reach out:

- **Email**: sahil16december@gmail.com  
- **GitHub**: sahil16-12  
---
Made with ❤️ by CabNest Team 🚖✨

