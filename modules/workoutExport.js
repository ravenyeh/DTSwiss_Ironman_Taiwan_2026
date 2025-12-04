// Workout Export Module - JSON, ZWO, ERG file formats

import { TRAINING_PARAMS } from './paceZones.js';
import { escapeXml } from './utils.js';

// Convert Garmin workout to Zwift ZWO format (XML)
export function convertToZWO(workout) {
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
export function convertToERG(workout) {
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

// Download workout JSON as file
export function downloadWorkoutJson(idx, filename, trainingData, convertToGarminWorkout) {
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

// Copy workout JSON to clipboard
export function copyWorkoutJson(idx, btn, trainingData, convertToGarminWorkout) {
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

// Download workout as ZWO file
export function downloadWorkoutZWO(idx, filename) {
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

// Download workout as ERG file
export function downloadWorkoutERG(idx, filename) {
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
