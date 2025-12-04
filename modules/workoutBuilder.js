// Workout Builder Module - Generates Garmin workout steps for swim/bike/run

import {
    TRAINING_PARAMS,
    getSwimPaceTarget, getPowerTarget, getCadenceTarget,
    getRunPaceTarget, parseRunPaceFromContent,
    parseStructuredLongRun, parseStructuredWorkout
} from './paceZones.js';

let stepIdCounter = 1;

export function resetStepIdCounter() {
    stepIdCounter = 1;
}

// Extract workout description for specific sport
export function extractWorkoutPart(content, sport) {
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
export function formatStep(step) {
    const isRepeatGroup = step.stepType?.stepTypeKey === 'repeat' && step.workoutSteps;

    const formatted = {
        type: isRepeatGroup ? 'RepeatGroupDTO' : 'ExecutableStepDTO',
        stepId: stepIdCounter++,
        stepOrder: step.stepOrder || 1,
        childStepId: null,
        stepType: step.stepType || { stepTypeId: 3, stepTypeKey: 'interval' },
        endCondition: step.endCondition,
        targetType: step.targetType || { workoutTargetTypeId: 1, workoutTargetTypeKey: 'no.target' }
    };

    if (step.endConditionValue !== undefined) {
        formatted.endConditionValue = step.endConditionValue;
    }
    if (step.targetValueOne !== undefined) {
        formatted.targetValueOne = step.targetValueOne;
    }
    if (step.targetValueTwo !== undefined) {
        formatted.targetValueTwo = step.targetValueTwo;
    }
    if (step.secondaryTargetType) {
        formatted.secondaryTargetType = step.secondaryTargetType;
        formatted.secondaryTargetValueOne = step.secondaryTargetValueOne;
        formatted.secondaryTargetValueTwo = step.secondaryTargetValueTwo;
    }
    if (step.description) {
        formatted.description = step.description;
    }

    // Handle repeat groups - MUST remove incompatible fields
    if (isRepeatGroup) {
        formatted.numberOfIterations = step.numberOfIterations || 2;
        formatted.workoutSteps = step.workoutSteps.map(s => formatStep(s));
        delete formatted.endCondition;
        delete formatted.targetType;
    }

    return formatted;
}

// Generate swim workout steps
export function generateSwimSteps(totalDistance, content) {
    const steps = [];
    let stepOrder = 1;

    const isRecovery = content.includes('恢復') || content.includes('輕鬆');
    const isTechnical = content.includes('技術') || content.includes('划頻') || content.includes('踢水');
    const intervalMatch = content.match(/(\d+)\s*[xX×]\s*(\d+)\s*m/i);

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
                    stepType: { stepTypeId: 5, stepTypeKey: 'rest' },
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
                    stepType: { stepTypeId: 5, stepTypeKey: 'rest' },
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
export function generateBikeSteps(totalDistance, content) {
    const steps = [];
    let stepOrder = 1;

    const isRecovery = content.includes('恢復') || content.includes('輕鬆');
    const isLongRide = totalDistance >= 100000 || content.includes('長距離');
    const isRaceSimulation = content.includes('模擬賽') || content.includes('模擬');
    const hasFTP = content.includes('FTP') || (content.includes('測試') && !isRaceSimulation);

    const ssMatch = content.match(/(\d+)\s*[xX×]\s*(\d+)\s*分鐘.*Sweet\s*Spot/i);
    const ftpMatch = content.match(/(\d+)\s*[xX×]\s*(\d+)\s*分鐘.*(?:FTP|閾值)/i);

    const z1Power = getPowerTarget('Z1');
    const z2Power = getPowerTarget('Z2');
    const z3Power = getPowerTarget('Z3');
    const ssPower = getPowerTarget('SS');
    const z4Power = getPowerTarget('Z4');

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
            ...z2Power, ...normalCadence
        });
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: mainDistance,
            ...z3Power, ...normalCadence
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
            ...z2Power, ...normalCadence
        });

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 6, stepTypeKey: 'repeat' },
            numberOfIterations: 3,
            workoutSteps: [
                { stepOrder: 1, stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                  endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' }, endConditionValue: 60,
                  ...z3Power, ...highCadence },
                { stepOrder: 2, stepType: { stepTypeId: 5, stepTypeKey: 'rest' },
                  endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' }, endConditionValue: 60,
                  ...z1Power }
            ]
        });

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 6, stepTypeKey: 'repeat' },
            numberOfIterations: reps,
            workoutSteps: [
                { stepOrder: 1, stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                  endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' }, endConditionValue: minutes * 60,
                  ...ssPower, ...normalCadence },
                { stepOrder: 2, stepType: { stepTypeId: 5, stepTypeKey: 'rest' },
                  endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' }, endConditionValue: 300,
                  ...z1Power }
            ]
        });

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 1, conditionTypeKey: 'lap.button' },
            ...z1Power, ...normalCadence
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
            ...z2Power, ...normalCadence
        });

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 6, stepTypeKey: 'repeat' },
            numberOfIterations: 3,
            workoutSteps: [
                { stepOrder: 1, stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                  endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' }, endConditionValue: 30,
                  ...z4Power, ...highCadence },
                { stepOrder: 2, stepType: { stepTypeId: 5, stepTypeKey: 'rest' },
                  endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' }, endConditionValue: 90,
                  ...z1Power }
            ]
        });

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 6, stepTypeKey: 'repeat' },
            numberOfIterations: reps,
            workoutSteps: [
                { stepOrder: 1, stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                  endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' }, endConditionValue: minutes * 60,
                  ...z4Power, ...normalCadence },
                { stepOrder: 2, stepType: { stepTypeId: 5, stepTypeKey: 'rest' },
                  endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' }, endConditionValue: 600,
                  ...z1Power }
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
            ...z2Power, ...normalCadence
        });

        const numBlocks = Math.max(1, Math.floor(mainDistance / 30000));
        const blockDistance = Math.round(mainDistance / numBlocks);

        if (numBlocks > 1) {
            steps.push({
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 6, stepTypeKey: 'repeat' },
                numberOfIterations: numBlocks,
                workoutSteps: [
                    { stepOrder: 1, stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                      endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' }, endConditionValue: blockDistance - 3000,
                      ...z2Power, ...normalCadence },
                    { stepOrder: 2, stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                      endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' }, endConditionValue: 3000,
                      ...z3Power, ...normalCadence }
                ]
            });
        } else {
            steps.push({
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: mainDistance,
                ...z2Power, ...normalCadence
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
            ...z1Power, ...highCadence
        });
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: Math.round(totalDistance * 0.8),
            ...z1Power, ...highCadence
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
            ...z2Power, ...normalCadence
        });
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: mainDistance,
            ...z2Power, ...normalCadence
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
export function generateRunSteps(totalDistance, content) {
    const steps = [];
    let stepOrder = 1;

    const isRecoveryRun = content.includes('恢復');
    const isEasyRun = content.includes('輕鬆');
    const isLongRun = totalDistance >= 15000 || content.includes('長跑');
    const isBrick = content.includes('磚式') || content.includes('接續跑') || content.includes('轉換');
    const isTempo = content.includes('節奏跑') || content.includes('T配速');

    const intervalKmMatch = content.match(/(\d+)\s*[xX×]\s*([\d.]+)\s*km/i);
    const intervalMMatch = content.match(/(\d+)\s*[xX×]\s*(\d+)\s*m(?!\w)/i);

    const contentPace = parseRunPaceFromContent(content);

    const easyPace = getRunPaceTarget('EASY');
    const longPace = getRunPaceTarget('LONG');
    const marathonPace = getRunPaceTarget('MARATHON');
    const tempoPace = getRunPaceTarget('TEMPO');
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

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 6, stepTypeKey: 'repeat' },
            numberOfIterations: 4,
            workoutSteps: [
                { stepOrder: 1, stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                  endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' }, endConditionValue: 100,
                  ...getRunPaceTarget('REP') },
                { stepOrder: 2, stepType: { stepTypeId: 5, stepTypeKey: 'rest' },
                  endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' }, endConditionValue: 100,
                  targetType: { workoutTargetTypeId: 1, workoutTargetTypeKey: 'no.target' } }
            ]
        });

        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 6, stepTypeKey: 'repeat' },
            numberOfIterations: reps,
            workoutSteps: [
                { stepOrder: 1, stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                  endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' }, endConditionValue: intervalDistance,
                  ...intervalTarget },
                { stepOrder: 2, stepType: { stepTypeId: 5, stepTypeKey: 'rest' },
                  endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' }, endConditionValue: restTime,
                  targetType: { workoutTargetTypeId: 1, workoutTargetTypeKey: 'no.target' } }
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
            steps.push({ stepOrder: stepOrder++, stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: structuredWorkout.warmupDistance, ...easyPace });
            steps.push({ stepOrder: stepOrder++, stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: structuredWorkout.mainDistance, ...structuredWorkout.mainPace });
            steps.push({ stepOrder: stepOrder++, stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: structuredWorkout.cooldownDistance, ...easyPace });
        } else {
            const warmupDistance = 2000;
            const cooldownDistance = 2000;
            const tempoDistance = totalDistance - warmupDistance - cooldownDistance;

            steps.push({ stepOrder: stepOrder++, stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: warmupDistance, ...easyPace });
            steps.push({ stepOrder: stepOrder++, stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: tempoDistance, ...tempoPace });
            steps.push({ stepOrder: stepOrder++, stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: cooldownDistance, ...easyPace });
        }

    } else if (isBrick) {
        const targetPace = contentPace || marathonPace;
        const transitionDistance = 1000;
        const mainDistance = totalDistance - transitionDistance;

        steps.push({ stepOrder: stepOrder++, stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: transitionDistance, ...easyPace });
        steps.push({ stepOrder: stepOrder++, stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: mainDistance, ...targetPace });

    } else if (isLongRun) {
        const structuredRun = parseStructuredLongRun(content);

        if (structuredRun) {
            steps.push({ stepOrder: stepOrder++, stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: structuredRun.firstDistance, ...easyPace });
            steps.push({ stepOrder: stepOrder++, stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: structuredRun.middleDistance, ...structuredRun.middlePace });
            steps.push({ stepOrder: stepOrder++, stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: structuredRun.lastDistance, ...easyPace });
        } else {
            const warmupDistance = 2000;
            const cooldownDistance = 2000;
            const mainDistance = totalDistance - warmupDistance - cooldownDistance;
            const mainPace = contentPace || longPace;

            steps.push({ stepOrder: stepOrder++, stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: warmupDistance, ...easyPace });
            steps.push({ stepOrder: stepOrder++, stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: mainDistance, ...mainPace });
            steps.push({ stepOrder: stepOrder++, stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: cooldownDistance, ...easyPace });
        }

    } else if (isRecoveryRun || isEasyRun) {
        const defaultPace = isRecoveryRun ? recoveryPace : easyPace;
        const targetPace = contentPace || defaultPace;

        steps.push({ stepOrder: stepOrder++, stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: Math.round(totalDistance * 0.1), ...targetPace });
        steps.push({ stepOrder: stepOrder++, stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: Math.round(totalDistance * 0.8), ...targetPace });
        steps.push({ stepOrder: stepOrder++, stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: Math.round(totalDistance * 0.1), ...targetPace });

    } else {
        const targetPace = contentPace || easyPace;
        const warmupDistance = Math.round(totalDistance * 0.1);
        const mainDistance = Math.round(totalDistance * 0.8);
        const cooldownDistance = totalDistance - warmupDistance - mainDistance;

        steps.push({ stepOrder: stepOrder++, stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: warmupDistance, ...targetPace });
        steps.push({ stepOrder: stepOrder++, stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: mainDistance, ...targetPace });
        steps.push({ stepOrder: stepOrder++, stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: cooldownDistance, ...targetPace });
    }

    return steps;
}

