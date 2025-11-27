'use client';

import { useState, useEffect } from 'react';
import songsData from '../data/songs.json';
import { searchTrack, createPlaylist, addTracksToPlaylist, getUserProfile } from './utils/spotify';

export default function Home() {
    const [birthYear, setBirthYear] = useState('');
    const [eighthGradeYear, setEighthGradeYear] = useState(null);
    const [songs, setSongs] = useState([]);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [playlistUrl, setPlaylistUrl] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check for access token in cookies
        const match = document.cookie.match(new RegExp('(^| )spotify_access_token=([^;]+)'));
        if (match) {
            setAccessToken(match[2]);

            // Restore state if we just came back from login
            const savedYear = localStorage.getItem('birthYear');
            if (savedYear) {
                setBirthYear(savedYear);
                calculateYear(null, savedYear); // Trigger calculation
                localStorage.removeItem('birthYear'); // Clear it
            }
        }
    }, []);

    const calculateYear = (e, yearOverride = null) => {
        if (e) e.preventDefault();
        const yearInput = yearOverride || birthYear;

        if (!yearInput || yearInput < 1950 || yearInput > 2015) {
            if (!yearOverride) alert('Please enter a valid birth year between 1950 and 2015.');
            return;
        }

        // 8th grade is typically around age 13-14.
        // If born in 1990, 13 in 2003, 14 in 2004.
        // Let's approximate to Birth Year + 14.
        const year = parseInt(yearInput) + 14;
        setEighthGradeYear(year);

        // Fetch songs for that year
        // Since our data is sparse, we'll try to find the closest year or just show empty if not found
        // For the demo, we have 1970, 1980, 1990, 2000.
        // We'll implement a fallback to the nearest decade for now if exact year missing, 
        // or just show what we have.
        // ideally we'd have all years.

        // For this MVP, let's just check if we have the exact year, else show nearest decade?
        // Or just show a message.

        // Let's try to find the exact year first.
        let yearSongs = songsData[year.toString()];

        if (!yearSongs) {
            // Fallback logic for demo purposes: round to nearest decade
            const decade = Math.floor(year / 10) * 10;
            yearSongs = songsData[decade.toString()];
            if (yearSongs) {
                setError(`Data for ${year} not found. Showing top songs from ${decade}s instead.`);
            } else {
                setError(`Sorry, we don't have song data for ${year} yet.`);
                setSongs([]);
                return;
            }
        } else {
            setError(null);
        }

        setSongs(yearSongs || []);
        setPlaylistUrl(null);
    };

    const handleLogin = () => {
        if (birthYear) {
            localStorage.setItem('birthYear', birthYear);
        }
        window.location.href = '/api/login';
    };

    const handleCreatePlaylist = async () => {
        if (!accessToken) return;
        setLoading(true);
        try {
            const userProfile = await getUserProfile(accessToken);
            if (!userProfile) throw new Error('Could not fetch user profile');

            const playlistId = await createPlaylist(
                userProfile.id,
                `8th Grade Jams (${eighthGradeYear})`,
                accessToken
            );

            if (!playlistId) throw new Error('Failed to create playlist');

            const trackUris = [];
            for (const song of songs) {
                const uri = await searchTrack(`${song.title} ${song.artist}`, accessToken);
                if (uri) trackUris.push(uri);
            }

            if (trackUris.length > 0) {
                console.log('Track URIs found:', trackUris);
                await addTracksToPlaylist(playlistId, trackUris, accessToken);
                setPlaylistUrl(`https://open.spotify.com/playlist/${playlistId}`);
            } else {
                console.warn('No track URIs found.');
                setError('Could not find any of these songs on Spotify.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to create playlist. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 relative">
            <div className="container fade-in">
                <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                    8th Grade DJ
                </h1>

                <div className="card max-w-md mx-auto">
                    {!accessToken ? (
                        <div className="text-center">
                            <p className="mb-6 text-gray-400">
                                Connect your Spotify account to get started.
                            </p>
                            <button onClick={handleLogin} className="btn btn-primary w-full">
                                Connect Spotify
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="mb-4 text-gray-400 text-center">
                                Enter your birth year to relive your 8th grade jams.
                            </p>
                            <form onSubmit={calculateYear} className="flex flex-col gap-4">
                                <input
                                    type="number"
                                    placeholder="YYYY"
                                    value={birthYear}
                                    onChange={(e) => setBirthYear(e.target.value)}
                                    className="input text-center"
                                    min="1950"
                                    max="2015"
                                />
                                <button type="submit" className="btn btn-primary w-full">
                                    Calculate
                                </button>
                            </form>
                        </>
                    )}
                </div>

                {eighthGradeYear && accessToken && (
                    <div className="mt-12 fade-in">
                        <h2 className="text-2xl font-bold mb-6 text-center">
                            Class of {eighthGradeYear} (approx.)
                        </h2>

                        {error && (
                            <div className="bg-yellow-900/50 text-yellow-200 p-4 rounded-lg mb-6 text-center border border-yellow-700">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                            {songs.map((song, index) => (
                                <div key={index} className="bg-white/5 p-4 rounded-lg flex items-center gap-4 hover:bg-white/10 transition-colors">
                                    <div className="text-2xl font-bold text-gray-500 w-8 text-center">
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{song.title}</div>
                                        <div className="text-gray-400">{song.artist}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <div className="flex flex-col items-center gap-4">
                                {!playlistUrl ? (
                                    <button
                                        onClick={handleCreatePlaylist}
                                        disabled={loading}
                                        className={`btn btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? 'Creating Playlist...' : 'Create Spotify Playlist'}
                                    </button>
                                ) : (
                                    <a
                                        href={playlistUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary bg-black text-white border border-green-500 hover:bg-green-900"
                                    >
                                        Open Playlist in Spotify
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
