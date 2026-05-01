.phone { font-family:var(--font); background:var(--bg); min-height:100dvh; max-width:430px; margin:0 auto; }

/* ── Headers ─────────────────────────────────────────────────────── */
.pageHeader {
  position:sticky; top:0; z-index:50;
  background:var(--bg); border-bottom:0.5px solid var(--sep);
  display:flex; align-items:center; justify-content:space-between;
  padding:10px 16px; min-height:44px;
}
.pageHeaderTitle { font-size:17px; font-weight:600; color:var(--text); letter-spacing:-0.3px; }
.headerAction { font-size:15px; font-weight:500; color:var(--green); background:none; border:none; cursor:pointer; padding:4px 0 4px 12px; }

/* ── 今日頁 Header ────────────────────────────────────────────────── */
.todayHeader {
  position:sticky; top:0; z-index:50;
  background:var(--bg); border-bottom:0.5px solid var(--sep);
  padding:6px 12px 6px;
}

/* FIX 1: 日期列 — 三欄置中佈局 */
.todayDateRow {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:0;
}

/* < > 箭頭：夠大好點按，用文字而非細小符號 */
.dateArrow {
  width:44px; height:44px;
  display:flex; align-items:center; justify-content:center;
  font-size:20px; font-weight:400; color:var(--text2);
  background:none; border:none; cursor:pointer;
  border-radius:12px; flex-shrink:0;
  -webkit-tap-highlight-color:transparent;
  transition:background 0.12s;
}
.dateArrow:active { background:var(--sep); }
.dateArrowDisabled { opacity:0.2; pointer-events:none; }

/* 置中日期按鈕 */
.datePickerBtn {
  flex:1;
  display:flex; align-items:center; justify-content:center; gap:6px;
  background:none; border:none; cursor:pointer; padding:4px 0;
  -webkit-tap-highlight-color:transparent;
}
.datePickerText { font-size:16px; font-weight:600; color:var(--text); letter-spacing:-0.2px; }
.weekdayLabel { font-size:15px; color:var(--text3); }
.datePickerChevron { font-size:10px; color:var(--text4); transition:transform 0.2s; }
.datePickerChevronOpen { transform:rotate(180deg); }

.syncRow { display:flex; align-items:center; justify-content:center; gap:5px; margin-top:2px; }
.syncDot { width:5px; height:5px; border-radius:50%; background:var(--text4); transition:background 0.4s; }
.syncDotSaved { background:var(--green); }
.syncText { font-size:11px; color:var(--text4); transition:color 0.4s; }
.syncTextSaved { color:var(--green); }

/* FIX 2: 今日頁展開月曆 — 比照紀錄頁 */
.dpDropdown { background:var(--bg); border-top:0.5px solid var(--sep); padding:8px 12px 4px; }
.dpNav { display:flex; align-items:center; justify-content:space-between; margin-bottom:4px; }
.dpNavBtns { display:flex; gap:3px; }
.dpMonthLabel { font-size:13px; font-weight:600; color:var(--text); }
.dpNavBtn { min-width:26px; height:26px; border-radius:50%; border:none; background:var(--card); color:var(--text2); font-size:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; padding:0 6px; }
.dpNavBtn:active { background:var(--bg2); }
.dpGrid { display:grid; grid-template-columns:repeat(7,1fr); gap:1px; }
.dpDayLabel { font-size:9px; font-weight:600; color:var(--text4); text-align:center; padding:2px 0 3px; }