// Convert training data to Garmin Workout JSON format
export function convertToGarminWorkout(training, index, overrideDate = null) {
    const workouts = [];
    const sportTypes = {
        swim: { sportTypeId: 5, sportTypeKey: 'pool_swimming' },
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
                workoutId: null, ownerId: null,
                workoutName: `Day ${index + 1} 游泳 - ${training.phase}`,
                description: extractWorkoutPart(content, '游泳'),
                sportType: sportTypes.swim,
                workoutSegments: [{ segmentOrder: 1, sportType: sportTypes.swim,
                    workoutSteps: rawSteps.map(step => formatStep(step)) }],
                estimatedDurationInSecs: Math.round(swimDistance * 2.5 / 100 * 60),
                estimatedDistanceInMeters: swimDistance,
                poolLength: 25, poolLengthUnit: { unitId: 1, unitKey: 'meter' },
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
                workoutId: null, ownerId: null,
                workoutName: `Day ${index + 1} 自行車 - ${training.phase}`,
                description: extractWorkoutPart(content, '自行車'),
                sportType: sportTypes.bike,
                workoutSegments: [{ segmentOrder: 1, sportType: sportTypes.bike,
                    workoutSteps: rawSteps.map(step => formatStep(step)) }],
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
                workoutId: null, ownerId: null,
                workoutName: `Day ${index + 1} 跑步 - ${training.phase}`,
                description: extractWorkoutPart(content, '跑步'),
                sportType: sportTypes.run,
                workoutSegments: [{ segmentOrder: 1, sportType: sportTypes.run,
                    workoutSteps: rawSteps.map(step => formatStep(step)) }],
                estimatedDurationInSecs: Math.round(runDistance / 1000 * 6 * 60),
                estimatedDistanceInMeters: runDistance,
                scheduledDate: dateStr
            }
        });
    }

    return workouts;
}
