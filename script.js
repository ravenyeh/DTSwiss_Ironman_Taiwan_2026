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
    const raceDay = new Date('2026-04-12T06:00:00');
    const now = new Date();
    const diff = raceDay - now;

    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        console.log(`距離比賽還有 ${days} 天`);
    }
}

updateCountdown();
