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

// Note: Garmin functions are bound to window after function definitions (see end of file)

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

// Generate swim workout steps
function generateSwimSteps(totalDistance, content) {
    const steps = [];
    let stepOrder = 1;

    // Determine workout type from content
    const isRecovery = content.includes('恢復') || content.includes('輕鬆');
    const isTechnical = content.includes('技術') || content.includes('划頻') || content.includes('踢水');

    // Check for intervals pattern like "6x400m", "10x200m", "8x300m"
    const intervalMatch = content.match(/(\d+)\s*[xX×]\s*(\d+)\s*m/i);

    // Try to parse target pace from content like "@ 2:35/100m"
    const paceMatch = content.match(/@\s*(\d+):(\d+)\/100m/);
    let targetPaceZone = 'CSS';
    if (paceMatch) {
        const targetPace = parseInt(paceMatch[1]) * 60 + parseInt(paceMatch[2]);
        const cssRatio = targetPace / TRAINING_PARAMS.CSS_SEC;
        if (cssRatio >= 1.15) targetPaceZone = 'RECOVERY';
        else if (cssRatio >= 1.08) targetPaceZone = 'EASY';
        else if (cssRatio >= 1.02) targetPaceZone = 'AEROBIC';
        else if (cssRatio >= 0.97) targetPaceZone = 'CSS';
        else if (cssRatio >= 0.92) targetPaceZone = 'THRESHOLD';
        else targetPaceZone = 'SPRINT';
    }

    const warmupPace = getSwimPaceTarget('EASY');
    const mainPace = getSwimPaceTarget(targetPaceZone);
    const recoveryPace = getSwimPaceTarget('RECOVERY');

    function getRestTime(distance) {
        if (distance <= 100) return 15;
        if (distance <= 200) return 30;
        if (distance <= 300) return 40;
        if (distance <= 400) return 45;
        return 60;
    }

    if (intervalMatch) {
        const reps = parseInt(intervalMatch[1]);
        const distance = parseInt(intervalMatch[2]);
        const mainSetDistance = reps * distance;
        const restTime = getRestTime(distance);

        let warmupDistance = Math.round((totalDistance - mainSetDistance) / 2);
        let cooldownDistance = totalDistance - mainSetDistance - warmupDistance;

        if (warmupDistance < 300 && totalDistance > mainSetDistance + 300) {
            warmupDistance = 300;
            cooldownDistance = totalDistance - mainSetDistance - warmupDistance;
        }

        if (warmupDistance > 0) {
            steps.push({
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: warmupDistance,
                ...warmupPace
            });
        }

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 6, stepTypeKey: 'repeat' },
            numberOfIterations: reps,
            workoutSteps: [
                {
                    stepOrder: 1,
                    stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                    endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                    endConditionValue: distance,
                    ...mainPace
                },
                {
                    stepOrder: 2,
                    stepType: { stepTypeId: 4, stepTypeKey: 'rest' },
                    endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' },
                    endConditionValue: restTime,
                    targetType: { workoutTargetTypeId: 1, workoutTargetTypeKey: 'no.target' }
                }
            ]
        });

        if (cooldownDistance > 0) {
            steps.push({
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: cooldownDistance,
                ...recoveryPace
            });
        }

    } else if (isTechnical) {
        const warmupDistance = Math.round(totalDistance * 0.2);
        const drillDistance = Math.round(totalDistance * 0.4);
        const techniqueDistance = Math.round(totalDistance * 0.25);
        const cooldownDistance = totalDistance - warmupDistance - drillDistance - techniqueDistance;

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: warmupDistance,
            ...warmupPace
        });

        const drillReps = 4;
        const drillPerRep = Math.round(drillDistance / drillReps);
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 6, stepTypeKey: 'repeat' },
            numberOfIterations: drillReps,
            workoutSteps: [
                {
                    stepOrder: 1,
                    stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                    endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                    endConditionValue: drillPerRep,
                    targetType: { workoutTargetTypeId: 1, workoutTargetTypeKey: 'no.target' }
                },
                {
                    stepOrder: 2,
                    stepType: { stepTypeId: 4, stepTypeKey: 'rest' },
                    endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' },
                    endConditionValue: 20,
                    targetType: { workoutTargetTypeId: 1, workoutTargetTypeKey: 'no.target' }
                }
            ]
        });

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: techniqueDistance,
            ...getSwimPaceTarget('AEROBIC')
        });

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: cooldownDistance,
            ...recoveryPace
        });

    } else if (isRecovery) {
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: Math.round(totalDistance * 0.15),
            ...recoveryPace
        });
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: Math.round(totalDistance * 0.7),
            ...recoveryPace
        });
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: Math.round(totalDistance * 0.15),
            ...recoveryPace
        });

    } else {
        const warmupDistance = Math.round(totalDistance * 0.2);
        const mainDistance = Math.round(totalDistance * 0.6);
        const cooldownDistance = totalDistance - warmupDistance - mainDistance;

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: warmupDistance,
            ...warmupPace
        });
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: mainDistance,
            ...getSwimPaceTarget('AEROBIC')
        });
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: cooldownDistance,
            ...recoveryPace
        });
    }

    return steps;
}

