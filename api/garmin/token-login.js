const { GarminConnect } = require('@gooin/garmin-connect');
const { sessions } = require('./login');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { oauth2Token } = req.body;

        if (!oauth2Token || !oauth2Token.access_token) {
            return res.status(400).json({
                success: false,
                error: '請提供有效的 Token'
            });
        }

        // Check if token is expired
        const now = Date.now();
        if (oauth2Token.expires && oauth2Token.expires < now) {
            return res.status(401).json({
                success: false,
                error: 'Token 已過期，請重新登入',
                expired: true
            });
        }

        // Create GarminConnect instance and restore with token
        const GC = new GarminConnect();

        // Set the OAuth2 token directly
        if (GC.client) {
            GC.client.oauth2Token = oauth2Token;
        }

        // Verify the token works by getting user profile
        const userProfile = await GC.getUserProfile();
        console.log('User profile:', JSON.stringify(userProfile, null, 2));

        // Try to fetch social profile using displayName
        let socialProfile = null;
        if (userProfile.displayName) {
            try {
                const socialUrl = `https://connect.garmin.com/modern/proxy/userprofile-service/socialProfile/${userProfile.displayName}`;
                console.log('Fetching social profile from:', socialUrl);
                socialProfile = await GC.get(socialUrl);
                console.log('Social profile:', JSON.stringify(socialProfile, null, 2));
            } catch (e) {
                console.log('Social profile fetch error:', e.message);
            }
        }

        // Generate session ID
        const sessionId = `gc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Store the GarminConnect instance
        sessions.set(sessionId, {
            gc: GC,
            email: 'token-login',
            createdAt: Date.now()
        });

        // Clean up old sessions (older than 30 minutes)
        const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
        for (const [key, value] of sessions) {
            if (value.createdAt < thirtyMinutesAgo) {
                sessions.delete(key);
            }
        }

        // Get refreshed token if available
        const refreshedToken = GC.client?.oauth2Token || oauth2Token;

        // Build user object - prefer social profile data if available
        const user = {
            displayName: userProfile.displayName || 'Garmin User',
            fullName: socialProfile?.fullName || socialProfile?.userProfileFullName || userProfile.fullName || null,
            profileImageUrl: socialProfile?.profileImageUrlSmall || userProfile.profileImageUrlSmall || null
        };
        console.log('Returning user:', JSON.stringify(user, null, 2));

        return res.status(200).json({
            success: true,
            sessionId: sessionId,
            user: user,
            oauth2Token: refreshedToken
        });

    } catch (error) {
        console.error('Token login error:', error.message);

        return res.status(401).json({
            success: false,
            error: 'Token 無效或已過期，請重新登入',
            expired: true
        });
    }
};
