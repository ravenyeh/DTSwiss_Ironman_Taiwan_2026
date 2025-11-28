// Training Schedule Data
const trainingData = [
    { day: "Week 1 - Day 1 (週一)", status: "No", intensity: "休息", date: "January 12, 2026", swim: "", bike: "", content: "完全休息日，進行輕度伸展和按摩放鬆", hours: 0, type: "完全休息", run: "", week: "Week 1", phase: "建構期" },
    { day: "Week 1 - Day 2 (週二)", status: "No", intensity: "輕鬆", date: "January 13, 2026", swim: "2", bike: "", content: "游泳：技術課 2km (熱身500m + 技術練習1000m + 緩和500m) | 跑步：輕鬆跑 6km @ 6:30/km", hours: 2, type: "技術課", run: "6", week: "Week 1", phase: "建構期" },
    { day: "Week 1 - Day 3 (週三)", status: "No", intensity: "輕鬆", date: "January 14, 2026", swim: "", bike: "40", content: "自行車：輕鬆騎 40km @ Z2 (65-75% FTP)", hours: 1.5, type: "輕鬆恢復", run: "", week: "Week 1", phase: "建構期" },
    { day: "Week 1 - Day 4 (週四)", status: "No", intensity: "輕鬆", date: "January 15, 2026", swim: "2.5", bike: "", content: "游泳：技術課 2.5km (專注划頻提升) | 跑步：恢復跑 5km @ 6:40/km", hours: 1.5, type: "技術課, 輕鬆恢復", run: "5", week: "Week 1", phase: "建構期" },
    { day: "Week 1 - Day 5 (週五)", status: "No", intensity: "休息", date: "January 16, 2026", swim: "", bike: "", content: "完全休息日，準備週末長距離訓練", hours: 0, type: "完全休息", run: "", week: "Week 1", phase: "建構期" },
    { day: "Week 1 - Day 6 (週六)", status: "No", intensity: "中等", date: "January 17, 2026", swim: "", bike: "120", content: "自行車：長距離 120km @ Z2 (每30分鐘補給一次)", hours: 4.5, type: "長距離", run: "", week: "Week 1", phase: "建構期" },
    { day: "Week 1 - Day 7 (週日)", status: "No", intensity: "中等", date: "January 18, 2026", swim: "1.5", bike: "", content: "跑步：長跑 18km @ 6:20/km | 游泳：恢復游 1.5km", hours: 3, type: "輕鬆恢復, 長距離", run: "18", week: "Week 1", phase: "建構期" },
    { day: "Week 2 - Day 1 (週一)", status: "No", intensity: "休息", date: "January 19, 2026", swim: "", bike: "", content: "完全休息日", hours: 0, type: "完全休息", run: "", week: "Week 2", phase: "建構期" },
    { day: "Week 2 - Day 2 (週二)", status: "No", intensity: "輕鬆", date: "January 20, 2026", swim: "2.5", bike: "", content: "游泳：技術課 2.5km (划頻練習) | 跑步：輕鬆跑 7km", hours: 2, type: "技術課, 輕鬆恢復", run: "7", week: "Week 2", phase: "建構期" },
    { day: "Week 2 - Day 3 (週三)", status: "No", intensity: "中等", date: "January 21, 2026", swim: "", bike: "50", content: "自行車：50km (含 3x10分鐘 @ Sweet Spot, 休5分鐘)", hours: 2, type: "配速訓練", run: "", week: "Week 2", phase: "建構期" },
    { day: "Week 2 - Day 4 (週四)", status: "No", intensity: "中等", date: "January 22, 2026", swim: "2", bike: "", content: "游泳：配速訓練 2km (8x200m @ 2:40/100m, 休30秒) | 跑步：恢復跑 6km", hours: 2, type: "配速訓練", run: "6", week: "Week 2", phase: "建構期" },
    { day: "Week 2 - Day 5 (週五)", status: "No", intensity: "休息", date: "January 23, 2026", swim: "", bike: "", content: "半休息日，輕度伸展", hours: 0, type: "輕鬆恢復", run: "", week: "Week 2", phase: "建構期" },
    { day: "Week 2 - Day 6 (週六)", status: "No", intensity: "中等", date: "January 24, 2026", swim: "", bike: "130", content: "自行車：長距離 130km @ Z2", hours: 5, type: "長距離", run: "", week: "Week 2", phase: "建構期" },
    { day: "Week 2 - Day 7 (週日)", status: "No", intensity: "中等", date: "January 25, 2026", swim: "2", bike: "", content: "跑步：長跑 20km @ 6:15/km | 游泳：恢復游 2km", hours: 3.5, type: "輕鬆恢復, 長距離", run: "20", week: "Week 2", phase: "建構期" },
    { day: "Week 3 - Day 1 (週一)", status: "No", intensity: "休息", date: "January 26, 2026", swim: "", bike: "", content: "完全休息日", hours: 0, type: "完全休息", run: "", week: "Week 3", phase: "建構期" },
    { day: "Week 3 - Day 2 (週二)", status: "No", intensity: "輕鬆", date: "January 27, 2026", swim: "2.5", bike: "", content: "游泳：技術課 2.5km | 跑步：輕鬆跑 8km", hours: 2, type: "技術課", run: "8", week: "Week 3", phase: "建構期" },
    { day: "Week 3 - Day 3 (週三)", status: "No", intensity: "中等", date: "January 28, 2026", swim: "", bike: "55", content: "自行車：55km (含 4x10分鐘 @ Sweet Spot)", hours: 2.5, type: "配速訓練", run: "", week: "Week 3", phase: "建構期" },
    { day: "Week 3 - Day 4 (週四)", status: "No", intensity: "高強度", date: "January 29, 2026", swim: "2.5", bike: "", content: "游泳：間歇 2.5km (10x200m @ 2:38/100m, 休30秒) | 跑步：輕鬆跑 7km", hours: 2, type: "間歇訓練", run: "7", week: "Week 3", phase: "建構期" },
    { day: "Week 3 - Day 5 (週五)", status: "No", intensity: "休息", date: "January 30, 2026", swim: "", bike: "", content: "完全休息日", hours: 0, type: "完全休息", run: "", week: "Week 3", phase: "建構期" },
    { day: "Week 3 - Day 6 (週六)", status: "No", intensity: "中等", date: "January 31, 2026", swim: "", bike: "135", content: "自行車：長距離 135km @ Z2", hours: 5, type: "長距離", run: "", week: "Week 3", phase: "建構期" },
    { day: "Week 3 - Day 7 (週日)", status: "No", intensity: "中等", date: "February 1, 2026", swim: "2", bike: "", content: "跑步：長跑 21km @ 6:10/km | 游泳：恢復游 2km", hours: 3.5, type: "輕鬆恢復, 長距離", run: "21", week: "Week 3", phase: "建構期" },
    { day: "Week 4 - Day 1 (週一)", status: "No", intensity: "休息", date: "February 2, 2026", swim: "", bike: "", content: "完全休息日", hours: 0, type: "完全休息", run: "", week: "Week 4", phase: "建構期" },
    { day: "Week 4 - Day 2 (週二)", status: "No", intensity: "輕鬆", date: "February 3, 2026", swim: "3", bike: "", content: "游泳：技術課 3km (划頻70+ SPM) | 跑步：輕鬆跑 8km", hours: 2.5, type: "技術課", run: "8", week: "Week 4", phase: "建構期" },
    { day: "Week 4 - Day 3 (週三)", status: "No", intensity: "中等", date: "February 4, 2026", swim: "", bike: "60", content: "自行車：60km (含 4x12分鐘 @ Sweet Spot)", hours: 2.5, type: "配速訓練", run: "", week: "Week 4", phase: "建構期" },
    { day: "Week 4 - Day 4 (週四)", status: "No", intensity: "中等", date: "February 5, 2026", swim: "2.5", bike: "", content: "游泳：配速 2.5km (6x300m @ 2:35/100m) | 跑步：輕鬆跑 7km", hours: 2, type: "配速訓練", run: "7", week: "Week 4", phase: "建構期" },
    { day: "Week 4 - Day 5 (週五)", status: "No", intensity: "休息", date: "February 6, 2026", swim: "", bike: "", content: "完全休息日", hours: 0, type: "完全休息", run: "", week: "Week 4", phase: "建構期" },
    { day: "Week 4 - Day 6 (週六)", status: "No", intensity: "中等", date: "February 7, 2026", swim: "", bike: "140", content: "自行車：長距離 140km @ Z2 (含20分鐘FTP測試)", hours: 5.5, type: "測試, 長距離", run: "", week: "Week 4", phase: "建構期" },
    { day: "Week 4 - Day 7 (週日)", status: "No", intensity: "中等", date: "February 8, 2026", swim: "2.5", bike: "", content: "跑步：長跑 22km (含3km測試配速) | 游泳：測試 2.5km @ 目標配速", hours: 4, type: "測試, 長距離", run: "22", week: "Week 4", phase: "建構期" },
    { day: "Week 5 - Day 1 (週一)", status: "No", intensity: "休息", date: "February 9, 2026", swim: "", bike: "", content: "完全休息日", hours: 0, type: "完全休息", run: "", week: "Week 5", phase: "強化期" },
    { day: "Week 5 - Day 2 (週二)", status: "No", intensity: "中等", date: "February 10, 2026", swim: "3", bike: "", content: "游泳：配速訓練 3km (6x400m @ 2:33/100m, 休30秒) | 跑步：輕鬆跑 8km @ 6:20/km", hours: 2.5, type: "配速訓練", run: "8", week: "Week 5", phase: "強化期" },
    { day: "Week 5 - Day 3 (週三)", status: "No", intensity: "高強度", date: "February 11, 2026", swim: "", bike: "70", content: "自行車：70km (含 3x20分鐘 @ Sweet Spot, 休5分鐘)", hours: 3, type: "配速訓練", run: "", week: "Week 5", phase: "強化期" },
    { day: "Week 5 - Day 4 (週四)", status: "No", intensity: "高強度", date: "February 12, 2026", swim: "3", bike: "", content: "游泳：間歇 3km (10x250m @ 2:32/100m, 休30秒) | 跑步：節奏跑 10km (熱身3km + 5km @ 5:30/km + 緩和2km)", hours: 2.5, type: "間歇訓練", run: "10", week: "Week 5", phase: "強化期" },
    { day: "Week 5 - Day 5 (週五)", status: "No", intensity: "休息", date: "February 13, 2026", swim: "", bike: "", content: "完全休息日，準備週末大訓練量", hours: 0, type: "完全休息", run: "", week: "Week 5", phase: "強化期" },
    { day: "Week 5 - Day 6 (週六)", status: "No", intensity: "高強度", date: "February 14, 2026", swim: "", bike: "160", content: "自行車：長距離 160km @ Z2 | 磚式訓練：接續跑 8km @ 6:00/km", hours: 7, type: "磚式訓練, 長距離", run: "8", week: "Week 5", phase: "強化期" },
    { day: "Week 5 - Day 7 (週日)", status: "No", intensity: "中等", date: "February 15, 2026", swim: "3", bike: "", content: "跑步：長跑 25km (前10km輕鬆 + 中段10km @ M配速6:00/km + 最後5km輕鬆) | 游泳：恢復游 3km", hours: 4.5, type: "配速訓練, 長距離", run: "25", week: "Week 5", phase: "強化期" },
    { day: "Week 6 - Day 1 (週一)", status: "No", intensity: "休息", date: "February 16, 2026", swim: "", bike: "", content: "🧧 除夕 | 完全休息日", hours: 0, type: "完全休息", run: "", week: "Week 6", phase: "強化期", holiday: "除夕" },
    { day: "Week 6 - Day 2 (週二)", status: "No", intensity: "中等", date: "February 17, 2026", swim: "3.5", bike: "", content: "🧧 初一 | 游泳：技術+配速 3.5km (1km技術 + 6x300m @ 2:32/100m) | 跑步：輕鬆跑 8km", hours: 2.5, type: "技術課, 配速訓練", run: "8", week: "Week 6", phase: "強化期", holiday: "初一" },
    { day: "Week 6 - Day 3 (週三)", status: "No", intensity: "高強度", date: "February 18, 2026", swim: "", bike: "75", content: "🧧 初二 | 自行車：75km (含 4x15分鐘 @ Sweet Spot)", hours: 3, type: "配速訓練", run: "", week: "Week 6", phase: "強化期", holiday: "初二" },
    { day: "Week 6 - Day 4 (週四)", status: "No", intensity: "高強度", date: "February 19, 2026", swim: "3", bike: "", content: "🧧 初三 | 游泳：間歇 3km (8x300m @ 2:30/100m, 休40秒) | 跑步：間歇 11km (熱身3km + 8x1km @ 4:45/km 休90秒 + 緩和2km)", hours: 2.5, type: "間歇訓練", run: "11", week: "Week 6", phase: "強化期", holiday: "初三" },
    { day: "Week 6 - Day 5 (週五)", status: "No", intensity: "輕鬆", date: "February 20, 2026", swim: "2", bike: "", content: "🧧 初四 | 游泳：恢復游 2km (輕鬆技術)", hours: 1, type: "輕鬆恢復", run: "", week: "Week 6", phase: "強化期", holiday: "初四" },
    { day: "Week 6 - Day 6 (週六)", status: "No", intensity: "高強度", date: "February 21, 2026", swim: "", bike: "170", content: "🧧 初五 | 自行車：長距離 170km @ Z2 (每30分鐘補給) | 磚式訓練：接續跑 9km @ 5:55/km", hours: 7.5, type: "磚式訓練, 長距離", run: "9", week: "Week 6", phase: "強化期", holiday: "初五" },
    { day: "Week 6 - Day 7 (週日)", status: "No", intensity: "中等", date: "February 22, 2026", swim: "3", bike: "", content: "🧧 初六 | 跑步：長跑 26km (前8km輕鬆 + 中段14km @ 5:55/km + 最後4km輕鬆) | 游泳：恢復游 3km", hours: 4.5, type: "配速訓練, 長距離", run: "26", week: "Week 6", phase: "強化期", holiday: "初六" },
    { day: "Week 7 - Day 1 (週一)", status: "No", intensity: "休息", date: "February 23, 2026", swim: "", bike: "", content: "完全休息日 - 最大負荷週開始", hours: 0, type: "完全休息", run: "", week: "Week 7", phase: "強化期" },
    { day: "Week 7 - Day 2 (週二)", status: "No", intensity: "高強度", date: "February 24, 2026", swim: "3.5", bike: "", content: "游泳：配速 3.5km (5x500m @ 2:30/100m, 休45秒) | 跑步：節奏跑 9km (2km熱身 + 5km @ 5:20/km + 2km緩和)", hours: 2.5, type: "配速訓練", run: "9", week: "Week 7", phase: "強化期" },
    { day: "Week 7 - Day 3 (週三)", status: "No", intensity: "最大", date: "February 25, 2026", swim: "", bike: "80", content: "自行車：80km (含 3x20分鐘 @ Sweet Spot + 爬坡訓練)", hours: 3.5, type: "配速訓練", run: "", week: "Week 7", phase: "強化期" },
    { day: "Week 7 - Day 4 (週四)", status: "No", intensity: "最大", date: "February 26, 2026", swim: "3.5", bike: "", content: "游泳：間歇 3.5km (12x250m @ 2:28/100m, 休30秒) | 跑步：間歇 12km (3km熱身 + 6x1.2km @ 4:40/km 休2分 + 2km緩和)", hours: 3, type: "間歇訓練", run: "12", week: "Week 7", phase: "強化期" },
    { day: "Week 7 - Day 5 (週五)", status: "No", intensity: "輕鬆", date: "February 27, 2026", swim: "2", bike: "", content: "游泳：恢復游 2km | 跑步：輕鬆跑 5km", hours: 1.5, type: "輕鬆恢復", run: "5", week: "Week 7", phase: "強化期" },
    { day: "Week 7 - Day 6 (週六)", status: "No", intensity: "最大", date: "February 28, 2026", swim: "", bike: "180", content: "自行車：長距離 180km @ Z2 (側風訓練) | 磚式訓練：接續跑 10km @ 5:50/km", hours: 8, type: "磚式訓練, 長距離", run: "10", week: "Week 7", phase: "強化期" },
    { day: "Week 7 - Day 7 (週日)", status: "No", intensity: "高強度", date: "March 1, 2026", swim: "3", bike: "", content: "跑步：長跑 28km (前10km輕鬆 + 中段12km @ 5:50/km + 最後6km維持) | 游泳：恢復游 3km", hours: 5, type: "配速訓練, 長距離", run: "28", week: "Week 7", phase: "強化期" },
    { day: "Week 8 - Day 1 (週一)", status: "No", intensity: "休息", date: "March 2, 2026", swim: "", bike: "", content: "完全休息日 - 恢復週", hours: 0, type: "完全休息", run: "", week: "Week 8", phase: "強化期" },
    { day: "Week 8 - Day 2 (週二)", status: "No", intensity: "輕鬆", date: "March 3, 2026", swim: "3", bike: "", content: "游泳：技術課 3km (專注流線型) | 跑步：輕鬆跑 7km", hours: 2, type: "技術課, 輕鬆恢復", run: "7", week: "Week 8", phase: "強化期" },
    { day: "Week 8 - Day 3 (週三)", status: "No", intensity: "中等", date: "March 4, 2026", swim: "", bike: "65", content: "自行車：65km (含 3x15分鐘 @ Sweet Spot)", hours: 2.5, type: "配速訓練", run: "", week: "Week 8", phase: "強化期" },
    { day: "Week 8 - Day 4 (週四)", status: "No", intensity: "中等", date: "March 5, 2026", swim: "2.5", bike: "", content: "游泳：配速 2.5km (6x350m @ 2:32/100m) | 跑步：節奏跑 10km", hours: 2.5, type: "配速訓練", run: "10", week: "Week 8", phase: "強化期" },
    { day: "Week 8 - Day 5 (週五)", status: "No", intensity: "休息", date: "March 6, 2026", swim: "", bike: "", content: "完全休息日", hours: 0, type: "完全休息", run: "", week: "Week 8", phase: "強化期" },
    { day: "Week 8 - Day 6 (週六)", status: "No", intensity: "中等", date: "March 7, 2026", swim: "", bike: "150", content: "自行車：長距離 150km @ Z2 | 磚式訓練：接續跑 8km", hours: 6.5, type: "磚式訓練, 長距離", run: "8", week: "Week 8", phase: "強化期" },
    { day: "Week 8 - Day 7 (週日)", status: "No", intensity: "中等", date: "March 8, 2026", swim: "3", bike: "", content: "跑步：長跑 24km @ 輕鬆配速 | 游泳：恢復游 3km", hours: 4, type: "輕鬆恢復, 長距離", run: "24", week: "Week 8", phase: "強化期" },
    { day: "Week 9 - Day 1 (週一)", status: "No", intensity: "休息", date: "March 9, 2026", swim: "", bike: "", content: "完全休息日", hours: 0, type: "完全休息", run: "", week: "Week 9", phase: "強化期" },
    { day: "Week 9 - Day 2 (週二)", status: "No", intensity: "中等", date: "March 10, 2026", swim: "3.5", bike: "", content: "游泳：配速 3.5km (4x600m @ 2:30/100m, 休1分鐘) | 跑步：輕鬆跑 8km", hours: 2.5, type: "配速訓練", run: "8", week: "Week 9", phase: "強化期" },
    { day: "Week 9 - Day 3 (週三)", status: "No", intensity: "高強度", date: "March 11, 2026", swim: "", bike: "75", content: "自行車：75km (含 4x20分鐘 @ Sweet Spot)", hours: 3, type: "配速訓練", run: "", week: "Week 9", phase: "強化期" },
    { day: "Week 9 - Day 4 (週四)", status: "No", intensity: "高強度", date: "March 12, 2026", swim: "3", bike: "", content: "游泳：間歇 3km (10x250m @ 2:28/100m) | 跑步：節奏跑 11km (3km + 6km @ T配速 + 2km)", hours: 2.5, type: "間歇訓練", run: "11", week: "Week 9", phase: "強化期" },
    { day: "Week 9 - Day 5 (週五)", status: "No", intensity: "休息", date: "March 13, 2026", swim: "", bike: "", content: "完全休息日，準備週末大訓練", hours: 0, type: "完全休息", run: "", week: "Week 9", phase: "強化期" },
    { day: "Week 9 - Day 6 (週六)", status: "No", intensity: "高強度", date: "March 14, 2026", swim: "", bike: "170", content: "自行車：長距離 170km @ Z2 | 磚式訓練：接續跑 10km @ 比賽配速", hours: 7.5, type: "磚式訓練, 長距離", run: "10", week: "Week 9", phase: "強化期" },
    { day: "Week 9 - Day 7 (週日)", status: "No", intensity: "中等", date: "March 15, 2026", swim: "3", bike: "", content: "跑步：長跑 26km (含 16km @ M配速) | 游泳：恢復游 3km", hours: 4.5, type: "配速訓練, 長距離", run: "26", week: "Week 9", phase: "強化期" },
    { day: "Week 10 - Day 1 (週一)", status: "No", intensity: "休息", date: "March 16, 2026", swim: "", bike: "", content: "完全休息日 - 巔峰期開始", hours: 0, type: "完全休息", run: "", week: "Week 10", phase: "巔峰期" },
    { day: "Week 10 - Day 2 (週二)", status: "No", intensity: "中等", date: "March 17, 2026", swim: "3", bike: "", content: "游泳：技術+配速 3km (1km技術 + 4x400m @ 2:30/100m) | 跑步：輕鬆跑 7km", hours: 2, type: "技術課, 配速訓練", run: "7", week: "Week 10", phase: "巔峰期" },
    { day: "Week 10 - Day 3 (週三)", status: "No", intensity: "中等", date: "March 18, 2026", swim: "", bike: "70", content: "自行車：70km (含 3x15分鐘 @ Sweet Spot)", hours: 3, type: "配速訓練", run: "", week: "Week 10", phase: "巔峰期" },
    { day: "Week 10 - Day 4 (週四)", status: "No", intensity: "中等", date: "March 19, 2026", swim: "2.5", bike: "", content: "游泳：配速 2.5km (5x400m @ 2:30/100m) | 跑步：節奏跑 10km (2km + 6km @ T配速 + 2km)", hours: 2.5, type: "配速訓練", run: "10", week: "Week 10", phase: "巔峰期" },
    { day: "Week 10 - Day 5 (週五)", status: "No", intensity: "休息", date: "March 20, 2026", swim: "", bike: "", content: "完全休息日，準備週末訓練", hours: 0, type: "完全休息", run: "", week: "Week 10", phase: "巔峰期" },
    { day: "Week 10 - Day 6 (週六)", status: "No", intensity: "中等", date: "March 21, 2026", swim: "", bike: "150", content: "自行車：長距離 150km @ Z2 | 磚式訓練：接續跑 8km @ 比賽配速", hours: 6.5, type: "磚式訓練, 長距離", run: "8", week: "Week 10", phase: "巔峰期" },
    { day: "Week 10 - Day 7 (週日)", status: "No", intensity: "中等", date: "March 22, 2026", swim: "3", bike: "", content: "跑步：長跑 23km (含 15km @ M配速) | 游泳：恢復游 3km", hours: 4, type: "配速訓練, 長距離", run: "23", week: "Week 10", phase: "巔峰期" },
    { day: "Week 11 - Day 1 (週一)", status: "No", intensity: "休息", date: "March 23, 2026", swim: "", bike: "", content: "完全休息日", hours: 0, type: "完全休息", run: "", week: "Week 11", phase: "巔峰期" },
    { day: "Week 11 - Day 2 (週二)", status: "No", intensity: "輕鬆", date: "March 24, 2026", swim: "2.5", bike: "", content: "游泳：技術課 2.5km | 跑步：輕鬆跑 6km", hours: 1.5, type: "技術課, 輕鬆恢復", run: "6", week: "Week 11", phase: "巔峰期" },
    { day: "Week 11 - Day 3 (週三)", status: "No", intensity: "中等", date: "March 25, 2026", swim: "", bike: "60", content: "自行車：60km (含 3x12分鐘 @ Sweet Spot)", hours: 2.5, type: "配速訓練", run: "", week: "Week 11", phase: "巔峰期" },
    { day: "Week 11 - Day 4 (週四)", status: "No", intensity: "中等", date: "March 26, 2026", swim: "2.5", bike: "", content: "游泳：配速 2.5km (6x300m @ 2:30/100m) | 跑步：節奏跑 8km", hours: 2, type: "配速訓練", run: "8", week: "Week 11", phase: "巔峰期" },
    { day: "Week 11 - Day 5 (週五)", status: "No", intensity: "休息", date: "March 27, 2026", swim: "", bike: "", content: "完全休息日，準備週末半程模擬賽", hours: 0, type: "完全休息", run: "", week: "Week 11", phase: "巔峰期" },
    { day: "Week 11 - Day 6 (週六)", status: "No", intensity: "輕鬆", date: "March 28, 2026", swim: "", bike: "50", content: "自行車：輕鬆騎 50km @ Z2 | 輕鬆跑 5km", hours: 2.5, type: "輕鬆恢復", run: "5", week: "Week 11", phase: "巔峰期" },
    { day: "Week 11 - Day 7 (週日)", status: "No", intensity: "高強度", date: "March 29, 2026", swim: "2", bike: "90", content: "半程距離模擬賽：游泳 2km (測試配速) + 自行車 90km (測試穩定度) + 跑步 21km (測試配速與補給策略) | 目標：驗證配速與補給計劃", hours: 7, type: "模擬賽", run: "21", week: "Week 11", phase: "巔峰期" },
    { day: "Week 12 - Day 1 (週一)", status: "No", intensity: "休息", date: "March 30, 2026", swim: "", bike: "", content: "完全休息日 - 減量期開始，從模擬賽恢復", hours: 0, type: "完全休息", run: "", week: "Week 12", phase: "減量期" },
    { day: "Week 12 - Day 2 (週二)", status: "No", intensity: "輕鬆", date: "March 31, 2026", swim: "2", bike: "", content: "游泳：技術課 2km (輕鬆恢復) | 跑步：輕鬆跑 6km", hours: 1.5, type: "技術課, 輕鬆恢復", run: "6", week: "Week 12", phase: "減量期" },
    { day: "Week 12 - Day 3 (週三)", status: "No", intensity: "中等", date: "April 1, 2026", swim: "", bike: "50", content: "自行車：50km (含 3x10分鐘 @ Sweet Spot) - 維持品質，減少數量", hours: 2, type: "配速訓練", run: "", week: "Week 12", phase: "減量期" },
    { day: "Week 12 - Day 4 (週四)", status: "No", intensity: "中等", date: "April 2, 2026", swim: "2", bike: "", content: "游泳：配速 2km (5x300m @ 2:30/100m) | 跑步：節奏跑 8km (2km + 4km @ T配速 + 2km)", hours: 2, type: "配速訓練", run: "8", week: "Week 12", phase: "減量期" },
    { day: "Week 12 - Day 5 (週五)", status: "No", intensity: "休息", date: "April 3, 2026", swim: "", bike: "", content: "完全休息日", hours: 0, type: "完全休息", run: "", week: "Week 12", phase: "減量期" },
    { day: "Week 12 - Day 6 (週六)", status: "No", intensity: "中等", date: "April 4, 2026", swim: "", bike: "100", content: "自行車：中距離 100km @ Z2 (維持輕鬆) | 磚式訓練：接續跑 6km @ 比賽配速", hours: 4.5, type: "磚式訓練, 配速訓練", run: "6", week: "Week 12", phase: "減量期" },
    { day: "Week 12 - Day 7 (週日)", status: "No", intensity: "輕鬆", date: "April 5, 2026", swim: "2", bike: "", content: "跑步：長跑 15km @ 輕鬆配速 | 游泳：恢復游 2km", hours: 2.5, type: "輕鬆恢復", run: "15", week: "Week 12", phase: "減量期" },
    { day: "Week 13 - Day 1 (週一)", status: "No", intensity: "輕鬆", date: "April 6, 2026", swim: "2", bike: "", content: "游泳：技術課 2km (流線型、手部動作) | 跑步：輕鬆跑 6km", hours: 1.5, type: "技術課, 輕鬆恢復", run: "6", week: "Week 13", phase: "賽前週" },
    { day: "Week 13 - Day 2 (週二)", status: "No", intensity: "輕鬆", date: "April 7, 2026", swim: "", bike: "40", content: "自行車：輕鬆騎 40km @ Z2 (檢查裝備、營養試驗)", hours: 1.5, type: "輕鬆恢復", run: "", week: "Week 13", phase: "賽前週" },
    { day: "Week 13 - Day 3 (週三)", status: "No", intensity: "輕鬆", date: "April 8, 2026", swim: "1.5", bike: "", content: "游泳：開放水域 1.5km (熟悉環境、測試防寒衣) | 跑步：輕鬆跑 4km", hours: 1.5, type: "技術課", run: "4", week: "Week 13", phase: "賽前週" },
    { day: "Week 13 - Day 4 (週四)", status: "No", intensity: "休息", date: "April 9, 2026", swim: "", bike: "", content: "完全休息日 - 保存體力，準備裝備", hours: 0, type: "完全休息", run: "", week: "Week 13", phase: "賽前週" },
    { day: "Week 13 - Day 5 (週五)", status: "No", intensity: "輕鬆", date: "April 10, 2026", swim: "", bike: "20", content: "賽前活化：自行車 20km (含 3x3分鐘 @ 比賽配速) + 跑步 3km (含 3x1分鐘 @ 比賽配速)", hours: 1.5, type: "配速訓練", run: "3", week: "Week 13", phase: "賽前週" },
    { day: "Week 13 - Day 6 (週六)", status: "No", intensity: "休息", date: "April 11, 2026", swim: "", bike: "", content: "完全休息日 - 前往澎湖，營養調整，檢查裝備", hours: 0, type: "完全休息", run: "", week: "Week 13", phase: "賽前週" },
    { day: "Week 13 - Day 7 (週日) - 比賽日", status: "No", intensity: "最大", date: "April 12, 2026", swim: "3.8", bike: "180", content: "🏆 DT Swiss X Ironman 澎湖 2026 🏆 | 目標時間：Sub-12小時 | 游泳 3.8km：1:35:00 | 自行車 180km：6:00:00 | 跑步 42.2km：4:05:00", hours: 12, type: "比賽日", run: "42.2", week: "Week 13", phase: "賽前週" }
];

