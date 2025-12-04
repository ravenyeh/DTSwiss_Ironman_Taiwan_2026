// Main entry point - imports all modules and exposes functions globally

// Import modules
import { trainingData, motivationQuotes, getMotivationQuote } from './trainingData.js';
import {
    TRAINING_PARAMS, POWER_ZONES, RUN_PACE_ZONES, SWIM_PACE_ZONES,
    parsePaceToSeconds, formatSecondsToPace, getTrainingParams,
    runPaceToSpeed, getRunPaceTarget, getRunPaceFromSeconds, parseRunPaceFromContent,
    parseStructuredLongRun, parseStructuredWorkout,
    swimPaceToSpeed, getSwimPaceTarget, getPowerTarget, getCadenceTarget, parsePaceString
} from './paceZones.js';
import { saveUserSettings, toggleSettingsPanel, updateSettingsDisplay } from './settings.js';
import { formatDate, formatPace, toEnglishFilename, escapeXml } from './utils.js';
import {
    getGarminSession, setGarminSession, clearGarminSession,
    getGarminToken, setGarminToken, clearGarminToken,
    getGarminUser, setGarminUser, clearGarminUser,
    isTokenExpired, tryTokenLogin, updateGarminStatus,
    garminLogin, garminLogout, importWorkoutToGarmin,
    importAllToGarmin, directImportToGarmin, importWithToken, clearTokenAndShowLogin
} from './garminConnect.js';

// Re-export for global access
export {
    trainingData, motivationQuotes, getMotivationQuote,
    TRAINING_PARAMS, POWER_ZONES, RUN_PACE_ZONES, SWIM_PACE_ZONES,
    formatDate, formatPace, toEnglishFilename, escapeXml
};

// Make functions available globally for HTML onclick handlers
window.trainingData = trainingData;
window.TRAINING_PARAMS = TRAINING_PARAMS;
window.saveUserSettings = saveUserSettings;
window.toggleSettingsPanel = toggleSettingsPanel;
window.getMotivationQuote = getMotivationQuote;

// Garmin functions
window.garminLogin = () => garminLogin(showWorkoutModal);
window.garminLogout = () => garminLogout(showWorkoutModal);
window.directImportToGarmin = (dayIndex) => directImportToGarmin(dayIndex, trainingData, convertToGarminWorkout, showWorkoutModal);
window.importWithToken = (dayIndex) => importWithToken(dayIndex, trainingData, convertToGarminWorkout, () => clearTokenAndShowLogin(showWorkoutModal));
window.clearTokenAndShowLogin = () => clearTokenAndShowLogin(showWorkoutModal);

// ============================================
// Workout Builder Functions (kept inline for simplicity)
// ============================================

let stepIdCounter = 1;

function resetStepIdCounter() {
    stepIdCounter = 1;
}

// Extract workout description for specific sport
function extractWorkoutPart(content, sport) {
    const parts = content.split('|').map(p => p.trim());
    for (const part of parts) {
        if (part.toLowerCase().includes(sport.toLowerCase()) ||
            (sport === '游泳' && part.includes('游泳')) ||
            (sport === '自行車' && (part.includes('自行車') || part.includes('騎'))) ||
            (sport === '跑步' && (part.includes('跑步') || part.includes('跑')))) {
            return part;
        }
    }
    return content;
}

// Format a workout step with required Garmin API fields
function formatStep(step) {
    const formatted = {
        stepId: step.stepId || stepIdCounter++,
        stepOrder: step.stepOrder || 1,
        stepType: step.stepType || { stepTypeId: 3, stepTypeKey: 'interval' }
    };

    if (step.endCondition) {
        formatted.endCondition = step.endCondition;
        if (step.endConditionValue !== undefined) {
            formatted.endConditionValue = step.endConditionValue;
        }
    }

    if (step.targetType) {
        formatted.targetType = step.targetType;
        if (step.targetValueOne !== undefined) formatted.targetValueOne = step.targetValueOne;
        if (step.targetValueTwo !== undefined) formatted.targetValueTwo = step.targetValueTwo;
    }

    if (step.secondaryTargetType) {
        formatted.secondaryTargetType = step.secondaryTargetType;
        formatted.secondaryTargetValueOne = step.secondaryTargetValueOne;
        formatted.secondaryTargetValueTwo = step.secondaryTargetValueTwo;
    }

    if (step.repeatType) {
        formatted.repeatType = step.repeatType;
        formatted.repeatValue = step.repeatValue;
        formatted.workoutSteps = step.workoutSteps.map(s => formatStep(s));
    }

    return formatted;
}

