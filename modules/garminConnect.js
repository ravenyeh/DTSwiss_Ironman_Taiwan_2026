// Garmin Connect Integration Module

const GARMIN_SESSION_KEY = 'garmin_session_id';
const GARMIN_TOKEN_KEY = 'garmin_oauth2_token';
const GARMIN_USER_KEY = 'garmin_user_info';

// Get Garmin session from localStorage
export function getGarminSession() {
    return localStorage.getItem(GARMIN_SESSION_KEY);
}

// Set Garmin session to localStorage
export function setGarminSession(sessionId) {
    localStorage.setItem(GARMIN_SESSION_KEY, sessionId);
}

// Clear Garmin session
export function clearGarminSession() {
    localStorage.removeItem(GARMIN_SESSION_KEY);
}

// Get Garmin OAuth2 token from localStorage
export function getGarminToken() {
    try {
        const token = localStorage.getItem(GARMIN_TOKEN_KEY);
        return token ? JSON.parse(token) : null;
    } catch {
        return null;
    }
}

// Set Garmin OAuth2 token to localStorage
export function setGarminToken(token) {
    if (token) {
        localStorage.setItem(GARMIN_TOKEN_KEY, JSON.stringify(token));
    }
}

// Clear Garmin token
export function clearGarminToken() {
    localStorage.removeItem(GARMIN_TOKEN_KEY);
}

// Get Garmin user info from localStorage
export function getGarminUser() {
    try {
        const user = localStorage.getItem(GARMIN_USER_KEY);
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
}

// Set Garmin user info to localStorage
export function setGarminUser(user) {
    if (user) {
        localStorage.setItem(GARMIN_USER_KEY, JSON.stringify(user));
    }
}

// Clear Garmin user info
export function clearGarminUser() {
    localStorage.removeItem(GARMIN_USER_KEY);
}

// Check if token is expired
export function isTokenExpired(token) {
    if (!token) return true;

    const expiresAt = token.expires_at || (token.expires ? token.expires / 1000 : null);
    if (!expiresAt) return true;

    const nowInSeconds = Date.now() / 1000;
    return expiresAt < (nowInSeconds + 60);
}

// Try to login with stored token
export async function tryTokenLogin() {
    const token = getGarminToken();
    if (!token || isTokenExpired(token)) {
        return false;
    }

    try {
        const response = await fetch('/api/garmin/token-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oauth2Token: token })
        });

        const data = await response.json();

        if (data.success) {
            setGarminSession(data.sessionId);
            if (data.oauth2Token) setGarminToken(data.oauth2Token);
            if (data.user) setGarminUser(data.user);
            return data.user;
        }
    } catch (error) {
        console.error('Token login error:', error);
    }

    clearGarminToken();
    return false;
}

// Update Garmin status message
export function updateGarminStatus(message, isError = false) {
    const statusEl = document.getElementById('garminStatus');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = `garmin-status ${isError ? 'error' : 'success'}`;
        statusEl.style.display = message ? 'block' : 'none';
    }
}

// Login to Garmin Connect
export async function garminLogin(showWorkoutModal) {
    const email = document.getElementById('garminEmail')?.value;
    const password = document.getElementById('garminPassword')?.value;

    if (!email || !password) {
        updateGarminStatus('請輸入 Email 和密碼', true);
        return;
    }

    updateGarminStatus('登入中...', false);

    try {
        const response = await fetch('/api/garmin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            setGarminSession(data.sessionId);
            if (data.oauth2Token) setGarminToken(data.oauth2Token);
            if (data.user) setGarminUser(data.user);
            updateGarminStatus(`登入成功！歡迎 ${data.user.fullName || data.user.displayName}`, false);

            setTimeout(() => {
                const currentIndex = window.currentWorkoutDayIndex;
                if (currentIndex !== undefined && showWorkoutModal) {
                    showWorkoutModal(currentIndex);
                }
            }, 1000);
        } else {
            let errorMsg = data.error || '登入失敗';
            if (data.detail) errorMsg += '\n' + data.detail;
            updateGarminStatus(errorMsg, true);
        }
    } catch (error) {
        console.error('Garmin login error:', error);
        updateGarminStatus('連線錯誤，請使用「複製 JSON」或「下載 .json」手動匯入', true);
    }
}