// Generate bike workout steps
function generateBikeSteps(totalDistance, content) {
    const steps = [];
    let stepOrder = 1;

    // Determine workout type from content
    const isRecovery = content.includes('恢復') || content.includes('輕鬆');
    const isLongRide = totalDistance >= 100000 || content.includes('長距離');
    const hasBrick = content.includes('磚式') || content.includes('接續跑');
    const isRaceSimulation = content.includes('模擬賽') || content.includes('模擬');
    const hasFTP = content.includes('FTP') || (content.includes('測試') && !isRaceSimulation);
    const hasClimb = content.includes('爬坡');

    // Check for Sweet Spot intervals: "3x20分鐘 @ Sweet Spot"
    const ssMatch = content.match(/(\d+)\s*[xX×]\s*(\d+)\s*分鐘.*Sweet\s*Spot/i);
    // Check for FTP/threshold intervals
    const ftpMatch = content.match(/(\d+)\s*[xX×]\s*(\d+)\s*分鐘.*(?:FTP|閾值)/i);

    // Get power targets
    const z1Power = getPowerTarget('Z1');
    const z2Power = getPowerTarget('Z2');
    const z3Power = getPowerTarget('Z3');
    const ssPower = getPowerTarget('SS');
    const z4Power = getPowerTarget('Z4');

    // Get cadence targets
    const normalCadence = getCadenceTarget(85, 95);
    const highCadence = getCadenceTarget(95, 105);

    if (isRaceSimulation) {
        const warmupDistance = Math.min(10000, Math.round(totalDistance * 0.1));
        const cooldownDistance = Math.min(5000, Math.round(totalDistance * 0.05));
        const mainDistance = totalDistance - warmupDistance - cooldownDistance;

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: warmupDistance,
            ...z2Power,
            ...normalCadence
        });

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: mainDistance,
            ...z3Power,
            ...normalCadence
        });

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: cooldownDistance,
            ...z1Power
        });

    } else if (ssMatch) {
        const reps = parseInt(ssMatch[1]);
        const minutes = parseInt(ssMatch[2]);
        const warmupDistance = Math.round(totalDistance * 0.15);

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: warmupDistance,
            ...z2Power,
            ...normalCadence
        });

        // Activation spin-ups
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 6, stepTypeKey: 'repeat' },
            numberOfIterations: 3,
            workoutSteps: [
                {
                    stepOrder: 1,
                    stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                    endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' },
                    endConditionValue: 60,
                    ...z3Power,
                    ...highCadence
                },
                {
                    stepOrder: 2,
                    stepType: { stepTypeId: 4, stepTypeKey: 'rest' },
                    endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' },
                    endConditionValue: 60,
                    ...z1Power
                }
            ]
        });

        // Sweet Spot intervals
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 6, stepTypeKey: 'repeat' },
            numberOfIterations: reps,
            workoutSteps: [
                {
                    stepOrder: 1,
                    stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                    endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' },
                    endConditionValue: minutes * 60,
                    ...ssPower,
                    ...normalCadence
                },
                {
                    stepOrder: 2,
                    stepType: { stepTypeId: 4, stepTypeKey: 'rest' },
                    endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' },
                    endConditionValue: 300,
                    ...z1Power
                }
            ]
        });

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 1, conditionTypeKey: 'lap.button' },
            ...z1Power,
            ...normalCadence
        });

    } else if (ftpMatch || hasFTP) {
        const reps = ftpMatch ? parseInt(ftpMatch[1]) : 2;
        const minutes = ftpMatch ? parseInt(ftpMatch[2]) : 20;
        const warmupDistance = Math.round(totalDistance * 0.15);

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: warmupDistance,
            ...z2Power,
            ...normalCadence
        });

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 6, stepTypeKey: 'repeat' },
            numberOfIterations: 3,
            workoutSteps: [
                {
                    stepOrder: 1,
                    stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                    endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' },
                    endConditionValue: 30,
                    ...z4Power,
                    ...highCadence
                },
                {
                    stepOrder: 2,
                    stepType: { stepTypeId: 4, stepTypeKey: 'rest' },
                    endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' },
                    endConditionValue: 90,
                    ...z1Power
                }
            ]
        });

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 6, stepTypeKey: 'repeat' },
            numberOfIterations: reps,
            workoutSteps: [
                {
                    stepOrder: 1,
                    stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                    endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' },
                    endConditionValue: minutes * 60,
                    ...z4Power,
                    ...normalCadence
                },
                {
                    stepOrder: 2,
                    stepType: { stepTypeId: 4, stepTypeKey: 'rest' },
                    endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' },
                    endConditionValue: 600,
                    ...z1Power
                }
            ]
        });

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 1, conditionTypeKey: 'lap.button' },
            ...z1Power
        });

    } else if (isLongRide) {
        const warmupDistance = 10000;
        const cooldownDistance = 5000;
        const mainDistance = totalDistance - warmupDistance - cooldownDistance;

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: warmupDistance,
            ...z2Power,
            ...normalCadence
        });

        const numBlocks = Math.max(1, Math.floor(mainDistance / 30000));
        const blockDistance = Math.round(mainDistance / numBlocks);

        if (numBlocks > 1) {
            steps.push({
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 6, stepTypeKey: 'repeat' },
                numberOfIterations: numBlocks,
                workoutSteps: [
                    {
                        stepOrder: 1,
                        stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                        endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                        endConditionValue: blockDistance - 3000,
                        ...z2Power,
                        ...normalCadence
                    },
                    {
                        stepOrder: 2,
                        stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                        endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                        endConditionValue: 3000,
                        ...z3Power,
                        ...normalCadence
                    }
                ]
            });
        } else {
            steps.push({
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: mainDistance,
                ...z2Power,
                ...normalCadence
            });
        }

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: cooldownDistance,
            ...z1Power
        });

    } else if (isRecovery) {
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: Math.round(totalDistance * 0.1),
            ...z1Power,
            ...highCadence
        });
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: Math.round(totalDistance * 0.8),
            ...z1Power,
            ...highCadence
        });
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: Math.round(totalDistance * 0.1),
            ...z1Power
        });

    } else {
        const warmupDistance = Math.round(totalDistance * 0.1);
        const mainDistance = Math.round(totalDistance * 0.8);
        const cooldownDistance = totalDistance - warmupDistance - mainDistance;

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: warmupDistance,
            ...z2Power,
            ...normalCadence
        });
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: mainDistance,
            ...z2Power,
            ...normalCadence
        });
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: cooldownDistance,
            ...z1Power
        });
    }

    return steps;
}

