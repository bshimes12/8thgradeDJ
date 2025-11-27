const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

/**
 * Search for a track on Spotify.
 * @param {string} query - The search query (e.g., "Song Title Artist").
 * @param {string} accessToken - The user's access token.
 * @returns {Promise<string|null>} - The Spotify URI of the track or null if not found.
 */
export async function searchTrack(query, accessToken) {
  try {
    const response = await fetch(`${SPOTIFY_API_BASE}/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error('Spotify Search Error:', await response.text());
      return null;
    }

    const data = await response.json();
    if (data.tracks.items.length > 0) {
      return data.tracks.items[0].uri;
    }
    return null;
  } catch (error) {
    console.error('Error searching track:', error);
    return null;
  }
}

/**
 * Create a new playlist for the user.
 * @param {string} userId - The Spotify User ID.
 * @param {string} name - The name of the playlist.
 * @param {string} accessToken - The user's access token.
 * @returns {Promise<string|null>} - The ID of the created playlist.
 */
export async function createPlaylist(userId, name, accessToken) {
  try {
    const response = await fetch(`${SPOTIFY_API_BASE}/users/${userId}/playlists`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        description: 'Created by 8th Grade DJ App',
        public: false,
      }),
    });

    if (!response.ok) {
      console.error('Spotify Create Playlist Error:', await response.text());
      return null;
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error creating playlist:', error);
    return null;
  }
}

/**
 * Add tracks to a playlist.
 * @param {string} playlistId - The Spotify Playlist ID.
 * @param {string[]} uris - Array of Spotify Track URIs.
 * @param {string} accessToken - The user's access token.
 */
export async function addTracksToPlaylist(playlistId, uris, accessToken) {
  try {
    console.log(`Adding tracks to playlist: ${playlistId}`);
    console.log(`URIs:`, uris);

    const url = `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`;
    const body = JSON.stringify({ uris: uris });

    console.log(`Request URL: ${url}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (!response.ok) {
      console.error('Spotify Add Tracks Error Status:', response.status);
      console.error('Spotify Add Tracks Error Text:', await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error adding tracks:', error);
    return false;
  }
}

/**
 * Get the current user's profile.
 * @param {string} accessToken 
 * @returns {Promise<Object|null>}
 */
export async function getUserProfile(accessToken) {
  try {
    const response = await fetch(`${SPOTIFY_API_BASE}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
