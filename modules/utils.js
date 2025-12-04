// Format date for display
export function formatDate(dateStr) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
    return `${month}/${day} (${weekday})`;
}

// Format seconds to MM:SS
export function formatPace(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Convert workout name to English filename
export function toEnglishFilename(workoutName, sportType) {
    // Handle undefined/null workoutName
    if (!workoutName) workoutName = '';

    const sportPrefix = {
        swim: 'swim',
        bike: 'bike',
        run: 'run'
    };

    const prefix = sportPrefix[sportType] || 'workout';

    // Extract day info
    const dayMatch = workoutName.match(/Day\s*(\d+)/i);
    const dayNum = dayMatch ? dayMatch[1] : '';

    // Extract workout type keywords
    let type = '';
    if (workoutName.includes('技術課') || workoutName.includes('技術')) type = 'technique';
    else if (workoutName.includes('間歇') || workoutName.includes('Interval')) type = 'intervals';
    else if (workoutName.includes('配速') || workoutName.includes('Tempo')) type = 'tempo';
    else if (workoutName.includes('長距離') || workoutName.includes('Long')) type = 'long';
    else if (workoutName.includes('恢復') || workoutName.includes('Recovery')) type = 'recovery';
    else if (workoutName.includes('輕鬆')) type = 'easy';
    else if (workoutName.includes('磚式')) type = 'brick';
    else if (workoutName.includes('測試')) type = 'test';
    else if (workoutName.includes('節奏')) type = 'tempo';
    else type = 'workout';

    // Extract phase
    let phase = '';
    if (workoutName.includes('建構期')) phase = 'base';
    else if (workoutName.includes('強化期')) phase = 'build';
    else if (workoutName.includes('巔峰期')) phase = 'peak';
    else if (workoutName.includes('減量期')) phase = 'taper';
    else if (workoutName.includes('賽前週')) phase = 'race-week';

    const filename = `${prefix}_day${dayNum}_${type}${phase ? '_' + phase : ''}`;
    return filename.toLowerCase().replace(/[^a-z0-9_-]/g, '');
}

// Helper function to escape XML special characters
export function escapeXml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
