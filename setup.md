# UrbanFlow Setup Guide

## 🚀 Quick Setup Instructions

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