// ===========================================
// Training Parameters (使用者自訂或預設值)
// ===========================================

// Helper to parse pace string "M:SS" to seconds
export function parsePaceToSeconds(paceStr) {
    if (!paceStr) return null;
    const parts = paceStr.split(':');
    if (parts.length !== 2) return null;
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

// Helper to format seconds to pace string "M:SS"
export function formatSecondsToPace(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Get training params from localStorage or use defaults
export function getTrainingParams() {
    const storedFTP = localStorage.getItem('userFTP');
    const storedRunPace = localStorage.getItem('userRunPace');
    const storedSwimCSS = localStorage.getItem('userSwimCSS');

    return {
        FTP: storedFTP ? parseInt(storedFTP) : 190,
        MARATHON_PACE_SEC: storedRunPace ? parsePaceToSeconds(storedRunPace) : 270,
        CSS_SEC: storedSwimCSS ? parsePaceToSeconds(storedSwimCSS) : 150
    };
}

// Dynamic TRAINING_PARAMS that reads from localStorage
export const TRAINING_PARAMS = getTrainingParams();

// Power Zones (based on FTP)
export const POWER_ZONES = {
    Z1: { min: 0.45, max: 0.55, name: 'Recovery' },
    Z2: { min: 0.55, max: 0.75, name: 'Endurance' },
    Z3: { min: 0.75, max: 0.88, name: 'Tempo' },
    SS: { min: 0.88, max: 0.94, name: 'Sweet Spot' },
    Z4: { min: 0.94, max: 1.05, name: 'Threshold' },
    Z5: { min: 1.05, max: 1.20, name: 'VO2max' }
};

// Run Pace Zones (based on Marathon Pace)
export const RUN_PACE_ZONES = {
    RECOVERY: 1.50,
    EASY: 1.15,
    LONG: 1.10,
    MARATHON: 1.00,
    TEMPO: 0.95,
    THRESHOLD: 0.92,
    INTERVAL: 0.85,
    REP: 0.80
};

// Swim Pace Zones (based on CSS)
export const SWIM_PACE_ZONES = {
    RECOVERY: 1.20,
    EASY: 1.10,
    AEROBIC: 1.05,
    CSS: 1.00,
    THRESHOLD: 0.95,
    SPRINT: 0.90
};

// ===========================================
// Pace/Power Calculation Helpers
// ===========================================

// Convert run pace (seconds/km) to speed (m/s) for Garmin API
export function runPaceToSpeed(paceSecondsPerKm) {
    return 1000 / paceSecondsPerKm;
}

// Get run pace target object for Garmin API
export function getRunPaceTarget(zone) {
    const multiplier = RUN_PACE_ZONES[zone] || RUN_PACE_ZONES.EASY;
    const paceSeconds = TRAINING_PARAMS.MARATHON_PACE_SEC * multiplier;
    const fastPace = paceSeconds * 0.95;
    const slowPace = paceSeconds * 1.05;
    return {
        targetType: { workoutTargetTypeId: 5, workoutTargetTypeKey: 'speed.zone' },
        targetValueOne: runPaceToSpeed(slowPace),
        targetValueTwo: runPaceToSpeed(fastPace)
    };
}

// Get run pace target from specific pace in seconds
export function getRunPaceFromSeconds(paceSeconds, variancePercent = 5) {
    const fastPace = paceSeconds * (1 - variancePercent / 100);
    const slowPace = paceSeconds * (1 + variancePercent / 100);
    return {
        targetType: { workoutTargetTypeId: 5, workoutTargetTypeKey: 'speed.zone' },
        targetValueOne: runPaceToSpeed(slowPace),
        targetValueTwo: runPaceToSpeed(fastPace)
    };
}

// Parse pace from content like "@ 6:40/km"
export function parseRunPaceFromContent(content) {
    const paceMatch = content.match(/@\s*(\d+):(\d+)\/km/);
    if (paceMatch) {
        const paceSeconds = parseInt(paceMatch[1]) * 60 + parseInt(paceMatch[2]);
        return getRunPaceFromSeconds(paceSeconds);
    }
    return null;
}

// Parse structured long run description
export function parseStructuredLongRun(content) {
    const firstMatch = content.match(/前\s*([\d.]+)\s*km/i);
    const middleMatch = content.match(/中段\s*([\d.]+)\s*km\s*@\s*(\d+):(\d+)\/km/i);
    const lastMatch = content.match(/最後\s*([\d.]+)\s*km/i);

    if (firstMatch && middleMatch && lastMatch) {
        const firstKm = parseFloat(firstMatch[1]);
        const middleKm = parseFloat(middleMatch[1]);
        const middlePaceSec = parseInt(middleMatch[2]) * 60 + parseInt(middleMatch[3]);
        const lastKm = parseFloat(lastMatch[1]);

        return {
            firstDistance: firstKm * 1000,
            middleDistance: middleKm * 1000,
            middlePace: getRunPaceFromSeconds(middlePaceSec),
            lastDistance: lastKm * 1000
        };
    }
    return null;
}

// Parse structured workout with warmup/main/cooldown
export function parseStructuredWorkout(content) {
    const warmupMatch = content.match(/熱身\s*([\d.]+)\s*km/i);
    const mainMatch = content.match(/[\+\s]\s*([\d.]+)\s*km\s*@\s*(\d+):(\d+)\/km/i);
    const cooldownMatch = content.match(/緩和\s*([\d.]+)\s*km/i);

    if (warmupMatch && mainMatch && cooldownMatch) {
        const warmupKm = parseFloat(warmupMatch[1]);
        const mainKm = parseFloat(mainMatch[1]);
        const mainPaceSec = parseInt(mainMatch[2]) * 60 + parseInt(mainMatch[3]);
        const cooldownKm = parseFloat(cooldownMatch[1]);

        return {
            warmupDistance: warmupKm * 1000,
            mainDistance: mainKm * 1000,
            mainPace: getRunPaceFromSeconds(mainPaceSec),
            cooldownDistance: cooldownKm * 1000
        };
    }
    return null;
}

// Convert swim pace (seconds/100m) to speed (m/s)
export function swimPaceToSpeed(paceSecondsPer100m) {
    return 100 / paceSecondsPer100m;
}

// Get swim pace target object for Garmin API
export function getSwimPaceTarget(zone) {
    const multiplier = SWIM_PACE_ZONES[zone] || SWIM_PACE_ZONES.CSS;
    const paceSeconds = TRAINING_PARAMS.CSS_SEC * multiplier;
    const fastPace = paceSeconds * 0.97;
    const slowPace = paceSeconds * 1.03;
    return {
        targetType: { workoutTargetTypeId: 5, workoutTargetTypeKey: 'speed.zone' },
        targetValueOne: swimPaceToSpeed(slowPace),
        targetValueTwo: swimPaceToSpeed(fastPace)
    };
}

// Get power target object for Garmin API
export function getPowerTarget(zone) {
    const zoneData = POWER_ZONES[zone] || POWER_ZONES.Z2;
    const minWatts = Math.round(TRAINING_PARAMS.FTP * zoneData.min);
    const maxWatts = Math.round(TRAINING_PARAMS.FTP * zoneData.max);
    return {
        targetType: { workoutTargetTypeId: 2, workoutTargetTypeKey: 'power.zone' },
        targetValueOne: minWatts,
        targetValueTwo: maxWatts
    };
}

// Get cadence secondary target for cycling
export function getCadenceTarget(minRpm, maxRpm) {
    return {
        secondaryTargetType: { workoutTargetTypeId: 3, workoutTargetTypeKey: 'cadence.zone' },
        secondaryTargetValueOne: minRpm,
        secondaryTargetValueTwo: maxRpm
    };
}

// Parse pace string like "2:30/100m" or "4:30/km" to seconds
export function parsePaceString(paceStr) {
    const match = paceStr.match(/(\d+):(\d+)/);
    if (match) {
        return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return null;
}
