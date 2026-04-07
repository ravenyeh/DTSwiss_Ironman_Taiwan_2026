// Main entry point - imports all modules and exposes functions globally

// Import modules
import { trainingData, motivationQuotes, getMotivationQuote } from './trainingData.js';
import { TRAINING_PARAMS, POWER_ZONES, RUN_PACE_ZONES, SWIM_PACE_ZONES } from './paceZones.js';
import { saveUserSettings, toggleSettingsPanel, updateSettingsDisplay } from './settings.js';
import { formatDate, formatPace, toEnglishFilename, escapeXml } from './utils.js';
import {
    hasValidLogin, getGarminUser, hasPendingMfa,
    garminLogin, garminLogout,
    directImportToGarmin as _directImportToGarmin,
    importWithCredentials as _importWithCredentials,
    clearLoginAndShowForm as _clearLoginAndShowForm,
    submitMfaCode as _submitMfaCode
} from './garminConnect.js';
import { convertToGarminWorkout } from './workoutBuilder.js';
import {
    convertToZWO, convertToERG,
    downloadWorkoutZWO, downloadWorkoutERG
} from './workoutExport.js';

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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pastCount = filteredData.filter(item => new Date(item.date) < today).length;
    const pastExpanded = window.__pastExpanded === true;
    let toggleInserted = false;

    filteredData.forEach(item => {
        const itemDate = new Date(item.date);
        const isPast = itemDate < today;

        if (isPast && !toggleInserted && pastCount > 0) {
            const toggleRow = document.createElement('tr');
            toggleRow.className = 'past-toggle-row';
            toggleRow.innerHTML = `<td colspan="10" class="past-toggle-cell">
                <button class="past-toggle-btn" onclick="togglePastSchedule()">
                    ${pastExpanded ? '▼' : '▶'} 已過去的訓練日 (${pastCount} 天)
                </button>
            </td>`;
            tbody.appendChild(toggleRow);
            toggleInserted = true;
        }

        const row = document.createElement('tr');
        const originalIndex = trainingData.findIndex(d => d.date === item.date);

        if (item.intensity === '休息') row.classList.add('rest-day');
        if (item.type === '比賽日') row.classList.add('race-day');
        if (item.holiday) row.classList.add('holiday-row');
        if (isPast) {
            row.classList.add('past-row');
            if (!pastExpanded) row.style.display = 'none';
        }

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

// Toggle past schedule rows visibility
window.togglePastSchedule = function () {
    window.__pastExpanded = !window.__pastExpanded;
    const activeFilter = document.querySelector('.filter-btn.active');
    populateSchedule(activeFilter ? activeFilter.dataset.filter : 'all');
};

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

    const scheduledDateObj = overrideDate ? new Date(overrideDate) : new Date(training.date);
    const scheduledDateStr = `${scheduledDateObj.getFullYear()}/${scheduledDateObj.getMonth() + 1}/${scheduledDateObj.getDate()}`;
    const isOverride = overrideDate && overrideDate !== training.date;

    const quote = getMotivationQuote(dayIndex);

    let html = `
        <div class="modal-header">
            <h3>Garmin 訓練計劃</h3>
            <button class="modal-close" onclick="closeWorkoutModal()">&times;</button>
        </div>
        <div class="modal-body">
            <div class="training-info">
                <div class="training-date">${formatDate(training.date)}</div>
                <span class="phase-badge phase-${training.phase}">${training.phase}</span>
                <span class="intensity-badge intensity-${training.intensity}">${training.intensity}</span>
            </div>
            ${quote ? `<div class="modal-motivation-quote">💪 ${quote}</div>` : ''}
            ${isOverride ? `<div class="scheduled-date-notice">📅 匯入日期：<strong>${scheduledDateStr}</strong>（今日）</div>` : ''}
            <div class="training-description">${training.content}</div>
    `;

    if (workouts.length === 0) {
        html += `<div class="no-workout">此日無訓練內容</div>`;
    } else {
        workouts.forEach((workout, idx) => {
            const typeLabel = { swim: '游泳', bike: '自行車', run: '跑步' }[workout.type];
            const typeColor = { swim: 'var(--swim-color)', bike: 'var(--bike-color)', run: 'var(--run-color)' }[workout.type];

            const isBike = workout.type === 'bike';
            const englishFilename = toEnglishFilename(workout.data.workoutName, workout.type);
            window[`workoutData_${idx}`] = workout.data;

            html += `
                <div class="workout-section" style="border-left: 4px solid ${typeColor}">
                    <div class="workout-header">
                        <img src="images/${workout.type === 'swim' ? 'swim' : workout.type === 'bike' ? 'cycling' : 'run'}.png" class="workout-type-icon" alt="${typeLabel}">
                        <span class="workout-type-label">${typeLabel}</span>
                    </div>
                    <div class="workout-name">${workout.data.workoutName || ''}</div>
                    <div class="workout-desc">${workout.data.description || ''}</div>
                    <div class="workout-stats">
                        <span>距離: ${workout.data.estimatedDistanceInMeters ? (workout.data.estimatedDistanceInMeters / 1000).toFixed(1) : '0'} km</span>
                        <span>預估時間: ${workout.data.estimatedDurationInSecs ? Math.round(workout.data.estimatedDurationInSecs / 60) : 0} 分鐘</span>
                    </div>
                    ${renderStepsPreview(workout.data, workout.type)}
                    <div class="workout-actions-row">
                        <button class="btn-trainer btn-json" onclick="downloadWorkoutJson(${idx}, '${englishFilename}')">下載 JSON</button>
                        ${isBike ? `<button class="btn-trainer btn-zwo" onclick="downloadWorkoutZWO(${idx}, '${englishFilename}')">下載 ZWO</button>
                        <button class="btn-trainer btn-erg" onclick="downloadWorkoutERG(${idx}, '${englishFilename}')">下載 ERG</button>` : ''}
                    </div>
                </div>
            `;
        });
    }

    const isLoggedIn = hasValidLogin();
    const storedUser = getGarminUser();
    const isMfaPending = hasPendingMfa();

    html += `
            <div class="garmin-section">
                <h4>匯入 Garmin Connect</h4>
                ${workouts.length > 0 ? `
                    <div id="garminLoginSection">
                        ${isLoggedIn && !isMfaPending ? `
                            <div class="garmin-token-status">
                                <div class="garmin-user-info" id="garminUserInfo">
                                    ${storedUser?.profileImageUrl ? `<img src="${storedUser.profileImageUrl}" alt="Profile" class="garmin-user-avatar">` : '<div class="garmin-user-avatar-placeholder">👤</div>'}
                                    <span class="garmin-user-name">${storedUser?.fullName || storedUser?.displayName || '已登入'}</span>
                                </div>
                                <button class="btn-garmin-import" onclick="importWithCredentials(${dayIndex})">直接匯入訓練</button>
                                <button class="btn-garmin-logout-small" onclick="clearLoginAndShowForm()">登出</button>
                            </div>
                        ` : `
                            <div class="garmin-login-form" id="garminLoginForm" style="${isMfaPending ? 'display:none' : ''}">
                                <input type="email" id="garminEmail" placeholder="Garmin Email" class="garmin-input">
                                <input type="password" id="garminPassword" placeholder="密碼" class="garmin-input">
                                <button class="btn-garmin-import" onclick="directImportToGarmin(${dayIndex})">登入並匯入訓練</button>
                            </div>
                            <div class="garmin-mfa-form" id="garminMfaForm" style="${isMfaPending ? '' : 'display:none'}">
                                <p class="mfa-hint">📱 Garmin 已傳送驗證碼到你的信箱或手機</p>
                                <div class="mfa-input-row">
                                    <input type="text" id="garminMfaCode" placeholder="輸入驗證碼" class="garmin-input mfa-code-input" maxlength="7" autocomplete="one-time-code" inputmode="numeric">
                                    <button class="btn-garmin-import" onclick="submitMfaCode()">驗證</button>
                                </div>
                                <button class="btn-mfa-cancel" onclick="cancelMfa()">取消，重新登入</button>
                            </div>
                        `}
                    </div>
                ` : ''}
                <div id="garminStatus" class="garmin-status">${isMfaPending ? '📱 請輸入 Garmin 傳送的驗證碼' : ''}</div>
            </div>
            <div class="modal-footer">
                <button class="btn-close" onclick="closeWorkoutModal()">關閉</button>
            </div>
        </div>
    `;

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
window.downloadWorkoutZWO = downloadWorkoutZWO;
window.downloadWorkoutERG = downloadWorkoutERG;

// ============================================
// Workout Steps Visualization
// ============================================

function renderStepsPreview(workout, sportType) {
    const steps = workout.workoutSegments?.[0]?.workoutSteps || [];
    if (steps.length === 0) return '';

    let html = `<div class="steps-preview"><div class="steps-header">訓練步驟</div>`;
    steps.forEach(step => { html += renderStep(step, sportType); });
    html += `</div>`;
    return html;
}

function renderStep(step, sportType) {
    const stepType = step.stepType?.stepTypeKey || 'interval';

    if (stepType === 'repeat' && step.workoutSteps) {
        return renderRepeatGroup(step, sportType);
    }

    const label = getStepLabel(stepType);
    const duration = formatStepDuration(step);
    const target = formatStepTarget(step, sportType);

    return `
        <div class="step-item step-type-${stepType}">
            <div class="step-color-bar ${stepType}"></div>
            <div class="step-content">
                <div class="step-label">${label}</div>
                <div class="step-duration">${duration}</div>
                ${target ? `<div class="step-target">${target}</div>` : ''}
            </div>
        </div>
    `;
}

function renderRepeatGroup(step, sportType) {
    const reps = step.numberOfIterations || 1;
    const childSteps = step.workoutSteps || [];

    let html = `
        <div class="step-repeat-group">
            <div class="repeat-header">
                <span class="repeat-times">${reps}x</span>
                <span>重複訓練</span>
            </div>
            <div class="repeat-steps">
    `;
    childSteps.forEach(childStep => { html += renderStep(childStep, sportType); });
    html += `</div></div>`;
    return html;
}

function getStepLabel(stepType) {
    const labels = {
        'warmup': '熱身', 'cooldown': '緩和', 'interval': '主課表',
        'rest': '休息', 'recovery': '恢復', 'active': '動態恢復'
    };
    return labels[stepType] || stepType;
}

function formatStepDuration(step) {
    const condition = step.endCondition?.conditionTypeKey;
    const value = step.endConditionValue;

    if (!condition || !value) return '';

    if (condition === 'distance') {
        return value >= 1000 ? `${(value / 1000).toFixed(1)} km` : `${value} m`;
    } else if (condition === 'time') {
        if (value >= 60) {
            const mins = Math.floor(value / 60);
            const secs = value % 60;
            return secs > 0 ? `${mins}分${secs}秒` : `${mins} 分鐘`;
        }
        return `${value} 秒`;
    } else if (condition === 'lap.button') {
        return '按圈結束';
    }
    return '';
}

function formatStepTarget(step, sportType) {
    const targetType = step.targetType?.workoutTargetTypeKey;
    const v1 = step.targetValueOne;
    const v2 = step.targetValueTwo;

    if (!targetType || targetType === 'no.target') return '';

    if (targetType === 'power.zone' && v1 && v2) {
        return `功率: ${Math.round(v1)}-${Math.round(v2)} W`;
    } else if ((targetType === 'speed.zone' || targetType === 'pace.zone') && v1 && v2) {
        if (sportType === 'swim') {
            const pace1 = Math.round(100 / v2);
            const pace2 = Math.round(100 / v1);
            return `配速: ${formatPace(pace1)}-${formatPace(pace2)}/100m`;
        } else {
            const pace1 = Math.round(1000 / v2);
            const pace2 = Math.round(1000 / v1);
            return `配速: ${formatPace(pace1)}-${formatPace(pace2)}/km`;
        }
    }

    let result = '';
    if (step.secondaryTargetType?.workoutTargetTypeKey === 'cadence.zone') {
        const c1 = step.secondaryTargetValueOne;
        const c2 = step.secondaryTargetValueTwo;
        if (c1 && c2) result += `迴轉速: ${c1}-${c2} rpm`;
    }
    return result;
}

// ============================================
// Race Settings
// ============================================

const RACES = {
    roth: { name: '2026 Challenge Roth', date: 'July 5, 2026' }
};

const DEFAULT_RACE_KEY = 'roth';

function getRaceSettings() {
    const saved = localStorage.getItem('raceSettings');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.raceKey && RACES[parsed.raceKey]) {
            return {
                raceKey: parsed.raceKey,
                name: RACES[parsed.raceKey].name,
                date: RACES[parsed.raceKey].date
            };
        }
    }
    return {
        raceKey: DEFAULT_RACE_KEY,
        name: RACES[DEFAULT_RACE_KEY].name,
        date: RACES[DEFAULT_RACE_KEY].date
    };
}