// Logout from Garmin Connect
export async function garminLogout(showWorkoutModal) {
    const sessionId = getGarminSession();

    try {
        await fetch('/api/garmin/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-Id': sessionId || ''
            }
        });
    } catch (error) {
        console.error('Logout error:', error);
    }

    clearGarminSession();
    clearGarminToken();
    updateGarminStatus('已登出', false);

    setTimeout(() => {
        const currentIndex = window.currentWorkoutDayIndex;
        if (currentIndex !== undefined && showWorkoutModal) {
            showWorkoutModal(currentIndex);
        }
    }, 500);
}

// Import single workout to Garmin
export async function importWorkoutToGarmin(workoutData, scheduledDate) {
    const sessionId = getGarminSession();

    if (!sessionId) {
        updateGarminStatus('請先登入 Garmin Connect', true);
        return false;
    }

    try {
        const response = await fetch('/api/garmin/workout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-Id': sessionId
            },
            body: JSON.stringify({
                workout: workoutData,
                scheduledDate: scheduledDate
            })
        });

        const data = await response.json();

        if (data.success) {
            return true;
        } else {
            if (data.error.includes('過期') || data.error.includes('登入')) {
                clearGarminSession();
            }
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Import workout error:', error);
        throw error;
    }
}

// Import all workouts for a day to Garmin
export async function importAllToGarmin(dayIndex, trainingData, convertToGarminWorkout) {
    const training = trainingData[dayIndex];
    const overrideDate = window.currentWorkoutOverrideDate;
    const workouts = convertToGarminWorkout(training, dayIndex, overrideDate);

    if (workouts.length === 0) {
        updateGarminStatus('沒有訓練可匯入', true);
        return;
    }

    updateGarminStatus(`匯入中... (0/${workouts.length})`, false);

    let successCount = 0;
    let errors = [];

    for (let i = 0; i < workouts.length; i++) {
        const workout = workouts[i];
        updateGarminStatus(`匯入中... (${i + 1}/${workouts.length}) ${workout.data.workoutName}`, false);

        try {
            await importWorkoutToGarmin(workout.data, workout.data.scheduledDate);
            successCount++;
        } catch (error) {
            errors.push(`${workout.data.workoutName}: ${error.message}`);
        }
    }

    if (successCount === workouts.length) {
        updateGarminStatus(`成功匯入 ${successCount} 個訓練到 Garmin Connect！`, false);
    } else if (successCount > 0) {
        updateGarminStatus(`部分成功：${successCount}/${workouts.length} 個訓練已匯入`, true);
    } else {
        updateGarminStatus(`匯入失敗：${errors[0]}`, true);
    }
}

