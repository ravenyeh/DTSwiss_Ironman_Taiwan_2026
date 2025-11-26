const { GarminConnect } = require('@flow-js/garmin-connect');

// Store sessions in memory (for demo - in production use Redis/DB)
const sessions = new Map();

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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: '請提供 Email 和密碼' });
        }

        const GC = new GarminConnect();

        // Login to Garmin Connect
        await GC.login(email, password);

        // Generate session ID
        const sessionId = `gc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Store the GarminConnect instance
        sessions.set(sessionId, {
            gc: GC,
            email: email,
            createdAt: Date.now()
        });

        // Clean up old sessions (older than 30 minutes)
        const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
        for (const [key, value] of sessions) {
            if (value.createdAt < thirtyMinutesAgo) {
                sessions.delete(key);
            }
        }

        // Get user profile for confirmation
        const userProfile = await GC.getUserProfile();

        return res.status(200).json({
            success: true,
            sessionId: sessionId,
            user: {
                displayName: userProfile.displayName || email.split('@')[0],
                profileImageUrl: userProfile.profileImageUrlSmall || null
            }
        });

    } catch (error) {
        console.error('Garmin login error:', error);

        let errorMessage = '登入失敗';
        if (error.message.includes('credentials')) {
            errorMessage = 'Email 或密碼錯誤';
        } else if (error.message.includes('network')) {
            errorMessage = '網路連線錯誤，請稍後再試';
        }

        return res.status(401).json({
            success: false,
            error: errorMessage
        });
    }
};

// Export sessions for use by other modules
module.exports.sessions = sessions;