function saveRaceSettings(raceKey) {
    if (!RACES[raceKey]) return;
    const settings = {
        raceKey,
        name: RACES[raceKey].name,
        date: RACES[raceKey].date
    };
    localStorage.setItem('raceSettings', JSON.stringify(settings));
    updateRaceDisplay();
    updateCountdown();
}

function updateRaceDisplay() {
    const settings = getRaceSettings();

    // Update title
    const titleEl = document.getElementById('raceTitle');
    if (titleEl) titleEl.textContent = settings.name;

    // Update nav race name
    const navRaceNameEl = document.getElementById('navRaceName');
    if (navRaceNameEl) navRaceNameEl.textContent = settings.name;

    // Update date display
    const dateDisplayEl = document.getElementById('raceDateDisplay');
    if (dateDisplayEl) {
        const raceDate = new Date(settings.date);
        if (!isNaN(raceDate.getTime())) {
            const year = raceDate.getFullYear();
            const month = raceDate.getMonth() + 1;
            const day = raceDate.getDate();
            dateDisplayEl.textContent = `${year}年${month}月${day}日`;
        } else {
            dateDisplayEl.textContent = '請設定比賽日期';
        }
    }

    // Update page title
    document.title = settings.name + ' - 訓練計劃';

    // Update footer copyright
    const footerEl = document.getElementById('footerCopyright');
    if (footerEl) footerEl.textContent = `© ${settings.name}`;
}

