import { NextResponse } from 'next/server';
import querystring from 'querystring';
import { serialize } from 'cookie';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (state === null) {
        return NextResponse.redirect('/?error=state_mismatch');
    }

    const authOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization:
                'Basic ' +
                Buffer.from(
                    process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
                ).toString('base64'),
        },
        body: querystring.stringify({
            code: code,
            redirect_uri: `${process.env.BASE_URL || 'http://127.0.0.1:3000'}/api/callback`,
            grant_type: 'authorization_code',
        }),
    };

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
        const data = await response.json();

        if (response.ok) {
            const { access_token, refresh_token, expires_in } = data;

            const redirectResponse = NextResponse.redirect(process.env.BASE_URL || 'http://127.0.0.1:3000');

            redirectResponse.cookies.set('spotify_access_token', access_token, {
                httpOnly: false, // Allow client to read it for now to simplify client-side calls
                secure: process.env.NODE_ENV === 'production',
                maxAge: expires_in,
                path: '/',
            });

            return redirectResponse;
        } else {
            return NextResponse.redirect(`/?error=invalid_token&details=${data.error}`);
        }
    } catch (error) {
        return NextResponse.redirect('/?error=server_error');
    }
}
