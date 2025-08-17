<!-- 🔥 Stylish Banner -->
<div align="center">
  <img src="https://img.shields.io/badge/UrbanFlow-Mobility%20Assistant-3CB371?style=for-the-badge&logo=leaf&logoColor=white" alt="UrbanFlow" />
  <br><br>
  <h1 align="center">🌍 UrbanFlow</h1>
  <h3 align="center">A Multimodal Mobility Assistant for Smarter, Greener Travel</h3>
  
  <p align="center">
    <em>Plan your journeys with <strong style="color:#3CB371;">eco-friendly</strong> 🌱 and <strong style="color:#4682B4;">intelligent</strong> 🧠 routes across the city.</em>
  </p>

  <p align="center">
    <a href="#features">✨ Features</a> •
    <a href="#demo">📱 Demo</a> •
    <a href="#tech-stack">🛠️ Tech Stack</a> •
    <a href="#quick-start">🚀 Quick Start</a> •
    <a href="#api">🔌 API</a> •
    <a href="#contributing">🤝 Contributing</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/github/stars/yourusername/urbanflow?style=for-the-badge&color=violet&logo=github" alt="Stars">
    <img src="https://img.shields.io/github/forks/yourusername/urbanflow?style=for-the-badge&color=orange&logo=github" alt="Forks">
    <img src="https://img.shields.io/github/issues/yourusername/urbanflow?style=for-the-badge&color=blue&logo=github" alt="Issues">
    <img src="https://img.shields.io/github/license/yourusername/urbanflow?style=for-the-badge&color=green&logo=github" alt="License">
    <img src="https://img.shields.io/badge/React%20Native-0.72+-blue?style=for-the-badge&logo=react" alt="React Native">
    <img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js" alt="Node.js">
  </p>
</div>

---

## ✨ Features at a Glance

<div align="center">

| 🌟 Feature | 💬 Description | 🎯 Status |
|------------|----------------|-----------|
| 🚦 **Multimodal Route Planning** | Combine 🚍 bus, 🚆 train, 🚶 walk & more into one seamless route | ✅ **Complete** |
| 📍 **Real-Time Location Tracking** | GPS-powered live location updates with offline support | ✅ **Complete** |
| 🌱 **Eco-Stats Dashboard** | Track your carbon footprint & green choices with detailed analytics | ✅ **Complete** |
| 📊 **Trip History & Analytics** | Access personal travel insights & summaries with beautiful charts | ✅ **Complete** |
| 🧠 **AI Recommendations** | Get the best route suggestions based on behavior patterns | 🚧 **In Progress** |
| 🧑‍🤝‍🧑 **Accessible UX** | Designed for all, with inclusive and smooth UI/UX | ✅ **Complete** |
| 🌐 **Offline Mode** | Works even without internet in critical features | ✅ **Complete** |
| 🔔 **Smart Notifications** | Real-time alerts for delays, traffic, and route changes | ✅ **Complete** |
| 🗺️ **Interactive Maps** | Beautiful map integration with route visualization | ✅ **Complete** |
| 🔐 **Secure Authentication** | JWT-based auth with password hashing and token management | ✅ **Complete** |

</div>

---

## 📱 Demo Preview

<div align="center">
  <img src="https://via.placeholder.com/800x400/3CB371/white?text=UrbanFlow+App+Demo" width="80%" alt="App Demo" />
  
  <p><em>💡 Replace with actual screenshots of Home, Routes, EcoStats, and Live screens</em></p>
</div>

---

## 🧠 Built With Love (Tech Stack)

<div align="center">

| 🛠 Category | 🔧 Technologies | 📦 Version |
|-------------|-----------------|------------|
| 📱 **Frontend** | React Native + Expo | 0.72+ |
| 🗺 **Maps & Location** | Google Maps API, Geolocation SDK | Latest |
| 🌐 **Backend** | Node.js + Express + SQLite | 18+ |
| 🗄️ **Database** | SQLite with Sequelize ORM | 6.35+ |
| 🔐 **Authentication** | JWT + bcrypt | Latest |
| 🧪 **Testing** | Jest, Detox | Latest |
| 🎨 **UI/UX** | React Native Paper, Styled Components | Latest |
| 📊 **Charts** | React Native Chart Kit | Latest |
| 🎭 **Animations** | Moti, React Native Reanimated | Latest |

</div>

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Git**

### 🛠️ Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/urbanflow.git
cd urbanflow
```

#### 2. Install Mobile App Dependencies
```bash
cd urbanflow_app/urbanflow_app
npm install
```

#### 3. Install Server Dependencies
```bash
cd ../../server
npm install
```

#### 4. Initialize the Server
```bash
# Create necessary directories and environment files
npm run init

# Populate database with sample data
npm run seed
```

#### 5. Start the Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Or production mode
npm start
```

The server will start on `http://localhost:3000`

#### 6. Access the Server Dashboard
Open your browser and visit: `http://localhost:3000/dashboard`