function initRaceSettingsModal() {
    const modal = document.getElementById('raceSettingsModal');
    const btnOpen = document.getElementById('btnRaceSettings');
    const btnSave = document.getElementById('btnSaveRace');
    const btnCancel = document.getElementById('btnCancelRace');
    const raceSelect = document.getElementById('raceSelect');

    if (!modal || !btnOpen) return;

    // Load current settings into select
    const settings = getRaceSettings();
    if (raceSelect) raceSelect.value = settings.raceKey || '';

    // Open modal
    btnOpen.addEventListener('click', () => {
        modal.classList.add('show');
        const currentSettings = getRaceSettings();
        if (raceSelect) raceSelect.value = currentSettings.raceKey || '';
    });

    // Save settings
    if (btnSave) {
        btnSave.addEventListener('click', () => {
            const selectedRace = raceSelect?.value;
            if (selectedRace && RACES[selectedRace]) {
                saveRaceSettings(selectedRace);
            }
            modal.classList.remove('show');
        });
    }

    // Cancel
    if (btnCancel) {
        btnCancel.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

// ============================================
// Countdown & Today's Training
// ============================================

function updateCountdown() {
    const settings = getRaceSettings();
    const raceDate = new Date(settings.date);
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

    if (diff > 0) {
        if (daysEl) daysEl.textContent = days;
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minsEl) minsEl.textContent = mins.toString().padStart(2, '0');
        if (secsEl) secsEl.textContent = secs.toString().padStart(2, '0');
    } else {
        if (daysEl) daysEl.textContent = '0';
        if (hoursEl) hoursEl.textContent = '00';
        if (minsEl) minsEl.textContent = '00';
        if (secsEl) secsEl.textContent = '00';
    }
}

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

    if (todayLabel) todayLabel.textContent = isRandom ? '今日訓練預覽' : '今日訓練';

    if (training) {
        if (todayPhase) { todayPhase.textContent = training.phase; todayPhase.className = 'today-phase phase-' + training.phase; }
        if (todayIntensity) { todayIntensity.textContent = training.intensity; todayIntensity.className = 'today-intensity intensity-' + training.intensity; }
        if (todayDescription) todayDescription.textContent = training.content;

        if (todaySwim) { todaySwim.innerHTML = training.swim ? '<span class="stat-icon">🏊</span> ' + training.swim + ' km' : ''; todaySwim.style.display = training.swim ? 'inline-flex' : 'none'; }
        if (todayBike) { todayBike.innerHTML = training.bike ? '<span class="stat-icon">🚴</span> ' + training.bike + ' km' : ''; todayBike.style.display = training.bike ? 'inline-flex' : 'none'; }
        if (todayRun) { todayRun.innerHTML = training.run ? '<span class="stat-icon">🏃</span> ' + training.run + ' km' : ''; todayRun.style.display = training.run ? 'inline-flex' : 'none'; }
        if (todayHours) { todayHours.innerHTML = training.hours ? '<span class="stat-icon">⏱</span> ' + training.hours + ' h' : ''; todayHours.style.display = training.hours ? 'inline-flex' : 'none'; }

        if (todayNote) { todayNote.textContent = isRandom ? '※ 未到訓練日，隨機顯示' : ''; todayNote.style.display = isRandom ? 'block' : 'none'; }

        if (todayMotivation && trainingIndex >= 0) {
            const quote = getMotivationQuote(trainingIndex);
            if (quote) { todayMotivation.textContent = '💪 ' + quote; todayMotivation.style.display = 'block'; }
            else { todayMotivation.style.display = 'none'; }
        }

        if (todayActions && trainingIndex >= 0 && (training.swim || training.bike || training.run)) {
            // Use local timezone (Asia/Taipei) instead of UTC
            const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            todayActions.innerHTML = `<button class="btn-today-workout" onclick="showWorkoutModal(${trainingIndex}${isRandom ? `, '${todayISO}'` : ''})"><span class="btn-icon">📋</span>查看訓練 / 匯入 Garmin</button>`;
            todayActions.style.display = 'block';
        } else if (todayActions) {
            todayActions.style.display = 'none';
        }
    }
}

