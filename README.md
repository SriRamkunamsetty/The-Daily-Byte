# 🗞️ The Daily Byte

### Immersive News Aggregation with a Multisensory Physics Engine

The Daily Byte is a production-grade, full-stack news platform that transforms the standard news-reading experience into an interactive physical playground. Built with a focus on high-fidelity animations, autonomous data pipelines, and multisensory feedback, it represents the intersection of creative technology and modern web engineering.

## 🚀 Key Features

### 1. Multisensory Physics Engine (v2.0)
A custom-built interaction layer that treats news cards as physical objects.
- **Momentum Tossing**: Leverages `dragTransition` for natural gliding and friction-based stops.
- **Dynamic Spring Dynamics**: Calibrated with `stiffness: 100` and `damping: 10` for an "enterprise" tactile feel.
- **Spatial Audio**: Integrated Web Audio API providing pitch-shifted "thuds" on impact and atmospheric "whooshes" on gravity activation.
- **Haptic Feedback**: Native `navigator.vibrate` synchronization for grab and impact events.
- **Shake-to-Trigger**: Accelerometer-based toggle with full iOS 13+ motion permission support.

### 2. Autonomous News Bridge
A hardened backend pipeline that keeps the platform updated without manual intervention.
- **Automated Sync**: GitHub Actions cron job triggering a Node.js sync engine every 4 hours.
- **Data Integrity**: Implements base64-encoded title IDs to ensure a zero-duplicate Firestore environment.
- **Efficiency**: Utilizes `db.batch()` to process up to 500 articles in a single atomic operation.
- **Smart Cleaning**: Image fallback logic and 48-hour date filtering for guaranteed content freshness.

## 🛠️ Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS |
| **Animation** | Framer Motion (Physics Engine) |
| **Backend** | Node.js, Firebase Admin SDK |
| **Database** | Firebase Firestore (NoSQL) |
| **Automation** | GitHub Actions (CI/CD) |
| **Hosting** | Firebase Hosting |

## 🏗️ System Architecture

1.  **Ingestion**: GitHub Actions wakes up every 4 hours and executes the `syncNews` script.
2.  **Processing**: The script fetches headlines from NewsAPI, applies base64-encoding for unique IDs, and batches the writes.
3.  **Storage**: Firestore receives the atomic batch update.
4.  **Delivery**: The React frontend uses real-time listeners to render new cards instantly with GPU-accelerated animations (`will-change: transform`).

## 💻 Getting Started

### Prerequisites
- Node.js (v18+)
- Firebase CLI
- NewsAPI Key

### Installation

1.  **Clone and Install**:
    ```bash
    git clone https://github.com/your-username/the-daily-byte.git
    cd the-daily-byte
    npm install
    ```

2.  **Environment Setup**:
    Create a `.env` in the root and `backend/` directories.
    ```env
    VITE_FIREBASE_API_KEY=your_key
    NEWS_API_KEY=your_news_key
    ```

3.  **Local Development**:
    ```bash
    # Run the frontend
    npm run dev

    # Test the news sync
    cd backend && node index.js
    ```

## 🔒 Security & Performance
- **Credential Masking**: All sensitive JSON service accounts are injected via GitHub Secrets and parsed at runtime.
- **GPU Acceleration**: Forced hardware acceleration for physics calculations to maintain a consistent 60FPS on mobile devices.
- **API Optimization**: Strategic caching and batching to stay within the free-tier limits of NewsAPI and Firebase.

## 🏆 Engineering Achievements
- Successfully implemented iOS-specific permission gating for hardware sensors.
- Engineered a bounce-aware audio system that triggers spatial sounds based on animation rebound events.
- Built a type-safe architecture ensuring 0 runtime errors during high-intensity physics interactions.