// Generate run workout steps
function generateRunSteps(totalDistance, content) {
    const steps = [];
    let stepOrder = 1;

    // Determine workout type from content
    const isRecoveryRun = content.includes('恢復');
    const isEasyRun = content.includes('輕鬆');
    const isLongRun = totalDistance >= 15000 || content.includes('長跑');
    const isBrick = content.includes('磚式') || content.includes('接續跑') || content.includes('轉換');
    const isTempo = content.includes('節奏跑') || content.includes('T配速');
    const hasProgressive = content.includes('漸進') || content.includes('M配速') || content.includes('前');

    // Check for interval patterns
    const intervalKmMatch = content.match(/(\d+)\s*[xX×]\s*([\d.]+)\s*km/i);
    const intervalMMatch = content.match(/(\d+)\s*[xX×]\s*(\d+)\s*m(?!\w)/i);

    const contentPace = parseRunPaceFromContent(content);

    const easyPace = getRunPaceTarget('EASY');
    const longPace = getRunPaceTarget('LONG');
    const marathonPace = getRunPaceTarget('MARATHON');
    const tempoPace = getRunPaceTarget('TEMPO');
    const thresholdPace = getRunPaceTarget('THRESHOLD');
    const intervalPace = getRunPaceTarget('INTERVAL');
    const recoveryPace = getRunPaceTarget('RECOVERY');

    function getRestTime(distanceMeters) {
        if (distanceMeters <= 400) return 60;
        if (distanceMeters <= 800) return 90;
        if (distanceMeters <= 1000) return 90;
        if (distanceMeters <= 1200) return 120;
        return 120;
    }

    if (intervalKmMatch || intervalMMatch) {
        let reps, intervalDistance;
        if (intervalKmMatch) {
            reps = parseInt(intervalKmMatch[1]);
            intervalDistance = parseFloat(intervalKmMatch[2]) * 1000;
        } else {
            reps = parseInt(intervalMMatch[1]);
            intervalDistance = parseInt(intervalMMatch[2]);
        }
        const restTime = getRestTime(intervalDistance);
        let intervalTarget = contentPace || intervalPace;

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: 2000,
            ...easyPace
        });

        // Strides
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 6, stepTypeKey: 'repeat' },
            numberOfIterations: 4,
            workoutSteps: [
                {
                    stepOrder: 1,
                    stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                    endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                    endConditionValue: 100,
                    ...getRunPaceTarget('REP')
                },
                {
                    stepOrder: 2,
                    stepType: { stepTypeId: 4, stepTypeKey: 'rest' },
                    endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                    endConditionValue: 100,
                    targetType: { workoutTargetTypeId: 1, workoutTargetTypeKey: 'no.target' }
                }
            ]
        });

        // Main intervals
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 6, stepTypeKey: 'repeat' },
            numberOfIterations: reps,
            workoutSteps: [
                {
                    stepOrder: 1,
                    stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                    endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                    endConditionValue: intervalDistance,
                    ...intervalTarget
                },
                {
                    stepOrder: 2,
                    stepType: { stepTypeId: 4, stepTypeKey: 'rest' },
                    endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' },
                    endConditionValue: restTime,
                    targetType: { workoutTargetTypeId: 1, workoutTargetTypeKey: 'no.target' }
                }
            ]
        });

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: 2000,
            ...easyPace
        });

    } else if (isTempo) {
        const structuredWorkout = parseStructuredWorkout(content);

        if (structuredWorkout) {
            steps.push({
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: structuredWorkout.warmupDistance,
                ...easyPace
            });

            steps.push({
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: structuredWorkout.mainDistance,
                ...structuredWorkout.mainPace
            });

            steps.push({
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: structuredWorkout.cooldownDistance,
                ...easyPace
            });

        } else {
            const warmupDistance = 2000;
            const cooldownDistance = 2000;
            const tempoDistance = totalDistance - warmupDistance - cooldownDistance;

            steps.push({
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: warmupDistance,
                ...easyPace
            });

            steps.push({
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: tempoDistance,
                ...tempoPace
            });

            steps.push({
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: cooldownDistance,
                ...easyPace
            });
        }

    } else if (isBrick) {
        const targetPace = contentPace || marathonPace;
        const transitionDistance = 1000;
        const mainDistance = totalDistance - transitionDistance;

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: transitionDistance,
            ...easyPace
        });

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: mainDistance,
            ...targetPace
        });

    } else if (isLongRun) {
        const structuredRun = parseStructuredLongRun(content);

        if (structuredRun) {
            steps.push({
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: structuredRun.firstDistance,
                ...easyPace
            });

            steps.push({
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: structuredRun.middleDistance,
                ...structuredRun.middlePace
            });

            steps.push({
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: structuredRun.lastDistance,
                ...easyPace
            });

        } else {
            const warmupDistance = 2000;
            const cooldownDistance = 2000;
            const mainDistance = totalDistance - warmupDistance - cooldownDistance;
            const mainPace = contentPace || longPace;

            steps.push({
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: warmupDistance,
                ...easyPace
            });
            steps.push({
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: mainDistance,
                ...mainPace
            });
            steps.push({
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: cooldownDistance,
                ...easyPace
            });
        }

    } else if (isRecoveryRun || isEasyRun) {
        const defaultPace = isRecoveryRun ? recoveryPace : easyPace;
        const targetPace = contentPace || defaultPace;

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: Math.round(totalDistance * 0.1),
            ...targetPace
        });
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: Math.round(totalDistance * 0.8),
            ...targetPace
        });
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: Math.round(totalDistance * 0.1),
            ...targetPace
        });

    } else {
        const targetPace = contentPace || easyPace;
        const warmupDistance = Math.round(totalDistance * 0.1);
        const mainDistance = Math.round(totalDistance * 0.8);
        const cooldownDistance = totalDistance - warmupDistance - mainDistance;

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: warmupDistance,
            ...targetPace
        });
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: mainDistance,
            ...targetPace
        });
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: cooldownDistance,
            ...targetPace
        });
    }

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

