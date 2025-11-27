import { NextResponse } from 'next/server';
import querystring from 'querystring';

export async function GET() {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000';
    const redirect_uri = `${baseUrl}/api/callback`;
    const state = generateRandomString(16);
    const scope = 'user-read-private playlist-modify-public playlist-modify-private';

    const queryParams = querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
    });

    return NextResponse.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
}

function generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
