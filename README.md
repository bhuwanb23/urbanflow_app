<!-- 🔥 Stylish Banner -->
<p align="center">
  <img src="https://yourdomain.com/urbanflow-banner.gif" alt="UrbanFlow Banner" width="100%" />
</p>

<h1 align="center">🌍 UrbanFlow</h1>

<p align="center">
  <em><strong>A Multimodal Mobility Assistant for Smarter, Greener Travel</strong></em><br>
  Plan your journeys with <strong style="color:#3CB371;">eco-friendly</strong> 🌱 and <strong style="color:#4682B4;">intelligent</strong> 🧠 routes across the city.
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/yourusername/urbanflow?style=for-the-badge&color=violet">
  <img src="https://img.shields.io/github/forks/yourusername/urbanflow?style=for-the-badge&color=orange">
  <img src="https://img.shields.io/github/issues/yourusername/urbanflow?style=for-the-badge&color=blue">
  <img src="https://img.shields.io/github/license/yourusername/urbanflow?style=for-the-badge&color=green">
</p>

---

## ✨ Features at a Glance

| 🌟 Feature                          | 💬 Description                                                                 |
|------------------------------------|---------------------------------------------------------------------------------|
| 🚦 Multimodal Route Planning        | Combine 🚍 bus, 🚆 train, 🚶 walk & more into one seamless route                |
| 📍 Real-Time Location Tracking      | GPS-powered live location updates                                               |
| 🌱 Eco-Stats                        | Track your carbon footprint & green choices                                    |
| 📊 Trip History                     | Access personal travel insights & summaries                                    |
| 🧠 AI Recommendations               | Get the best route suggestions based on behavior                               |
| 🧑‍🤝‍🧑 Accessible UX                | Designed for all, with inclusive and smooth UI                                 |
| 🌐 Offline Mode                     | Works even without internet in critical features                               |

---

## 📱 Demo Preview

<p align="center">
  <img src="https://yourdomain.com/screens/urbanflow-demo.gif" width="80%" alt="App Demo" />
</p>

> 💡 *Tip: Replace this GIF with your Home, Routes, or EcoStats page demos.*

---

## 🧠 Built With Love (Tech Stack)

| 🛠 Category        | 🔧 Technologies                                                      |
|-------------------|----------------------------------------------------------------------|
| 📱 Framework       | React Native + Expo                                                  |
| 🗺 Maps & Location | Google Maps API, Geolocation SDK                                     |
| 🌐 Backend         | Firebase (Realtime DB, Auth), Node.js                                |
| 🧠 AI/ML           | TensorFlow.js (for Recommender), Heuristic Algorithms                |
| 🧪 Testing         | Jest, Detox                                                          |
| 🎨 UI/UX           | TailwindCSS (web), Styled Components (mobile)                        |

---

## 🚀 Quick Setup

### 1. Install Mobile App Dependencies
```bash
cd urbanflow_app/urbanflow_app
npm install
```

### 2. Install Server Dependencies
```bash
cd ../server
npm install
```

### 3. Start the Backend Server
```bash
# In the server directory
npm run dev
```

The server will start on `http://localhost:3000`

### 4. Start the Mobile App
```bash
# In the urbanflow_app directory
npm start
```

## 🔐 Testing the Login System

### Demo Credentials
- **Email:** `demo@urbanflow.com`
- **Password:** `password`

### Test Flow
1. Open the app - you should see the Intro screen
2. Tap "Get Started" - you'll be taken to the Login screen
3. Try the demo login or create a new account
4. After successful login, you'll be taken to the main app
5. Close and reopen the app - you should stay logged in

## 🛠️ Troubleshooting

### If the login page doesn't appear:
1. Make sure you've installed all dependencies
2. Check that the server is running on port 3000
3. Restart the Expo development server

### If login fails:
1. Check that the server is running
2. Verify the API URL in `utils/auth.js` matches your server
3. Check the console for error messages

### If you can't see the login screen:
1. Make sure you've updated App.js with the new navigation
2. Check that LoginScreen.js is in the correct path: `pages/auth/LoginScreen.js`
3. Restart the app completely

## 📱 App Flow

