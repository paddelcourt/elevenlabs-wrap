# 🎵 ElevenLabs Wrapped

AI-powered music personality analyzer with custom track generation. Like Spotify Wrapped meets AI music generation!

## ✨ Features

- 🎵 Analyze your Spotify listening history with AI
- 🤖 Get personalized insights about your music taste
- 🎼 Generate 8 custom AI tracks based on your preferences
- 🎨 Beautiful animated presentation with slides
- 🔐 Secure Spotify OAuth integration
- 💾 Session persistence across page refreshes

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Spotify Developer Account
- Anthropic API Key (Claude)
- ElevenLabs API Key

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/elevenlabs-wrap.git
   cd elevenlabs-wrap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create `apps/api/.env`:
   ```env
   # Spotify OAuth (get from https://developer.spotify.com/dashboard)
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   REDIRECT_URI=http://127.0.0.1:3001/auth/callback

   # Frontend URL
   FRONTEND_URL=http://127.0.0.1:3000

   # AI API Keys
   ANTHROPIC_API_KEY=your_anthropic_key
   ELEVENLABS_API_KEY=your_elevenlabs_key

   # App Config
   SESSION_SECRET=your_random_secret_here
   NODE_ENV=development
   PORT=3001
   ```

   Create `apps/web/.env`:
   ```env
   VITE_API_URL=http://127.0.0.1:3001
   ```

4. **Set up Spotify App**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Add redirect URI: `http://127.0.0.1:3001/auth/callback`
   - Copy Client ID and Client Secret to your `.env` file

5. **Run the app**
   ```bash
   npm run dev
   ```

   That's it! Both backend and frontend will start:
   - 🎨 Frontend: http://127.0.0.1:3000
   - 🔧 API: http://127.0.0.1:3001

## 📁 Project Structure

```
elevenlabs-wrap/
├── apps/
│   ├── api/                 # Express.js backend
│   │   ├── src/
│   │   │   ├── modules/     # Feature modules
│   │   │   │   ├── auth/           # Spotify OAuth
│   │   │   │   ├── ai-analysis/    # Claude AI analysis
│   │   │   │   ├── music-generation/ # ElevenLabs API
│   │   │   │   └── wrap-stats/     # Spotify stats
│   │   │   └── routes/      # API routes
│   │   └── server.js        # Entry point
│   │
│   └── web/                 # React + Vite frontend
│       └── src/
│           ├── components/  # React components
│           └── App.tsx      # Main app
│
├── docs/                    # Documentation
├── scripts/                 # Dev utilities
└── package.json            # Root workspace config
```

## 🎯 Available Commands

**Development:**
- `npm run dev` - Start both API and web (recommended)
- `npm run dev:api` - Start API only
- `npm run dev:web` - Start web only

**Production:**
- `npm run start:api` - Start API in production mode
- `npm run start:web` - Start web in production mode

## 🚢 Deployment

See [RAILWAY-DEPLOYMENT.md](./RAILWAY-DEPLOYMENT.md) for deploying to Railway.

Quick deploy checklist:
1. Push code to GitHub
2. Create Railway project from GitHub
3. Deploy backend service with environment variables
4. Deploy frontend service with API URL
5. Update Spotify redirect URIs
6. Test the deployment

## 🔑 Getting API Keys

### Spotify
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create an app
3. Get Client ID and Client Secret

### Anthropic (Claude)
1. Sign up at [Anthropic Console](https://console.anthropic.com/)
2. Generate an API key

### ElevenLabs
1. Sign up at [ElevenLabs](https://elevenlabs.io/)
2. Get your API key from Profile → API Keys

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- TailwindCSS
- Framer Motion
- Radix UI

**Backend:**
- Node.js
- Express.js
- Spotify Web API
- Anthropic Claude API
- ElevenLabs API

## 📝 How It Works

1. **User logs in** with Spotify OAuth
2. **Backend fetches** top artists, tracks, and recently played songs
3. **Claude AI analyzes** music taste and estimates "music age"
4. **ElevenLabs generates** 8 custom tracks based on analysis
5. **Frontend displays** animated slides with insights
6. **Music plays** as user navigates through their wrapped

## 🐛 Troubleshooting

**"Redirect URI mismatch"**
- Ensure Spotify redirect URI exactly matches: `http://127.0.0.1:3001/auth/callback`

**CORS errors**
- Check `FRONTEND_URL` in backend `.env` matches your frontend URL

**API calls failing**
- Verify `VITE_API_URL` in frontend `.env` points to backend

**Session not persisting**
- Check browser localStorage for `elevenlabs_analysis` and `elevenlabs_tracks`
- Verify cookies are enabled

## 📄 License

ISC

## 👥 Contributors

Built during the ElevenLabs Hackathon by padel enthusiasts 🎾

## 🔗 Links

- [Spotify Web API Docs](https://developer.spotify.com/documentation/web-api)
- [Anthropic Claude Docs](https://docs.anthropic.com/)
- [ElevenLabs API Docs](https://elevenlabs.io/docs)
- [Railway Deployment Guide](./RAILWAY-DEPLOYMENT.md)
