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

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                error: '請先登入 Garmin Connect'
            });
        }

        const session = sessions.get(sessionId);

        if (!session) {
            return res.status(401).json({
                success: false,
                error: '登入已過期，請重新登入'
            });
        }

        const { workout, scheduledDate } = req.body;

        if (!workout) {
            return res.status(400).json({
                success: false,
                error: '請提供訓練資料'
            });
        }

        const GC = session.gc;

        // Create the workout in Garmin Connect
        // Note: The exact API may vary based on the library version
        let createdWorkout;

        try {
            // Try to create workout using the library's method
            createdWorkout = await GC.addWorkout(workout);
        } catch (e) {
            // If addWorkout doesn't exist, try alternative methods
            console.log('addWorkout failed, trying alternative:', e.message);

            // Try using raw API call
            const workoutPayload = {
                ...workout,
                workoutId: null,
                ownerId: null
            };

            // Use the internal request method if available
            if (GC.client && GC.client.post) {
                const response = await GC.client.post(
                    'https://connect.garmin.com/workout-service/workout',
                    workoutPayload
                );
                createdWorkout = response.data;
            } else {
                throw new Error('無法建立訓練，請稍後再試');
            }
        }

        // Schedule the workout if date is provided
        let scheduled = false;
        let scheduleError = null;
        if (scheduledDate && createdWorkout && createdWorkout.workoutId) {
            try {
                // Correct format: first param is object with workoutId, second is Date object
                await GC.scheduleWorkout(
                    { workoutId: createdWorkout.workoutId },
                    new Date(scheduledDate)
                );
                scheduled = true;
                console.log('Workout scheduled successfully:', createdWorkout.workoutId, 'to', scheduledDate);
            } catch (e) {
                console.log('Schedule workout failed:', e.message);
                scheduleError = e.message;
            }
        }

        return res.status(200).json({
            success: true,
            message: scheduled
                ? '訓練已成功匯入並排程到 Garmin Connect'
                : '訓練已匯入 Garmin Connect' + (scheduleError ? '，但排程失敗' : ''),
            workout: {
                workoutId: createdWorkout?.workoutId,
                workoutName: workout.workoutName,
                scheduled: scheduled,
                scheduledDate: scheduled ? scheduledDate : null
            }
        });

    } catch (error) {
        console.error('Workout creation error:', error);

        return res.status(500).json({
            success: false,
            error: error.message || '建立訓練失敗，請稍後再試'
        });
    }
};
