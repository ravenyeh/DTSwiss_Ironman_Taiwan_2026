const { GarminConnect } = require('garmin-connect');

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
        const { email, password, mfaSession, mfaCode } = req.body;

        // Step 2: MFA verification
        if (mfaSession && mfaCode) {
            const GC = new GarminConnect({ username: '', password: '' });

            try {
                await GC.verifyMFA(mfaSession, mfaCode);
            } catch (e) {
                const msg = e.message.toLowerCase();
                let errorMessage = 'MFA 驗證失敗';
                let sessionExpired = false;

                if (msg.includes('expired')) {
                    errorMessage = '驗證碼已過期（5 分鐘），請重新登入';
                    sessionExpired = true;
                } else if (msg.includes('invalid') && msg.includes('session')) {
                    errorMessage = 'Session 無效，請重新登入';
                    sessionExpired = true;
                } else if (msg.includes('mfa_secret_key')) {
                    errorMessage = '伺服器 MFA 設定錯誤';
                    sessionExpired = true;
                } else if (msg.includes('code') || msg.includes('invalid')) {
                    errorMessage = '驗證碼錯誤，請重新輸入';
                }

                return res.status(401).json({
                    success: false,
                    error: errorMessage,
                    sessionExpired: sessionExpired
                });
            }

            // MFA verified, create session
            const sessionId = `gc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            sessions.set(sessionId, { gc: GC, createdAt: Date.now() });

            // Get user profile
            let user = null;
            let oauth2Token = GC.client?.oauth2Token || null;
            try {
                const userProfile = await GC.getUserProfile();
                let socialProfile = null;
                if (userProfile.displayName) {
                    try {
                        const socialUrl = `https://connect.garmin.com/modern/proxy/userprofile-service/socialProfile/${userProfile.displayName}`;
                        socialProfile = await GC.get(socialUrl);
                    } catch (e) {}
                }
                user = {
                    displayName: userProfile.displayName || 'User',
                    fullName: socialProfile?.fullName || socialProfile?.userProfileFullName || userProfile.fullName || null,
                    profileImageUrl: socialProfile?.profileImageUrlSmall || userProfile.profileImageUrlSmall || null
                };
            } catch (e) {}

            return res.status(200).json({
                success: true,
                sessionId: sessionId,
                user: user,
                oauth2Token: oauth2Token
            });
        }

        // Step 1: Login with credentials
        if (!email || !password) {
            return res.status(400).json({ error: '請提供 Email 和密碼' });
        }

        const GC = new GarminConnect({
            username: email,
            password: password
        });

        const loginResult = await GC.login();

        // Check if MFA is required
        if (loginResult && loginResult.needsMFA) {
            return res.status(200).json({
                success: false,
                needsMfa: true,
                mfaSession: loginResult.mfaSession,
                message: '請輸入 Garmin 傳送的驗證碼'
            });
        }

        // No MFA needed
        const sessionId = `gc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

        // Get user profile
        const userProfile = await GC.getUserProfile();

        let socialProfile = null;
        if (userProfile.displayName) {
            try {
                const socialUrl = `https://connect.garmin.com/modern/proxy/userprofile-service/socialProfile/${userProfile.displayName}`;
                socialProfile = await GC.get(socialUrl);
            } catch (e) {}
        }

        const oauth2Token = GC.client?.oauth2Token || null;

        const user = {
            displayName: userProfile.displayName || email.split('@')[0],
            fullName: socialProfile?.fullName || socialProfile?.userProfileFullName || userProfile.fullName || null,
            profileImageUrl: socialProfile?.profileImageUrlSmall || userProfile.profileImageUrlSmall || null
        };

        return res.status(200).json({
            success: true,
            sessionId: sessionId,
            user: user,
            oauth2Token: oauth2Token
        });

    } catch (error) {
        console.error('Garmin login error:', error.message);

        let errorMessage = '登入失敗';
        let errorDetail = '';

        if (error.message) {
            const msg = error.message.toLowerCase();
            if (msg.includes('credentials') || msg.includes('password') || msg.includes('401')) {
                errorMessage = 'Email 或密碼錯誤';
            } else if (msg.includes('network') || msg.includes('fetch')) {
                errorMessage = '網路連線錯誤，請稍後再試';
            } else if (msg.includes('captcha') || msg.includes('robot')) {
                errorMessage = 'Garmin 需要驗證碼，請使用手動匯入方式';
            } else if (msg.includes('blocked') || msg.includes('forbidden')) {
                errorMessage = 'Garmin 暫時封鎖此連線，請稍後再試或使用手動匯入';
            } else {
                errorDetail = error.message;
            }
        }

        return res.status(401).json({
            success: false,
            error: errorMessage,
            detail: errorDetail || 'Garmin Connect API 登入失敗，建議使用「複製 JSON」或「下載 .json」功能手動匯入'
        });
    }
};

// Export sessions for use by other modules
module.exports.sessions = sessions;