// Generate swim workout steps - simplified version
function generateSwimSteps(totalDistance, content) {
    const steps = [];
    const warmupDist = Math.min(500, totalDistance * 0.2);
    const cooldownDist = Math.min(500, totalDistance * 0.2);
    const mainDist = totalDistance - warmupDist - cooldownDist;

    // Warmup
    steps.push({
        stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
        endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
        endConditionValue: warmupDist,
        ...getSwimPaceTarget('EASY')
    });

    // Main set
    if (content.includes('間歇') || content.includes('Interval')) {
        const repMatch = content.match(/(\d+)\s*x\s*(\d+)\s*m/i);
        if (repMatch) {
            const reps = parseInt(repMatch[1]);
            const dist = parseInt(repMatch[2]);
            steps.push({
                repeatType: { repeatTypeId: 2, repeatTypeKey: 'repeat' },
                repeatValue: reps,
                workoutSteps: [
                    {
                        stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                        endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                        endConditionValue: dist,
                        ...getSwimPaceTarget('THRESHOLD')
                    },
                    {
                        stepType: { stepTypeId: 4, stepTypeKey: 'rest' },
                        endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' },
                        endConditionValue: 30
                    }
                ]
            });
        }
    } else {
        steps.push({
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: mainDist,
            ...getSwimPaceTarget('CSS')
        });
    }

    // Cooldown
    steps.push({
        stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
        endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
        endConditionValue: cooldownDist,
        ...getSwimPaceTarget('RECOVERY')
    });

    return steps;
}

// Generate bike workout steps - simplified version
function generateBikeSteps(totalDistance, content) {
    const steps = [];
    const warmupDist = Math.min(5000, totalDistance * 0.1);
    const cooldownDist = Math.min(5000, totalDistance * 0.1);
    const mainDist = totalDistance - warmupDist - cooldownDist;

    // Warmup
    steps.push({
        stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
        endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
        endConditionValue: warmupDist,
        ...getPowerTarget('Z2')
    });

    // Main set
    if (content.includes('Sweet Spot') || content.includes('SS')) {
        const repMatch = content.match(/(\d+)\s*x\s*(\d+)\s*分鐘/);
        if (repMatch) {
            const reps = parseInt(repMatch[1]);
            const mins = parseInt(repMatch[2]);
            steps.push({
                repeatType: { repeatTypeId: 2, repeatTypeKey: 'repeat' },
                repeatValue: reps,
                workoutSteps: [
                    {
                        stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                        endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' },
                        endConditionValue: mins * 60,
                        ...getPowerTarget('SS')
                    },
                    {
                        stepType: { stepTypeId: 4, stepTypeKey: 'rest' },
                        endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' },
                        endConditionValue: 300
                    }
                ]
            });
        }
    } else {
        steps.push({
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: mainDist,
            ...getPowerTarget('Z2')
        });
    }

    // Cooldown
    steps.push({
        stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
        endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
        endConditionValue: cooldownDist,
        ...getPowerTarget('Z1')
    });

    return steps;
}

// Generate run workout steps - simplified version
function generateRunSteps(totalDistance, content) {
    const steps = [];
    const warmupDist = Math.min(2000, totalDistance * 0.15);
    const cooldownDist = Math.min(2000, totalDistance * 0.15);
    const mainDist = totalDistance - warmupDist - cooldownDist;

    // Warmup
    steps.push({
        stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
        endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
        endConditionValue: warmupDist,
        ...getRunPaceTarget('EASY')
    });

    // Check for structured workout
    const structuredLongRun = parseStructuredLongRun(content);
    const structuredWorkout = parseStructuredWorkout(content);

    if (structuredLongRun) {
        // First segment - easy
        steps.push({
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: structuredLongRun.firstDistance,
            ...getRunPaceTarget('EASY')
        });
        // Middle segment - at pace
        steps.push({
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: structuredLongRun.middleDistance,
            ...structuredLongRun.middlePace
        });
        // Last segment - easy
        steps.push({
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: structuredLongRun.lastDistance,
            ...getRunPaceTarget('EASY')
        });
    } else if (structuredWorkout) {
        // Warmup already added, main set, cooldown
        steps.push({
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: structuredWorkout.mainDistance,
            ...structuredWorkout.mainPace
        });
    } else if (content.includes('間歇') || content.includes('Interval')) {
        const repMatch = content.match(/(\d+)\s*x\s*([\d.]+)\s*km/i);
        if (repMatch) {
            const reps = parseInt(repMatch[1]);
            const dist = parseFloat(repMatch[2]) * 1000;
            steps.push({
                repeatType: { repeatTypeId: 2, repeatTypeKey: 'repeat' },
                repeatValue: reps,
                workoutSteps: [
                    {
                        stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                        endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                        endConditionValue: dist,
                        ...getRunPaceTarget('INTERVAL')
                    },
                    {
                        stepType: { stepTypeId: 4, stepTypeKey: 'rest' },
                        endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' },
                        endConditionValue: 90
                    }
                ]
            });
        }
    } else {
        // Simple main set
        steps.push({
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: mainDist,
            ...getRunPaceTarget('EASY')
        });
    }

    // Cooldown
    steps.push({
        stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
        endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
        endConditionValue: cooldownDist,
        ...getRunPaceTarget('RECOVERY')
    });

    return steps;
}