// Direct import to Garmin (login + import in one request)
export async function directImportToGarmin(dayIndex, trainingData, convertToGarminWorkout, showWorkoutModal) {
    const email = document.getElementById('garminEmail')?.value;
    const password = document.getElementById('garminPassword')?.value;

    if (!email || !password) {
        updateGarminStatus('請輸入 Email 和密碼', true);
        return;
    }

    const training = trainingData[dayIndex];
    if (!training) {
        updateGarminStatus('找不到訓練資料', true);
        return;
    }

    const overrideDate = window.currentWorkoutOverrideDate;
    let workouts;
    try {
        workouts = convertToGarminWorkout(training, dayIndex, overrideDate);
    } catch (err) {
        updateGarminStatus(`生成訓練失敗：${err.message}`, true);
        return;
    }

    if (!workouts || workouts.length === 0) {
        updateGarminStatus('沒有訓練可匯入', true);
        return;
    }

    const workoutPayloads = workouts.map(w => ({
        workout: w.data,
        scheduledDate: w.data.scheduledDate
    }));

    updateGarminStatus('登入並匯入中...', false);
    try {
        const response = await fetch('/api/garmin/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password,
                workouts: workoutPayloads
            })
        });

        if (!response.ok) {
            const text = await response.text();
            updateGarminStatus(`伺服器錯誤 (${response.status})`, true);
            return;
        }

        const data = await response.json();

        // 無論成功失敗，都保存 token 和 user（如果有的話）
        if (data.oauth2Token) {
            setGarminToken(data.oauth2Token);
        }
        if (data.user) {
            setGarminUser(data.user);
        }

        if (data.success) {
            updateGarminStatus('✅ ' + (data.message || '匯入成功！'), false);
            setTimeout(() => {
                const currentIndex = window.currentWorkoutDayIndex;
                if (currentIndex !== undefined && showWorkoutModal) {
                    showWorkoutModal(currentIndex, window.currentWorkoutOverrideDate);
                }
            }, 1500);
        } else {
            const summary = data.summary || {};
            const imported = summary.imported || 0;
            const total = summary.total || 0;
            let errorMsg = `匯入失敗 (${imported}/${total})`;
            if (data.results && data.results[0]) {
                errorMsg += `：${data.results[0].error}`;
            }
            if (data.oauth2Token) {
                errorMsg += '\n（登錄成功，憑證已保存）';
            }
            updateGarminStatus(errorMsg, true);

            // 刷新 modal 以顯示已登錄狀態
            setTimeout(() => {
                const currentIndex = window.currentWorkoutDayIndex;
                if (currentIndex !== undefined && showWorkoutModal) {
                    showWorkoutModal(currentIndex, window.currentWorkoutOverrideDate);
                }
            }, 2000);
        }
    } catch (error) {
        updateGarminStatus(`連線錯誤：${error.message}`, true);
    }
}

// Import using stored token (direct to /api/garmin/import)
export async function importWithToken(dayIndex, trainingData, convertToGarminWorkout, clearTokenAndShowLogin, showWorkoutModal) {
    const token = getGarminToken();
    if (!token || isTokenExpired(token)) {
        updateGarminStatus('登入憑證已過期，請重新登入', true);
        clearTokenAndShowLogin();
        return;
    }

    const training = trainingData[dayIndex];
    if (!training) {
        updateGarminStatus('找不到訓練資料', true);
        return;
    }

    const overrideDate = window.currentWorkoutOverrideDate;
    let workouts;
    try {
        workouts = convertToGarminWorkout(training, dayIndex, overrideDate);
    } catch (err) {
        updateGarminStatus(`生成訓練失敗：${err.message}`, true);
        return;
    }

    if (!workouts || workouts.length === 0) {
        updateGarminStatus('沒有訓練可匯入', true);
        return;
    }

    const workoutPayloads = workouts.map(w => ({
        workout: w.data,
        scheduledDate: w.data.scheduledDate
    }));

    updateGarminStatus(`匯入 ${workouts.length} 個訓練中...`, false);

    try {
        const response = await fetch('/api/garmin/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                oauth2Token: token,
                workouts: workoutPayloads
            })
        });

        const data = await response.json();

        // Update token if refreshed
        if (data.oauth2Token) {
            setGarminToken(data.oauth2Token);
        }

        // Handle token expiration
        if (data.tokenExpired) {
            updateGarminStatus('登入憑證已過期，請重新登入', true);
            clearTokenAndShowLogin();
            return;
        }

        if (data.success) {
            updateGarminStatus('✅ ' + (data.message || '匯入成功！'), false);
            setTimeout(() => {
                const currentIndex = window.currentWorkoutDayIndex;
                if (currentIndex !== undefined && showWorkoutModal) {
                    showWorkoutModal(currentIndex, window.currentWorkoutOverrideDate);
                }
            }, 1500);
        } else {
            updateGarminStatus(`匯入失敗：${data.error}`, true);
        }
    } catch (error) {
        updateGarminStatus(`連線錯誤：${error.message}`, true);
    }
}

// Clear token and show login form
export function clearTokenAndShowLogin(showWorkoutModal) {
    clearGarminToken();
    clearGarminSession();
    clearGarminUser();

    const currentIndex = window.currentWorkoutDayIndex;
    if (currentIndex !== undefined && showWorkoutModal) {
        showWorkoutModal(currentIndex, window.currentWorkoutOverrideDate);
    }
}

// Initialize global state
window.currentWorkoutDayIndex = undefined;
window.currentWorkoutOverrideDate = null;