<div align="center">
  <img src="https://via.placeholder.com/600x300/4682B4/white?text=Server+Dashboard" width="60%" alt="Server Dashboard" />
</div>

The dashboard provides:
- 📊 **Real-time server statistics**
- 🔍 **API endpoint documentation**
- 🔐 **Demo credentials display**
- 📈 **Request monitoring**
- 🎨 **Beautiful, responsive interface**

#### 7. Start the Mobile App
```bash
# In the urbanflow_app directory
cd urbanflow_app/urbanflow_app
npm start
```

---

## 🔐 Testing the Application

### Demo Credentials
- **Email:** `alex@urbanflow.com`
- **Password:** `password123`

### Alternative Demo Account
- **Email:** `bhuwan.b@urbanflow.com`
- **Password:** `password123`

### Test Flow
1. **Open the app** - You should see the Intro screen
2. **Tap "Get Started"** - You'll be taken to the Login screen
3. **Try the demo login** or create a new account
4. **After successful login** - You'll be taken to the main app
5. **Close and reopen the app** - You should stay logged in

---

## 🔌 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register a new user |
| `POST` | `/api/v1/auth/login` | Login user |
| `GET` | `/api/v1/auth/verify` | Verify JWT token |
| `POST` | `/api/v1/auth/logout` | Logout user |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/user/profile` | Get user profile |
| `PUT` | `/api/v1/user/profile` | Update profile |

### Trips & Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/trips` | Get user trips |
| `POST` | `/api/v1/trips` | Create new trip |
| `GET` | `/api/v1/routes` | Get saved routes |
| `POST` | `/api/v1/routes` | Create new route |

### Analytics & Stats
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/ecostats` | Get user eco stats |
| `GET` | `/api/v1/ecostats/weekly` | Get weekly statistics |
| `GET` | `/api/v1/traffic` | Get live traffic data |
| `GET` | `/api/v1/notifications` | Get user notifications |

### Health & Status
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |
| `GET` | `/api/v1` | API information |
| `GET` | `/api/stats` | Server statistics |

---

## 🛠️ Troubleshooting

### Common Issues & Solutions

#### 🔴 Login Issues
```bash
# Problem: Login fails
# Solution: Check server status
curl http://localhost:3000/health

# Problem: API connection error
# Solution: Verify API URL in utils/auth.js
```

#### 🔴 Server Won't Start
```bash
# Problem: Port 3000 already in use
# Solution: Kill existing process
npx kill-port 3000

# Problem: Database connection error
# Solution: Reinitialize database
npm run init
npm run seed
```

#### 🔴 Mobile App Issues
```bash
# Problem: Expo server not starting
# Solution: Clear cache and restart
npx expo start --clear

# Problem: Dependencies missing
# Solution: Reinstall node_modules
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 App Architecture

<div align="center">
  <img src="https://via.placeholder.com/800x400/FF6B6B/white?text=App+Architecture+Diagram" width="80%" alt="Architecture" />
</div>

### 📁 Project Structure
```
urbanflow_app/
├── 📱 urbanflow_app/          # React Native Mobile App
│   ├── 📄 App.js             # Main app entry point
│   ├── 📁 pages/             # Screen components
│   │   ├── 🏠 home/          # Home screen & components
│   │   ├── 🗺️ live/          # Live tracking & maps
│   │   ├── 📊 ecostats/      # Eco statistics
│   │   ├── 🛣️ planner/       # Route planning
│   │   ├── 📋 trips/         # Trip history
│   │   ├── 👤 profile/       # User profile
│   │   └── 🔐 auth/          # Authentication
│   ├── 📁 utils/             # Utility functions
│   └── 📁 assets/            # Images, fonts, etc.
├── 🖥️ server/                # Node.js Backend
│   ├── 📄 server.js          # Main server file
│   ├── 📁 routes/            # API route handlers
│   ├── 📁 models/            # Database models
│   ├── 📁 config/            # Configuration files
│   └── 📁 seeders/           # Sample data
└── 📚 README.md              # This file
```

---

## 🌍 Vision & Mission

<div align="center">
  <h3>🎯 Our Mission</h3>
  <p><em>"Empowering cities with smarter, greener, and seamless urban mobility"</em></p>
</div>

UrbanFlow is not just another navigation app — it's a **movement towards sustainable urban transit**. By combining multiple transportation modes and AI-driven intelligence, we aim to:

- 💡 **Reduce congestion** through intelligent routing
- 🌱 **Lower carbon emissions** by promoting eco-friendly options
- 📶 **Enable access** to smart mobility even offline
- 🤝 **Promote inclusive** and accessible transit systems
- 🧠 **Leverage AI** for personalized recommendations

---

## 🚀 Roadmap

<div align="center">