// Show workout modal (follows original script.js layout)
function showWorkoutModal(dayIndex, overrideDate = null) {
    window.currentWorkoutDayIndex = dayIndex;
    window.currentWorkoutOverrideDate = overrideDate;

    const training = trainingData[dayIndex];
    if (!training) return;

    const modal = document.getElementById('workoutModal');
    const modalContent = document.getElementById('workoutModalContent');
    if (!modal || !modalContent) return;

    const workouts = convertToGarminWorkout(training, dayIndex, overrideDate);

    // Show scheduled date info (if override date is used)
    const scheduledDateObj = overrideDate ? new Date(overrideDate) : new Date(training.date);
    const scheduledDateStr = `${scheduledDateObj.getFullYear()}/${scheduledDateObj.getMonth() + 1}/${scheduledDateObj.getDate()}`;
    const isOverride = overrideDate && overrideDate !== training.date;

    // Get motivation quote for this training day
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
            // Store workout data for download functions
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

    // Check for stored token and user info
    const storedToken = getGarminToken();
    const hasValidToken = storedToken && !isTokenExpired(storedToken);
    const storedUser = getGarminUser();

    // Garmin Connect section - with token auto-login support
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
                                <button class="btn-garmin-import" onclick="importWithToken(${dayIndex})">
                                    直接匯入訓練
                                </button>
                                <button class="btn-garmin-logout-small" onclick="clearTokenAndShowLogin()">
                                    登出
                                </button>
                            </div>
                        ` : `
                            <div class="garmin-login-form" id="garminLoginForm">
                                <input type="email" id="garminEmail" placeholder="Garmin Email" class="garmin-input">
                                <input type="password" id="garminPassword" placeholder="密碼" class="garmin-input">
                                <button class="btn-garmin-import" onclick="directImportToGarmin(${dayIndex})">
                                    登入並匯入訓練
                                </button>
                            </div>
                        `}
                    </div>
                ` : ''}
                <div id="garminStatus" class="garmin-status"></div>
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