// ============================================
// Weekly Mileage Chart
// ============================================

function initWeeklyMileageChart() {
    const ctx = document.getElementById('weeklyMileageChart');
    if (!ctx) return;

    const weeklyData = {};
    trainingData.forEach(day => {
        const week = day.week;
        if (!weeklyData[week]) weeklyData[week] = { swim: 0, bike: 0, run: 0 };
        weeklyData[week].swim += parseFloat(day.swim) || 0;
        weeklyData[week].bike += parseFloat(day.bike) || 0;
        weeklyData[week].run += parseFloat(day.run) || 0;
    });

    const weeks = Object.keys(weeklyData).sort((a, b) => parseInt(a.replace('Week ', '')) - parseInt(b.replace('Week ', '')));
    const swimData = weeks.map(w => weeklyData[w].swim.toFixed(1));
    const bikeData = weeks.map(w => weeklyData[w].bike.toFixed(0));
    const runData = weeks.map(w => weeklyData[w].run.toFixed(1));
    const labels = weeks.map(w => w.replace('Week ', 'W'));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: '游泳 (km)', data: swimData, borderColor: '#0077be', backgroundColor: 'rgba(0, 119, 190, 0.1)', borderWidth: 3, fill: true, tension: 0.3, yAxisID: 'y1', pointBackgroundColor: '#0077be', pointRadius: 5, pointHoverRadius: 7 },
                { label: '自行車 (km)', data: bikeData, borderColor: '#f5a623', backgroundColor: 'rgba(245, 166, 35, 0.1)', borderWidth: 3, fill: true, tension: 0.3, yAxisID: 'y', pointBackgroundColor: '#f5a623', pointRadius: 5, pointHoverRadius: 7 },
                { label: '跑步 (km)', data: runData, borderColor: '#4caf50', backgroundColor: 'rgba(76, 175, 80, 0.1)', borderWidth: 3, fill: true, tension: 0.3, yAxisID: 'y', pointBackgroundColor: '#4caf50', pointRadius: 5, pointHoverRadius: 7 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { position: 'top', labels: { usePointStyle: true, padding: 20, font: { size: 14, family: "'Noto Sans TC', sans-serif" } } },
                tooltip: { backgroundColor: 'rgba(26, 26, 26, 0.9)', titleFont: { size: 14, family: "'Noto Sans TC', sans-serif" }, bodyFont: { size: 13, family: "'Noto Sans TC', sans-serif" }, padding: 12, callbacks: { label: ctx => ctx.dataset.label + ': ' + ctx.parsed.y + ' km' } }
            },
            scales: {
                x: { grid: { color: 'rgba(0, 0, 0, 0.05)' }, ticks: { font: { size: 12, family: "'Noto Sans TC', sans-serif" } } },
                y: { type: 'linear', display: true, position: 'left', title: { display: true, text: '自行車 / 跑步 (km)', font: { size: 13, family: "'Noto Sans TC', sans-serif" } }, grid: { color: 'rgba(0, 0, 0, 0.05)' }, ticks: { font: { size: 12 } }, min: 0 },
                y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: '游泳 (km)', color: '#0077be', font: { size: 13, family: "'Noto Sans TC', sans-serif" } }, grid: { drawOnChartArea: false }, ticks: { color: '#0077be', font: { size: 12 } }, min: 0 }
            }
        }
    });
}