| ✅ Feature | 🗓️ Status | 🎯 Timeline |
|------------|-----------|-------------|
| 🗺️ **Dynamic Multimodal Routing** | ✅ **Completed** | Q1 2024 |
| 🌿 **Eco-Impact Dashboard** | ✅ **Completed** | Q1 2024 |
| 🔔 **Smart Alerts for Delays** | 🚧 **In Progress** | Q2 2024 |
| 🗣 **Voice-based Trip Assistant** | 🧪 **Experimental** | Q2 2024 |
| 🏙 **Community Transit Feedback** | 🔜 **Planned** | Q3 2024 |
| 🧩 **Plugin-based Integration** | 🔜 **Planned** | Q3 2024 |
| 📘 **In-App Transit Wiki** | 🧠 **Idea Stage** | Q4 2024 |
| 🌐 **Internationalization (i18n)** | 🔜 **Coming Soon** | Q4 2024 |

</div>

---

## 👥 Team UrbanFlow

<div align="center">

| Name | Role | Emoji Badge | Focus Area |
|------|------|-------------|------------|
| **Bhuwan B** | 💡 **Founder & Tech Lead** | 🧠 💻 🌐 | Full-stack Development |
| **Member 2** | 🧭 **AI/ML Architect** | 🤖 📊 | Machine Learning |
| **Member 3** | 🎨 **UI/UX Designer** | 🎨 🧑‍🎨 | User Experience |
| **Member 4** | 🔌 **Backend Engineer** | 🔧 🔥 | API Development |
| **Member 5** | 📱 **Mobile App Developer** | 📱 ⚛️ | React Native |

</div>

> 💬 *Want to join us or contribute? Scroll down to the Contribution section!*

---

## 🤝 How to Contribute

We 💚 community contributions! Here's how you can help make UrbanFlow even better:

### 🚀 Quick Contribution Steps

```bash
# 1. Fork this repository
# 2. Clone your fork
git clone https://github.com/yourusername/urbanflow.git

# 3. Create a feature branch
git checkout -b feature/awesome-feature

# 4. Make your changes
# 5. Test thoroughly
npm test

# 6. Commit your changes
git commit -m "feat: add awesome new feature"

# 7. Push to your branch
git push origin feature/awesome-feature

# 8. Open a Pull Request
```

### 🎯 Areas for Contribution

- 🐛 **Bug Fixes** - Help us squash bugs
- ✨ **New Features** - Add exciting functionality
- 📚 **Documentation** - Improve our docs
- 🎨 **UI/UX** - Enhance the user experience
- 🧪 **Testing** - Add more test coverage
- 🌐 **Localization** - Help with translations

### 📋 Contribution Guidelines

- 📝 Follow our [Contribution Guidelines](CONTRIBUTING.md)
- 🧾 Adhere to our [Code of Conduct](CODE_OF_CONDUCT.md)
- ✅ Ensure all tests pass
- 📚 Update documentation as needed
- 🎨 Follow our coding standards

---

## 📜 License

<div align="center">
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="MIT License" />
</div>

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for complete details.

---

## 📫 Get in Touch

<div align="center">
  <p>Have ideas, feedback, or partnership proposals? Let's connect! 🌐</p>
  
  <a href="mailto:urbanflow.team@email.com">
    <img src="https://img.shields.io/badge/Email-urbanflow.team@email.com-blue?style=for-the-badge&logo=gmail" alt="Email" />
  </a>
  
  <a href="https://urbanflow.app">
    <img src="https://img.shields.io/badge/Website-urbanflow.app-green?style=for-the-badge&logo=globe" alt="Website" />
  </a>
  
  <a href="https://twitter.com/UrbanFlowHQ">
    <img src="https://img.shields.io/badge/Twitter-@UrbanFlowHQ-blue?style=for-the-badge&logo=twitter" alt="Twitter" />
  </a>
  
  <a href="https://linkedin.com/company/urbanflow">
    <img src="https://img.shields.io/badge/LinkedIn-UrbanFlow-blue?style=for-the-badge&logo=linkedin" alt="LinkedIn" />
  </a>
</div>

---

## 💬 Acknowledgments

<div align="center">
  <p>We'd like to thank the amazing communities and partners who made this possible:</p>
  
  - 🌍 **Open Source Contributors & Communities**
  - 🏙️ **Local Transit Authorities & Public Datasets**
  - 💻 **Expo & React Native Ecosystem**
  - 🌿 **Champions of Sustainable Urban Living**
  - 🎨 **UI/UX Design Community**
  - 🧪 **Testing & Quality Assurance Teams**
</div>

---

<div align="center">
  <img src="https://via.placeholder.com/120x120/3CB371/white?text=UF" width="120" alt="UrbanFlow Logo" />
  
  <p><em>Made with 💚 for cities, commuters, and the climate</em></p>
  <p><strong>#DriveLess #FlowSmart #SustainableMobility</strong></p>
  
  <br>
  
  <p>
    <a href="#top">⬆️ Back to Top</a>
  </p>
</div>