// ============================================
// Trainer File Formats (ZWO, ERG)
// ============================================

// Convert Garmin workout to Zwift ZWO format (XML)
function convertToZWO(workout) {
    const steps = workout.workoutSegments[0]?.workoutSteps || [];
    const FTP = TRAINING_PARAMS.FTP;

    function powerToFTP(watts) {
        return (watts / FTP).toFixed(2);
    }

    function getStepPower(step) {
        if (step.targetValueOne && step.targetValueTwo) {
            return (step.targetValueOne + step.targetValueTwo) / 2;
        }
        return FTP * 0.65;
    }

    function getStepPowerRange(step) {
        if (step.targetValueOne && step.targetValueTwo) {
            return { low: step.targetValueOne, high: step.targetValueTwo };
        }
        return { low: FTP * 0.55, high: FTP * 0.75 };
    }

    let zwoContent = `<workout_file>
    <author>DTSwiss Ironman Taiwan 2026</author>
    <name>${escapeXml(workout.workoutName)}</name>
    <description>${escapeXml(workout.description || '')}</description>
    <sportType>bike</sportType>
    <workout>
`;

    steps.forEach(step => {
        const stepType = step.stepType?.stepTypeKey;
        const duration = step.endConditionValue || 300;
        const isTime = step.endCondition?.conditionTypeKey === 'time';
        const isDistance = step.endCondition?.conditionTypeKey === 'distance';

        let durationSecs;
        if (isTime) {
            durationSecs = duration;
        } else if (isDistance) {
            durationSecs = Math.round(duration / 1000 * 120);
        } else {
            durationSecs = 300;
        }

        if (stepType === 'repeat' && step.workoutSteps) {
            const reps = step.numberOfIterations || 1;
            const childSteps = step.workoutSteps;

            if (childSteps.length >= 2) {
                const workStep = childSteps[0];
                const restStep = childSteps[1];
                const workDuration = workStep.endConditionValue || 300;
                const restDuration = restStep.endConditionValue || 60;
                const workIsTime = workStep.endCondition?.conditionTypeKey === 'time';
                const restIsTime = restStep.endCondition?.conditionTypeKey === 'time';
                let onDuration = workIsTime ? workDuration : Math.round(workDuration / 1000 * 120);
                let offDuration = restIsTime ? restDuration : Math.round(restDuration / 1000 * 120);
                const onPower = powerToFTP(getStepPower(workStep));
                const offPower = powerToFTP(getStepPower(restStep));
                zwoContent += `        <IntervalsT Repeat="${reps}" OnDuration="${onDuration}" OffDuration="${offDuration}" OnPower="${onPower}" OffPower="${offPower}"/>\n`;
            }
        } else if (stepType === 'warmup') {
            const powerRange = getStepPowerRange(step);
            zwoContent += `        <Warmup Duration="${durationSecs}" PowerLow="${powerToFTP(powerRange.low * 0.8)}" PowerHigh="${powerToFTP(powerRange.high)}"/>\n`;
        } else if (stepType === 'cooldown') {
            const powerRange = getStepPowerRange(step);
            zwoContent += `        <Cooldown Duration="${durationSecs}" PowerLow="${powerToFTP(powerRange.high)}" PowerHigh="${powerToFTP(powerRange.low * 0.8)}"/>\n`;
        } else if (stepType === 'interval' || stepType === 'active') {
            const power = powerToFTP(getStepPower(step));
            zwoContent += `        <SteadyState Duration="${durationSecs}" Power="${power}"/>\n`;
        } else if (stepType === 'rest' || stepType === 'recovery') {
            zwoContent += `        <SteadyState Duration="${durationSecs}" Power="0.50"/>\n`;
        }
    });

    zwoContent += `    </workout>
</workout_file>`;

    return zwoContent;
}