// Convert training data to Garmin Workout JSON format
function convertToGarminWorkout(training, index, overrideDate = null) {
    const workouts = [];
    const sportTypes = {
        swim: { sportTypeId: 4, sportTypeKey: 'swimming_pool' },
        bike: { sportTypeId: 2, sportTypeKey: 'cycling' },
        run: { sportTypeId: 1, sportTypeKey: 'running' }
    };

    const content = training.content;
    const dateObj = overrideDate ? new Date(overrideDate) : new Date(training.date);
    const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

    if (training.swim && parseFloat(training.swim) > 0) {
        resetStepIdCounter();
        const swimDistance = parseFloat(training.swim) * 1000;
        const rawSteps = generateSwimSteps(swimDistance, content);
        workouts.push({
            type: 'swim',
            data: {
                workoutId: null,
                ownerId: null,
                workoutName: `Day ${index + 1} 游泳 - ${training.phase}`,
                description: extractWorkoutPart(content, '游泳'),
                sportType: sportTypes.swim,
                workoutSegments: [{
                    segmentOrder: 1,
                    sportType: sportTypes.swim,
                    workoutSteps: rawSteps.map(step => formatStep(step))
                }],
                estimatedDurationInSecs: Math.round(swimDistance * 2.5 / 100 * 60),
                estimatedDistanceInMeters: swimDistance,
                poolLength: 25,
                poolLengthUnit: { unitId: 1, unitKey: 'meter' },
                scheduledDate: dateStr
            }
        });
    }

    if (training.bike && parseFloat(training.bike) > 0) {
        resetStepIdCounter();
        const bikeDistance = parseFloat(training.bike) * 1000;
        const rawSteps = generateBikeSteps(bikeDistance, content);
        workouts.push({
            type: 'bike',
            data: {
                workoutId: null,
                ownerId: null,
                workoutName: `Day ${index + 1} 自行車 - ${training.phase}`,
                description: extractWorkoutPart(content, '自行車'),
                sportType: sportTypes.bike,
                workoutSegments: [{
                    segmentOrder: 1,
                    sportType: sportTypes.bike,
                    workoutSteps: rawSteps.map(step => formatStep(step))
                }],
                estimatedDurationInSecs: Math.round(bikeDistance / 1000 / 30 * 3600),
                estimatedDistanceInMeters: bikeDistance,
                scheduledDate: dateStr
            }
        });
    }

    if (training.run && parseFloat(training.run) > 0) {
        resetStepIdCounter();
        const runDistance = parseFloat(training.run) * 1000;
        const rawSteps = generateRunSteps(runDistance, content);
        workouts.push({
            type: 'run',
            data: {
                workoutId: null,
                ownerId: null,
                workoutName: `Day ${index + 1} 跑步 - ${training.phase}`,
                description: extractWorkoutPart(content, '跑步'),
                sportType: sportTypes.run,
                workoutSegments: [{
                    segmentOrder: 1,
                    sportType: sportTypes.run,
                    workoutSteps: rawSteps.map(step => formatStep(step))
                }],
                estimatedDurationInSecs: Math.round(runDistance / 1000 * 6 * 60),
                estimatedDistanceInMeters: runDistance,
                scheduledDate: dateStr
            }
        });
    }

    return workouts;
}

// Expose workout builder functions globally
window.convertToGarminWorkout = convertToGarminWorkout;

// ============================================
// UI Functions
// ============================================

