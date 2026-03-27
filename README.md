# 🌍 Global Earthquake Research Lab

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Threejs](https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=react)

An interactive, 3D data visualization and RESTful web application that tracks and maps real-time global seismic activity. 

This project transforms raw USGS (United States Geological Survey) telemetry into an immersive 3D experience, paired with a modern, high-performance dashboard for saving and analyzing geological events.

## ✨ Key Features

- **Interactive 3D Globe:** Built with WebGL, Three.js, and React Three Fiber. Features custom shaders for day/night cycles, atmospheric glow, and interactive geographical data points.
- **Real-Time Data Consumption:** Fetches live earthquake telemetry globally via the USGS REST API.
- **Advanced Telemetry Dashboard:** Includes interactive epicenter maps (via OpenStreetMap) and dynamic visual gauges for Magnitude, Depth, and Significance.
- **Global State Caching:** Utilizes `Zustand` to aggressively cache API payloads and database records, ensuring instant, zero-loading-screen page transitions.
- **Authentication & Cloud Storage:** Secure user registration, authentication, and personal data storage powered by Supabase.

## 🏛️ RESTful Architecture

This application was engineered to strictly follow **RESTful architectural constraints**:

1. **Client-Server Separation:** A fully decoupled React SPA (Single Page Application) acting as the client, interacting with remote backend services.
2. **Stateless Operations:** User sessions and database mutations are handled statelessly using JWTs (JSON Web Tokens) passed in standard HTTP `Authorization` headers.
3. **Uniform Interface (CRUD):** The application relies entirely on standard HTTP verbs interacting with JSON payloads:
   - `GET`: Fetching live data from USGS, querying the NewsAPI, and reading saved records from the database.
   - `POST`: Writing new earthquake records to the Supabase database.
   - `PATCH`: Updating user profiles and privacy settings.
   - `DELETE`: Removing specific earthquake records from a user's cloud storage or deleting accounts.
4. **PostgREST Backend:** The database layer uses Supabase, which utilizes PostgREST to automatically expose a fully compliant REST API directly from the PostgreSQL schema.

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **3D Engine:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Styling:** Tailwind CSS v4, Lucide React (Icons)
- **State Management:** Zustand, React Router DOM
- **Backend/BaaS:** Supabase (PostgreSQL, GoTrue Auth, PostgREST)
- **External APIs:** USGS Earthquake Hazards API, NewsAPI, OpenStreetMap

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- A [Supabase](https://supabase.com/) account and project
- A[NewsAPI](https://newsapi.org/) key (free)

### Installation
## Installation

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/collab.git
   cd collab
```

2. **Install dependencies**
```bash
   npm install
```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_NEWS_API_KEY=your_newsapi_key
```

4. **Start the development server**
```bash
   npm run dev
```

   The application will be available at `http://localhost:5173`.

---

## Project Structure
```
src/
├── components/       # Reusable UI & 3D Canvas components (Globe, Earth, Markers)
├── constants/        # Global constants, asset URLs, and API route definitions
├── contexts/         # React Context providers (AuthContext)
├── hooks/            # Custom React hooks & Three.js utilities
├── pages/            # Top-level route components (Dashboard, Settings, Auth)
├── services/         # REST API wrapper functions (Supabase, USGS)
├── shaders/          # Custom GLSL shaders for WebGL rendering
├── store/            # Zustand global state management
├── styles/           # Global CSS and Tailwind configurations
├── types/            # TypeScript interfaces and definitions
└── utils/            # Helper functions (color scaling, raycasting, math)
```

---

## Acknowledgments

- [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/) — real-time earthquake REST API
- [NewsAPI](https://newsapi.org/) — live science and geological news aggregation
- [OpenStreetMap](https://www.openstreetmap.org/) — open-source mapping