// Convert Garmin workout to ERG/MRC format
function convertToERG(workout) {
    const steps = workout.workoutSegments[0]?.workoutSteps || [];
    const FTP = TRAINING_PARAMS.FTP;

    function getStepPower(step) {
        if (step.targetValueOne && step.targetValueTwo) {
            return Math.round((step.targetValueOne + step.targetValueTwo) / 2);
        }
        return Math.round(FTP * 0.65);
    }

    let ergContent = `[COURSE HEADER]
VERSION = 2
UNITS = ENGLISH
DESCRIPTION = ${workout.description || workout.workoutName}
FILE NAME = ${workout.workoutName}
FTP = ${FTP}
MINUTES WATTS
[END COURSE HEADER]
[COURSE DATA]
`;

    let currentTime = 0;

    function processStep(step) {
        const stepType = step.stepType?.stepTypeKey;
        const duration = step.endConditionValue || 300;
        const isTime = step.endCondition?.conditionTypeKey === 'time';
        const isDistance = step.endCondition?.conditionTypeKey === 'distance';

        let durationMins;
        if (isTime) {
            durationMins = duration / 60;
        } else if (isDistance) {
            durationMins = (duration / 1000) * 2;
        } else {
            durationMins = 5;
        }

        if (stepType === 'repeat' && step.workoutSteps) {
            const reps = step.numberOfIterations || 1;
            for (let i = 0; i < reps; i++) {
                step.workoutSteps.forEach(childStep => processStep(childStep));
            }
        } else {
            let power;
            if (stepType === 'warmup') {
                const startPower = Math.round(FTP * 0.45);
                const endPower = getStepPower(step);
                ergContent += `${currentTime.toFixed(2)}\t${startPower}\n`;
                currentTime += durationMins;
                ergContent += `${currentTime.toFixed(2)}\t${endPower}\n`;
            } else if (stepType === 'cooldown') {
                const startPower = getStepPower(step);
                const endPower = Math.round(FTP * 0.40);
                ergContent += `${currentTime.toFixed(2)}\t${startPower}\n`;
                currentTime += durationMins;
                ergContent += `${currentTime.toFixed(2)}\t${endPower}\n`;
            } else if (stepType === 'rest' || stepType === 'recovery') {
                power = Math.round(FTP * 0.50);
                ergContent += `${currentTime.toFixed(2)}\t${power}\n`;
                currentTime += durationMins;
                ergContent += `${currentTime.toFixed(2)}\t${power}\n`;
            } else {
                power = getStepPower(step);
                ergContent += `${currentTime.toFixed(2)}\t${power}\n`;
                currentTime += durationMins;
                ergContent += `${currentTime.toFixed(2)}\t${power}\n`;
            }
        }
    }

    steps.forEach(step => processStep(step));
    ergContent += `[END COURSE DATA]`;

    return ergContent;
}