// Populate schedule table
function populateSchedule(filter = 'all') {
    const tbody = document.getElementById('scheduleBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const filteredData = filter === 'all'
        ? trainingData
        : trainingData.filter(item => item.phase === filter);

    filteredData.forEach(item => {
        const row = document.createElement('tr');
        const originalIndex = trainingData.findIndex(d => d.date === item.date);

        if (item.intensity === '休息') row.classList.add('rest-day');
        if (item.type === '比賽日') row.classList.add('race-day');
        if (item.holiday) row.classList.add('holiday-row');

        const hasWorkout = item.swim || item.bike || item.run;

        row.innerHTML = `
            <td>${item.week}</td>
            <td>${formatDate(item.date)}</td>
            <td><span class="phase-badge phase-${item.phase}">${item.phase}</span></td>
            <td><span class="intensity-badge intensity-${item.intensity}">${item.intensity}</span></td>
            <td>${item.content}</td>
            <td>${item.swim ? item.swim + 'km' : '-'}</td>
            <td>${item.bike ? item.bike + 'km' : '-'}</td>
            <td>${item.run ? item.run + 'km' : '-'}</td>
            <td>${item.hours}h</td>
            <td>${hasWorkout ? `<button class="btn-view-workout" onclick="showWorkoutModal(${originalIndex})">查看訓練</button>` : '-'}</td>
        `;

        tbody.appendChild(row);
    });
}

window.populateSchedule = populateSchedule;

// Show workout modal
function showWorkoutModal(dayIndex, overrideDate = null) {
    window.currentWorkoutDayIndex = dayIndex;
    window.currentWorkoutOverrideDate = overrideDate;

    const training = trainingData[dayIndex];
    if (!training) return;

    const modal = document.getElementById('workoutModal');
    const modalContent = document.getElementById('workoutModalContent');
    if (!modal || !modalContent) return;

    const workouts = convertToGarminWorkout(training, dayIndex, overrideDate);
    const storedToken = getGarminToken();
    const hasValidToken = storedToken && !isTokenExpired(storedToken);
    const storedUser = getGarminUser();

    let html = `
        <div class="modal-header">
            <h2>Day ${dayIndex + 1} - ${training.phase}</h2>
            <span class="close-btn" onclick="closeWorkoutModal()">&times;</span>
        </div>
        <div class="modal-body">
            <p class="workout-description">${training.content}</p>
    `;

    // Garmin Connect section
    html += `
        <div class="garmin-section">
            <h4>匯入 Garmin Connect</h4>
            ${workouts.length > 0 ? `
                <div id="garminLoginSection">
                    ${hasValidToken ? `
                        <div class="garmin-token-status">
                            <div class="garmin-user-info" id="garminUserInfo">
                                ${storedUser?.profileImageUrl ? `<img src="${storedUser.profileImageUrl}" alt="Profile" class="garmin-user-avatar">` : '<div class="garmin-user-avatar-placeholder">👤</div>'}
                                <span class="garmin-user-name">${storedUser?.fullName || storedUser?.displayName || '已從瀏覽器取得登入憑證'}</span>
                            </div>
                            <button class="btn-garmin-import" onclick="importWithToken(${dayIndex})">直接匯入訓練</button>
                            <button class="btn-garmin-logout-small" onclick="clearTokenAndShowLogin()">登出</button>
                        </div>
                    ` : `
                        <div class="garmin-login-form" id="garminLoginForm">
                            <input type="email" id="garminEmail" placeholder="Garmin Email" class="garmin-input">
                            <input type="password" id="garminPassword" placeholder="密碼" class="garmin-input">
                            <button class="btn-garmin-import" onclick="directImportToGarmin(${dayIndex})">登入並匯入</button>
                        </div>
                    `}
                </div>
                <div id="garminStatus" class="garmin-status"></div>
            ` : '<p class="no-workout">今日無訓練可匯入</p>'}
        </div>
    `;

    // Workout previews
    workouts.forEach((workout, idx) => {
        const sportLabel = { swim: '🏊 游泳', bike: '🚴 自行車', run: '🏃 跑步' }[workout.type];
        html += `
            <div class="workout-card ${workout.type}">
                <h4>${sportLabel}</h4>
                <p>${workout.data.description}</p>
                <div class="workout-actions">
                    <button class="btn-copy" onclick="copyWorkoutJson(${idx}, this)">複製 JSON</button>
                    <button class="btn-download" onclick="downloadWorkoutJson(${idx}, '${toEnglishFilename(workout.data.workoutName, workout.type)}')">下載 .json</button>
                </div>
            </div>
        `;
    });

    html += '</div>';
    modalContent.innerHTML = html;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

window.showWorkoutModal = showWorkoutModal;

// Close workout modal
function closeWorkoutModal() {
    const modal = document.getElementById('workoutModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

window.closeWorkoutModal = closeWorkoutModal;

// Copy workout JSON to clipboard
function copyWorkoutJson(idx, btn) {
    const training = trainingData[window.currentWorkoutDayIndex];
    const workouts = convertToGarminWorkout(training, window.currentWorkoutDayIndex, window.currentWorkoutOverrideDate);
    const workout = workouts[idx];

    navigator.clipboard.writeText(JSON.stringify(workout.data, null, 2)).then(() => {
        const originalText = btn.textContent;
        btn.textContent = '已複製！';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copied');
        }, 2000);
    });
}

window.copyWorkoutJson = copyWorkoutJson;

// Download workout JSON as file
function downloadWorkoutJson(idx, filename) {
    const training = trainingData[window.currentWorkoutDayIndex];
    const workouts = convertToGarminWorkout(training, window.currentWorkoutDayIndex, window.currentWorkoutOverrideDate);
    const workout = workouts[idx];

    const blob = new Blob([JSON.stringify(workout.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

window.downloadWorkoutJson = downloadWorkoutJson;

// Countdown function
function updateCountdown() {
    const raceDate = new Date('April 12, 2026');
    const today = new Date();
    const diff = raceDate - today;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minsEl = document.getElementById('countdown-minutes');
    const secsEl = document.getElementById('countdown-seconds');

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minsEl) minsEl.textContent = mins.toString().padStart(2, '0');
    if (secsEl) secsEl.textContent = secs.toString().padStart(2, '0');
}

// Display Today's Training
function displayTodayTraining() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let trainingIndex = trainingData.findIndex(item => {
        const itemDate = new Date(item.date);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate.getTime() === today.getTime();
    });

    let training = trainingIndex >= 0 ? trainingData[trainingIndex] : null;
    let isRandom = false;

    if (!training) {
        const validTrainings = trainingData.filter(t => t.swim || t.bike || t.run);
        if (validTrainings.length > 0) {
            const randomIndex = Math.floor(Math.random() * validTrainings.length);
            training = validTrainings[randomIndex];
            trainingIndex = trainingData.indexOf(training);
            isRandom = true;
        }
    }

    const todayLabel = document.getElementById('todayLabel');
    const todayPhase = document.getElementById('todayPhase');
    const todayIntensity = document.getElementById('todayIntensity');
    const todayDescription = document.getElementById('todayDescription');
    const todaySwim = document.getElementById('todaySwim');
    const todayBike = document.getElementById('todayBike');
    const todayRun = document.getElementById('todayRun');
    const todayHours = document.getElementById('todayHours');
    const todayNote = document.getElementById('todayNote');
    const todayActions = document.getElementById('todayActions');
    const todayMotivation = document.getElementById('todayMotivation');

    if (todayLabel) {
        todayLabel.textContent = isRandom ? '今日訓練預覽' : '今日訓練';
    }

    if (training) {
        if (todayPhase) {
            todayPhase.textContent = training.phase;
            todayPhase.className = 'today-phase phase-' + training.phase;
        }
        if (todayIntensity) {
            todayIntensity.textContent = training.intensity;
            todayIntensity.className = 'today-intensity intensity-' + training.intensity;
        }
        if (todayDescription) todayDescription.textContent = training.content;

        if (todaySwim) {
            if (training.swim) {
                todaySwim.innerHTML = '<span class="stat-icon">🏊</span> ' + training.swim + ' km';
                todaySwim.style.display = 'inline-flex';
            } else {
                todaySwim.style.display = 'none';
            }
        }
        if (todayBike) {
            if (training.bike) {
                todayBike.innerHTML = '<span class="stat-icon">🚴</span> ' + training.bike + ' km';
                todayBike.style.display = 'inline-flex';
            } else {
                todayBike.style.display = 'none';
            }
        }
        if (todayRun) {
            if (training.run) {
                todayRun.innerHTML = '<span class="stat-icon">🏃</span> ' + training.run + ' km';
                todayRun.style.display = 'inline-flex';
            } else {
                todayRun.style.display = 'none';
            }
        }
        if (todayHours) {
            if (training.hours) {
                todayHours.innerHTML = '<span class="stat-icon">⏱</span> ' + training.hours + ' h';
                todayHours.style.display = 'inline-flex';
            } else {
                todayHours.style.display = 'none';
            }
        }

        if (todayNote) {
            if (isRandom) {
                todayNote.textContent = '※ 未到訓練日，隨機顯示';
                todayNote.style.display = 'block';
            } else {
                todayNote.style.display = 'none';
            }
        }

        if (todayMotivation && trainingIndex >= 0) {
            const quote = getMotivationQuote(trainingIndex);
            if (quote) {
                todayMotivation.textContent = '💪 ' + quote;
                todayMotivation.style.display = 'block';
            } else {
                todayMotivation.style.display = 'none';
            }
        }

        if (todayActions && trainingIndex >= 0 && (training.swim || training.bike || training.run)) {
            const todayISO = today.toISOString().split('T')[0];
            todayActions.innerHTML = `
                <button class="btn-today-workout" onclick="showWorkoutModal(${trainingIndex}${isRandom ? `, '${todayISO}'` : ''})">
                    <span class="btn-icon">📋</span>
                    查看訓練 / 匯入 Garmin
                </button>
            `;
            todayActions.style.display = 'block';
        } else if (todayActions) {
            todayActions.style.display = 'none';
        }
    }
}

// Initialize Weekly Mileage Chart
function initWeeklyMileageChart() {
    const ctx = document.getElementById('weeklyMileageChart');
    if (!ctx) return;

    // Calculate weekly totals
    const weeklyData = {};
    trainingData.forEach(day => {
        const week = day.week;
        if (!weeklyData[week]) {
            weeklyData[week] = { swim: 0, bike: 0, run: 0 };
        }
        weeklyData[week].swim += parseFloat(day.swim) || 0;
        weeklyData[week].bike += parseFloat(day.bike) || 0;
        weeklyData[week].run += parseFloat(day.run) || 0;
    });

    // Convert to arrays
    const weeks = Object.keys(weeklyData).sort((a, b) => {
        const numA = parseInt(a.replace('Week ', ''));
        const numB = parseInt(b.replace('Week ', ''));
        return numA - numB;
    });

    const swimData = weeks.map(w => weeklyData[w].swim.toFixed(1));
    const bikeData = weeks.map(w => weeklyData[w].bike.toFixed(0));
    const runData = weeks.map(w => weeklyData[w].run.toFixed(1));
    const labels = weeks.map(w => w.replace('Week ', 'W'));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '游泳 (km)',
                    data: swimData,
                    borderColor: '#0077be',
                    backgroundColor: 'rgba(0, 119, 190, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    yAxisID: 'y1',
                    pointBackgroundColor: '#0077be',
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: '自行車 (km)',
                    data: bikeData,
                    borderColor: '#f5a623',
                    backgroundColor: 'rgba(245, 166, 35, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    yAxisID: 'y',
                    pointBackgroundColor: '#f5a623',
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: '跑步 (km)',
                    data: runData,
                    borderColor: '#4caf50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    yAxisID: 'y',
                    pointBackgroundColor: '#4caf50',
                    pointRadius: 5,
                    pointHoverRadius: 7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 14,
                            family: "'Noto Sans TC', sans-serif"
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleFont: {
                        size: 14,
                        family: "'Noto Sans TC', sans-serif"
                    },
                    bodyFont: {
                        size: 13,
                        family: "'Noto Sans TC', sans-serif"
                    },
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + ' km';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 12,
                            family: "'Noto Sans TC', sans-serif"
                        }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: '自行車 / 跑步 (km)',
                        font: {
                            size: 13,
                            family: "'Noto Sans TC', sans-serif"
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    min: 0
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: '游泳 (km)',
                        color: '#0077be',
                        font: {
                            size: 13,
                            family: "'Noto Sans TC', sans-serif"
                        }
                    },
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        color: '#0077be',
                        font: {
                            size: 12
                        }
                    },
                    min: 0
                }
            }
        }
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    populateSchedule();
    updateSettingsDisplay();
    updateCountdown();
    displayTodayTraining();
    initWeeklyMileageChart();

    // Setup filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            populateSchedule(btn.dataset.filter);
        });
    });

    // Update countdown every second
    setInterval(updateCountdown, 1000);
});

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('workoutModal');
    if (e.target === modal) {
        closeWorkoutModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeWorkoutModal();
    }
});
