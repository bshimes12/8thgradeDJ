# 8th Grade DJ 🎧

Because who *wouldn't* want to relive that amazing time in life?

You remember it, don't you? The braces. The awkward growth spurts. The desperate hope that your crush would ask you to dance to "I Don't Want to Miss a Thing" at the Spring Fling. **8th Grade DJ** is here to drag you back to that glorious, cringe-filled era by generating a Spotify playlist of the top hits from May of your 8th-grade year.

Prepare to feel things. Mostly embarrassment.

## Prerequisites

*   A Spotify Premium account (probably).
*   A high tolerance for early 2000s pop (or whenever you were 13).
*   Node.js installed.

## Setup Guide

### 1. Spotify Configuration (The Annoying Part)

To make this magic happen, you need to tell Spotify you're cool.

1.  Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2.  Log in and click **"Create App"**.
3.  Give it a name (e.g., "My Cringe Playlist Generator") and description.
4.  **IMPORTANT:** You need to set the **Redirect URIs**.
    *   Click on your new app -> **Settings**.
    *   Find "Redirect URIs" and add these EXACTLY:
        *   `http://127.0.0.1:3000/api/callback` (For local testing)
        *   `https://your-vercel-project-name.vercel.app/api/callback` (For when you deploy it)
    *   Click **Save**.

### 2. Environment Variables

Create a file named `.env.local` in the root directory. Do not commit this file, or the internet will steal your credentials and ruin your playlists.

Add the following:

```bash
SPOTIFY_CLIENT_ID=your_client_id_from_dashboard
SPOTIFY_CLIENT_SECRET=your_client_secret_from_dashboard
BASE_URL=http://127.0.0.1:3000
```

*   Replace `your_client_id...` and `your_client_secret...` with the values from your Spotify Dashboard settings.
*   `BASE_URL` should be `http://127.0.0.1:3000` for local dev. When you deploy to Vercel, you'll set this to your actual domain (e.g., `https://8thgrade-dj.vercel.app`).

### 3. Run It

Install the dependencies (because there are always dependencies):

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `http://127.0.0.1:3000` if you want to be pedantic and match your redirect URI).

## Deployment (Vercel)

1.  Push this code to GitHub.
2.  Import the project into [Vercel](https://vercel.com).
3.  **Crucial Step:** In the Vercel Project Settings -> **Environment Variables**, add:
    *   `SPOTIFY_CLIENT_ID`
    *   `SPOTIFY_CLIENT_SECRET`
    *   `BASE_URL` (Set this to your Vercel domain, e.g., `https://8thgrade-dj.vercel.app` - **NO trailing slash**)
4.  Deploy.
5.  Cry as "The Reason" by Hoobastank plays softly in the distance.