// Download workout as ZWO file
function downloadWorkoutZWO(idx, filename) {
    const workout = window[`workoutData_${idx}`];
    if (!workout) return;
    const zwo = convertToZWO(workout);
    const blob = new Blob([zwo], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}.zwo`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

window.downloadWorkoutZWO = downloadWorkoutZWO;

// Download workout as ERG file
function downloadWorkoutERG(idx, filename) {
    const workout = window[`workoutData_${idx}`];
    if (!workout) return;
    const erg = convertToERG(workout);
    const blob = new Blob([erg], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}.erg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

window.downloadWorkoutERG = downloadWorkoutERG;

// ============================================
// Workout Steps Visualization
// ============================================

// Render workout steps preview (Garmin style)
function renderStepsPreview(workout, sportType) {
    const steps = workout.workoutSegments?.[0]?.workoutSteps || [];
    if (steps.length === 0) return '';

    let html = `<div class="steps-preview"><div class="steps-header">訓練步驟</div>`;

    steps.forEach(step => {
        html += renderStep(step, sportType);
    });

    html += `</div>`;
    return html;
}

// Render a single step or repeat group
function renderStep(step, sportType) {
    const stepType = step.stepType?.stepTypeKey || 'interval';

    if (stepType === 'repeat' && step.workoutSteps) {
        // Render repeat group
        return renderRepeatGroup(step, sportType);
    }

    // Render single step
    const typeClass = `step-type-${stepType}`;
    const colorClass = stepType;
    const label = getStepLabel(stepType);
    const duration = formatStepDuration(step);
    const target = formatStepTarget(step, sportType);

    let html = `
        <div class="step-item ${typeClass}">
            <div class="step-color-bar ${colorClass}"></div>
            <div class="step-content">
                <div class="step-label">${label}</div>
                <div class="step-duration">${duration}</div>
                ${target ? `<div class="step-target">${target}</div>` : ''}
                ${step.description ? `<div class="step-description">${step.description}</div>` : ''}
            </div>
        </div>
    `;
    return html;
}

// Render a repeat group with nested steps
function renderRepeatGroup(step, sportType) {
    const reps = step.numberOfIterations || 1;
    const childSteps = step.workoutSteps || [];

    let html = `
        <div class="step-repeat-group">
            <div class="repeat-header">
                <span class="repeat-times">${reps}x</span>
                <span>重複訓練</span>
                ${step.description ? `<span class="repeat-description">- ${step.description}</span>` : ''}
            </div>
            <div class="repeat-steps">
    `;

    childSteps.forEach(childStep => {
        html += renderStep(childStep, sportType);
    });

    html += `</div></div>`;
    return html;
}

// Get human-readable step label
function getStepLabel(stepType) {
    const labels = {
        'warmup': '熱身',
        'cooldown': '緩和',
        'interval': '主課表',
        'rest': '休息',
        'recovery': '恢復',
        'active': '動態恢復'
    };
    return labels[stepType] || stepType;
}

// Format step duration
function formatStepDuration(step) {
    const condition = step.endCondition?.conditionTypeKey;
    const value = step.endConditionValue;

    if (!condition || !value) return '';

    if (condition === 'distance') {
        if (value >= 1000) {
            return `${(value / 1000).toFixed(1)} km`;
        }
        return `${value} m`;
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

// Format step target (power/pace)
function formatStepTarget(step, sportType) {
    const targetType = step.targetType?.workoutTargetTypeKey;
    const v1 = step.targetValueOne;
    const v2 = step.targetValueTwo;

    if (!targetType || targetType === 'no.target') return '';

    if (targetType === 'power.zone' && v1 && v2) {
        return `功率: ${Math.round(v1)}-${Math.round(v2)} W`;
    } else if (targetType === 'speed.zone' && v1 && v2) {
        // Convert m/s to pace
        if (sportType === 'swim') {
            const pace1 = Math.round(100 / v2);  // faster
            const pace2 = Math.round(100 / v1);  // slower
            return `配速: ${formatPace(pace1)}-${formatPace(pace2)}/100m`;
        } else {
            const pace1 = Math.round(1000 / v2);  // faster
            const pace2 = Math.round(1000 / v1);  // slower
            return `配速: ${formatPace(pace1)}-${formatPace(pace2)}/km`;
        }
    } else if (targetType === 'pace.zone' && v1 && v2) {
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

    // Add cadence if present
    let result = '';
    if (step.secondaryTargetType?.workoutTargetTypeKey === 'cadence.zone') {
        const c1 = step.secondaryTargetValueOne;
        const c2 = step.secondaryTargetValueTwo;
        if (c1 && c2) {
            result += `迴轉速: ${c1}-${c2} rpm`;
        }
    }
    return result;
}

// Note: formatPace and toEnglishFilename are imported from utils.js

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

// ============================================
// Garmin Functions (bound after all function definitions)
// ============================================
window.garminLogin = () => garminLogin(showWorkoutModal);
window.garminLogout = () => garminLogout(showWorkoutModal);
window.directImportToGarmin = async (dayIndex) => {
    try {
        alert(`DEBUG: directImportToGarmin called with dayIndex=${dayIndex}, trainingData=${typeof trainingData}, convertToGarminWorkout=${typeof convertToGarminWorkout}, showWorkoutModal=${typeof showWorkoutModal}`);
        await directImportToGarmin(dayIndex, trainingData, convertToGarminWorkout, showWorkoutModal);
    } catch (err) {
        alert(`directImportToGarmin ERROR: ${err.message}\n\nStack: ${err.stack}`);
    }
};
window.importWithToken = async (dayIndex) => {
    try {
        alert(`DEBUG: importWithToken called with dayIndex=${dayIndex}, trainingData=${typeof trainingData}, convertToGarminWorkout=${typeof convertToGarminWorkout}`);
        await importWithToken(dayIndex, trainingData, convertToGarminWorkout, () => clearTokenAndShowLogin(showWorkoutModal));
    } catch (err) {
        alert(`importWithToken ERROR: ${err.message}\n\nStack: ${err.stack}`);
    }
};
window.clearTokenAndShowLogin = () => clearTokenAndShowLogin(showWorkoutModal);