// ============================================
// Initialize on DOM ready
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize race settings first
    updateRaceDisplay();
    initRaceSettingsModal();

    populateSchedule();
    updateSettingsDisplay();
    updateCountdown();
    displayTodayTraining();
    initWeeklyMileageChart();

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            populateSchedule(btn.dataset.filter);
        });
    });

    setInterval(updateCountdown, 1000);
});

document.addEventListener('click', (e) => {
    const modal = document.getElementById('workoutModal');
    if (e.target === modal) closeWorkoutModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeWorkoutModal();
        // Also close race settings modal
        const raceModal = document.getElementById('raceSettingsModal');
        if (raceModal) raceModal.classList.remove('show');
    }
});

// ============================================
// Garmin Functions (bound after all function definitions)
// ============================================
window.garminLogin = () => garminLogin(showWorkoutModal);
window.garminLogout = () => garminLogout(showWorkoutModal);

window.directImportToGarmin = (dayIndex) => {
    return _directImportToGarmin(dayIndex, trainingData, convertToGarminWorkout, showWorkoutModal);
};

window.importWithCredentials = (dayIndex) => {
    return _importWithCredentials(dayIndex, trainingData, convertToGarminWorkout, () => _clearLoginAndShowForm(showWorkoutModal), showWorkoutModal);
};

window.clearLoginAndShowForm = () => _clearLoginAndShowForm(showWorkoutModal);

window.submitMfaCode = () => _submitMfaCode(showWorkoutModal);

window.cancelMfa = () => _clearLoginAndShowForm(showWorkoutModal);
