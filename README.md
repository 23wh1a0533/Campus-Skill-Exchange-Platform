# SkillSwap - Peer-to-Peer Skill Exchange Platform

A full-stack web application that connects people for skill exchanges without money involved. Users can teach and learn skills through a matching algorithm, real-time chat, and structured exchange requests.

## Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Multi-step Onboarding**: Comprehensive profile setup with skills and availability
- **Smart Matching**: Algorithm-based user recommendations based on complementary skills
- **Exchange Requests**: Send, accept, reject, and complete skill exchange proposals
- **Real-time Chat**: Socket.io-powered messaging with file sharing
- **Profile Management**: Edit skills, upload avatars, update availability
- **Notifications**: In-app notifications for requests and messages
- **Search & Filters**: Advanced search by skill, level, location, and availability

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **Socket.io** for real-time communication
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Nodemailer** for email services

### Frontend
- **React** with **React Router**
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API calls
- **Socket.io-client** for real-time features
- **React Hot Toast** for notifications

## Project Structure

```
skillswap/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── ExchangeRequest.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   ├── Review.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── notifications.js
│   │   ├── requests.js
│   │   └── users.js
│   ├── socket/
│   │   └── socket.js
│   ├── utils/
│   │   ├── mailer.js
│   │   └── matchAlgorithm.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   ├── Loader.jsx
    │   │   ├── MatchCard.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── NotificationBell.jsx
    │   │   ├── PrivateRoute.jsx
    │   │   ├── RequestModal.jsx
    │   │   └── SearchFilters.jsx
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   └── SocketContext.js
    │   ├── pages/
    │   │   ├── ChatPage.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── LandingPage.jsx
    │   │   ├── Login.jsx
    │   │   ├── MyProfile.jsx
    │   │   ├── Onboarding.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── RequestsPage.jsx
    │   │   └── Signup.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.css
    │   └── index.js
    ├── .env
    ├── package.json
    └── tailwind.config.js
```

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed locally or MongoDB Atlas URI

### Backend Setup
1. Navigate to the backend folder:
```bash
cd skillswap/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create an `uploads` folder:
```bash
mkdir uploads
```

4. Update the `.env` file with your MongoDB URI and email credentials (for password reset functionality)

5. Start the backend server:
```bash
npm run dev
```

### Frontend Setup
1. Navigate to the frontend folder:
```bash
cd skillswap/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

4. Open your browser and go to `http://localhost:3000`

### Default Functionality
- **Authentication**: Sign up with email/password, JWT token stored in localStorage
- **Onboarding**: 4-step mandatory onboarding process after first login
- **Dashboard**: View all users with match percentage based on skill compatibility
- **Search & Filters**: Search by skill name, level, location, and availability mode
- **Exchange Requests**: Send, accept, reject, and complete exchanges
- **Real-time Chat**: Socket.io-powered messaging with file sharing capability
- **Profile Management**: Edit skills, upload avatar, update availability
- **Notifications**: In-app notifications for requests and messages

The application is fully functional with all core features implemented according to your specifications.