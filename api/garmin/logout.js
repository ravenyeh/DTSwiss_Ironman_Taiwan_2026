const { sessions } = require('./login');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Session-Id');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const sessionId = req.headers['x-session-id'];

        if (sessionId && sessions.has(sessionId)) {
            sessions.delete(sessionId);
        }

        return res.status(200).json({
            success: true,
            message: '已登出 Garmin Connect'
        });

    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            error: '登出失敗'
        });
    }
};