// Sort by date
trainingData.sort((a, b) => new Date(a.date) - new Date(b.date));

// Populate schedule table
function populateSchedule(filter = 'all') {
    const tbody = document.getElementById('scheduleBody');
    tbody.innerHTML = '';

    const filteredData = filter === 'all'
        ? trainingData
        : trainingData.filter(item => item.phase === filter);

    filteredData.forEach(item => {
        const row = document.createElement('tr');

        // Find the original index in trainingData
        const originalIndex = trainingData.findIndex(d => d.date === item.date);

        // Add classes for styling
        if (item.intensity === '休息') {
            row.classList.add('rest-day');
        }
        if (item.type === '比賽日') {
            row.classList.add('race-day');
        }
        if (item.holiday) {
            row.classList.add('holiday-row');
        }

        // Determine if there are workouts (not a rest day)
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
            <td>
                ${hasWorkout ? `<button class="btn-view-workout" onclick="showWorkoutModal(${originalIndex})">查看訓練</button>` : '-'}
            </td>
        `;

        tbody.appendChild(row);
    });
}

// Format date for display
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
    return `${month}/${day} (${weekday})`;
}

// Filter buttons
document.addEventListener('DOMContentLoaded', () => {
    populateSchedule();

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            populateSchedule(btn.dataset.filter);
        });
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(26, 26, 26, 0.98)';
        } else {
            header.style.background = 'rgba(26, 26, 26, 0.95)';
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Add animation to elements
    document.querySelectorAll('.phase, .strategy-card, .success-card, .race-segment').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Weekly Mileage Chart
    initWeeklyMileageChart();

    // Today's Training
    displayTodayTraining();
});

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

// Countdown to race day
function updateCountdown() {
    const raceDay = new Date('2026-04-12T06:00:00+08:00');
    const now = new Date();
    const diff = raceDay - now;

    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = days;
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    } else {
        if (daysEl) daysEl.textContent = '0';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';
    }
}

// Update countdown every second
updateCountdown();
setInterval(updateCountdown, 1000);

// ===========================================
// Training Parameters (固定訓練參數)
// ===========================================
const TRAINING_PARAMS = {
    // Cycling: FTP 190W
    FTP: 190,
    // Running: Marathon Pace 4:30/km = 270 seconds/km
    MARATHON_PACE_SEC: 270,
    // Swimming: CSS 2:30/100m = 150 seconds/100m
    CSS_SEC: 150
};

// Power Zones (based on FTP)
const POWER_ZONES = {
    Z1: { min: 0.45, max: 0.55, name: 'Recovery' },      // 86-105W
    Z2: { min: 0.55, max: 0.75, name: 'Endurance' },     // 105-143W
    Z3: { min: 0.75, max: 0.88, name: 'Tempo' },         // 143-167W
    SS: { min: 0.88, max: 0.94, name: 'Sweet Spot' },    // 167-179W
    Z4: { min: 0.94, max: 1.05, name: 'Threshold' },     // 179-200W
    Z5: { min: 1.05, max: 1.20, name: 'VO2max' }         // 200-228W
};

// Run Pace Zones (based on Marathon Pace)
// Slower = higher multiplier (more seconds per km)
const RUN_PACE_ZONES = {
    EASY: 1.15,        // +15% time = 310.5s/km = 5:10/km
    LONG: 1.10,        // +10% time = 297s/km = 4:57/km
    MARATHON: 1.00,    // MP = 270s/km = 4:30/km
    TEMPO: 0.95,       // -5% time = 256.5s/km = 4:16/km
    THRESHOLD: 0.92,   // -8% time = 248.4s/km = 4:08/km
    INTERVAL: 0.85,    // -15% time = 229.5s/km = 3:49/km
    REP: 0.80          // -20% time = 216s/km = 3:36/km
};

// Swim Pace Zones (based on CSS)
// Slower = higher multiplier (more seconds per 100m)
const SWIM_PACE_ZONES = {
    RECOVERY: 1.20,    // +20% = 180s/100m = 3:00/100m
    EASY: 1.10,        // +10% = 165s/100m = 2:45/100m
    AEROBIC: 1.05,     // +5% = 157.5s/100m = 2:37/100m
    CSS: 1.00,         // CSS = 150s/100m = 2:30/100m
    THRESHOLD: 0.95,   // -5% = 142.5s/100m = 2:22/100m
    SPRINT: 0.90       // -10% = 135s/100m = 2:15/100m
};

// ===========================================
// Pace/Power Calculation Helpers
// ===========================================

// Convert run pace (seconds/km) to speed (m/s) for Garmin API
function runPaceToSpeed(paceSecondsPerKm) {
    return 1000 / paceSecondsPerKm;
}

// Get run pace target object for Garmin API
function getRunPaceTarget(zone) {
    const multiplier = RUN_PACE_ZONES[zone] || RUN_PACE_ZONES.EASY;
    const paceSeconds = TRAINING_PARAMS.MARATHON_PACE_SEC * multiplier;
    // Allow ±5% variance
    const fastPace = paceSeconds * 0.95;
    const slowPace = paceSeconds * 1.05;
    return {
        targetType: { workoutTargetTypeId: 5, workoutTargetTypeKey: 'speed.zone' },
        targetValueOne: runPaceToSpeed(slowPace),  // slower pace = lower m/s
        targetValueTwo: runPaceToSpeed(fastPace)   // faster pace = higher m/s
    };
}

// Convert swim pace (seconds/100m) to speed (m/s) for Garmin API
function swimPaceToSpeed(paceSecondsPer100m) {
    return 100 / paceSecondsPer100m;
}

// Get swim pace target object for Garmin API
function getSwimPaceTarget(zone) {
    const multiplier = SWIM_PACE_ZONES[zone] || SWIM_PACE_ZONES.CSS;
    const paceSeconds = TRAINING_PARAMS.CSS_SEC * multiplier;
    // Allow ±3% variance for swim
    const fastPace = paceSeconds * 0.97;
    const slowPace = paceSeconds * 1.03;
    return {
        targetType: { workoutTargetTypeId: 5, workoutTargetTypeKey: 'speed.zone' },
        targetValueOne: swimPaceToSpeed(slowPace),  // slower pace = lower m/s
        targetValueTwo: swimPaceToSpeed(fastPace)   // faster pace = higher m/s
    };
}

// Get power target object for Garmin API
function getPowerTarget(zone) {
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
function getCadenceTarget(minRpm, maxRpm) {
    return {
        secondaryTargetType: { workoutTargetTypeId: 3, workoutTargetTypeKey: 'cadence.zone' },
        secondaryTargetValueOne: minRpm,
        secondaryTargetValueTwo: maxRpm
    };
}

// Parse pace string like "2:30/100m" or "4:30/km" to seconds
function parsePaceString(paceStr) {
    const match = paceStr.match(/(\d+):(\d+)/);
    if (match) {
        return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return null;
}

// Convert training data to Garmin Workout JSON format
function convertToGarminWorkout(training, index, overrideDate = null) {
    const workouts = [];

    // Sport type mappings: 1=running, 2=cycling, 4=swimming (pool), 5=swimming (open water)
    const sportTypes = {
        swim: { sportTypeId: 4, sportTypeKey: 'swimming_pool' },
        bike: { sportTypeId: 2, sportTypeKey: 'cycling' },
        run: { sportTypeId: 1, sportTypeKey: 'running' }
    };

    // Parse workout content to extract details
    const content = training.content;
    // Use override date if provided, otherwise use training's original date
    const dateObj = overrideDate ? new Date(overrideDate) : new Date(training.date);
    const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

    // Create swim workout if exists
    if (training.swim && parseFloat(training.swim) > 0) {
        resetStepIdCounter();
        const swimDistance = parseFloat(training.swim) * 1000; // Convert to meters
        const rawSteps = generateSwimSteps(swimDistance, content);
        const swimWorkout = {
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
            estimatedDurationInSecs: Math.round(swimDistance * 2.5 / 100 * 60), // Estimate based on 2:30/100m
            estimatedDistanceInMeters: swimDistance,
            poolLength: 25,
            poolLengthUnit: { unitId: 1, unitKey: 'meter' },
            scheduledDate: dateStr
        };
        workouts.push({ type: 'swim', data: swimWorkout });
    }

    // Create bike workout if exists
    if (training.bike && parseFloat(training.bike) > 0) {
        resetStepIdCounter();
        const bikeDistance = parseFloat(training.bike) * 1000; // Convert to meters
        const rawSteps = generateBikeSteps(bikeDistance, content);
        const bikeWorkout = {
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
            estimatedDurationInSecs: Math.round(bikeDistance / 1000 / 30 * 3600), // Estimate based on 30km/h
            estimatedDistanceInMeters: bikeDistance,
            scheduledDate: dateStr
        };
        workouts.push({ type: 'bike', data: bikeWorkout });
    }

    // Create run workout if exists
    if (training.run && parseFloat(training.run) > 0) {
        resetStepIdCounter();
        const runDistance = parseFloat(training.run) * 1000; // Convert to meters
        const rawSteps = generateRunSteps(runDistance, content);
        const runWorkout = {
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
            estimatedDurationInSecs: Math.round(runDistance / 1000 * 6 * 60), // Estimate based on 6:00/km
            estimatedDistanceInMeters: runDistance,
            scheduledDate: dateStr
        };
        workouts.push({ type: 'run', data: runWorkout });
    }

    return workouts;
}

// Extract workout description for specific sport
function extractWorkoutPart(content, sport) {
    const parts = content.split('|').map(p => p.trim());
    for (const part of parts) {
        if (part.includes(sport)) {
            return part;
        }
    }
    return content;
}

// Format a workout step with required Garmin API fields
let stepIdCounter = 0;
function formatStep(step) {
    const stepId = ++stepIdCounter;
    const formattedStep = {
        type: step.stepType.stepTypeKey === 'repeat' ? 'RepeatGroupDTO' : 'ExecutableStepDTO',
        stepId: stepId,
        stepOrder: step.stepOrder,
        childStepId: null,
        stepType: step.stepType,
        targetType: step.targetType || { workoutTargetTypeId: 1, workoutTargetTypeKey: 'no.target' },
        targetValueOne: step.targetValueOne !== undefined ? step.targetValueOne : null,
        targetValueTwo: step.targetValueTwo !== undefined ? step.targetValueTwo : null
    };

    // Add endCondition for non-repeat steps
    if (step.endCondition) {
        formattedStep.endCondition = step.endCondition;
        formattedStep.endConditionValue = step.endConditionValue;
    }

    // Add secondary target (e.g., cadence for cycling)
    if (step.secondaryTargetType) {
        formattedStep.secondaryTargetType = step.secondaryTargetType;
        formattedStep.secondaryTargetValueOne = step.secondaryTargetValueOne !== undefined ? step.secondaryTargetValueOne : null;
        formattedStep.secondaryTargetValueTwo = step.secondaryTargetValueTwo !== undefined ? step.secondaryTargetValueTwo : null;
    }

    // Handle repeat steps with nested workoutSteps
    if (step.workoutSteps) {
        formattedStep.numberOfIterations = step.numberOfIterations;
        formattedStep.workoutSteps = step.workoutSteps.map(childStep => formatStep(childStep));
    }

    return formattedStep;
}

// Reset step ID counter for each workout
function resetStepIdCounter() {
    stepIdCounter = 0;
}

// Generate swim workout steps
function generateSwimSteps(totalDistance, content) {
    const steps = [];
    let stepOrder = 1;

    // Determine workout type from content
    const isRecovery = content.includes('恢復') || content.includes('輕鬆');
    const isTechnical = content.includes('技術') || content.includes('划頻') || content.includes('踢水');
    const isTest = content.includes('測試') || content.includes('目標配速');

    // Check for intervals pattern like "6x400m", "10x200m", "8x300m"
    const intervalMatch = content.match(/(\d+)\s*[xX×]\s*(\d+)\s*m/i);

    // Try to parse target pace from content like "@ 2:35/100m"
    const paceMatch = content.match(/@\s*(\d+):(\d+)\/100m/);
    let targetPaceZone = 'CSS';  // Default to CSS pace
    if (paceMatch) {
        const targetPace = parseInt(paceMatch[1]) * 60 + parseInt(paceMatch[2]);
        // Determine zone based on target pace vs CSS
        const cssRatio = targetPace / TRAINING_PARAMS.CSS_SEC;
        if (cssRatio >= 1.15) targetPaceZone = 'RECOVERY';
        else if (cssRatio >= 1.08) targetPaceZone = 'EASY';
        else if (cssRatio >= 1.02) targetPaceZone = 'AEROBIC';
        else if (cssRatio >= 0.97) targetPaceZone = 'CSS';
        else if (cssRatio >= 0.92) targetPaceZone = 'THRESHOLD';
        else targetPaceZone = 'SPRINT';
    }

    // Get pace targets
    const warmupPace = getSwimPaceTarget('EASY');
    const mainPace = getSwimPaceTarget(targetPaceZone);
    const recoveryPace = getSwimPaceTarget('RECOVERY');

    // Calculate rest time based on interval distance
    function getRestTime(distance) {
        if (distance <= 100) return 15;
        if (distance <= 200) return 30;
        if (distance <= 300) return 40;
        if (distance <= 400) return 45;
        return 60;
    }

    if (intervalMatch) {
        // Interval workout
        const reps = parseInt(intervalMatch[1]);
        const distance = parseInt(intervalMatch[2]);
        const mainSetDistance = reps * distance;
        const restTime = getRestTime(distance);

        // Calculate warmup/cooldown (remaining distance split)
        let warmupDistance = Math.round((totalDistance - mainSetDistance) / 2);
        let cooldownDistance = totalDistance - mainSetDistance - warmupDistance;

        // Ensure minimum warmup of 300m
        if (warmupDistance < 300 && totalDistance > mainSetDistance + 300) {
            warmupDistance = 300;
            cooldownDistance = totalDistance - mainSetDistance - warmupDistance;
        }

        // Warmup
        if (warmupDistance > 0) {
            steps.push({
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: warmupDistance,
                ...warmupPace
            });
        }

        // Main set - Interval repeats
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

        // Cooldown
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
        // Technical session: warmup + drills + technique + cooldown
        const warmupDistance = Math.round(totalDistance * 0.2);
        const drillDistance = Math.round(totalDistance * 0.4);
        const techniqueDistance = Math.round(totalDistance * 0.25);
        const cooldownDistance = totalDistance - warmupDistance - drillDistance - techniqueDistance;

        // Warmup
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: warmupDistance,
            ...warmupPace
        });

        // Drill set (4x repeats)
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

        // Technique swim at aerobic pace
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: techniqueDistance,
            ...getSwimPaceTarget('AEROBIC')
        });

        // Cooldown
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: cooldownDistance,
            ...recoveryPace
        });

    } else if (isRecovery) {
        // Recovery swim: easy pace throughout
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
        // Default: steady swim at aerobic pace
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
    const hasFTP = content.includes('FTP') || content.includes('測試');
    const hasClimb = content.includes('爬坡');

    // Check for Sweet Spot intervals: "3x20分鐘 @ Sweet Spot", "4x15分鐘 @ Sweet Spot"
    const ssMatch = content.match(/(\d+)\s*[xX×]\s*(\d+)\s*分鐘.*Sweet\s*Spot/i);

    // Check for FTP/threshold intervals: "2x20分鐘 @ FTP"
    const ftpMatch = content.match(/(\d+)\s*[xX×]\s*(\d+)\s*分鐘.*(?:FTP|閾值)/i);

    // Get power targets
    const z1Power = getPowerTarget('Z1');  // Recovery: 86-105W
    const z2Power = getPowerTarget('Z2');  // Endurance: 105-143W
    const z3Power = getPowerTarget('Z3');  // Tempo: 143-167W
    const ssPower = getPowerTarget('SS');  // Sweet Spot: 167-179W
    const z4Power = getPowerTarget('Z4');  // Threshold: 179-200W

    // Get cadence targets
    const normalCadence = getCadenceTarget(85, 95);
    const highCadence = getCadenceTarget(95, 105);

    if (ssMatch) {
        // Sweet Spot workout with actual power values
        const reps = parseInt(ssMatch[1]);
        const minutes = parseInt(ssMatch[2]);
        const warmupDistance = Math.round(totalDistance * 0.15);

        // Warmup at Z2 with activation spin-ups
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: warmupDistance,
            ...z2Power,
            ...normalCadence
        });

        // Activation spin-ups (3x1min high cadence)
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

        // Sweet Spot intervals with actual power values (167-179W for FTP 190)
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
                    endConditionValue: 300,  // 5 min recovery
                    ...z1Power
                }
            ]
        });

        // Cooldown
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 1, conditionTypeKey: 'lap.button' },
            ...z1Power,
            ...normalCadence
        });

    } else if (ftpMatch || hasFTP) {
        // FTP/Threshold workout
        const reps = ftpMatch ? parseInt(ftpMatch[1]) : 2;
        const minutes = ftpMatch ? parseInt(ftpMatch[2]) : 20;
        const warmupDistance = Math.round(totalDistance * 0.15);

        // Warmup
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: warmupDistance,
            ...z2Power,
            ...normalCadence
        });

        // Build-ups
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

        // FTP intervals at threshold power (179-200W)
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
                    endConditionValue: 600,  // 10 min recovery
                    ...z1Power
                }
            ]
        });

        // Cooldown
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 1, conditionTypeKey: 'lap.button' },
            ...z1Power
        });

    } else if (isLongRide) {
        // Long endurance ride at Z2 with tempo surges
        const warmupDistance = 10000;  // 10km warmup
        const cooldownDistance = 5000;  // 5km cooldown
        const mainDistance = totalDistance - warmupDistance - cooldownDistance;

        // Warmup
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: warmupDistance,
            ...z2Power,
            ...normalCadence
        });

        // Main set: Z2 blocks with tempo surges every ~30km
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
                        endConditionValue: blockDistance - 3000,  // Main Z2 portion
                        ...z2Power,
                        ...normalCadence
                    },
                    {
                        stepOrder: 2,
                        stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                        endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                        endConditionValue: 3000,  // 3km tempo surge
                        ...z3Power,
                        ...normalCadence
                    }
                ]
            });
        } else {
            // Single main set for shorter "long" rides
            steps.push({
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                endConditionValue: mainDistance,
                ...z2Power,
                ...normalCadence
            });
        }

        // Cooldown
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: cooldownDistance,
            ...z1Power
        });

    } else if (isRecovery) {
        // Recovery ride at Z1
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
        // Default: Z2 endurance ride with power targets
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
    const isRecovery = content.includes('恢復') || content.includes('輕鬆');
    const isLongRun = totalDistance >= 15000 || content.includes('長跑');
    const isBrick = content.includes('磚式') || content.includes('接續跑') || content.includes('轉換');
    const isTempo = content.includes('節奏跑') || content.includes('T配速');
    const hasProgressive = content.includes('漸進') || content.includes('M配速') || content.includes('前');

    // Check for interval pattern like "8x1km", "6x1.2km", "8x400m"
    const intervalKmMatch = content.match(/(\d+)\s*[xX×]\s*([\d.]+)\s*km/i);
    const intervalMMatch = content.match(/(\d+)\s*[xX×]\s*(\d+)\s*m(?!\w)/i);

    // Try to parse target pace from content like "@ 4:45/km"
    const paceMatch = content.match(/@\s*(\d+):(\d+)\/km/);

    // Get pace targets with actual speed values
    const easyPace = getRunPaceTarget('EASY');           // ~5:10/km = 3.22 m/s
    const longPace = getRunPaceTarget('LONG');           // ~4:57/km = 3.37 m/s
    const marathonPace = getRunPaceTarget('MARATHON');   // 4:30/km = 3.70 m/s
    const tempoPace = getRunPaceTarget('TEMPO');         // ~4:16/km = 3.90 m/s
    const thresholdPace = getRunPaceTarget('THRESHOLD'); // ~4:08/km = 4.03 m/s
    const intervalPace = getRunPaceTarget('INTERVAL');   // ~3:49/km = 4.36 m/s
    const recoveryPace = getRunPaceTarget('EASY');       // Recovery jog

    // Calculate rest time based on interval distance
    function getRestTime(distanceMeters) {
        if (distanceMeters <= 400) return 60;
        if (distanceMeters <= 800) return 90;
        if (distanceMeters <= 1000) return 90;
        if (distanceMeters <= 1200) return 120;
        return 120;
    }

    if (intervalKmMatch || intervalMMatch) {
        // Interval workout
        let reps, intervalDistance;
        if (intervalKmMatch) {
            reps = parseInt(intervalKmMatch[1]);
            intervalDistance = parseFloat(intervalKmMatch[2]) * 1000;
        } else {
            reps = parseInt(intervalMMatch[1]);
            intervalDistance = parseInt(intervalMMatch[2]);
        }
        const restTime = getRestTime(intervalDistance);

        // Determine interval pace zone based on content or default
        let intervalTarget = intervalPace;
        if (paceMatch) {
            const targetPaceSec = parseInt(paceMatch[1]) * 60 + parseInt(paceMatch[2]);
            const mpRatio = targetPaceSec / TRAINING_PARAMS.MARATHON_PACE_SEC;
            if (mpRatio >= 1.10) intervalTarget = easyPace;
            else if (mpRatio >= 1.00) intervalTarget = marathonPace;
            else if (mpRatio >= 0.93) intervalTarget = tempoPace;
            else if (mpRatio >= 0.88) intervalTarget = thresholdPace;
            else intervalTarget = intervalPace;
        }

        // Warmup with strides
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: 2000,
            ...easyPace
        });

        // Strides (4x100m)
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

        // Cooldown
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: 2000,
            ...easyPace
        });

    } else if (isTempo) {
        // Tempo/Threshold run
        const warmupDistance = 2000;
        const cooldownDistance = 2000;
        const tempoDistance = totalDistance - warmupDistance - cooldownDistance;

        // Warmup
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: warmupDistance,
            ...easyPace
        });

        // Drills (3x100m)
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 6, stepTypeKey: 'repeat' },
            numberOfIterations: 3,
            workoutSteps: [
                {
                    stepOrder: 1,
                    stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
                    endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
                    endConditionValue: 100,
                    targetType: { workoutTargetTypeId: 1, workoutTargetTypeKey: 'no.target' }
                },
                {
                    stepOrder: 2,
                    stepType: { stepTypeId: 4, stepTypeKey: 'rest' },
                    endCondition: { conditionTypeId: 2, conditionTypeKey: 'time' },
                    endConditionValue: 30,
                    targetType: { workoutTargetTypeId: 1, workoutTargetTypeKey: 'no.target' }
                }
            ]
        });

        // Tempo segment
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: tempoDistance - 300,  // Minus drills
            ...tempoPace
        });

        // Cooldown
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: cooldownDistance,
            ...easyPace
        });

    } else if (isBrick) {
        // Brick run (post-bike transition run)
        // Conservative start, then build to race pace
        const transitionDistance = 1000;  // First km conservative
        const mainDistance = totalDistance - transitionDistance;

        // Transition/conservative start
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: transitionDistance,
            ...longPace  // Conservative pace for transition
        });

        // Main run at race pace
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: mainDistance,
            ...marathonPace  // Build to race pace
        });

    } else if (isLongRun && hasProgressive) {
        // Progressive long run: 60% easy, 40% at marathon pace
        const warmupDistance = Math.round(totalDistance * 0.1);
        const easyDistance = Math.round(totalDistance * 0.5);
        const mpDistance = Math.round(totalDistance * 0.3);
        const cooldownDistance = totalDistance - warmupDistance - easyDistance - mpDistance;

        // Warmup
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: warmupDistance,
            ...easyPace
        });

        // Easy portion (long run pace)
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: easyDistance,
            ...longPace
        });

        // Marathon pace portion
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: mpDistance,
            ...marathonPace
        });

        // Cooldown
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: cooldownDistance,
            ...easyPace
        });

    } else if (isLongRun) {
        // Standard long run at long-run pace
        const warmupDistance = 2000;
        const cooldownDistance = 2000;
        const mainDistance = totalDistance - warmupDistance - cooldownDistance;

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
            ...longPace
        });
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: cooldownDistance,
            ...easyPace
        });

    } else if (isRecovery) {
        // Recovery/easy run
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 1, stepTypeKey: 'warmup' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: Math.round(totalDistance * 0.1),
            ...easyPace
        });
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 3, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: Math.round(totalDistance * 0.8),
            ...easyPace
        });
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: Math.round(totalDistance * 0.1),
            ...easyPace
        });

    } else {
        // Default: easy run with pace target
        const warmupDistance = Math.round(totalDistance * 0.1);
        const mainDistance = Math.round(totalDistance * 0.8);
        const cooldownDistance = totalDistance - warmupDistance - mainDistance;

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
            ...easyPace
        });
        steps.push({
            stepOrder: stepOrder++,
            stepType: { stepTypeId: 2, stepTypeKey: 'cooldown' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'distance' },
            endConditionValue: cooldownDistance,
            ...easyPace
        });
    }

    return steps;
}

// Show workout modal
// overrideDate: if provided, the workouts will be scheduled for this date instead of training's original date
function showWorkoutModal(dayIndex, overrideDate = null) {
    console.log('showWorkoutModal called with index:', dayIndex, 'overrideDate:', overrideDate);
    window.currentWorkoutDayIndex = dayIndex;
    window.currentWorkoutOverrideDate = overrideDate;
    const training = trainingData[dayIndex];
    if (!training) {
        console.error('Training not found for index:', dayIndex);
        return;
    }
    const workouts = convertToGarminWorkout(training, dayIndex, overrideDate);

    const modal = document.getElementById('workoutModal');
    const modalContent = document.getElementById('workoutModalContent');

    if (!modal || !modalContent) {
        console.error('Modal elements not found');
        return;
    }

    // Show scheduled date info (if override date is used)
    const scheduledDateObj = overrideDate ? new Date(overrideDate) : new Date(training.date);
    const scheduledDateStr = `${scheduledDateObj.getFullYear()}/${scheduledDateObj.getMonth() + 1}/${scheduledDateObj.getDate()}`;
    const isOverride = overrideDate && overrideDate !== training.date;

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
            ${isOverride ? `<div class="scheduled-date-notice">📅 匯入日期：<strong>${scheduledDateStr}</strong>（今日）</div>` : ''}
            <div class="training-description">${training.content}</div>
    `;

    if (workouts.length === 0) {
        html += `<div class="no-workout">此日無訓練內容</div>`;
    } else {
        workouts.forEach((workout, idx) => {
            const typeLabel = { swim: '游泳', bike: '自行車', run: '跑步' }[workout.type];
            const typeColor = { swim: 'var(--swim-color)', bike: 'var(--bike-color)', run: 'var(--run-color)' }[workout.type];

            const escapedName = workout.data.workoutName.replace(/'/g, "\\'").replace(/"/g, '\\"');
            const isBike = workout.type === 'bike';
            html += `
                <div class="workout-section" style="border-left: 4px solid ${typeColor}">
                    <div class="workout-header">
                        <img src="images/${workout.type === 'swim' ? 'swim' : workout.type === 'bike' ? 'cycling' : 'run'}.png" class="workout-type-icon" alt="${typeLabel}">
                        <span class="workout-type-label">${typeLabel}</span>
                    </div>
                    <div class="workout-name">${workout.data.workoutName}</div>
                    <div class="workout-desc">${workout.data.description}</div>
                    <div class="workout-stats">
                        <span>距離: ${(workout.data.estimatedDistanceInMeters / 1000).toFixed(1)} km</span>
                        <span>預估時間: ${Math.round(workout.data.estimatedDurationInSecs / 60)} 分鐘</span>
                    </div>
                    <details class="workout-json-details">
                        <summary>查看 JSON</summary>
                        <textarea class="workout-json" id="workout-json-${idx}" rows="12">${JSON.stringify(workout.data, null, 2)}</textarea>
                        <div class="json-actions">
                            <button class="btn-copy" onclick="copyWorkoutJson(${idx}, this)">複製 JSON</button>
                            <button class="btn-download" onclick="downloadWorkoutJson(${idx}, '${escapedName}')">下載 .json</button>
                            ${isBike ? `<button class="btn-download btn-zwo" onclick="downloadWorkoutZWO(${idx}, '${escapedName}')">下載 ZWO</button>
                            <button class="btn-download btn-erg" onclick="downloadWorkoutERG(${idx}, '${escapedName}')">下載 ERG</button>` : ''}
                        </div>
                    </details>
                </div>
            `;
        });
    }

    // Garmin Connect section - Direct import (login + import in one step)
    html += `
            <div class="garmin-section">
                <h4>匯入 Garmin Connect</h4>
                <div class="garmin-manual-note">
                    <p><strong>💡 建議方式：</strong>使用上方「複製 JSON」或「下載 .json」，然後到 <a href="https://connect.garmin.com/modern/workouts" target="_blank">Garmin Connect 網站</a> 手動匯入</p>
                </div>
                ${workouts.length > 0 ? `
                    <details class="garmin-login-details">
                        <summary>自動匯入（實驗性功能）</summary>
                        <div class="garmin-login-form" id="garminLoginForm">
                            <p class="garmin-warning">⚠️ Garmin 可能會封鎖自動登入，如失敗請使用手動匯入</p>
                            <input type="email" id="garminEmail" placeholder="Garmin Email" class="garmin-input">
                            <input type="password" id="garminPassword" placeholder="密碼" class="garmin-input">
                            <button class="btn-garmin-import" onclick="directImportToGarmin(${dayIndex})">
                                登入並匯入訓練
                            </button>
                        </div>
                    </details>
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

// Close workout modal
function closeWorkoutModal() {
    const modal = document.getElementById('workoutModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// Copy workout JSON to clipboard
function copyWorkoutJson(idx, btn) {
    const textarea = document.getElementById(`workout-json-${idx}`);
    textarea.select();
    document.execCommand('copy');

    const originalText = btn.textContent;
    btn.textContent = '已複製!';
    btn.classList.add('copied');
    setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('copied');
    }, 2000);
}

// Download workout JSON as file
function downloadWorkoutJson(idx, filename) {
    const textarea = document.getElementById(`workout-json-${idx}`);
    const json = textarea.value;
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================
// Trainer File Formats (ZWO, ERG)
// ============================================

// Convert Garmin workout to Zwift ZWO format (XML)
function convertToZWO(workout) {
    const steps = workout.workoutSegments[0]?.workoutSteps || [];
    const FTP = TRAINING_PARAMS.FTP;

    // Helper to convert power watts to FTP percentage
    function powerToFTP(watts) {
        return (watts / FTP).toFixed(2);
    }

    // Helper to get power from step (handles different formats)
    function getStepPower(step) {
        if (step.targetValueOne && step.targetValueTwo) {
            // Average of min/max
            return (step.targetValueOne + step.targetValueTwo) / 2;
        }
        // Default to Z2 if no target
        return FTP * 0.65;
    }

    // Helper to get power range
    function getStepPowerRange(step) {
        if (step.targetValueOne && step.targetValueTwo) {
            return {
                low: step.targetValueOne,
                high: step.targetValueTwo
            };
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

    // Process each step
    steps.forEach(step => {
        const stepType = step.stepType?.stepTypeKey;
        const duration = step.endConditionValue || 300;
        const isTime = step.endCondition?.conditionTypeKey === 'time';
        const isDistance = step.endCondition?.conditionTypeKey === 'distance';

        // Calculate duration in seconds
        let durationSecs;
        if (isTime) {
            durationSecs = duration;
        } else if (isDistance) {
            // Estimate time from distance (assume 30 km/h average)
            durationSecs = Math.round(duration / 1000 * 120); // 120 sec per km = 30 km/h
        } else {
            durationSecs = 300; // Default 5 minutes
        }

        if (stepType === 'repeat' && step.workoutSteps) {
            // Handle repeat/interval blocks
            const reps = step.numberOfIterations || 1;
            const childSteps = step.workoutSteps;

            if (childSteps.length >= 2) {
                // Interval format: work + rest
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

                zwoContent += `        <IntervalsT Repeat="${reps}" OnDuration="${onDuration}" OffDuration="${offDuration}" OnPower="${onPower}" OffPower="${offPower}"/>
`;
            }
        } else if (stepType === 'warmup') {
            const powerRange = getStepPowerRange(step);
            zwoContent += `        <Warmup Duration="${durationSecs}" PowerLow="${powerToFTP(powerRange.low * 0.8)}" PowerHigh="${powerToFTP(powerRange.high)}"/>
`;
        } else if (stepType === 'cooldown') {
            const powerRange = getStepPowerRange(step);
            zwoContent += `        <Cooldown Duration="${durationSecs}" PowerLow="${powerToFTP(powerRange.high)}" PowerHigh="${powerToFTP(powerRange.low * 0.8)}"/>
`;
        } else if (stepType === 'interval' || stepType === 'active') {
            const power = powerToFTP(getStepPower(step));
            zwoContent += `        <SteadyState Duration="${durationSecs}" Power="${power}"/>
`;
        } else if (stepType === 'rest' || stepType === 'recovery') {
            zwoContent += `        <SteadyState Duration="${durationSecs}" Power="0.50"/>
`;
        }
    });

    zwoContent += `    </workout>
</workout_file>`;

    return zwoContent;
}

// Helper function to escape XML special characters
function escapeXml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Convert Garmin workout to ERG/MRC format
function convertToERG(workout) {
    const steps = workout.workoutSegments[0]?.workoutSteps || [];
    const FTP = TRAINING_PARAMS.FTP;

    // Helper to get power from step
    function getStepPower(step) {
        if (step.targetValueOne && step.targetValueTwo) {
            return Math.round((step.targetValueOne + step.targetValueTwo) / 2);
        }
        return Math.round(FTP * 0.65); // Default Z2
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

    let currentTime = 0; // in minutes

    // Process each step
    function processStep(step, isChild = false) {
        const stepType = step.stepType?.stepTypeKey;
        const duration = step.endConditionValue || 300;
        const isTime = step.endCondition?.conditionTypeKey === 'time';
        const isDistance = step.endCondition?.conditionTypeKey === 'distance';

        // Calculate duration in minutes
        let durationMins;
        if (isTime) {
            durationMins = duration / 60;
        } else if (isDistance) {
            durationMins = (duration / 1000) * 2; // 2 min per km = 30 km/h
        } else {
            durationMins = 5; // Default
        }

        if (stepType === 'repeat' && step.workoutSteps) {
            const reps = step.numberOfIterations || 1;
            for (let i = 0; i < reps; i++) {
                step.workoutSteps.forEach(childStep => {
                    processStep(childStep, true);
                });
            }
        } else {
            let power;
            if (stepType === 'warmup') {
                // Ramp up
                const startPower = Math.round(FTP * 0.45);
                const endPower = getStepPower(step);
                ergContent += `${currentTime.toFixed(2)}\t${startPower}\n`;
                currentTime += durationMins;
                ergContent += `${currentTime.toFixed(2)}\t${endPower}\n`;
            } else if (stepType === 'cooldown') {
                // Ramp down
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
                // Interval or steady state
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
    const textarea = document.getElementById(`workout-json-${idx}`);
    const workout = JSON.parse(textarea.value);
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
function downloadWorkoutERG(idx, filename) {
    const textarea = document.getElementById(`workout-json-${idx}`);
    const workout = JSON.parse(textarea.value);
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

// ============================================
// Garmin Connect Integration
// ============================================

const GARMIN_SESSION_KEY = 'garmin_session_id';

// Get Garmin session from localStorage
function getGarminSession() {
    return localStorage.getItem(GARMIN_SESSION_KEY);
}

// Set Garmin session to localStorage
function setGarminSession(sessionId) {
    localStorage.setItem(GARMIN_SESSION_KEY, sessionId);
}

// Clear Garmin session
function clearGarminSession() {
    localStorage.removeItem(GARMIN_SESSION_KEY);
}

// Update Garmin status message
function updateGarminStatus(message, isError = false) {
    const statusEl = document.getElementById('garminStatus');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = `garmin-status ${isError ? 'error' : 'success'}`;
        statusEl.style.display = message ? 'block' : 'none';
    }
}

// Login to Garmin Connect
async function garminLogin() {
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            setGarminSession(data.sessionId);
            updateGarminStatus(`登入成功！歡迎 ${data.user.displayName}`, false);

            // Refresh modal to show logged-in state
            setTimeout(() => {
                const currentIndex = window.currentWorkoutDayIndex;
                if (currentIndex !== undefined) {
                    showWorkoutModal(currentIndex);
                }
            }, 1000);
        } else {
            let errorMsg = data.error || '登入失敗';
            if (data.detail) {
                errorMsg += '\n' + data.detail;
            }
            updateGarminStatus(errorMsg, true);
        }
    } catch (error) {
        console.error('Garmin login error:', error);
        updateGarminStatus('連線錯誤，請使用「複製 JSON」或「下載 .json」手動匯入', true);
    }
}

// Logout from Garmin Connect
async function garminLogout() {
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
    updateGarminStatus('已登出', false);

    // Refresh modal
    setTimeout(() => {
        const currentIndex = window.currentWorkoutDayIndex;
        if (currentIndex !== undefined) {
            showWorkoutModal(currentIndex);
        }
    }, 500);
}

// Import single workout to Garmin
async function importWorkoutToGarmin(workoutData, scheduledDate) {
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
async function importAllToGarmin(dayIndex) {
    const training = trainingData[dayIndex];
    // Use override date if set (from today's training section)
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
async function directImportToGarmin(dayIndex) {
    const email = document.getElementById('garminEmail')?.value;
    const password = document.getElementById('garminPassword')?.value;

    if (!email || !password) {
        updateGarminStatus('請輸入 Email 和密碼', true);
        return;
    }

    const training = trainingData[dayIndex];
    const overrideDate = window.currentWorkoutOverrideDate;
    const workouts = convertToGarminWorkout(training, dayIndex, overrideDate);

    if (workouts.length === 0) {
        updateGarminStatus('沒有訓練可匯入', true);
        return;
    }

    updateGarminStatus('登入並匯入中...', false);

    try {
        const workoutPayloads = workouts.map(w => ({
            workout: w.data,
            scheduledDate: w.data.scheduledDate
        }));

        const response = await fetch('/api/garmin/import', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                workouts: workoutPayloads
            })
        });

        const data = await response.json();

        if (data.success) {
            updateGarminStatus(data.message || '匯入成功！', false);
        } else {
            let errorMsg = data.error || '匯入失敗';
            if (data.detail) {
                errorMsg += '\n' + data.detail;
            }
            updateGarminStatus(errorMsg, true);
        }
    } catch (error) {
        console.error('Direct import error:', error);
        updateGarminStatus('連線錯誤，請使用「複製 JSON」或「下載 .json」手動匯入', true);
    }
}

// Store current workout day index for modal refresh
window.currentWorkoutDayIndex = undefined;

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

// Display Today's Training
function displayTodayTraining() {
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

    if (!todayLabel) return;

    const today = new Date();
    const trainingStartDate = new Date('2026-01-12');
    const trainingEndDate = new Date('2026-04-12');

    let training = null;
    let trainingIndex = -1;
    let isRandom = false;

    // Check if today is within training period
    if (today >= trainingStartDate && today <= trainingEndDate) {
        // Find today's training
        const todayStr = today.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        trainingIndex = trainingData.findIndex(d => {
            const trainingDate = new Date(d.date);
            return trainingDate.toDateString() === today.toDateString();
        });

        if (trainingIndex >= 0) {
            training = trainingData[trainingIndex];
            todayLabel.textContent = '今日訓練';
        }
    }

    // If not in training period or no training found, show random from 建構期
    if (!training) {
        isRandom = true;
        // Filter to 建構期 only, exclude rest days
        const buildPhaseTrainings = trainingData.filter(d =>
            d.phase === '建構期' && d.intensity !== '休息' && (d.swim || d.bike || d.run)
        );
        const randomTraining = buildPhaseTrainings[Math.floor(Math.random() * buildPhaseTrainings.length)];
        training = randomTraining;
        // Find the index in the original array
        trainingIndex = trainingData.findIndex(d => d.date === randomTraining.date);
        todayLabel.textContent = '今日訓練預覽';
    }

    if (training) {
        // Display training info
        todayPhase.textContent = training.phase;
        todayPhase.className = 'today-phase phase-' + training.phase;

        todayIntensity.textContent = training.intensity;
        todayIntensity.className = 'today-intensity intensity-' + training.intensity;

        todayDescription.textContent = training.content;

        // Display stats
        if (training.swim) {
            todaySwim.innerHTML = '<span class="stat-icon">🏊</span> ' + training.swim + ' km';
            todaySwim.style.display = 'inline-flex';
        } else {
            todaySwim.style.display = 'none';
        }

        if (training.bike) {
            todayBike.innerHTML = '<span class="stat-icon">🚴</span> ' + training.bike + ' km';
            todayBike.style.display = 'inline-flex';
        } else {
            todayBike.style.display = 'none';
        }

        if (training.run) {
            todayRun.innerHTML = '<span class="stat-icon">🏃</span> ' + training.run + ' km';
            todayRun.style.display = 'inline-flex';
        } else {
            todayRun.style.display = 'none';
        }

        if (training.hours) {
            todayHours.innerHTML = '<span class="stat-icon">⏱</span> ' + training.hours + ' h';
            todayHours.style.display = 'inline-flex';
        } else {
            todayHours.style.display = 'none';
        }

        // Display note if random
        if (isRandom) {
            todayNote.textContent = '※ 未到訓練日，隨機顯示';
            todayNote.style.display = 'block';
        } else {
            todayNote.style.display = 'none';
        }

        // Add view/import button if training has workouts
        if (todayActions && trainingIndex >= 0 && (training.swim || training.bike || training.run)) {
            // Only override date for random preview (not actual today's training)
            if (isRandom) {
                const todayISO = today.toISOString().split('T')[0];
                todayActions.innerHTML = `
                    <button class="btn-today-workout" onclick="showWorkoutModal(${trainingIndex}, '${todayISO}')">
                        <span class="btn-icon">📋</span>
                        查看訓練 / 匯入 Garmin
                    </button>
                `;
            } else {
                todayActions.innerHTML = `
                    <button class="btn-today-workout" onclick="showWorkoutModal(${trainingIndex})">
                        <span class="btn-icon">📋</span>
                        查看訓練 / 匯入 Garmin
                    </button>
                `;
            }
            todayActions.style.display = 'block';
        } else if (todayActions) {
            todayActions.style.display = 'none';
        }
    }
}