1. **App Start** → Checks for existing login
2. **If Logged In** → Goes directly to MainTabs
3. **If Not Logged In** → Shows Intro screen
4. **Intro Screen** → "Get Started" button → Login screen
5. **Login Screen** → Login/Register → MainTabs

## 🔧 Development Notes

- The server uses in-memory storage (data resets on restart)
- JWT tokens expire after 7 days
- Demo user is pre-created in the server
- All API endpoints are documented in `server/README.md`

---

## 🌍 Vision & Mission

> “**Empowering cities with smarter, greener, and seamless urban mobility**”

UrbanFlow is not just another navigation app — it's a **movement towards sustainable urban transit**. By combining multiple transportation modes and AI-driven intelligence, we aim to:
- 💡 Reduce congestion
- 🌱 Lower carbon emissions
- 📶 Enable access to smart mobility even offline
- 🤝 Promote inclusive, accessible transit systems

Together, let’s **reshape the future of mobility**.

---

## 🚀 Roadmap

| ✅ Feature                        | 🗓️ Status         |
|----------------------------------|-------------------|
| 🗺️ Dynamic Multimodal Routing     | ✅ Completed       |
| 🌿 Eco-Impact Dashboard          | ✅ Completed       |
| 🔔 Smart Alerts for Delays        | 🚧 In Progress     |
| 🗣 Voice-based Trip Assistant     | 🧪 Experimental    |
| 🏙 Community Transit Feedback     | 🔜 Planned         |
| 🧩 Plugin-based Integration       | 🔜 Planned         |
| 📘 In-App Transit Wiki            | 🧠 Idea Stage      |
| 🌐 Internationalization (i18n)    | 🔜 Coming Soon     |

---

## 🧩 Architecture Overview


💡 *The app uses a modular, scalable, and cloud-based architecture optimized for mobile-first deployment.*

---

## 👥 Team UrbanFlow

| Name       | Role                    | Emoji Badge         |
|------------|-------------------------|----------------------|
| Bhuwan B   | 💡 Founder & Tech Lead   | 🧠 💻 🌐              |
| Member 2   | 🧭 AI/ML Architect        | 🤖 📊                |
| Member 3   | 🎨 UI/UX Designer         | 🎨 🧑‍🎨              |
| Member 4   | 🔌 Backend Engineer       | 🔧 🔥                |
| Member 5   | 📱 Mobile App Developer   | 📱 ⚛️                |

> 💬 *Want to join us or contribute? Scroll down to the Contribution section!*

---

## 🤝 How to Contribute

We 💚 community contributions!

```bash
🧑‍💻 Step 1: Fork this repo  
📦 Step 2: Create a new branch (`git checkout -b feature/awesome-feature`)  
💡 Step 3: Commit your changes  
🚀 Step 4: Push to your branch and open a pull request  
```

---

## 🤝 Contributing

📬 **Want to make UrbanFlow even better?**  
We welcome ideas, fixes, feedback, and feature contributions!

- 🛠 Check out our [Contribution Guidelines](CONTRIBUTING.md)
- 🧾 Follow our [Code of Conduct](CODE_OF_CONDUCT.md)

---

## 📜 License

🪪 This project is licensed under the **MIT License**.  
Please refer to the [LICENSE](LICENSE) file for complete details.

---

## 📫 Get in Touch

Have ideas, feedback, or partnership proposals? Let’s connect! 🌐

- 📧 Email: [urbanflow.team@email.com](mailto:urbanflow.team@email.com)
- 🌍 Website: [urbanflow.app](https://urbanflow.app)
- 🐦 Twitter: [@UrbanFlowHQ](https://twitter.com/UrbanFlowHQ)
- 💼 LinkedIn: [UrbanFlow](https://linkedin.com/company/urbanflow)

---

## 💬 Acknowledgments

We’d like to thank the amazing communities and partners who made this possible:

- 🌍 **Open Source Contributors & Communities**
- 🏙️ **Local Transit Authorities & Public Datasets**
- 💻 **Expo & React Native Ecosystem**
- 🌿 **Champions of Sustainable Urban Living**

---

<p align="center">
  <img src="https://yourdomain.com/urbanflow-logo-footer.png" width="120" />
</p>

<p align="center">
  <i>Made with 💚 for cities, commuters, and the climate</i><br/>
  <strong>#DriveLess #FlowSmart</strong>
</p>
