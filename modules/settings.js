import { TRAINING_PARAMS, formatSecondsToPace, parsePaceToSeconds } from './paceZones.js';

// Save user settings to localStorage and refresh workouts
export function saveUserSettings() {
    const ftpInput = document.getElementById('userFTP');
    const runPaceInput = document.getElementById('userRunPace');
    const swimCSSInput = document.getElementById('userSwimCSS');

    if (ftpInput.value) {
        localStorage.setItem('userFTP', ftpInput.value);
        TRAINING_PARAMS.FTP = parseInt(ftpInput.value);
    }
    if (runPaceInput.value) {
        localStorage.setItem('userRunPace', runPaceInput.value);
        TRAINING_PARAMS.MARATHON_PACE_SEC = parsePaceToSeconds(runPaceInput.value);
    }
    if (swimCSSInput.value) {
        localStorage.setItem('userSwimCSS', swimCSSInput.value);
        TRAINING_PARAMS.CSS_SEC = parsePaceToSeconds(swimCSSInput.value);
    }

    // Update banner display values
    const displayFTP = document.getElementById('displayFTP');
    const displayRunPace = document.getElementById('displayRunPace');
    const displayCSS = document.getElementById('displayCSS');

    if (displayFTP) displayFTP.textContent = TRAINING_PARAMS.FTP;
    if (displayRunPace) displayRunPace.textContent = formatSecondsToPace(TRAINING_PARAMS.MARATHON_PACE_SEC);
    if (displayCSS) displayCSS.textContent = formatSecondsToPace(TRAINING_PARAMS.CSS_SEC);

    // Hide settings panel
    const panel = document.getElementById('settingsPanel');
    if (panel) panel.style.display = 'none';

    // Show confirmation message
    const msgEl = document.getElementById('settingsSavedMessage');
    if (msgEl) {
        msgEl.innerHTML = `✓ 設定已儲存！<br><small>FTP: ${TRAINING_PARAMS.FTP}W | 馬拉松配速: ${formatSecondsToPace(TRAINING_PARAMS.MARATHON_PACE_SEC)}/km | CSS: ${formatSecondsToPace(TRAINING_PARAMS.CSS_SEC)}/100m</small>`;
        msgEl.classList.add('show');
        setTimeout(() => msgEl.classList.remove('show'), 5000);
    }

    console.log('Settings saved:', TRAINING_PARAMS);
}

// Toggle settings panel visibility
export function toggleSettingsPanel() {
    const panel = document.getElementById('settingsPanel');
    if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
}

// Update settings display on page load
export function updateSettingsDisplay() {
    const ftpInput = document.getElementById('userFTP');
    const runPaceInput = document.getElementById('userRunPace');
    const swimCSSInput = document.getElementById('userSwimCSS');

    if (ftpInput) ftpInput.value = TRAINING_PARAMS.FTP;
    if (runPaceInput) runPaceInput.value = formatSecondsToPace(TRAINING_PARAMS.MARATHON_PACE_SEC);
    if (swimCSSInput) swimCSSInput.value = formatSecondsToPace(TRAINING_PARAMS.CSS_SEC);

    const displayFTP = document.getElementById('displayFTP');
    const displayRunPace = document.getElementById('displayRunPace');
    const displayCSS = document.getElementById('displayCSS');

    if (displayFTP) displayFTP.textContent = TRAINING_PARAMS.FTP;
    if (displayRunPace) displayRunPace.textContent = formatSecondsToPace(TRAINING_PARAMS.MARATHON_PACE_SEC);
    if (displayCSS) displayCSS.textContent = formatSecondsToPace(TRAINING_PARAMS.CSS_SEC);
}