/* 日期格子 — 比照紀錄頁：有資料→藍灰圓+反白數字 */
.dpDay {
  height:30px;
  display:flex; align-items:center; justify-content:center;
  font-size:12px; color:var(--text2);
  border-radius:50%; cursor:pointer;
  transition:background 0.1s;
  margin:1px auto; width:30px;
}
.dpDay:active { opacity:0.6; }
.dpDayToday { font-weight:700; color:var(--text); }
/* 有資料：藍灰圓底+反白數字（與紀錄頁完全一致） */
.dpDayHasData { background:#5B8DB8; color:#fff !important; font-weight:600; border-radius:50%; }
/* 選中：深色圓底 */
.dpDaySelected { background:var(--text) !important; color:#fff !important; font-weight:700; border-radius:50%; }
.dpDayEmpty { pointer-events:none; }

/* ── Scroll ───────────────────────────────────────────────────────── */
.scroll { padding:0 16px 100px; }
.scroll::-webkit-scrollbar { display:none; }
.sectionLabel { font-size:11px; font-weight:600; color:var(--text3); text-transform:uppercase; letter-spacing:0.5px; margin:20px 4px 7px; }
.card { background:var(--card); border-radius:16px; overflow:hidden; margin-bottom:10px; }

/* ── Tasks ────────────────────────────────────────────────────────── */
.taskRow { display:flex; align-items:center; padding:10px 16px; border-top:0.5px solid var(--sep); gap:10px; min-height:44px; }
.taskRow:first-child { border-top:none; }
.taskCheck { width:20px; height:20px; border-radius:50%; border:1.5px solid var(--text4); flex-shrink:0; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.18s; position:relative; }
.taskCheckDone { background:#5B8DB8; border-color:#5B8DB8; }
.taskCheckDone::after { content:''; position:absolute; width:4px; height:8px; border:1.5px solid #fff; border-top:none; border-left:none; transform:rotate(45deg) translateY(-1px); }
.taskInput { flex:1; border:none; outline:none; background:transparent; font-family:var(--font); font-size:15px; color:var(--text); caret-color:var(--green); min-width:0; }
.taskInput::placeholder { color:var(--text4); }
.taskInputDone { color:var(--text4); text-decoration:line-through; }
.taskNum { font-size:13px; font-weight:600; color:var(--text4); width:14px; text-align:center; flex-shrink:0; }
.postponeBtn { font-size:11px; font-weight:500; color:var(--text4); background:var(--bg); border:none; border-radius:8px; padding:4px 8px; cursor:pointer; flex-shrink:0; white-space:nowrap; }
.postponeBtn:active { color:var(--text2); }

/* ── Habits 2-col ─────────────────────────────────────────────────── */
.habitGrid { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:10px; }
.habitCell { background:var(--card); display:flex; align-items:center; gap:8px; padding:10px 12px; border-radius:12px; cursor:pointer; transition:background 0.1s; }
.habitCell:active { background:rgba(0,0,0,0.04); }
.habitCheck { width:10px; height:10px; border-radius:50%; border:1.5px solid var(--text4); flex-shrink:0; transition:all 0.18s; position:relative; }
.habitCheckDone { background:#5B8DB8; border-color:#5B8DB8; }
.habitCheckDone::after { content:''; position:absolute; top:50%; left:50%; transform:translate(-50%,-62%) rotate(45deg); width:2px; height:4px; border:1px solid #fff; border-top:none; border-left:none; }
.habitCellName { font-size:13px; color:var(--text); flex:1; line-height:1.3; }
.habitCellNameDone { color:var(--text4); text-decoration:line-through; }

/* ── 飲食記錄 ─────────────────────────────────────────────────────── */
.mealRow { display:flex; align-items:center; gap:12px; padding:11px 16px; border-top:0.5px solid var(--sep); }
.mealRow:first-child { border-top:none; }
.mealLabel { font-size:13px; color:var(--text3); width:30px; flex-shrink:0; font-weight:500; }
.mealInput { flex:1; border:none; outline:none; background:transparent; font-family:var(--font); font-size:15px; color:var(--text); caret-color:var(--green); min-width:0; }
.mealInput::placeholder { color:var(--text4); }

/* ── Body (one row) ───────────────────────────────────────────────── */
.bodyOneRow { display:flex; align-items:center; padding:12px 16px; }
.bodyField { display:flex; align-items:center; gap:4px; flex:1; }
.bodyField+.bodyField { border-left:0.5px solid var(--sep); padding-left:12px; }
.bodyLabel { font-size:13px; color:var(--text3); flex-shrink:0; }
.bodyInput { border:none; outline:none; background:transparent; font-family:var(--font); font-size:15px; font-weight:500; color:var(--text); width:48px; caret-color:var(--green); }
.bodyInput::placeholder { color:var(--text4); }
.bodyUnit { font-size:11px; color:var(--text4); flex-shrink:0; }

/* ── Mood faces ───────────────────────────────────────────────────── */
.moodWrap { padding:14px 16px 10px; }
.moodRow { display:flex; justify-content:space-between; margin-bottom:12px; }
.moodBtn { display:flex; flex-direction:column; align-items:center; gap:5px; background:none; border:none; cursor:pointer; padding:0; }
.moodFace { width:38px; height:38px; border-radius:50%; border:1.5px solid var(--sep); display:flex; align-items:center; justify-content:center; transition:all 0.15s; background:var(--bg); }
.moodFaceActive { background:var(--text); border-color:var(--text); }
.moodLabel { font-size:10px; color:var(--text4); font-family:var(--font); }
.moodLabelActive { color:var(--text); font-weight:500; }
.moodTextarea { width:100%; border:none; outline:none; background:transparent; font-family:var(--font); font-size:15px; color:var(--text); resize:none; line-height:1.6; caret-color:var(--green); border-top:0.5px solid var(--sep); padding:12px 0 2px; }
.moodTextarea::placeholder { color:var(--text4); }

/* ── Diary + Gratitude ────────────────────────────────────────────── */
.diaryWrap { padding:14px 16px; }
.diaryTextarea { width:100%; border:none; outline:none; background:transparent; font-family:var(--font); font-size:15px; color:var(--text); resize:none; line-height:1.8; caret-color:var(--green); }
.diaryTextarea::placeholder { color:var(--text4); }
.gratitudeDivider { border:none; border-top:0.5px solid var(--sep); margin:10px 0 8px; }
.gratitudeLabel { font-size:11px; font-weight:600; color:var(--text4); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px; }
.gratitudeItems { display:flex; flex-direction:column; gap:2px; }
.gratitudeRow { display:flex; align-items:center; gap:8px; padding:4px 0; }
.gratitudeNum { font-size:13px; font-weight:600; color:var(--text4); width:14px; flex-shrink:0; }
.gratitudeInput { flex:1; border:none; outline:none; background:transparent; font-family:var(--font); font-size:15px; color:var(--text); caret-color:var(--green); }
.gratitudeInput::placeholder { color:var(--text4); }

/* ── Tab bar ──────────────────────────────────────────────────────── */
.tabbar { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:430px; height:82px; background:rgba(242,242,247,0.9); backdrop-filter:saturate(180%) blur(20px); -webkit-backdrop-filter:saturate(180%) blur(20px); border-top:0.5px solid var(--sep); display:flex; align-items:flex-start; padding-top:8px; z-index:100; }
.tab { flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; background:none; border:none; cursor:pointer; padding:6px 0; color:var(--text4); transition:color 0.15s; }
.tab svg { width:24px; height:24px; fill:none; stroke:currentColor; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; }
.tabActive { color:var(--green) !important; }
.tabLabel { font-size:10px; font-family:var(--font); }

/* ── Toast ────────────────────────────────────────────────────────── */
.toast { position:fixed; top:56px; left:50%; transform:translateX(-50%); background:rgba(28,28,30,0.82); color:#fff; font-size:13px; font-family:var(--font); padding:9px 18px; border-radius:20px; animation:toastAnim 2.2s ease forwards; white-space:nowrap; z-index:999; pointer-events:none; }
@keyframes toastAnim { 0%{opacity:0;transform:translateX(-50%) translateY(-6px)} 10%{opacity:1;transform:translateX(-50%) translateY(0)} 78%{opacity:1} 100%{opacity:0} }

/* ── 習慣頁 Segmented Control ─────────────────────────────────────── */
.segWrap { padding:8px 16px 0; background:var(--bg); }
.segCtrl { display:flex; background:rgba(0,0,0,0.06); border-radius:10px; padding:2px; gap:2px; }
.segBtn { flex:1; border:none; border-radius:8px; padding:7px 0; font-size:13px; font-weight:500; font-family:var(--font); background:transparent; color:var(--text3); cursor:pointer; transition:all 0.18s; }
.segBtnActive { background:var(--bg); color:var(--text); box-shadow:0 1px 3px rgba(0,0,0,0.12); }
.segBtnActiveBad { background:var(--bg); color:#C0504D; box-shadow:0 1px 3px rgba(0,0,0,0.12); }

/* ── Habit week ───────────────────────────────────────────────────── */
.weekNav { display:flex; align-items:center; justify-content:space-between; padding:6px 12px 4px; }
.weekLabel { font-size:13px; color:var(--text3); }
.weekNavBtns { display:flex; gap:4px; align-items:center; }
.weekGrid { padding:0 8px; }
.weekHead { display:grid; grid-template-columns:minmax(0,1fr) repeat(7,32px); gap:2px; margin-bottom:4px; padding:0 6px; }
.weekHeadLabel { font-size:10px; font-weight:600; color:var(--text4); text-align:center; }
.weekHeadDate { font-size:9px; color:var(--text4); text-align:center; }
.weekHeadToday { color:var(--text); font-weight:700; }
.habitWeekRow { display:grid; grid-template-columns:minmax(0,1fr) repeat(7,32px); gap:2px; align-items:center; margin-bottom:5px; background:var(--card); border-radius:11px; padding:10px 6px; }
.habitWeekLeft { display:flex; flex-direction:column; gap:2px; min-width:0; padding-left:4px; }
.habitWeekName { font-size:12px; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.habitProgressTag { font-size:10px; font-weight:500; background:var(--bg); border-radius:6px; padding:1px 5px; color:var(--text4); white-space:nowrap; align-self:flex-start; }
.habitProgressTagMet { background:var(--green-bg); color:var(--green); }
.habitProgressTagBad { background:rgba(192,80,77,0.12); color:#C0504D; }
.weekCell { display:flex; align-items:center; justify-content:center; }
.weekDot { width:14px; height:14px; border-radius:50%; border:1.5px solid var(--sep); cursor:pointer; transition:all 0.15s; }
.weekDotDone { background:#5B8DB8; border-color:#5B8DB8; }
.weekDotBad { background:#C0504D; border-color:#C0504D; }
.weekDotToday { border-color:var(--text3); }

/* ── Calendar (紀錄頁) ────────────────────────────────────────────── */
.calWrap { position:sticky; top:44px; z-index:40; background:var(--bg); padding:4px 14px 4px; border-bottom:0.5px solid var(--sep); }
.calNav { display:flex; align-items:center; justify-content:space-between; margin-bottom:3px; }
.calMonthLabel { font-size:12px; font-weight:600; color:var(--text); }
.calNavBtns { display:flex; gap:4px; }
.calNavBtn { width:22px; height:22px; border-radius:50%; border:none; background:var(--card); color:var(--text2); font-size:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.calNavBtn:active { background:var(--bg2); }
.calGrid { display:grid; grid-template-columns:repeat(7,1fr); gap:1px; }
.calDayLabel { font-size:8px; font-weight:600; color:var(--text4); text-align:center; padding:1px 0 2px; }
.calDay { height:28px; display:flex; align-items:center; justify-content:center; font-size:10px; color:var(--text2); border-radius:50%; cursor:pointer; position:relative; transition:opacity 0.1s; }
.calDay:active { opacity:0.6; }
.calDayNum { line-height:1; }
.calDayToday .calDayNum { font-weight:700; color:var(--text); }
/* 今天有資料：藍灰圓底，數字加粗白色 */
.calDayToday.calDayHasData .calDayNum { font-weight:700; }
.calDayHasData { background:#5B8DB8; border-radius:50%; width:24px; height:24px; margin:auto; color:#fff !important; }
.calDayHasData .calDayNum { display:flex; align-items:center; justify-content:center; width:100%; height:100%; font-size:10px; font-weight:600; color:#fff !important; }
.calDayEmpty { pointer-events:none; }

/* 日紀錄卡片列表 */
.dayList { padding:12px 16px 100px; display:flex; flex-direction:column; gap:10px; }
.dayCard { background:var(--card); border-radius:16px; overflow:hidden; }
.dayCardHeader { display:flex; align-items:center; justify-content:space-between; padding:12px 16px 8px; }
.dayCardDate { font-size:13px; font-weight:600; color:var(--text); }
.dayCardMood { font-size:13px; color:var(--text3); }
.dayCardTags { display:flex; flex-wrap:wrap; gap:5px; padding:0 16px 10px; }
.dayCardTag { font-size:12px; color:var(--text2); background:var(--bg); border-radius:8px; padding:3px 8px; }
.dayCardDivider { border:none; border-top:0.5px solid var(--sep); margin:0 16px; }
.dayCardBody { padding:8px 16px 12px; }
.dayCardText { font-size:14px; color:var(--text2); line-height:1.6; white-space:pre-line; }
.dayCardLabel { font-size:10px; font-weight:600; color:var(--text4); text-transform:uppercase; letter-spacing:0.4px; margin-bottom:3px; }
.dayCardSection { margin-bottom:8px; }
.dayCardSection:last-child { margin-bottom:0; }
.dayEmpty { font-size:14px; color:var(--text4); text-align:center; padding:48px 0; }

/* ── Stats ────────────────────────────────────────────────────────── */
.chartCard { background:var(--card); border-radius:16px; padding:16px; margin-bottom:10px; }
.chartTitle { font-size:14px; font-weight:500; color:var(--text); margin-bottom:4px; }
.chartSub { font-size:12px; color:var(--text4); margin-bottom:14px; }
.chartSvg { width:100%; display:block; overflow:visible; }
.chartEmpty { font-size:13px; color:var(--text4); text-align:center; padding:20px 0; }

/* ── Modal overlay ────────────────────────────────────────────────── */
.overlay {
  position:fixed; inset:0; background:rgba(0,0,0,0.35);
  z-index:200;
  display:flex; align-items:center; justify-content:center;
  padding:16px;
}

/* 改天做 sheet（小型，置中） */
.sheet {
  width:100%; max-width:398px;
  background:var(--bg); border-radius:20px;
  padding-bottom:20px; max-height:80dvh; overflow-y:auto;
}
.sheet::-webkit-scrollbar { display:none; }

/* FIX 3: 習慣管理 — 固定三段式：header鎖頂 / list滾動 / addRow鎖底 */
.mgmtSheet {
  width:100%; max-width:398px;
  background:var(--bg); border-radius:20px;
  display:flex; flex-direction:column;
  /* 視窗高度限制，確保 addRow 不超出螢幕 */
  max-height:calc(100dvh - 80px);
  overflow:hidden;
}
/* 清單區：獨立滾動 */
.mgmtList {
  flex:1; overflow-y:auto; min-height:0;
}
.mgmtList::-webkit-scrollbar { display:none; }
/* 新增欄：鎖底，不隨清單滾動 */
.mgmtAddRow {
  flex-shrink:0;
  display:flex; align-items:center; gap:8px;
  padding:10px 16px;
  border-top:0.5px solid var(--sep);
  background:var(--bg);
}

.sheetHandle { width:36px; height:4px; background:var(--sep); border-radius:2px; margin:12px auto 0; flex-shrink:0; }
.sheetHeader { display:flex; align-items:center; justify-content:space-between; padding:12px 16px 10px; flex-shrink:0; }
.sheetTitle { font-size:17px; font-weight:600; color:var(--text); }
.sheetDone { font-size:15px; font-weight:500; color:var(--green); background:none; border:none; cursor:pointer; }
.miniCalWrap { padding:0 16px 16px; }
.miniCalNav { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
.miniCalMonth { font-size:13px; font-weight:500; color:var(--text); }
.miniCalGrid { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
.miniCalDayLabel { font-size:10px; font-weight:600; color:var(--text4); text-align:center; padding:3px 0; }
.miniCalDay { aspect-ratio:1; display:flex; align-items:center; justify-content:center; font-size:13px; color:var(--text2); border-radius:50%; cursor:pointer; }
.miniCalDay:active { background:var(--sep); }
.miniCalDayToday { font-weight:700; color:var(--green); }
.miniCalDayPast { color:var(--text4); pointer-events:none; }
.miniCalDayEmpty { pointer-events:none; }

/* Habit management rows */
.mgmtRow { display:flex; align-items:center; gap:10px; padding:8px 16px; border-top:0.5px solid var(--sep); }
.mgmtRow.dragging { opacity:0.4; }
.mgmtRow.dragOver { background:rgba(48,162,87,0.08); }
.dragHandle { color:var(--text4); cursor:grab; padding:2px 4px; font-size:14px; flex-shrink:0; line-height:1; }
.dragHandle:active { cursor:grabbing; }
.mgmtContent { flex:1; min-width:0; }
.mgmtNameInput { width:100%; border:none; outline:none; background:transparent; font-family:var(--font); font-size:14px; color:var(--text); caret-color:var(--green); }
.mgmtGoalRow { display:flex; align-items:center; gap:6px; margin-top:3px; }
.mgmtGoalLabel { font-size:11px; color:var(--text4); }
.mgmtGoalSelect { font-size:12px; color:var(--text3); font-family:var(--font); background:var(--bg); border:0.5px solid var(--sep); border-radius:6px; padding:2px 6px; outline:none; }
.delBtn { width:28px; height:28px; border-radius:50%; border:none; background:none; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.delBtn:active { background:var(--sep); }
.delIcon { width:16px; height:16px; stroke:#D14040; fill:none; stroke-width:1.8; stroke-linecap:round; }
.addInput {
  flex:1; min-width:0;
  border:none; border-radius:10px; padding:9px 13px;
  font-family:var(--font); font-size:14px;
  background:var(--card); color:var(--text); outline:none;
}
.addInput:focus { box-shadow:0 0 0 1.5px var(--green); }
.addBtn { background:var(--green); color:#fff; border:none; border-radius:10px; padding:9px 14px; font-size:13px; font-weight:500; font-family:var(--font); cursor:pointer; flex-shrink:0; white-space:nowrap; }
.addBtn:active { opacity:0.8; }

/* Settings */
.settingGroup { margin-bottom:10px; }
.settingRow { display:flex; align-items:center; padding:13px 16px; border-top:0.5px solid var(--sep); gap:12px; background:var(--card); }
.settingRow:first-child { border-top:none; border-radius:16px 16px 0 0; }
.settingRow:last-child { border-radius:0 0 16px 16px; }
.settingRow:only-child { border-radius:16px; }
.settingLabel { flex:1; font-size:15px; color:var(--text); }
.settingValue { font-size:14px; color:var(--text4); }
.settingBadge { font-size:11px; font-weight:500; background:var(--green-bg); color:var(--green); padding:2px 8px; border-radius:10px; }
